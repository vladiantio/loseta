#!/usr/bin/env node
/**
 * Local docs probe. Loads a docs page from a running preview server, then
 * prints computed styles, runs page expressions and/or screenshots one
 * example. It replaces the one-off Playwright scripts written during visual
 * reviews.
 *
 * Usage:
 *   pnpm --filter web preview --port 4323
 *   node web/scripts/probe.mjs field
 *   node web/scripts/probe.mjs field --example "Field group" --eval "getComputedStyle(el).gap"
 *   node web/scripts/probe.mjs field --all-examples --style vega --scheme dark
 *
 * Progress goes to stderr; results (JSON, file paths) go to stdout.
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { chromium } from "@playwright/test";
import { evaluateSource } from "./lib/eval.mjs";

const USAGE = `Usage: node web/scripts/probe.mjs <route> [options]

  <route>              component name ("field") or docs path ("/docs/components/field")

Options:
  --base <url>         Docs preview URL (default http://localhost:4323)
  --example <title>    Target one section.example; "Default" is the hero example
  --all-examples       Screenshot every example into --out
  --style <name>       Switch the docs style before probing (nova, vega, ...)
  --scheme <name>      light or dark (default light)
  --width <px>         Viewport width (default 1280)
  --height <px>        Viewport height (default 1000)
  --html <file>        Append the file's markup to .docs-content as #probe-root
  --eval <js>          Evaluate an expression, {block} or function with \`el\`
                       bound to the example root, #probe-root or .docs-content.
                       Blocks may use \`await\`; a returned function is called
                       with \`el\`; evaluation times out after 10s.
  --shot <file>        Screenshot the selected target (default: first example preview)
  --shot-el <selector> Screenshot this element instead of the default preview;
                       scoped to the selected example with --example, and
                       inside #probe-root with --html
  --page               Screenshot the whole .docs-content instead of one preview;
                       combine with --example to evaluate on that example
  --out <dir>          --all-examples output directory (default /tmp/loseta-probe)

Examples:
  probe field --example "Responsive layout" --eval "getComputedStyle(el.querySelector('[data-orientation=responsive]')).flexDirection"
  probe popover --example "With form" --eval "{ el.querySelector('[data-demo-trigger]').click(); }" --shot-el ".component-preview" --shot /tmp/popover.png
  probe popover --all-examples --eval "{ el.querySelector('[data-demo-trigger]')?.click(); }" --shot-el ".component-preview" --out /tmp/popover
  probe field --html /tmp/fixture.html --eval "el.querySelector('.field').getBoundingClientRect().width"
  probe field --all-examples --style vega --scheme dark
  probe /docs/components/native-select --eval "getComputedStyle(document.querySelector('.native-select')).width"

The default action is a screenshot of the first example preview; add --page for
the whole page. \`--eval\` runs before \`--shot\`, so an expression can mutate the
page before it is captured. The default \`--shot\` target is .docs-preview;
open overlays that paint into the code area need --shot-el ".component-preview"
or a taller preview.`;

const args = process.argv.slice(2);
const valueFlags = new Set([
  "--base",
  "--style",
  "--scheme",
  "--width",
  "--height",
  "--example",
  "--eval",
  "--shot",
  "--shot-el",
  "--html",
  "--out"
]);
const booleanFlags = new Set(["--all-examples", "--page", "--help", "-h"]);

const options = new Map();
const positionals = [];

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (booleanFlags.has(arg)) {
    options.set(arg, true);
    continue;
  }
  const equals = arg.startsWith("--") ? arg.indexOf("=") : -1;
  const name = equals === -1 ? arg : arg.slice(0, equals);
  if (valueFlags.has(name)) {
    const value = equals === -1 ? args[(index += 1)] : arg.slice(equals + 1);
    if (!value || value.startsWith("--")) {
      console.error(`probe: ${name} needs a value`);
      process.exit(1);
    }
    options.set(name, value);
    continue;
  }
  if (arg.startsWith("-")) {
    console.error(`probe: unknown option ${arg}\n\n${USAGE}`);
    process.exit(1);
  }
  positionals.push(arg);
}

if (options.has("--help") || options.has("-h")) {
  console.log(USAGE);
  process.exit(0);
}

function option(name, fallback) {
  return options.get(name) ?? fallback;
}

function die(message) {
  console.error(`probe: ${message}`);
  process.exit(1);
}

const route = positionals[0];
if (!route) die(`missing route\n\n${USAGE}`);
if (positionals.length > 1) {
  die(`unexpected arguments: ${positionals.slice(1).join(" ")}`);
}

const base = option("--base", "http://localhost:4323").replace(/\/$/, "");
const scheme = option("--scheme", "light");
if (scheme !== "light" && scheme !== "dark") {
  die(
    `unknown scheme "${scheme}"; use light or dark (styles:review covers both at once)`
  );
}

const width = Number(option("--width", "1280"));
const height = Number(option("--height", "1000"));
if (!Number.isInteger(width) || width <= 0) die("--width must be a positive integer");
if (!Number.isInteger(height) || height <= 0) die("--height must be a positive integer");

const allExamples = options.has("--all-examples");
const pageWide = options.has("--page");
const exampleTitle = option("--example");
const evalSource = option("--eval");
const shotFile = option("--shot");
const shotEl = option("--shot-el");
const htmlFile = option("--html");
const out = resolve(option("--out", "/tmp/loseta-probe"));

if (allExamples && exampleTitle) die("use --example or --all-examples, not both");
if (allExamples && pageWide) die("use --page or --all-examples, not both");
if (pageWide && htmlFile) die("use --html or --page, not both");
if (htmlFile && exampleTitle) die("use --html or --example, not both");
if (htmlFile && allExamples) die("use --html or --all-examples, not both");
if (allExamples && shotFile) die("use --all-examples with --out, not --shot");
if (htmlFile && !existsSync(htmlFile)) die(`no such file: ${htmlFile}`);

const url = /^https?:\/\//.test(route)
  ? route
  : route.startsWith("/")
    ? `${base}${route}`
    : `${base}/docs/components/${route}`;

const routeSlug =
  route
    .replace(/^https?:\/\/[^/]+/, "")
    .split(/[?#]/)[0]
    .split("/")
    .filter(Boolean)
    .pop() || "page";

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function note(message) {
  console.error(`probe: ${message}`);
}

function log(value) {
  console.log(typeof value === "string" ? value : JSON.stringify(value, null, 2));
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });

try {
  await page.emulateMedia({ colorScheme: scheme });
  note(`${url} (${scheme}, ${width}x${height})`);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });

  const style = option("--style");
  if (style) {
    const select = page.locator("[data-style-select]");
    if ((await select.count()) === 0) {
      throw new Error("this page has no style selector; drop --style");
    }
    const styles = await select
      .locator("option")
      .evaluateAll((options) => options.map((option) => option.value));
    if (!styles.includes(style)) {
      throw new Error(`unknown style "${style}"; available: ${styles.join(", ")}`);
    }
    await select.selectOption(style);
    await page.waitForFunction(
      (name) => {
        const link = document.querySelector("[data-style-link]");
        return link?.getAttribute("href") === `/styles/${name}.css`;
      },
      style
    );
    await page.waitForFunction(
      (name) =>
        [...document.styleSheets].some(
          (sheet) => sheet.href && sheet.href.endsWith(`/styles/${name}.css`)
        ),
      style
    );
    note(`style ${style}`);
  }

  const sections = page.locator("section.example");
  const sectionCount = await sections.count();
  const titles = await sections.evaluateAll((elements) =>
    elements.map(
      (element, index) =>
        element.querySelector(".example-title")?.textContent?.trim() ??
        (index === 0 ? "Default" : `Example ${index + 1}`)
    )
  );

  if (htmlFile) {
    const markup = readFileSync(htmlFile, "utf8");
    await page.evaluate((content) => {
      const main = document.querySelector(".docs-content");
      if (!main) throw new Error("no .docs-content on this page");
      const wrapper = document.createElement("div");
      wrapper.id = "probe-root";
      wrapper.innerHTML = content;
      main.append(wrapper);
    }, markup);
    await page.evaluate(() => document.fonts.ready);
    note(`injected ${htmlFile} as #probe-root`);
  }

  function findExample(title) {
    const wanted = title.trim().toLowerCase();
    const exact = titles.findIndex((entry) => entry.toLowerCase() === wanted);
    const index =
      exact !== -1
        ? exact
        : titles.findIndex((entry) => entry.toLowerCase().includes(wanted));
    if (index === -1) {
      throw new Error(
        `no example titled "${title}"; available: ${titles.join(", ")}`
      );
    }
    return index;
  }

  let exampleIndex = -1;
  if (exampleTitle) {
    exampleIndex = findExample(exampleTitle);
    note(`example ${titles[exampleIndex]}`);
  }

  function pageTarget() {
    if (htmlFile) return page.locator("#probe-root");
    if (exampleIndex !== -1) return sections.nth(exampleIndex);
    return page.locator(".docs-content");
  }

  async function evaluate(locator) {
    return evaluateSource(locator, evalSource);
  }

  async function screenshot(locator, file) {
    if ((await locator.count()) === 0) {
      const scope = htmlFile
        ? " inside #probe-root"
        : exampleIndex !== -1
          ? ` in example "${titles[exampleIndex]}"`
          : "";
      throw new Error(
        `no element to screenshot${shotEl ? ` for --shot-el ${shotEl}${scope}` : ""}`
      );
    }
    mkdirSync(dirname(resolve(file)), { recursive: true });
    await locator.scrollIntoViewIfNeeded();
    await locator.screenshot({ path: resolve(file) });
    return resolve(file);
  }

  async function previewOrSection(index) {
    const section = sections.nth(index);
    const preview = section.locator(".docs-preview").first();
    return (await preview.count()) > 0 ? preview : section;
  }

  async function shotTarget() {
    if (shotEl) {
      if (htmlFile) return page.locator("#probe-root").locator(shotEl).first();
      if (exampleIndex !== -1) {
        return sections.nth(exampleIndex).locator(shotEl).first();
      }
      return page.locator(shotEl).first();
    }
    if (htmlFile) return page.locator("#probe-root");
    if (pageWide) return page.locator(".docs-content");
    if (exampleIndex !== -1) return previewOrSection(exampleIndex);
    if (sectionCount > 0) return previewOrSection(0);
    return page.locator(".docs-content");
  }

  async function screenshotExample(index, file) {
    if (shotEl) {
      return screenshot(sections.nth(index).locator(shotEl).first(), file);
    }
    return screenshot(await previewOrSection(index), file);
  }

  if (allExamples) {
    if (sectionCount === 0) throw new Error("this page has no section.example");
    const files = [];
    const results = [];
    for (let index = 0; index < sectionCount; index += 1) {
      if (evalSource) {
        results.push({
          title: titles[index],
          result: await evaluate(sections.nth(index))
        });
      }
      files.push(
        await screenshotExample(
          index,
          join(out, `${String(index).padStart(2, "0")}-${slug(titles[index])}.png`)
        )
      );
    }
    files.forEach(log);
    if (evalSource) log(results);
  } else if (evalSource) {
    log(await evaluate(pageTarget()));
    if (shotFile) {
      log(await screenshot(await shotTarget(), shotFile));
    }
  } else {
    const file =
      shotFile ??
      join(
        out,
        `${routeSlug}${exampleIndex !== -1 ? `-${slug(titles[exampleIndex])}` : ""}${
          style ? `-${style}` : ""
        }-${scheme}.png`
      );
    log(await screenshot(await shotTarget(), file));
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/ERR_CONNECTION_REFUSED|ECONNREFUSED/.test(message)) {
    console.error(
      `probe: cannot reach ${base}; start the preview with \`pnpm --filter web astro preview --port 4323 --background\``
    );
  } else {
    console.error(`probe: ${message}`);
  }
  process.exitCode = 1;
} finally {
  await browser.close();
}
