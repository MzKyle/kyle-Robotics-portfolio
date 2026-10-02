import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const diagramDirectory = path.join(root, "public/diagrams/sany");
const executablePath = process.env.BROWSER_EXECUTABLE ?? [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);

function desktopLayout(source, name, language) {
  // A block grid avoids flowchart cluster ordering that stacks the two timelines.
  // Labels and directed edges are read from the original flowchart source; only
  // placement changes. All branches, matching, ISP, and resync relations survive.
  const labels = new Map(Array.from(source.matchAll(/(\w+)\["([^"]+)"\]/g), ([, id, label]) => [id, label]));
  const edges = Array.from(source.replace(/(\w+)\["[^"]+"\]/g, "$1").matchAll(/(\w+)\s*-->\s*(?:\|([^|]+)\|\s*)?(\w+)/g), ([, from, label, to]) => `${from} -->${label ? `|"${label}"|` : ""} ${to}`);
  const node = (id, span = 1) => `${id}["${labels.get(id)}"]:${span}`;
  let grid;
  if (name === "dual-timeline") {
    const robotLabel = language === "zh" ? "机器人时间轴 · ≈60 Hz" : "ROBOT TIMELINE · ≈60 Hz";
    const cameraLabel = language === "zh" ? "相机时间轴 · 高频 RAW" : "CAMERA TIMELINE · HIGH-RATE RAW";
    grid = ["columns 7", `RLabel["${robotLabel}"]:3 space CLabel["${cameraLabel}"]:3`, "space:7",
      `${node("FANUC", 3)} space ${node("RAW", 3)}`, "space:7",
      `${node("TCP", 3)} space ${node("TS", 3)}`, "space:7",
      `${node("SEP", 3)} space ${node("BUF", 3)}`, "space:7",
      `${node("SLOW")} space ${node("SWING")} ${node("SYNC")} ${node("MATCH", 3)}`, "space:7",
      `${node("MODEL", 3)} space ${node("KEY", 3)}`, "space:7",
      `${node("PHASE", 3)} space ${node("ISP", 3)}`, "space:7",
      `${node("TP", 3)} space ${node("STD", 3)}`, "space:7",
      `space:4 ${node("SEQ", 3)}`, "space:7", `space:4 ${node("ALGO", 3)}`,
      "style RLabel fill:transparent,stroke:transparent,color:#0866e8", "style CLabel fill:transparent,stroke:transparent,color:#0866e8"];
  } else {
    grid = ["columns 4", `${node("Start")} ${node("ReadCounts")} ${node("Anchor")} ${node("Independent")}`, "space:4",
      `space:2 ${node("Cam")} ${node("Rob")}`, "space:4",
      `${node("ROS", 2)} ${node("Match", 2)}`, "space:4",
      `${node("Update", 2)} ${node("Drift", 2)}`, "space:4", `space:2 ${node("Resync", 2)}`];
  }
  const accents = source.match(/^\s*class (.+) accent;/m)?.[1].split(",") ?? [];
  const styles = accents.map((id) => `style ${id} fill:#edf3fb,stroke:#0866e8,color:#161719`);
  return ["block-beta", ...grid.filter((line) => !/^space:\d+$/.test(line)), ...edges.map((edge) => edge.replace(/-->\|.*?\|/, "-->")), ...styles].join("\n");
}

// Serve the local Mermaid ESM bundle. No CDN or runtime page dependency.
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (pathname === "/") {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end('<html><body><script type="module">import mermaid from "/mermaid/mermaid.esm.min.mjs"; window.mermaid = mermaid;</script></body></html>');
      return;
    }
    if (!pathname.startsWith("/mermaid/") || pathname.includes("..")) throw new Error("Invalid bundle path");
    response.setHeader("Content-Type", "text/javascript");
    response.end(await readFile(path.join(root, "node_modules/mermaid/dist", pathname.slice(9))));
  } catch { response.writeHead(404).end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let browser;
const dimensions = {};
try {
  browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(() => window.mermaid);
  await page.evaluate(() => window.mermaid.initialize({
    startOnLoad: false, securityLevel: "strict", theme: "base", look: "classic", layout: "dagre", htmlLabels: false,
    fontFamily: 'Arial, "Microsoft YaHei", sans-serif',
    themeVariables: {
      fontSize: "16px", primaryColor: "#ffffff", primaryTextColor: "#161719",
      primaryBorderColor: "#bac1c8", lineColor: "#89939e", secondaryColor: "#edf3fb",
      tertiaryColor: "#f7f7f5", clusterBkg: "#f7f7f5", clusterBorder: "#d8dcdf",
      edgeLabelBackground: "#f7f7f5", background: "#f7f7f5",
    },
    block: { padding: 14 },
    flowchart: { htmlLabels: false, curve: "linear", nodeSpacing: 20, rankSpacing: 28, padding: 12, wrappingWidth: 220, useMaxWidth: false },
  }));
  for (const name of ["clock-mapping", "dual-timeline"]) {
    for (const language of ["zh", "en"]) {
      const source = await readFile(path.join(diagramDirectory, `${name}-${language}.mmd`), "utf8");
      for (const mobile of [false, true]) {
        const id = `${name}-${language}${mobile ? "-mobile" : ""}`;
        // Remove grouping on phones so every original node and edge stays readable
        // in one continuous vertical flow. The technical graph remains identical.
        let code = mobile ? source.replace(/^flowchart LR/m, "flowchart TB")
          .replace(/^\s*(subgraph .*|direction TB|end)\s*$/gm, "") : desktopLayout(source, name, language);
        if (mobile && name === "dual-timeline") {
          // This invisible link controls placement only: retain both independent
          // paths while laying them vertically for readable phone-size labels.
          code += "\nSYNC ~~~ RAW";
        }
        if (!mobile) await writeFile(path.join(diagramDirectory, `${id}-layout.mmd`), code);
        const artifact = await page.evaluate(async ({ id, code, mobile, name }) => {
          const result = await window.mermaid.render(id, code);
          const host = document.createElement("div");
          host.innerHTML = result.svg;
          document.body.append(host);
          const svg = host.querySelector("svg");
          if (!mobile) {
            // Mermaid's block renderer can backtrack arrows between blocks with
            // different column spans. Clip the original directed edges against
            // the final node rectangles, keeping their direction unambiguous.
            for (const edge of svg.querySelectorAll("path[data-edge]")) {
              const [, from, to] = edge.getAttribute("data-id").match(/-1-(\w+)-(\w+)$/) ?? [];
              if (!from || !to) continue;
              const bounds = (nodeId) => {
                const node = svg.querySelector(`[id="${id}-${nodeId}"]`);
                const box = node.getBBox();
                const transform = node.transform.baseVal.consolidate().matrix;
                return { x: transform.e + box.x + box.width / 2, y: transform.f + box.y + box.height / 2, width: box.width, height: box.height };
              };
              const start = bounds(from), end = bounds(to);
              const dx = end.x - start.x, dy = end.y - start.y;
              const clip = (box) => Math.min(dx ? box.width / 2 / Math.abs(dx) : Infinity, dy ? box.height / 2 / Math.abs(dy) : Infinity);
              const a = clip(start), b = clip(end);
              const startX = start.x + dx * a, startY = start.y + dy * a;
              const endX = end.x - dx * b, endY = end.y - dy * b;
              if (name === "dual-timeline" && from === "TP" && to === "SYNC") {
                const startRight = start.x + start.width / 2, endLeft = end.x - end.width / 2;
                const bridgeX = (startRight + endLeft) / 2;
                edge.setAttribute("d", `M${startRight} ${start.y}H${bridgeX}V${end.y}H${endLeft - 4}`);
              } else if (name === "clock-mapping" && ["Cam", "Rob"].includes(from) && to === "ROS") {
                // Both counter paths merge in the row gutter, avoiding a diagonal
                // robot-counter edge cutting through the camera-counter label.
                const startBottom = start.y + start.height / 2;
                const endTop = end.y - end.height / 2;
                const bridgeY = (startBottom + endTop) / 2;
                edge.setAttribute("d", `M${start.x} ${startBottom}V${bridgeY}H${end.x}V${endTop - 4}`);
              } else {
                const distance = Math.hypot(dx, dy);
                edge.setAttribute("d", `M${startX} ${startY}L${endX - 4 * dx / distance} ${endY - 4 * dy / distance}`);
              }
            }
          }
          // XML serialization makes the generated document safe to load as an
          // external SVG image, including any self-closing elements.
          const serialized = new XMLSerializer().serializeToString(svg);
          const size = { width: Math.ceil(svg.viewBox.baseVal.width), height: Math.ceil(svg.viewBox.baseVal.height) };
          host.remove();
          return { svg: serialized, ...size };
        }, { id, code, mobile, name });
        await writeFile(path.join(diagramDirectory, `${id}.svg`), artifact.svg);
        const key = `${name}-${language}`;
        dimensions[key] ??= {};
        dimensions[key][mobile ? "mobile" : "desktop"] = { width: artifact.width, height: artifact.height };
        console.log(`Rendered ${id}.svg`);
      }
    }
  }
  await writeFile(path.join(root, "lib/sany-diagram-sizes.ts"), `// Generated by npm run diagrams:sany; preserves layout before lazy SVG loading.\nexport const sanyDiagramSizes = ${JSON.stringify(dimensions, null, 2)} as const;\n`);
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
