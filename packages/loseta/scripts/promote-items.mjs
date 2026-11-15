#!/usr/bin/env node
/**
 * Scaffolds the seven non-Nova style files for an experimental item and flips
 * it to stable. The scaffold marker must be removed after the style has been
 * differentiated; the registry validator rejects stable style files that still
 * contain it.
 *
 * Usage:
 *   node scripts/promote-items.mjs <name...> [--dry-run]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "..");
const registryPath = join(packageRoot, "registry", "registry.json");
const registryDir = join(packageRoot, "registry");
const marker = "/* loseta:promotion-scaffold */";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const names = args.filter((arg) => arg !== "--dry-run");

if (names.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: node scripts/promote-items.mjs <component-or-primitive...> [--dry-run]

Scaffolds the non-Nova style files for experimental items, flips them to stable
and prints the remaining review steps. The scaffold marker must be removed from
every generated file before the registry validator passes.`);
  process.exit(names.length === 0 ? 1 : 0);
}

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const styleNames = registry.styles.map((style) => style.name);
if (!styleNames.includes("nova")) {
  console.error("promote-items: the registry does not declare the nova style");
  process.exit(1);
}

const items = new Map(registry.items.map((item) => [item.name, item]));
const seen = new Set();
const plans = [];

for (const name of names) {
  if (seen.has(name)) {
    console.error(`promote-items: duplicate name: ${name}`);
    process.exit(1);
  }
  seen.add(name);

  const item = items.get(name);
  if (!item) {
    console.error(`promote-items: unknown item: ${name}`);
    process.exit(1);
  }
  if (item.type !== "component" && item.type !== "primitive") {
    console.error(`promote-items: ${name} is a ${item.type}, not a component or primitive`);
    process.exit(1);
  }
  if (item.status !== "experimental") {
    console.error(`promote-items: ${name} is already ${item.status}`);
    process.exit(1);
  }

  const baseFiles = item.files.filter((file) => file.role === "base");
  const styleFiles = item.files.filter((file) => file.role === "style");
  if (baseFiles.length !== 1) {
    console.error(`promote-items: ${name} must have exactly one base file`);
    process.exit(1);
  }
  if (styleFiles.length !== 1 || !styleFiles[0].path.startsWith("styles/nova/")) {
    console.error(`promote-items: ${name} must have exactly one Nova style file`);
    process.exit(1);
  }

  const novaFile = styleFiles[0];
  const relative = novaFile.path.slice("styles/nova/".length);
  const novaPath = join(registryDir, novaFile.path);
  if (!existsSync(novaPath)) {
    console.error(`promote-items: missing Nova style file: ${novaFile.path}`);
    process.exit(1);
  }

  const generated = [];
  for (const style of styleNames) {
    if (style === "nova") continue;
    const path = `styles/${style}/${relative}`;
    const absolute = join(registryDir, path);
    if (existsSync(absolute)) {
      console.error(`promote-items: refusing to overwrite existing style file: ${path}`);
      process.exit(1);
    }
    generated.push({
      path,
      target: path,
      role: "style",
      layer: "loseta.style",
      absolute
    });
  }

  plans.push({ item, baseFiles, novaFile, generated });
}

for (const plan of plans) {
  const source = readFileSync(join(registryDir, plan.novaFile.path), "utf8");
  const scaffold = `${marker}\n${source}`;

  for (const file of plan.generated) {
    if (dryRun) {
      console.log(`would create ${file.path}`);
      continue;
    }
    mkdirSync(dirname(file.absolute), { recursive: true });
    writeFileSync(file.absolute, scaffold);
    console.log(`created ${file.path}`);
  }

  plan.item.status = "stable";
  plan.item.files = [
    ...plan.baseFiles,
    plan.novaFile,
    ...plan.generated.map(({ absolute, ...file }) => file)
  ];
}

if (dryRun) {
  console.log(`\nDry run: ${plans.length} item(s) would be promoted.`);
  process.exit(0);
}

writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`\nPromoted ${plans.length} item(s) to stable.`);
console.log("Next steps:");
console.log("  1. Differentiate every generated style file and remove the scaffold marker.");
console.log("  2. Run `pnpm registry:check`; it must fail while a marker remains.");
console.log("  3. Review all eight styles, then run the batch gate.");
