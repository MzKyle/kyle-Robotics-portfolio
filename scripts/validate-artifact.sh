#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

project_root="$(cd "${script_dir}/.." && pwd)"
worker="${project_root}/dist/server/index.js"
wrangler_config="${project_root}/dist/server/wrangler.json"

[[ -f "${worker}" ]] || {
  echo "Missing Cloudflare Worker entry: dist/server/index.js" >&2
  exit 66
}
[[ -f "${wrangler_config}" ]] || {
  echo "Missing generated Wrangler config: dist/server/wrangler.json" >&2
  exit 66
}

node --input-type=module - "${worker}" "${wrangler_config}" <<'NODE'
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const [workerPath, wranglerPath] = process.argv.slice(2);
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
NODE

echo "Validated Cloudflare Worker artifact: ESM default.fetch and generated Wrangler config are present."
