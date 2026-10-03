import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import path from "node:path";

const output = path.resolve(process.env.REVIEW_OUTPUT_DIR ?? "outputs/portfolio-polish");
const base = process.env.REVIEW_BASE_URL ?? "http://127.0.0.1:5173";
const phase = "/projects/sany-welding-robotics/technical";
const routes = [
  ["home", "/"], ["projects", "/projects"], ["experience", "/experience"],
  ["about", "/about"], ["resume", "/resume"], ["writing", "/writing"],
  ["interview-selector", "/interview"],
  ...["robotics", "industrial-vision", "computer-vision", "general"].map(track => [`interview-${track}`, `/interview?track=${track}`]),
  ["sany", "/projects/sany-welding-robotics"],
  ["preweld", "/projects/sany-welding-robotics/pre-weld-localization"], ["technical", phase],
  ...["waterbag-inspection", "auto-aim", "3d-volume-measurement", "datascope-studio", "robot-sim", "mascotmate"].map(slug => [slug, `/projects/${slug}`]),
];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(existsSync) });
const report = { layouts: [], interactions: [], phaseScreenshots: [] };

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = "eager";
    await Promise.all(Array.from(document.images, image => image.decode().catch(() => {})));
  });
}

try {
  for (const width of [1440, 820, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    for (const [name, route] of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      assert.equal((await page.goto(base + route, { waitUntil: "networkidle" })).status(), 200, route);
      await settle(page);
      for (const language of ["zh", "en"]) {
        await page.evaluate(language => { document.documentElement.dataset.language = language; }, language);
        const state = await page.evaluate(() => {
          const rect = element => element.getBoundingClientRect();
          return {
            width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
            halo: !!document.querySelector(".site-ambient-light"),
            brokenImages: Array.from(document.images).filter(image => !image.naturalWidth).map(image => image.src),
            missingAnchors: Array.from(document.querySelectorAll('a[href^="#"]')).filter(a => a.hash.length > 1 && !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a => a.hash),
            media: Array.from(document.querySelectorAll(".case-hero-media img, .vision-hero-photo img")).map(image => ({ naturalRatio: image.naturalWidth / image.naturalHeight, renderedRatio: rect(image).width / rect(image).height })),
            cards: Array.from(document.querySelectorAll('[class*="selectedCard"]')).map(card => ({ row: rect(card).top, heading: rect(card.querySelector("h3")).top, description: rect(card.querySelector("p")).top, tags: rect(card.querySelector("ul")).top, action: rect(card.lastElementChild).top })),
            footerHeight: document.querySelector(".site-footer") ? rect(document.querySelector(".site-footer")).height : 0,
          };
        });
        assert.equal(state.scrollWidth, width, `${route} ${language}: page overflow`);
        assert.deepEqual(state.brokenImages, [], `${route}: broken images`);
        assert.deepEqual(state.missingAnchors, [], `${route}: missing anchors`);
        assert.equal(state.halo, route !== phase, `${route}: ambient layer`);
        for (const media of state.media) assert.ok(Math.abs(media.renderedRatio / media.naturalRatio - 1) < .025, `${route}: media crop or distortion`);
        if (width >= 600) {
          const rows = new Map();
          for (const card of state.cards) { const key = Math.round(card.row); rows.set(key, [...(rows.get(key) ?? []), card]); }
          for (const cards of rows.values()) for (const slot of ["heading", "description", "tags", "action"]) assert.ok(Math.max(...cards.map(card => card[slot])) - Math.min(...cards.map(card => card[slot])) < 2, `${route} ${language}: ${slot} not aligned`);
        }
        if (width === 390 && route !== phase) assert.ok(state.footerHeight < 440, `${route}: oversized mobile footer`);
        report.layouts.push({ name, route, width, language, ...state });
        await page.screenshot({ path: path.join(output, `${width}-${name}-${language}.png`) });
        if (route === phase && language === "zh") {
          const before = path.join(output, `phase-before-${width}.png`);
          if (existsSync(before)) {
            const same = readFileSync(before).equals(readFileSync(path.join(output, `${width}-${name}-${language}.png`)));
            report.phaseScreenshots.push({ width, unchanged: same });
            assert.ok(same, `Phase essay changed visually at ${width}px`);
          }
        }
      }
      assert.deepEqual(errors, [], `${route}: browser errors`);
      await page.close();
    }
    console.log(`${width}px: all 20 routes, Chinese/English layouts passed`);
    await context.close();
  }

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const route of ["/", "/projects", "/about", "/projects/auto-aim", "/projects/waterbag-inspection"]) {
    await desktop.goto(base + route, { waitUntil: "networkidle" });
    await desktop.mouse.move(1, 1);
    await desktop.mouse.move(320, 280);
    await desktop.waitForFunction(() => document.querySelector(".site-ambient-light")?.style.getPropertyValue("--light-x") === "320px");
    await desktop.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(await desktop.locator(".site-ambient-light").evaluate(element => getComputedStyle(element).display), "none");
    await desktop.emulateMedia({ reducedMotion: "no-preference" });
    await desktop.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await desktop.mouse.move(620, 380);
    await desktop.waitForFunction(() => document.querySelector(".site-ambient-light")?.style.getPropertyValue("--light-x") === "620px");
  }
  report.interactions.push("Global halo tracks the pointer and responds to reduced-motion changes");
  await desktop.goto(base + "/projects", { waitUntil: "networkidle" });
  await desktop.locator('[class*="selectedHeading"]').scrollIntoViewIfNeeded();
  await desktop.screenshot({ path: path.join(output, "selected-projects-aligned.png") });
  await desktop.goto(base + "/resume", { waitUntil: "networkidle" });
  const download = desktop.waitForEvent("download");
  await desktop.locator(".resume-hero a[download]").click();
  assert.equal((await download).suggestedFilename(), "王凯豪简历.pdf");
  const font = await desktop.locator(".resume-main article li .lang-zh").first().evaluate(element => getComputedStyle(element).fontFamily);
  assert.ok(!font.startsWith('"Geist Mono"'), "Resume prose must use the body typeface");
  report.interactions.push("PDF downloads with the correct filename; resume prose uses the body typeface");
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await mobile.route("**/api/csdn?*", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ articles: Array.from({ length: 5 }, (_, index) => ({ title: `Article ${index + 1}`, url: `https://example.com/articles/${index}`, summary: "A long article summary. ".repeat(20), publishedAt: "2026-10-03", views: 100, column: { zh: "测试专栏", en: "Test column" } })) }) }));
  await mobile.goto(base + "/writing", { waitUntil: "networkidle" });
  const triggers = mobile.locator(".writing-topic-trigger");
  for (let index = 0; index < await triggers.count(); index++) {
    await triggers.nth(index).click();
    await mobile.locator(".online-article-list").waitFor();
    await mobile.locator(".writing-modal-body").evaluate(element => { element.scrollTop = element.scrollHeight; });
    const close = await mobile.locator(".writing-modal-header > button").boundingBox();
    assert.ok(close.y >= 0 && close.y + close.height <= 844, "Dialog close control must remain visible");
    await mobile.keyboard.press("Escape");
    await triggers.nth(index).waitFor({ state: "visible" });
    await mobile.waitForFunction(index => document.activeElement === document.querySelectorAll(".writing-topic-trigger")[index], index);
  }
  await triggers.first().click();
  await mobile.locator(".online-article-list").waitFor();
  await mobile.locator(".writing-modal-body").evaluate(element => { element.scrollTop = element.scrollHeight; });
  await mobile.screenshot({ path: path.join(output, "mobile-dialog-scrolled.png") });
  await mobile.locator(".writing-modal-header > button").click();
  await mobile.waitForFunction(() => document.activeElement === document.querySelector(".writing-topic-trigger"));
  report.interactions.push("All five article dialogs preserve focus and keep close controls visible after scrolling");
  await mobile.locator(".mobile-navigation > summary").click();
  await mobile.mouse.click(5, 820);
  assert.equal(await mobile.locator(".mobile-navigation").evaluate(element => element.open), false);
  await mobile.locator(".mobile-navigation > summary").click();
  await mobile.locator("h1").evaluate(element => { element.tabIndex = -1; element.focus(); });
  await mobile.keyboard.press("Escape");
  assert.equal(await mobile.locator(".mobile-navigation").evaluate(element => element.open), false);
  report.interactions.push("Mobile navigation closes on outside click and Escape even when focus moves outside");
  for (const track of ["robotics", "industrial-vision", "computer-vision", "general"]) {
    await mobile.goto(base + `/interview?track=${track}`, { waitUntil: "networkidle" });
    await mobile.locator(".interview-side-nav button").last().click();
    await mobile.waitForFunction(() => document.querySelectorAll(".interview-side-nav button")[3].getAttribute("aria-current") === "step");
    await mobile.waitForFunction(() => { const rect = document.querySelectorAll(".interview-side-nav button")[3].getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth; });
    assert.ok(await mobile.locator(".interview-side-nav").evaluate(element => element.getBoundingClientRect().bottom < 205), "Interview navigation occupies too much reading space");
  }
  report.interactions.push("All four interview routes scroll to the selected case and keep the active mobile tab visible");
  await mobile.close();
} finally {
  await writeFile(path.join(output, "review-report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(`${report.layouts.length} layout states and all interaction checks passed`);
