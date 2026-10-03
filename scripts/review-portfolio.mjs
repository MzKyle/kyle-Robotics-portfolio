import assert from "node:assert/strict";
import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("outputs/portfolio-redesign");
const base = process.env.REVIEW_BASE_URL ?? "http://127.0.0.1:5173";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE ?? [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync) });
const report = [];

async function inspect(page, name, screenshot = true) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = "eager";
    await Promise.all(Array.from(document.images, image => image.decode().catch(() => {})));
  });
  const state = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    background: getComputedStyle(document.body).backgroundColor,
    language: document.documentElement.dataset.language,
    fonts: Array.from(document.fonts, face => ({ family: face.family, status: face.status })),
    brokenImages: Array.from(document.images).filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
    firstProjectY: document.querySelector(".home-project")?.getBoundingClientRect().top,
    overflowing: Array.from(document.querySelectorAll("main *")).filter(element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && rect.width && rect.right > innerWidth + 2 && !element.closest(".source-math-block, .source-original-mermaid, .essay-source-mermaid");
    }).slice(0, 6).map(element => ({ tag: element.tagName, className: element.className })),
  }));
  report.push({ name, ...state });
  assert.equal(state.width, state.viewport, `${name}: horizontal page overflow`);
  assert.deepEqual(state.brokenImages, [], `${name}: broken images`);
  assert.ok(state.fonts.some(font => font.family === "Portfolio Sans SC" && font.status === "loaded"), `${name}: Chinese font missing`);
  if (screenshot) {
    await page.screenshot({ path: path.join(output, `${name}.png`) });
    if (name.endsWith("zh")) await page.screenshot({ path: path.join(output, `${name}-full.png`), fullPage: true });
  }
  console.log(`${name}: layout, assets and font passed`);
}

try {
  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "wide", width: 1920, height: 1080 },
    { name: "tablet", width: 1024, height: 900 },
    { name: "mobile", width: 390, height: 844 },
    { name: "small-mobile", width: 360, height: 800 },
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    assert.equal((await page.goto(base, { waitUntil: "networkidle" })).status(), 200);
    await inspect(page, `${viewport.name}-home-zh`);
    await page.locator(".home-utility .language-toggle").click();
    await inspect(page, `${viewport.name}-home-en`);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => document.documentElement.dataset.language), "en", "Language must persist after reload");
    await page.locator(".home-utility .language-toggle").click();
    await page.locator('.home-navigation a[href="#experience"]').click();
    await page.waitForFunction(() => document.querySelector('.home-navigation a[aria-current="location"]')?.getAttribute("href") === "#experience");
    const identityTop = await page.locator(".home-identity").evaluate(element => element.getBoundingClientRect().top);
    if (viewport.width > 1000) assert.ok(Math.abs(identityTop) < 2, "Desktop identity must remain visible while scrolling");
    const pdf = await context.request.get(`${base}/resume.pdf`);
    assert.equal(pdf.status(), 200);
    assert.equal((await pdf.body()).subarray(0, 4).toString(), "%PDF");
    assert.deepEqual(errors, [], `${viewport.name}: browser errors`);
    await context.close();
  }

  const routes = [
    ["projects", "/projects"], ["experience", "/experience"], ["about", "/about"],
    ["resume", "/resume"], ["writing", "/writing"], ["interview", "/interview?track=robotics"],
    ["sany", "/projects/sany-welding-robotics"], ["preweld", "/projects/sany-welding-robotics/pre-weld-localization"],
    ["technical", "/projects/sany-welding-robotics/technical"], ["inspection", "/projects/waterbag-inspection"],
    ["auto-aim", "/projects/auto-aim"], ["volume", "/projects/3d-volume-measurement"],
    ["datascope", "/projects/datascope-studio"], ["robot-sim", "/projects/robot-sim"], ["mascotmate", "/projects/mascotmate"],
  ];
  for (const viewport of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    for (const [name, route] of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      assert.equal((await page.goto(`${base}${route}`, { waitUntil: "networkidle", timeout: 60000 })).status(), 200);
      await inspect(page, `${viewport.name}-${name}-zh`);
      await page.evaluate(() => { document.documentElement.dataset.language = "en"; });
      await inspect(page, `${viewport.name}-${name}-en`, false);
      assert.deepEqual(errors, [], `${name}: browser errors`);
      await page.close();
    }
    await context.close();
  }
} finally {
  await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
