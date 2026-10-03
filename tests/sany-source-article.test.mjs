import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let server;
let articleModule;
let renderedHtml;
const ids = ["sampling-mismatch", "motion-prior", "event-time", "temporal-selection", "isp-decoupling", "dual-timeline", "error-evolution", "methodology", "conclusion"];

before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
  articleModule = await server.ssrLoadModule("/lib/sany-source-article.ts");
  // Check the actual production route, including its framework image renderer.
  const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url).href);
  const response = await worker.fetch(
    new Request("http://localhost/projects/sany-welding-robotics/technical", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  // Serialized RSC data must not make missing visible article markup pass.
  renderedHtml = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
});
after(async () => { await server?.close(); });

function meaningful(tokens) { return tokens.filter(token => !["space", "hr"].includes(token.type)); }
function escapeHtml(text) { return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;"); }

function checkToken(token, html) {
  if (["text", "escape", "codespan", "sourceMathInline", "sourceMathBlock", "code"].includes(token.type) && !token.tokens) {
    assert.ok(html.includes(escapeHtml(token.text)), `Source content missing: ${token.text.slice(0, 100)}`);
  }
  if (token.type === "sourceImage") assert.ok(html.includes(`data-source-image="${escapeHtml(token.href)}"`), "Source image missing");
  for (const child of token.tokens ?? []) checkToken(child, html);
  for (const item of token.items ?? []) for (const child of item.tokens) checkToken(child, html);
}

test("the complete unmodified Markdown is the canonical article source", async () => {
  const markdown = await readFile(new URL("../add_res/系统设计_---_基于运动相位的时间域稳像设计.md", import.meta.url), "utf8");
  assert.equal(articleModule.sourceArticleMarkdown, markdown);
  const tokens = articleModule.articleMarkdown.lexer(markdown);
  assert.equal(tokens.map(token => token.raw).join(""), markdown.replace(/\r\n?/g, "\n"), "Lexer must not discard source ranges");
  assert.equal(tokens.filter(token => token.type === "sourceMathBlock").length, 32);
  assert.equal(tokens.filter(token => token.type === "code" && token.lang === "mermaid").length, 2);
  assert.equal(articleModule.sourceArticle.zh.sections.length, 9);
  assert.equal(articleModule.sourceArticle.zh.sections.at(-1).title, "总结");
});

test("source paragraphs, lists, formulas, images and Mermaid survive rendering", () => {
  const article = articleModule.sourceArticle;
  const sections = [{ id: "abstract", zh: article.zh.abstract, en: article.en.abstract }, ...ids.map((id, index) => ({ id, zh: article.zh.sections[index].tokens, en: article.en.sections[index].tokens }))];
  for (const section of sections) {
    assert.deepEqual(meaningful(section.zh).map(token => token.type), meaningful(section.en).map(token => token.type), `${section.id}: incomplete English translation`);
    for (const token of meaningful(section.zh)) checkToken(token, renderedHtml);
    for (const [index] of meaningful(section.zh).entries()) assert.ok(renderedHtml.includes(`data-source-block="${section.id}-${index}"`), `${section.id}/${index}: source block missing`);
  }
  for (const section of article.zh.sections) assert.ok(renderedHtml.includes(escapeHtml(section.title)), `Source heading missing: ${section.title}`);
});
