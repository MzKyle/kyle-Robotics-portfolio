import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const output = path.resolve("outputs/portfolio-refinement");
const base = process.env.REVIEW_BASE_URL ?? "http://127.0.0.1:5173";
await mkdir(output, { recursive: true });
for (const width of [1440, 820, 390]) {
  await copyFile(`outputs/portfolio-polish/phase-before-${width}.png`, path.join(output, `phase-before-${width}.png`));
}
process.env.REVIEW_OUTPUT_DIR = output;
if (process.env.REVIEW_REFINEMENT_ONLY !== "1") await import("./review-portfolio-polish.mjs");

const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE ?? "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const report = { cases: [], names: [], devices: [], pdf: [], protected: [] };
const names = {
  "sany-welding-robotics": "焊接机器人系统化的设计开发",
  "waterbag-inspection": "工业水样袋视觉质检",
  "auto-aim": "RoboMaster 视觉自瞄",
  "3d-volume-measurement": "深度相机视觉测算物体体积",
};
const cases = ["auto-aim", "3d-volume-measurement", "datascope-studio", "robot-sim", "mascotmate", "waterbag-inspection", "sany-welding-robotics", "sany-welding-robotics/pre-weld-localization"];
const settle = page => page.evaluate(async () => {
  await document.fonts.ready;
  for (const image of document.images) image.loading = "eager";
  await Promise.all(Array.from(document.images, image => image.decode().catch(() => {})));
});

try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(15000);
    for (const slug of cases) {
      console.log(`Case review: ${slug} / ${width}`);
      await page.goto(base + "/projects/" + slug, { waitUntil: "networkidle" });
      await settle(page);
      if (names[slug]) {
        assert.equal(await page.locator("h1 .lang-zh").textContent(), names[slug]);
        assert.ok((await page.title()).startsWith(names[slug]), "Browser title should use the shared project name");
      }
      assert.equal(await page.locator(".case-jump-nav a[aria-current]").count(), 1);
      const sections = await page.locator(".case-jump-nav a").evaluateAll(links => links.map(link => link.hash.slice(1)));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      if (await page.locator("#evidence").count()) {
        const evidence = await page.locator("#evidence").boundingBox();
        const context = await page.locator("#context").boundingBox();
        assert.ok(evidence.y < context.y, "Results should precede context");
        assert.ok(evidence.y < (width === 390 ? 1050 : 800), "Results should be near the first screen");
        assert.equal(await page.locator("#ownership").evaluate(element => element.open), false);
        assert.equal(await page.locator(".case-flow-disclosure").evaluate(element => element.open), false);
      }
      for (const id of sections) {
        await page.locator(`.case-jump-nav a[href="#${id}"]`).click();
        await page.waitForFunction(id => document.querySelector(`.case-jump-nav a[href="#${id}"]`)?.getAttribute("aria-current") === "location", id);
        const section = await page.locator(`#${id}`).boundingBox();
        assert.ok(section.y >= 119, "Section heading should clear the sticky navigation");
        if (id === "ownership" || id === "problems") {
          assert.equal(await page.locator(`#${id}`).evaluate(element => element.open), true);
          await page.locator(`#${id} > summary`).click();
          await page.locator(`.case-jump-nav a[href="#${id}"]`).click();
          assert.equal(await page.locator(`#${id}`).evaluate(element => element.open), true, "Re-clicking the same hash must reopen a disclosure");
        }
      }
      if (slug.includes("-studio") || slug === "robot-sim" || slug === "mascotmate") {
        assert.equal(await page.locator(".repository-architecture").count(), 1);
        assert.match(await page.locator(".repository-architecture figcaption a").getAttribute("href"), /\/blob\/[a-f0-9]{40}\/docs\/architecture\/README.md$/);
      }
      await page.goto(base + "/projects/" + slug, { waitUntil: "networkidle" });
      await settle(page);
      await page.screenshot({ path: path.join(output, `final-${slug.replaceAll("/", "-")}-${width}.png`), fullPage: true });
      report.cases.push({ slug, width, sections, navigation: "passed" });
    }
    await page.goto(base + "/projects", { waitUntil: "networkidle" });
    assert.equal(await page.locator("figcaption").filter({ hasText: "AI 场景示意" }).count(), 0);
    for (const [slug, name] of Object.entries(names)) {
      assert.equal(await page.getByRole("heading", { name, exact: true }).count(), 1, slug + ": project index should use the shared display name");
    }
    report.names.push({ width, index: "passed" });
    await page.close();
  }

  for (const device of [{ width: 320, scale: 2 }, { width: 390, scale: 3 }, { width: 820, scale: 2 }]) {
    const context = await browser.newContext({ viewport: { width: device.width, height: 900 }, deviceScaleFactor: device.scale, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    for (const route of ["/", "/projects", "/projects/auto-aim", "/projects/datascope-studio", "/resume"]) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      await settle(page);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), device.width, route + " should fit the device");
      if (route === "/projects/auto-aim") {
        const media = await page.locator(".case-hero-media img").evaluate(image => ({ src: image.currentSrc, rendered: image.clientWidth }));
        const selected = Number(media.src.match(/-(\d+)\.webp$/)[1]);
        assert.ok(selected >= Math.min(1280, media.rendered * device.scale * .9), "Select a sharp enough image for the device pixel ratio");
        report.devices.push({ ...device, ...media, selected });
      }
      if (route === "/resume") {
        assert.equal(await page.locator(".resume-pdf-frame").count(), 0, "Do not request PDF before a preview is expanded");
        if (await page.locator(".resume-pdf-mobile").isVisible()) {
          assert.equal(await page.locator(".resume-pdf-disclosure").isVisible(), false);
          assert.equal(await page.locator(".resume-pdf-mobile a[download]").isVisible(), true);
        } else {
          await page.locator(".resume-pdf-disclosure summary").click();
          await page.waitForSelector(".resume-pdf-frame");
          await page.locator(".resume-pdf-disclosure summary").click();
          assert.equal(await page.locator(".resume-pdf-frame").count(), 0);
        }
        const downloadPromise = page.waitForEvent("download");
        await page.locator(".resume-hero a[download]").click();
        const download = await downloadPromise;
        assert.equal(download.suggestedFilename(), "王凯豪简历.pdf");
        assert.equal(await download.failure(), null);
        report.pdf.push({ ...device, download: "passed", preview: await page.locator(".resume-pdf-mobile").isVisible() ? "external PDF" : "on demand" });
      }
      await page.screenshot({ path: path.join(output, `device-${route.replaceAll("/", "-") || "home"}-${device.width}.png`) });
    }
    await context.close();
  }
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  desktop.setDefaultTimeout(15000);
  await desktop.goto(base + "/resume", { waitUntil: "networkidle" });
  assert.equal(await desktop.locator(".resume-pdf-frame").count(), 0);
  await desktop.locator(".resume-pdf-disclosure summary").click();
  await desktop.waitForSelector(".resume-pdf-frame");
  await desktop.locator(".resume-pdf-disclosure summary").click();
  await desktop.waitForSelector(".resume-pdf-frame", { state: "detached" });
  assert.equal(await desktop.locator(".resume-pdf-frame").count(), 0);
  await desktop.close();
  const pdf = await fetch(base + "/resume.pdf");
  assert.equal(pdf.status, 200);
  assert.match(pdf.headers.get("content-type"), /application\/pdf/);
  assert.equal(createHash("sha256").update(Buffer.from(await pdf.arrayBuffer())).digest("hex"), "4a9e0f61fc551b6accd455d03f03069abbe764e9e57b17f1edcc5307f40803c9");

  for (const source of ["outputs/portfolio-polish/protected-hashes.json", "outputs/portfolio-iteration/baseline-hashes.json"]) {
    if (!existsSync(source)) continue;
    const hashes = JSON.parse(await readFile(source, "utf8"));
    for (const [file, hash] of Object.entries(hashes)) {
      const current = createHash("sha256").update(await readFile(file)).digest("hex");
      assert.equal(current, hash, file + " must remain unchanged");
      report.protected.push(file);
    }
  }
  await writeFile(path.join(output, "refinement-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ cases: report.cases.length, names: report.names.length, devices: report.devices.length, pdf: report.pdf.length, protected: report.protected.length }));
} finally {
  await browser.close();
}
