import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = resolve(import.meta.dirname, "..");
const workerPath = resolve(projectRoot, "dist/server/index.js");
const wranglerPath = resolve(projectRoot, "dist/server/wrangler.json");

await access(workerPath, constants.R_OK);
await access(wranglerPath, constants.R_OK);

const config = JSON.parse(await readFile(wranglerPath, "utf8"));
if (config.name !== "kyle-robotics-portfolio") {
  throw new Error("dist/server/wrangler.json must name the kyle-robotics-portfolio Worker");
}
if (config.main !== "index.js") {
  throw new Error("dist/server/wrangler.json must point main at index.js");
}
if (config.assets?.directory !== "../client") {
  throw new Error("dist/server/wrangler.json must serve static assets from ../client");
}

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("cloudflare-validation", `${process.pid}-${Date.now()}`);
const worker = await import(workerUrl.href);
if (!worker.default || typeof worker.default.fetch !== "function") {
  throw new Error("dist/server/index.js must have an ESM default export with fetch(request, env, ctx)");
}

console.log("Validated Cloudflare Worker artifact: ESM default.fetch and generated Wrangler config are present.");
