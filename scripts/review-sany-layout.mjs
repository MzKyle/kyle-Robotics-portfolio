import assert from "node:assert/strict";
import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("outputs/sany-review");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE ?? [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync) });
const url = `${process.env.REVIEW_BASE_URL ?? "http://localhost:5173"}/projects/sany-welding-robotics/technical`;
const reports = [];
try {
  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "wide", width: 1920, height: 1080 },
    { name: "tablet", width: 1024, height: 900 },
    { name: "mobile", width: 390, height: 844 },
    { name: "small-mobile", width: 360, height: 800 },
  ]) {
    const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
    const errors = [];
    const failedRequests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", (response) => { if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`); });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const fonts = await page.evaluate(() => Array.from(document.fonts, (face) => ({ family: face.family, status: face.status })));
    for (const family of ["Geist", "Geist Mono"]) assert.ok(fonts.some((face) => face.family === family && face.status === "loaded"), `${family}: self-hosted font failed to load`);
    console.log(`${viewport.name}: page loaded`);
    await page.evaluate(() => { for (const img of document.images) img.loading = "eager"; });
    await page.locator(".essay-sampling button").first().click();
    // Scroll through the entire page to inspect layout and load every lazy diagram.
    await page.evaluate(async () => {
      for (let position = 0; position < document.documentElement.scrollHeight; position += window.innerHeight * .75) {
        window.scrollTo(0, position);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.evaluate(() => Promise.all(Array.from(document.images, (img) => img.decode().catch(() => {}))));
    console.log(`${viewport.name}: diagrams loaded`);
    const geometry = await page.evaluate(() => {
      const measure = (selector) => Array.from(document.querySelectorAll(selector), (element) => {
        const rect = element.getBoundingClientRect();
        return { x: rect.x, width: rect.width };
      });
      return {
        viewport: innerWidth, pageWidth: document.documentElement.scrollWidth,
        readings: measure(".case-reading"), figures: measure(".case-figure"),
        chapters: document.querySelectorAll(".essay-chapter").length,
        placeholders: /PLACEHOLDER|等待添加|真实素材预留/.test(document.body.innerText),
        headerBackground: getComputedStyle(document.querySelector(".site-header")).backgroundColor,
      };
    });
    assert.equal(geometry.pageWidth, geometry.viewport, `${viewport.name}: horizontal overflow`);
    assert.equal(geometry.chapters, 8);
    assert.equal(geometry.placeholders, false);
    assert.equal(geometry.figures.length, 11);
    assert.equal(geometry.headerBackground, "rgb(247, 247, 245)");
    const axis = geometry.readings[0].x;
    for (const rect of [...geometry.readings, ...geometry.figures]) assert.ok(Math.abs(rect.x - axis) < 1, `${viewport.name}: left axis drift`);
    const readingWidth = viewport.width > 1100 ? 800 : viewport.width - (viewport.width <= 760 ? 44 : 64);
    for (const rect of geometry.readings) assert.ok(Math.abs(rect.width - readingWidth) < 1, `${viewport.name}: reading width ${rect.width}`);
    for (const rect of geometry.figures) assert.ok(Math.abs(rect.width - Math.min(1160, viewport.width - (viewport.width <= 760 ? 44 : 64))) < 1, `${viewport.name}: figure width`);
    await page.screenshot({ path: path.join(output, `${viewport.name}-hero.png`) });
    await page.screenshot({ path: path.join(output, `${viewport.name}-full.png`), fullPage: true });
    if (["desktop", "mobile"].includes(viewport.name)) {
      for (const chapter of await page.locator(".essay-chapter").all()) {
        const id = await chapter.getAttribute("id");
        await page.evaluate((id) => { document.documentElement.style.scrollBehavior = "auto"; document.getElementById(id).scrollIntoView(); }, id);
        const top = await chapter.evaluate((element) => element.getBoundingClientRect().top);
        assert.ok(top >= 103 && top <= 105, `${id}: anchor hidden by header (${top})`);
        await page.screenshot({ path: path.join(output, `${viewport.name}-${id}.png`) });
      }
      for (const figure of await page.locator(".essay-figure").all()) {
        const id = (await figure.getAttribute("aria-labelledby")).replace("-title", "");
        // Element captures omit the sticky shell; chapter viewport captures above
        // keep it visible to verify its actual reading and anchor behavior.
        await page.locator(".site-header, .essay-reading-progress").evaluateAll((elements) => { for (const element of elements) element.style.visibility = "hidden"; });
        await figure.screenshot({ path: path.join(output, `${viewport.name}-figure-${id}.png`) });
        await page.locator(".site-header, .essay-reading-progress").evaluateAll((elements) => { for (const element of elements) element.style.visibility = ""; });
      }
    }
    // Preserved interactions: sampling, component visibility, phase matching, ISP,
    // reduced-motion clock stepping, resync, and expandable error explanations.
    const sampling = page.locator(".essay-sampling");
    await sampling.getByRole("button", { name: "200 Hz", exact: true }).click();
    assert.ok((await sampling.locator(".essay-sampling-values").innerText()).includes("±2.50 ms"));
    await sampling.locator("input").fill("62.5");
    assert.equal(await sampling.locator("output").innerText(), "62.5 ms");
    await page.locator(".essay-signal-tcp").click();
    assert.equal(await page.locator(".essay-motion-tcp").count(), 0);
    await page.locator(".essay-signal-tcp").click();
    await page.locator(".essay-matcher").getByRole("button", { name: "200 Hz", exact: true }).click();
    await page.locator(".essay-matcher").getByRole("button", { name: "中心过零", exact: true }).click();
    assert.ok((await page.locator(".essay-matcher-readout").innerText()).includes("54.1 ms"));
    assert.equal(await page.locator(".essay-matcher-raw-track > i.selected").count(), 1);
    const alignment = await page.locator(".essay-matcher").evaluate((figure) => {
      const curve = figure.querySelector(".essay-target-line").getBoundingClientRect();
      const raw = figure.querySelector(".essay-raw-target").getBoundingClientRect();
      return Math.abs(curve.x - raw.x);
    });
    assert.ok(alignment < 1, `${viewport.name}: phase and RAW axes disagree (${alignment})`);
    await page.getByRole("button", { name: "传统串行链路", exact: true }).click();
    assert.equal(await page.locator(".essay-isp-critical").count(), 1);
    await page.getByRole("button", { name: "相位感知重构", exact: true }).click();
    await page.getByRole("button", { name: "推进 10 秒", exact: true }).click();
    assert.ok((await page.locator(".essay-clock-readout").innerText()).includes("5.0 ms"));
    await page.getByRole("button", { name: "重新同步", exact: true }).click();
    assert.ok((await page.locator(".essay-clock-readout").innerText()).includes("0.0 ms"));
    await page.locator(".essay-error-terms summary").first().click();
    assert.equal(await page.locator(".essay-error-terms details[open]").count(), 1);
    await page.evaluate(() => { document.documentElement.dataset.language = "en"; window.scrollTo(0, 0); });
    await page.evaluate(() => Promise.all(Array.from(document.images, (img) => img.decode().catch(() => {}))));
    await page.screenshot({ path: path.join(output, `${viewport.name}-english.png`) });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), viewport.width, `${viewport.name}: English overflow`);
    const diagrams = await page.locator(".case-mermaid img:visible").evaluateAll((images) => images.map((img) => ({ loaded: img.complete && img.naturalWidth > 0, src: img.currentSrc })));
    assert.equal(diagrams.length, 2);
    assert.ok(diagrams.every((diagram) => diagram.loaded));
    if (["desktop", "mobile"].includes(viewport.name)) {
      for (const name of ["clock-mapping", "dual-timeline"]) {
        await page.locator(".site-header, .essay-reading-progress").evaluateAll((elements) => { for (const element of elements) element.style.visibility = "hidden"; });
        await page.locator(`.case-mermaid-${name}`).screenshot({ path: path.join(output, `${viewport.name}-english-${name}.png`) });
        await page.locator(".site-header, .essay-reading-progress").evaluateAll((elements) => { for (const element of elements) element.style.visibility = ""; });
      }
    }
    assert.deepEqual(errors, [], `${viewport.name}: browser errors`);
    assert.deepEqual(failedRequests, [], `${viewport.name}: failed requests`);
    reports.push({ viewport, geometry, diagrams, fonts, errors, failedRequests, interactions: "passed" });
    console.log(`${viewport.name}: layout, anchors, diagrams, language, interactions passed`);
    await page.close();
  }
  await writeFile(path.join(output, "review.json"), JSON.stringify(reports, null, 2));

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(url, { waitUntil: "networkidle" });
  const marker = page.locator(".essay-motion-marker");
  const before = await marker.getAttribute("cx");
  await page.getByRole("button", { name: "播放运动", exact: true }).click();
  await page.waitForTimeout(450);
  assert.notEqual(await marker.getAttribute("cx"), before, "phase marker must move while playing");
  await page.getByRole("button", { name: "暂停运动", exact: true }).click();
  const paused = await marker.getAttribute("cx");
  await page.waitForTimeout(150);
  assert.equal(await marker.getAttribute("cx"), paused, "phase marker must stop while paused");
  await page.locator(".essay-matcher").screenshot({ path: path.join(output, "desktop-matcher-active.png") });
  await page.locator(".essay-clock").getByRole("button", { name: "开始", exact: true }).click();
  await page.waitForTimeout(500);
  await page.locator(".essay-clock").getByRole("button", { name: "暂停", exact: true }).click();
  const clockSeconds = Number.parseFloat(await page.locator(".essay-clock-readout strong").first().innerText());
  assert.ok(clockSeconds > 0, "clock must advance while playing");
  await page.getByRole("button", { name: "重新同步", exact: true }).click();
  assert.ok((await page.locator(".essay-clock-readout").innerText()).includes("0.0 ms"));
  const overview = await page.goto(new URL("/projects/sany-welding-robotics", url).href, { waitUntil: "networkidle" });
  assert.equal(overview.status(), 200);
  assert.deepEqual(errors, [], "normal animation / overview: browser errors");
  await writeFile(path.join(output, "runtime.json"), JSON.stringify({ animation: "passed", pause: "passed", resync: "passed", clockSeconds, overviewStatus: overview.status(), errors }, null, 2));
  console.log("normal motion: playback, pause, resync, overview and console passed");
  await page.close();
} finally { await browser.close(); }
