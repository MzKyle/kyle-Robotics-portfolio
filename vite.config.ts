import vinext from "vinext";
import { defineConfig, normalizePath, type Plugin } from "vite";

// Vinext 0.0.50 caches CSS paths with forward slashes, but compares them against
// a Windows backslash path. Rewrite the missed font URLs after its transform;
// its own middleware and writeBundle hook already serve this asset namespace.
function windowsFontUrls(): Plugin {
  let cachePrefix = "";
  let servedPrefix = "";
  return {
    name: "portfolio:windows-font-urls",
    enforce: "post",
    configResolved(config) {
      cachePrefix = `${normalizePath(config.root)}/.vinext/fonts`;
      servedPrefix = `/${config.build.assetsDir || "assets"}/_vinext_fonts`;
    },
    transform(code) {
      if (process.platform !== "win32" || !code.includes("_selfHostedCSS") || !code.includes(cachePrefix)) return null;
      return { code: code.split(cachePrefix).join(servedPrefix), map: null };
    },
  };
}

// Sandboxed macOS environments can block FSEvents, so previews use polling for HMR.
const isSeatbeltSandbox = process.env.PREVIEW_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      ...(isSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      vinext(),
      windowsFontUrls(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: localBindingConfig,
      }),
    ],
  };
});
