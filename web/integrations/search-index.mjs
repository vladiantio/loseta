import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decodeHtmlEntities, extractMeta, findHtmlFiles } from "./html-utils.mjs";

const HEADING_LINK_PATTERN = /<a\b([^>]*\bdata-toc-link\b[^>]*)>([\s\S]*?)<\/a>/gi;
const HREF_PATTERN = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i;
const DEPTH_PATTERN = /\bdata-depth\s*=\s*(?:"([^"]*)"|'([^']*)')/i;

function groupForRoute(route) {
  if (route.startsWith("/docs/components")) return "Components";
  if (route.startsWith("/blocks")) return "Blocks";
  if (route === "/docs/styles") return "Styles";
  if (route.startsWith("/docs/")) return "Guides";
  return "Pages";
}

function routeFromHtml(relativeHtml) {
  const normalized = relativeHtml.split(path.sep).join("/");
  if (normalized === "index.html") return "/";
  if (normalized.endsWith("/index.html")) {
    return `/${normalized.slice(0, -"/index.html".length)}`;
  }
  return `/${normalized.replace(/\.html$/, "")}`;
}

function textFromHtml(html) {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(html) {
  const headings = [];
  const used = new Set();

  for (const match of html.matchAll(HEADING_LINK_PATTERN)) {
    const attributes = match[1];
    const hrefMatch = attributes.match(HREF_PATTERN);
    const href = hrefMatch?.[1] ?? hrefMatch?.[2];
    if (!href?.startsWith("#")) continue;

    let id;
    try {
      id = decodeURIComponent(href.slice(1));
    } catch {
      continue;
    }
    if (!id || used.has(id)) continue;

    const text = textFromHtml(match[2]);
    if (!text) continue;

    const depthMatch = attributes.match(DEPTH_PATTERN);
    const rawDepth = depthMatch?.[1] ?? depthMatch?.[2];
    const depth = rawDepth === "3" ? 3 : 2;
    used.add(id);
    headings.push({ depth, id, text });
  }

  return headings;
}

/** Adds a static search index to the built site using each rendered page as truth. */
export default function searchIndex() {
  return {
    name: "loseta:search-index",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const distDirectory = fileURLToPath(dir);
        const registry = JSON.parse(
          await readFile(
            fileURLToPath(
              new URL("../../packages/loseta/registry/registry.json", import.meta.url)
            ),
            "utf8"
          )
        );
        const styleKeywords = registry.styles.flatMap((style) => [style.name, style.title]);
        const itemByName = new Map(registry.items.map((item) => [item.name, item]));
        const htmlFiles = (await findHtmlFiles(distDirectory)).filter((file) => {
          if (path.basename(file) === "404.html") return false;
          return !path.relative(distDirectory, file).startsWith(`fixtures${path.sep}`);
        });
        const pages = [];

        for (const file of htmlFiles) {
          const relativeHtml = path.relative(distDirectory, file);
          const html = await readFile(file, "utf8");
          const { byProperty, byName } = extractMeta(html);
          const route = routeFromHtml(relativeHtml);
          const title = byProperty.get("og:title")?.trim();
          if (!title) {
            throw new Error(
              `Missing og:title in ${relativeHtml}. Render the page with Layout.astro.`
            );
          }

          const keywords = [];
          if (route === "/docs/styles") keywords.push(...styleKeywords);
          if (route.startsWith("/docs/components/")) {
            const name = route.slice("/docs/components/".length);
            const item = itemByName.get(name);
            if (item) keywords.push(item.name);
          }

          pages.push({
            route,
            title,
            description: byName.get("description")?.trim() ?? "",
            group: groupForRoute(route),
            keywords,
            headings: extractHeadings(html)
          });
        }

        if (pages.length === 0) {
          throw new Error("The search index did not find any rendered HTML pages.");
        }

        pages.sort((left, right) => left.route.localeCompare(right.route));
        await writeFile(
          path.join(distDirectory, "search-index.json"),
          JSON.stringify({ version: 1, pages })
        );
        logger.info(`Generated search index for ${pages.length} pages.`);
      }
    }
  };
}
