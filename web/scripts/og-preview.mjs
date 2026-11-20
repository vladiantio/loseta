import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderOgCard } from "../src/lib/og-render.mjs";

const webRoot = fileURLToPath(new URL("../", import.meta.url));
const pageMeta = JSON.parse(
  await readFile(new URL("../src/data/page-meta.json", import.meta.url), "utf8")
);
const registry = JSON.parse(
  await readFile(new URL("../../packages/loseta/registry/registry.json", import.meta.url), "utf8")
);
const components = registry.items.filter((item) => item.type === "component");
const componentById = new Map(components.map((component) => [component.name, component]));

function printUsage() {
  console.log(`Usage: pnpm --filter web og:preview [route] [--title <text>] [--description <text>]

Examples:
  pnpm --filter web og:preview
  pnpm --filter web og:preview /docs/components/button
  pnpm --filter web og:preview /docs/theming --title Theming

The image is written to web/.og-preview/.
`);
}

function normalizeRoute(value) {
  const pathname = decodeURIComponent(new URL(value, "https://loseta.vladiantio.com").pathname);

  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
}

function resolveCopy(route) {
  if (route === "/") {
    return { ...pageMeta["/"], source: "page metadata" };
  }

  const componentMatch = route.match(/^\/docs\/components\/([^/]+)$/);

  if (componentMatch) {
    const component = componentById.get(componentMatch[1]);

    if (component) {
      return {
        title: component.title,
        description: component.description,
        source: "registry"
      };
    }
  }

  return pageMeta[route] ? { ...pageMeta[route], source: "page metadata" } : undefined;
}

const args = process.argv.slice(2);
let route = "/";
let title;
let description;

for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];

  if (argument === "--help" || argument === "-h") {
    printUsage();
    process.exit(0);
  }

  if (argument === "--title") {
    title = args[index + 1];
    index += 1;
    continue;
  }

  if (argument === "--description") {
    description = args[index + 1];
    index += 1;
    continue;
  }

  if (argument === "--route") {
    route = args[index + 1] ?? route;
    index += 1;
    continue;
  }

  if (argument.startsWith("-")) {
    console.error(`Unknown option: ${argument}`);
    printUsage();
    process.exit(1);
  }

  route = argument;
}

route = normalizeRoute(route);

const copy = resolveCopy(route);

if (!copy) {
  console.error(`No Open Graph copy found for ${route}.`);
  console.error("Static routes live in web/src/data/page-meta.json.");
  console.error("Available routes:");
  console.error([...Object.keys(pageMeta), ...components.map((item) => `/docs/components/${item.name}`)].join("\n"));
  process.exit(1);
}

const cardTitle = title ?? copy.title;
const cardDescription = description ?? copy.description;
const filename = route === "/" ? "home.png" : `${route.slice(1).replaceAll("/", "-")}.png`;
const output = fileURLToPath(new URL(`../.og-preview/${filename}`, import.meta.url));

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, await renderOgCard({ title: cardTitle, description: cardDescription }));

console.log(`Wrote ${path.relative(webRoot, output)} (${copy.source}).`);
