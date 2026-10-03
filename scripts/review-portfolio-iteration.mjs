import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const output = path.resolve("outputs/portfolio-iteration");
const base = process.env.REVIEW_BASE_URL ?? "http://127.0.0.1:5173";
await mkdir(output, { recursive: true });
for (const width of [1440, 820, 390]) {
  const baseline = path.resolve(`outputs/portfolio-polish/phase-before-${width}.png`);
  if (existsSync(baseline)) await copyFile(baseline, path.join(output, `phase-before-${width}.png`));
}
process.env.REVIEW_OUTPUT_DIR = output;
await import("./review-portfolio-polish.mjs");

const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(existsSync) });
const report = { home: [], disclosures: [], media: [], protectedSources: [], notFound: [] };
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = "eager";
    await Promise.all(Array.from(document.images, image => image.decode().catch(() => {})));
  });
}
try {
  for (const width of [320, 390, 820, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    await page.goto(base, { waitUntil: "networkidle" });
    await settle(page);
    for (const language of ["zh", "en"]) {
      await page.evaluate(language => { document.documentElement.dataset.language = language; }, language);
      const state = await page.evaluate(() => {
        const first = document.querySelector(".home-project");
        const title = first.querySelector("h3").getBoundingClientRect();
        const image = first.querySelector("img").getBoundingClientRect();
        return {
          width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
          workTop: document.getElementById("selected-work").getBoundingClientRect().top,
          aboutTop: document.getElementById("about").getBoundingClientRect().top,
          titleTop: title.top, imageTop: image.top,
          title: first.querySelector("h3 .lang-zh").textContent,
          volumeTitle: document.querySelectorAll(".home-project h3 .lang-zh")[3].textContent,
          captions: document.querySelectorAll(".home-project-visual figcaption").length,
        };
      });
      assert.equal(state.scrollWidth, width, "Home overflow");
      assert.ok(state.workTop < state.aboutTop, "Work should appear before the full about section");
      assert.equal(state.title, "焊接机器人系统化的设计开发");
      assert.equal(state.volumeTitle, "深度相机视觉测算物体体积");
      assert.equal(state.captions, 0, "Remove the homepage image caption requested by the user");
      if (width <= 600) {
        assert.ok(state.titleTop < state.imageTop, "Mobile title should precede the image");
        assert.ok(state.titleTop < 800, "First project should be visible in the first screen");
      }
      report.home.push({ width, language, ...state });
      await page.screenshot({ path: path.join(output, `home-final-${width}-${language}.png`) });
    }
    await page.close();
  }
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    for (const slug of ["auto-aim", "3d-volume-measurement", "datascope-studio", "robot-sim", "mascotmate"]) {
      await page.goto(base + `/projects/${slug}`, { waitUntil: "networkidle" });
      await settle(page);
      assert.equal(await page.locator("#ownership").evaluate(e => e.open), false);
      await page.locator('.case-jump-nav a[href="#ownership"]').click();
      await page.waitForFunction(() => document.getElementById("ownership").open);
      const position = await page.locator("#ownership > summary").boundingBox();
      assert.ok(position.y >= 120, "Expanded section heading must clear the sticky navigation");
      await page.locator("#ownership > summary").click();
      await page.locator('.case-jump-nav a[href="#ownership"]').click();
      assert.equal(await page.locator("#ownership").evaluate(e => e.open), true, "Same-hash click should reopen a closed section");
      await page.goto(base + `/projects/${slug}#problems`, { waitUntil: "networkidle" });
      await page.waitForFunction(() => document.getElementById("problems").open);
      report.disclosures.push({ slug, width, anchorAndReload: true });
      await page.goto(base + `/projects/${slug}`, { waitUntil: "networkidle" });
      await settle(page);
      await page.screenshot({ path: path.join(output, `case-final-${slug}-${width}.png`), fullPage: true });
      for (const src of await page.locator(".case-hero-media img").evaluateAll(images => images.map(image => image.currentSrc))) {
        if (slug !== "robot-sim" && slug !== "3d-volume-measurement") assert.match(src, /optimized\/.*\.webp/);
        report.media.push({ slug, width, src });
      }
    }
    await page.goto(base + "/writing", { waitUntil: "networkidle" });
    assert.equal(await page.locator('.featured-writing a[href="/projects/sany-welding-robotics/technical"]').count(), 1);
    assert.equal(await page.locator(".featured-writing-notes a").count(), 2);
    await page.screenshot({ path: path.join(output, `writing-final-${width}.png`), fullPage: true });
    const response = await page.goto(base + "/does-not-exist", { waitUntil: "networkidle" });
    assert.equal(response.status(), 404);
    assert.equal(await page.locator(".not-found-page a").count(), 2);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    report.notFound.push({ width, status: response.status(), recoveryLinks: true });
    await page.screenshot({ path: path.join(output, `404-final-${width}.png`) });
    await page.close();
  }
  for (const filename of ["outputs/portfolio-iteration/baseline-hashes.json", "outputs/portfolio-polish/protected-hashes.json"]) {
    if (!existsSync(filename)) continue;
    for (const [file, expected] of Object.entries(JSON.parse(readFileSync(filename, "utf8")))) {
      assert.equal(createHash("sha256").update(readFileSync(file)).digest("hex"), expected, `${file} changed`);
      if (!report.protectedSources.includes(file)) report.protectedSources.push(file);
    }
  }
} finally {
  await writeFile(path.join(output, "iteration-report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
console.log("Home reading order, responsive media, case deep links, 404 recovery, and protected content passed");
