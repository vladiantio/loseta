import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// @jetio/validator publishes its ESM entry with a `.js` extension in a
// CommonJS package, so Node 22.0.0 needs the CJS entry.
const require = createRequire(import.meta.url);

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const repoRoot = resolve(packageRoot, "../..");
const registryDir = join(packageRoot, "registry");
const outputRoot = join(repoRoot, "web", "public", "r");
const schemaOutputRoot = join(repoRoot, "web", "public", "schema", "v1");

const registry = JSON.parse(
  readFileSync(join(registryDir, "registry.json"), "utf8")
);
const schemaVersion = registry.schemaVersion ?? 1;
const minCliVersion = registry.minCliVersion ?? "0.20.0";
const build = resolveBuild();

function resolveBuild() {
  try {
    const sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: repoRoot,
      encoding: "utf8"
    }).trim();
    const dirty = execFileSync("git", ["status", "--porcelain"], {
      cwd: repoRoot,
      encoding: "utf8"
    }).trim();
    return dirty ? `${sha}-dirty` : sha;
  } catch {
    return "dev";
  }
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === "object") {
    const result = {};
    for (const key of Object.keys(value).sort()) {
      result[key] = canonicalize(value[key]);
    }
    return result;
  }
  return value;
}

function serialize(value) {
  return `${JSON.stringify(canonicalize(value), null, 2)}\n`;
}

function hash(value) {
  return createHash("sha256").update(serialize(value)).digest("hex");
}

function parseExampleFile(content) {
  const pattern = /<!--\s*(.+?)\s*-->/g;
  const matches = [...content.matchAll(pattern)];
  if (matches.length === 0) {
    const html = content.trim();
    return html ? [{ title: "Example", html }] : [];
  }

  const examples = [];
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    if (!match || match.index === undefined) continue;
    const next = matches[index + 1];
    const start = match.index + match[0].length;
    const end = next?.index ?? content.length;
    const html = content.slice(start, end).trim();
    if (!html) continue;
    examples.push({ title: match[1] ?? "Example", html });
  }
  return examples;
}

function buildPayload(item, style) {
  const stylePrefix = `styles/${style}/`;
  const files = item.files
    .filter(
      (file) =>
        file.role === "base" ||
        (file.role === "style" && file.path.startsWith(stylePrefix))
    )
    .map((file) => ({
      ...file,
      content: readFileSync(join(registryDir, file.path), "utf8")
    }));

  const behaviors = (item.behaviors ?? []).map((behavior) => ({
    ...behavior,
    content: readFileSync(join(registryDir, behavior.path), "utf8")
  }));

  const examples = (item.examples ?? []).flatMap((example) =>
    parseExampleFile(readFileSync(join(registryDir, example), "utf8"))
  );

  return {
    $schema: "https://loseta.vladiantio.com/schema/v1/registry-item.json",
    name: item.name,
    type: item.type,
    status: item.status,
    title: item.title,
    description: item.description,
    ...(item.docs ? { docs: item.docs } : {}),
    root: item.root,
    ...(item.registryDependencies
      ? { registryDependencies: item.registryDependencies }
      : {}),
    ...(item.optionalDependencies
      ? { optionalDependencies: item.optionalDependencies }
      : {}),
    ...(item.type === "component" || item.type === "primitive"
      ? { style }
      : {}),
    files,
    ...(behaviors.length > 0 ? { behaviors } : {}),
    ...(examples.length > 0 ? { examples } : {}),
    schemaVersion,
    minCliVersion,
    build
  };
}

function catalogItem(item, extra) {
  return {
    name: item.name,
    type: item.type,
    status: item.status,
    title: item.title,
    description: item.description,
    ...(item.docs ? { docs: item.docs } : {}),
    root: item.root,
    ...(item.registryDependencies
      ? { registryDependencies: item.registryDependencies }
      : {}),
    ...(item.optionalDependencies
      ? { optionalDependencies: item.optionalDependencies }
      : {}),
    files: item.files.map(({ path, target, role, layer }) => ({
      path,
      target,
      role,
      layer
    })),
    ...(item.behaviors?.length
      ? {
          behaviors: item.behaviors.map(({ path, target, kind }) => ({
            path,
            target,
            kind
          }))
        }
      : {}),
    ...(item.examples ? { examples: item.examples } : {}),
    ...extra
  };
}

let validateItemPayload;
let validateCatalog;
try {
  ({ validateItemPayload, validateCatalog } = await import(
    pathToFileURL(join(packageRoot, "dist", "validate-content.js")).href
  ));
} catch {
  // Netlify builds the docs without the CLI's devDependencies, so dist may be
  // absent. Validate the wire shape here; the source validator and the remote
  // install smoke cover the semantic checks.
  const { JetValidator } = require("@jetio/validator");
  const validator = new JetValidator({ allErrors: true, strict: false });
  const itemValidator = validator.compile(
    JSON.parse(
      readFileSync(join(registryDir, "schema-item.json"), "utf8")
    )
  );
  const catalogValidator = validator.compile(
    JSON.parse(
      readFileSync(join(registryDir, "schema-catalog.json"), "utf8")
    )
  );
  const format = (errors) =>
    (errors ?? []).map(
      (error) => `${error.dataPath || "/"} ${error.message}`
    );
  validateItemPayload = (payload) => {
    if (!itemValidator(payload)) {
      throw new Error(`Invalid item payload:\n${format(itemValidator.errors).join("\n")}`);
    }
    return payload;
  };
  validateCatalog = (catalog) => {
    if (!catalogValidator(catalog)) {
      throw new Error(`Invalid catalog:\n${format(catalogValidator.errors).join("\n")}`);
    }
    return catalog;
  };
}

rmSync(outputRoot, { recursive: true, force: true });
rmSync(schemaOutputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });
mkdirSync(schemaOutputRoot, { recursive: true });

const catalogItems = [];
const payloads = [];

for (const item of registry.items) {
  if (item.type === "foundation") {
    const payload = buildPayload(item, "nova");
    validateItemPayload(payload, {
      style: "nova",
      schemaVersion,
      cliVersion: minCliVersion
    });
    payloads.push({ path: join("foundation", `${item.name}.json`), payload });
    catalogItems.push(catalogItem(item, { hash: hash(payload) }));
    continue;
  }

  const hashes = {};
  for (const style of registry.styles) {
    if (item.status === "experimental" && style.name !== "nova") continue;
    const payload = buildPayload(item, style.name);
    validateItemPayload(payload, {
      style: style.name,
      schemaVersion,
      cliVersion: minCliVersion
    });
    payloads.push({
      path: join("styles", style.name, `${item.name}.json`),
      payload
    });
    hashes[style.name] = hash(payload);
  }
  catalogItems.push(catalogItem(item, { hashes }));
}

const catalog = {
  $schema: "https://loseta.vladiantio.com/schema/v1/registry.json",
  name: registry.name,
  ...(registry.homepage ? { homepage: registry.homepage } : {}),
  schemaVersion,
  minCliVersion,
  build,
  styles: registry.styles,
  items: catalogItems
};
validateCatalog(catalog);

for (const { path, payload } of payloads) {
  const target = join(outputRoot, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, serialize(payload));
}

writeFileSync(join(outputRoot, "registry.json"), serialize(catalog));

for (const name of ["schema-item.json", "schema-catalog.json"]) {
  const outputName = name === "schema-item.json" ? "registry-item.json" : "registry.json";
  writeFileSync(
    join(schemaOutputRoot, outputName),
    readFileSync(join(registryDir, name), "utf8")
  );
}

console.log(
  `Remote registry: ${catalogItems.length} items, ${payloads.length} payloads, build ${build}.`
);
