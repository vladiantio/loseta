#!/usr/bin/env node
/**
 * Local visual-review helper. Starts from a running docs preview server,
 * screenshots the first preview of each component in every style, and composes
 * contact sheets with ImageMagick.
 *
 * Usage:
 *   pnpm --filter web preview --port 4323
 *   node web/scripts/style-review.mjs button card select --scheme both
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: node web/scripts/style-review.mjs <item...> [options]

Options:
  --base <url>       Docs preview URL (default http://localhost:4323)
  --out <dir>        Output directory (default /tmp/loseta-style-review)
  --scheme <name>    light, dark or both (default light)`);
  process.exit(args.length === 0 ? 1 : 0);
}

function option(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`style-review: ${name} needs a value`);
    process.exit(1);
  }
  return value;
}

const base = option("--base", "http://localhost:4323").replace(/\/$/, "");
const out = resolve(option("--out", "/tmp/loseta-style-review"));
const schemeOption = option("--scheme", "light");
const schemes =
  schemeOption === "both" ? ["light", "dark"] : [schemeOption];
if (schemes.some((scheme) => scheme !== "light" && scheme !== "dark")) {
  console.error(`style-review: unknown scheme: ${schemeOption}`);
  process.exit(1);
}

const ignored = new Set(["--base", "--out", "--scheme"]);
const items = args
  .filter((arg, index) => {
    if (ignored.has(arg)) return false;
    const previous = args[index - 1];
    return !ignored.has(previous);
  })
  .flatMap((arg) => arg.split(","))
  .map((item) => item.trim())
  .filter(Boolean);

if (items.length === 0) {
  console.error("style-review: pass at least one component name");
  process.exit(1);
}

const styles = ["nova", "vega", "maia", "lyra", "mira", "luma", "sera", "rhea"];
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

async function waitForStyle(style) {
  await page.waitForFunction((name) => {
    return [...document.styleSheets].some(
      (sheet) => sheet.href && sheet.href.endsWith(`/styles/${name}.css`)
    );
  }, style);
}

const shots = new Map();

for (const scheme of schemes) {
  await page.emulateMedia({ colorScheme: scheme });

  for (const item of items) {
    const files = [];
    for (const style of styles) {
      await page.goto(`${base}/docs/components/${item}`, {
        waitUntil: "networkidle"
      });
      await page.locator("[data-style-select]").selectOption(style);
      await page.waitForFunction(
        (name) => {
          const link = document.querySelector("[data-style-link]");
          return link?.getAttribute("href") === `/styles/${name}.css`;
        },
        style
      );
      await waitForStyle(style);
      await page.addStyleTag({
        content:
          "*, *::before, *::after { transition: none !important; animation: none !important; }"
      });
      await page.evaluate(() => document.fonts.ready);

      const preview = page.locator(".docs-preview").first();
      const target = (await preview.count()) > 0 ? preview : page.locator(".docs-content");
      const file = join(out, `${item}-${style}-${scheme}.png`);
      await target.screenshot({ path: file });
      files.push(file);
      console.log(`${item} ${style} ${scheme}`);
    }
    shots.set(`${item}-${scheme}`, files);
  }
}

await browser.close();

let hasMagick = true;
try {
  execFileSync("magick", ["-version"], { stdio: "ignore" });
} catch {
  hasMagick = false;
}

if (!hasMagick) {
  console.log("\nImageMagick not found; individual screenshots are in", out);
  process.exit(0);
}

for (const [key, files] of shots) {
  const sheet = join(out, `${key}-sheet.png`);
  execFileSync(
    "magick",
    ["montage", ...files, "-tile", "8x", "-geometry", "+8+8", "-background", "#e5e5e5", sheet],
    { stdio: "inherit" }
  );
  console.log(`sheet ${sheet}`);
}

for (const scheme of schemes) {
  const files = items.flatMap((item) => shots.get(`${item}-${scheme}`) ?? []);
  if (files.length === 0) continue;
  const sheet = join(out, `batch-${scheme}.png`);
  execFileSync(
    "magick",
    ["montage", ...files, "-tile", "8x", "-geometry", "+8+8", "-background", "#e5e5e5", sheet],
    { stdio: "inherit" }
  );
  console.log(`sheet ${sheet}`);
}

if (!existsSync(join(out, "batch-light.png")) && !existsSync(join(out, "batch-dark.png"))) {
  console.error("style-review: no contact sheets were written");
  process.exit(1);
}
