import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { transform } from "lightningcss";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const registryDir = join(packageRoot, "registry");
const registryPath = join(registryDir, "registry.json");
const schemaPath = join(registryDir, "schema.json");

// Rules that apply to every registry file, base or style.
const forbiddenEverywhere = [
  { pattern: /!important/g, message: "!important is not allowed" },
  {
    pattern: /html\.dark/g,
    message: "use .dark / .light on any container; html.dark blocks scoped overrides"
  }
];

// Rules for base-role files only. Style files own the visual treatment.
const forbiddenInBase = [
  { pattern: /\[class\*='size-'\]/g, message: "Tailwind size-* sniffing is not allowed" },
  { pattern: /\.border-[bt]\b/g, message: "Tailwind border utilities are not allowed" },
  { pattern: /\.peer\b/g, message: ".peer is a Tailwind dependency" },
  { pattern: /\.active\b/g, message: ".active is replaced by data-highlighted / ARIA state" },
  { pattern: /@layer components/g, message: "use loseta.* layers" },
  { pattern: /\[data-state=['"]selected['"]\]/g, message: "use aria-selected" },
  { pattern: /\[data-invalid\]/g, message: "use aria-invalid" },
  { pattern: /\[data-disabled/g, message: "use :disabled or aria-disabled" },
  { pattern: /\[data-selected/g, message: "use aria-selected" },
  { pattern: /\[data-title\]/g, message: "use data-slot=\"title\"" },
  { pattern: /\[data-description\]/g, message: "use data-slot=\"description\"" },
  { pattern: /\[data-shortcut\]/g, message: "use data-slot=\"shortcut\"" },
  { pattern: /\[data-indicator\]/g, message: "use data-slot=\"indicator\"" }
];

// Spacing and borders in the style layer follow the inline axis, so icon
// padding and dividers mirror on RTL pages.
const forbiddenInStyle = [
  {
    pattern: /(?:padding|margin|border)-(?:left|right)\b/g,
    message:
      "use logical properties (padding-inline-start/-end, margin-inline-start/-end, border-inline-start/-end)"
  }
];

// Dark values live in the token and style layers. Keep light-dark() out of
// base-role files, and keep the OS media query in the token layer only.
const forbiddenInBaseColor = [
  { pattern: /light-dark\(/g, message: "dark values belong in the style layer" }
];

const forbiddenOutsideTokens = [
  {
    pattern: /@media \(prefers-color-scheme/g,
    message: "the OS color scheme belongs in the tokens layer"
  }
];

// Stable style files must be differentiated before the item is promoted.
const promotionScaffold = /\/\*\s*loseta:promotion-scaffold\s*\*\//;

const errors = [];

function fail(message) {
  errors.push(message);
}

// Selector ASTs from lightningcss are comparable across files: they ignore
// formatting and preserve the rule structure. The formatter is only for error
// messages, so a readable approximation is enough.
function formatSelector(selector) {
  return selector.map(formatSelectorComponent).join("");
}

function formatSelectorComponent(component) {
  switch (component.type) {
    case "nesting":
      return "&";
    case "class":
      return `.${component.name}`;
    case "type":
      return component.name;
    case "universal":
      return "*";
    case "combinator":
      return (
        {
          descendant: " ",
          child: " > ",
          "next-sibling": " + ",
          "later-sibling": " ~ "
        }[component.value] ?? ` ${component.value} `
      );
    case "pseudo-class": {
      const argument = component.selectors
        ? `(${component.selectors.map(formatSelector).join(", ")})`
        : component.kind === "dir" && component.direction
          ? `(${component.direction})`
          : "";
      return `:${component.kind}${argument}`;
    }
    case "pseudo-element":
      return `::${component.kind}`;
    case "attribute": {
      const namespace = component.namespace ? `${component.namespace}|` : "";
      if (!component.operation) {
        return `[${namespace}${component.name}]`;
      }
      const operators = {
        equal: "=",
        includes: "~=",
        "dash-match": "|=",
        prefix: "^=",
        suffix: "$=",
        substring: "*="
      };
      const operator =
        operators[component.operation.operator] ?? component.operation.operator;
      const insensitive =
        component.operation.caseSensitivity === "ascii-case-insensitive"
          ? " i"
          : "";
      return `[${namespace}${component.name}${operator}"${component.operation.value}"${insensitive}]`;
    }
    default:
      return JSON.stringify(component);
  }
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

const registry = readJson(registryPath);
const packageJson = readJson(join(packageRoot, "package.json"));
const schema = readJson(schemaPath);

if (registry.version !== packageJson.version) {
  fail(
    `version mismatch: registry.json is ${registry.version}, package.json is ${packageJson.version}`
  );
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
if (!validate(registry)) {
  for (const error of validate.errors ?? []) {
    fail(`schema ${error.instancePath || "/"}: ${error.message}`);
  }
}

const items = new Map();
for (const item of registry.items ?? []) {
  if (items.has(item.name)) {
    fail(`duplicate item: ${item.name}`);
  }
  items.set(item.name, item);
}

// Component root classes map back to the item a consumer would install.
// Primitive and foundation roots are excluded: they are implementation
// details, not composition dependencies.
const componentRoots = new Map();
for (const item of registry.items ?? []) {
  if (item.type !== "component") continue;
  for (const root of item.root ?? []) {
    if (!root.startsWith(".")) continue;
    const className = root.slice(1);
    if (!componentRoots.has(className)) {
      componentRoots.set(className, new Set());
    }
    componentRoots.get(className).add(item.name);
  }
}

const stylesRoot = join(registryDir, "styles");
const styleNames = new Set();
for (const style of registry.styles ?? []) {
  if (styleNames.has(style.name)) {
    fail(`duplicate style: ${style.name}`);
  }
  styleNames.add(style.name);
  if (!existsSync(join(stylesRoot, style.name))) {
    fail(`style ${style.name}: expected directory styles/${style.name}`);
  }
}

if (!styleNames.has("nova")) {
  fail('styles: the default "nova" style is not declared');
}

if (existsSync(stylesRoot)) {
  for (const entry of readdirSync(stylesRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && !styleNames.has(entry.name)) {
      fail(`undeclared style directory: styles/${entry.name}`);
    }
  }
}

function walk(dir, base = "") {
  const files = [];
  for (const entry of readdirSync(join(dir, base), { withFileTypes: true })) {
    const relative = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...walk(dir, relative));
    } else if (entry.name.endsWith(".css")) {
      files.push(relative);
    }
  }
  return files;
}

const idRefAttributes = [
  "for",
  "aria-controls",
  "aria-labelledby",
  "aria-describedby",
  "aria-owns",
  "aria-activedescendant",
  "headers",
  "list",
  "form"
];

function normalizeCssValue(value) {
  return value.replace(/\s+/g, " ").trim();
}

function firstDeclaration(css, property) {
  const match = new RegExp(`${property}:\\s*([^;]+);`).exec(css);
  return match ? normalizeCssValue(match[1]) : null;
}

function overlayRecipe(css) {
  return {
    radius: firstDeclaration(css, "border-radius"),
    shadow: firstDeclaration(css, "box-shadow")
  };
}

function validateExampleMarkup(itemName, examplePath, html) {
  const ids = new Set();
  const duplicates = new Set();

  for (const match of html.matchAll(/(?:^|\s)id="([^"]+)"/g)) {
    if (ids.has(match[1])) duplicates.add(match[1]);
    ids.add(match[1]);
  }

  for (const id of duplicates) {
    fail(`${itemName}: ${examplePath}: duplicate id "${id}"`);
  }

  for (const attribute of idRefAttributes) {
    const pattern = new RegExp(`(?:^|\\s)${attribute}="([^"]+)"`, "g");
    for (const match of html.matchAll(pattern)) {
      for (const ref of match[1].split(/\s+/)) {
        if (ref && !ids.has(ref)) {
          fail(
            `${itemName}: ${examplePath}: ${attribute}="${ref}" has no matching id`
          );
        }
      }
    }
  }
}

function validateExampleComposition(item, examplePath, html) {
  const classes = new Set();
  for (const match of html.matchAll(/(?:^|\s)class="([^"]+)"/g)) {
    for (const name of match[1].split(/\s+/)) {
      if (name) classes.add(name);
    }
  }

  const declared = new Set([
    ...(item.optionalDependencies ?? []),
    ...(item.registryDependencies ?? [])
  ]);
  const missing = new Set();
  for (const name of classes) {
    for (const dependency of componentRoots.get(name) ?? []) {
      if (dependency === item.name) continue;
      if (!declared.has(dependency)) {
        missing.add(dependency);
      }
    }
  }

  if (missing.size > 0) {
    fail(
      `${item.name}: ${examplePath}: undeclared optional dependencies: ${[...missing].sort().join(", ")}`
    );
  }
}

function validatePopoverContracts(itemName, examplePath, html) {
  const chunks = html.split('<div class="popover"').slice(1);

  chunks.forEach((chunk, index) => {
    const panel = /<[a-z][^>]*\bdata-popover\b[^>]*>/i.exec(chunk)?.[0];
    if (!panel) return;

    const suffix = `${itemName}: ${examplePath}: popover ${index + 1}`;
    const beforePanel = chunk.slice(0, chunk.indexOf(panel));
    const trigger =
      /<[a-z][^>]*\baria-controls="[^"]+"[^>]*>/i.exec(beforePanel)?.[0] ??
      /<[a-z][^>]*\baria-haspopup="dialog"[^>]*>/i.exec(beforePanel)?.[0] ??
      /<button\b[^>]*>/i.exec(beforePanel)?.[0];
    const panelId = /(?:^|\s)id="([^"]+)"/.exec(panel)?.[1];

    if (!panelId) fail(`${suffix}: panel needs an id`);
    if (!/\brole="dialog"/.test(panel)) {
      fail(`${suffix}: panel needs role="dialog"`);
    }
    if (!/\btabindex="-1"/.test(panel)) {
      fail(`${suffix}: panel needs tabindex="-1"`);
    }
    if (!/\baria-labelledby="[^"]+"/.test(panel)) {
      fail(`${suffix}: panel needs aria-labelledby`);
    }
    if (!/\baria-hidden="true"/.test(panel)) {
      fail(`${suffix}: panel needs aria-hidden="true" when closed`);
    }

    if (!trigger) {
      fail(`${suffix}: missing trigger`);
      return;
    }
    if (!/\baria-haspopup="dialog"/.test(trigger)) {
      fail(`${suffix}: trigger needs aria-haspopup="dialog"`);
    }
    if (!/\baria-expanded="false"/.test(trigger)) {
      fail(`${suffix}: trigger needs aria-expanded="false" when closed`);
    }

    const controls = /\baria-controls="([^"]+)"/.exec(trigger)?.[1];
    if (!controls || !panelId || !controls.split(/\s+/).includes(panelId)) {
      fail(`${suffix}: trigger aria-controls must reference the panel id`);
    }
  });
}

function validateOverlayRecipes() {
  const candidates = [
    "primitives/listbox.css",
    "primitives/popover.css",
    "context-menu.css"
  ];

  for (const style of styleNames) {
    const menuPath = join(stylesRoot, style, "primitives/menu.css");
    if (!existsSync(menuPath)) continue;

    const menu = overlayRecipe(readFileSync(menuPath, "utf8"));
    if (!menu.radius || !menu.shadow) continue;

    for (const relative of candidates) {
      const path = join(stylesRoot, style, relative);
      if (!existsSync(path)) continue;

      const recipe = overlayRecipe(readFileSync(path, "utf8"));
      if (recipe.radius && recipe.radius !== menu.radius) {
        fail(
          `style ${style}: ${relative}: border-radius ${recipe.radius} does not match the menu primitive ${menu.radius}`
        );
      }
      if (recipe.shadow && recipe.shadow !== menu.shadow) {
        fail(
          `style ${style}: ${relative}: box-shadow does not match the menu primitive`
        );
      }
    }
  }
}

validateOverlayRecipes();

for (const item of registry.items ?? []) {
  for (const dependency of item.registryDependencies ?? []) {
    if (!items.has(dependency)) {
      fail(`${item.name}: missing registry dependency ${dependency}`);
    }
    if (dependency === item.name) {
      fail(`${item.name}: item depends on itself`);
    }
  }
  for (const dependency of item.optionalDependencies ?? []) {
    if (!items.has(dependency)) {
      fail(`${item.name}: missing optional dependency ${dependency}`);
    }
    if ((item.registryDependencies ?? []).includes(dependency)) {
      fail(
        `${item.name}: ${dependency} cannot be both a registry dependency and an optional dependency`
      );
    }
  }

  const roles = new Set();
  const styleFiles = [];
  const styleSelectors = new Map();
  for (const file of item.files ?? []) {
    let currentStyle = null;
    const absolute = join(registryDir, file.path);
    if (!existsSync(absolute)) {
      fail(`${item.name}: file not found: ${file.path}`);
      continue;
    }

    roles.add(file.role);
    const css = readFileSync(absolute, "utf8");

    if (file.role === "style" && item.status === "stable" && promotionScaffold.test(css)) {
      fail(
        `${item.name}: ${file.path}: remove the promotion scaffold before promoting`
      );
    }

    if (file.role === "style") {
      const match = /^styles\/([^/]+)\//.exec(file.path);
      if (!match) {
        fail(`${item.name}: style file must live under styles/<style>/: ${file.path}`);
      } else {
        if (!styleNames.has(match[1])) {
          fail(`${item.name}: undeclared style ${match[1]}: ${file.path}`);
        }
        if (!file.target.startsWith(`styles/${match[1]}/`)) {
          fail(`${item.name}: style target does not match ${match[1]}: ${file.target}`);
        }
        styleFiles.push(match[1]);
        currentStyle = match[1];
      }
    } else if (file.path.startsWith("styles/")) {
      fail(`${item.name}: base file must not live under styles/: ${file.path}`);
    }

    if (!css.includes(`@layer ${file.layer} {`)) {
      fail(`${item.name}: ${file.path} is not wrapped in @layer ${file.layer}`);
    }

    for (const rule of forbiddenEverywhere) {
      if (rule.pattern.test(css)) {
        fail(`${item.name}: ${file.path}: ${rule.message}`);
      }
      rule.pattern.lastIndex = 0;
    }

    for (const rule of forbiddenInBase) {
      if (file.role === "base" && rule.pattern.test(css)) {
        fail(`${item.name}: ${file.path}: ${rule.message}`);
      }
      rule.pattern.lastIndex = 0;
    }

    for (const rule of forbiddenInStyle) {
      if (file.role === "style" && rule.pattern.test(css)) {
        fail(`${item.name}: ${file.path}: ${rule.message}`);
      }
      rule.pattern.lastIndex = 0;
    }

    if (file.layer !== "loseta.tokens") {
      for (const rule of forbiddenOutsideTokens) {
        if (rule.pattern.test(css)) {
          fail(`${item.name}: ${file.path}: ${rule.message}`);
        }
        rule.pattern.lastIndex = 0;
      }
    }

    if (file.role === "base" && file.layer !== "loseta.tokens") {
      for (const rule of forbiddenInBaseColor) {
        if (rule.pattern.test(css)) {
          fail(`${item.name}: ${file.path}: ${rule.message}`);
        }
        rule.pattern.lastIndex = 0;
      }
    }

    const selectors = new Set();
    try {
      transform({
        filename: file.path,
        code: Buffer.from(css),
        minify: false,
        visitor:
          currentStyle === null
            ? undefined
            : {
                Rule(rule) {
                  if (rule.type !== "style") return;
                  for (const selector of rule.value.selectors) {
                    selectors.add(JSON.stringify(selector));
                  }
                }
              }
      });
      if (currentStyle !== null) {
        styleSelectors.set(currentStyle, selectors);
      }
    } catch (error) {
      fail(`${item.name}: ${file.path}: CSS parse error: ${error.message}`);
    }
  }

  if (item.type === "component" || item.type === "primitive") {
    if (!roles.has("base")) {
      fail(`${item.name}: expected a base file`);
    }

    if (item.status === "experimental") {
      // Experimental items are Nova-only until they are promoted to stable.
      if (styleFiles.length !== 1 || styleFiles[0] !== "nova") {
        fail(
          `${item.name}: experimental items ship exactly one nova style file, found ${
            styleFiles.length > 0 ? styleFiles.join(", ") : "none"
          }`
        );
      }
    } else {
      if (styleFiles.length !== styleNames.size) {
        fail(
          `${item.name}: expected ${styleNames.size} style files, found ${styleFiles.length}`
        );
      }
      for (const style of styleNames) {
        const count = styleFiles.filter((name) => name === style).length;
        if (count !== 1) {
          fail(`${item.name}: expected exactly one ${style} style file, found ${count}`);
        }
      }

      // Every stable style mirrors Nova's selectors. Extra selectors are
      // allowed for a style's role recipe; omissions are the failure mode that
      // shows up after an eight-file edit.
      const novaSelectors = styleSelectors.get("nova");
      if (novaSelectors) {
        for (const [style, selectors] of styleSelectors) {
          if (style === "nova") continue;
          const missing = [...novaSelectors].filter(
            (selector) => !selectors.has(selector)
          );
          if (missing.length > 0) {
            fail(
              `${item.name}: ${style} style is missing Nova selectors: ${missing
                .map((selector) => formatSelector(JSON.parse(selector)))
                .sort()
                .join(", ")}`
            );
          }
        }
      }
    }
  }

  if (item.type === "foundation" && styleFiles.length > 0) {
    fail(`${item.name}: foundation items do not have style files`);
  }

  for (const example of item.examples ?? []) {
    const examplePath = join(registryDir, example);
    if (!existsSync(examplePath)) {
      fail(`${item.name}: example not found: ${example}`);
      continue;
    }

    const html = readFileSync(examplePath, "utf8");
    validateExampleMarkup(item.name, example, html);
    validateExampleComposition(item, example, html);
    if (item.name === "popover") {
      validatePopoverContracts(item.name, example, html);
    }
  }
}

const referenced = new Set(
  (registry.items ?? []).flatMap((item) => (item.files ?? []).map((file) => file.path))
);
for (const style of styleNames) {
  const dir = join(stylesRoot, style);
  if (!existsSync(dir)) continue;
  for (const relative of walk(dir)) {
    const path = `styles/${style}/${relative}`;
    if (!referenced.has(path)) {
      fail(`unreferenced style file: ${path}`);
    }
  }
}

const visitState = new Map();
function visit(name, trail) {
  const state = visitState.get(name);
  if (state === "done") return;
  if (state === "visiting") {
    fail(`dependency cycle: ${[...trail, name].join(" -> ")}`);
    return;
  }
  visitState.set(name, "visiting");
  const item = items.get(name);
  for (const dependency of item?.registryDependencies ?? []) {
    visit(dependency, [...trail, name]);
  }
  visitState.set(name, "done");
}
for (const name of items.keys()) {
  visit(name, []);
}

if (errors.length > 0) {
  console.error(`\nloseta registry validation failed (${errors.length}):\n`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `loseta registry OK: ${items.size} items, ${registry.items.filter((item) => item.type === "component").length} components, ${styleNames.size} styles.`
);
