import { readFileSync, readdirSync } from "node:fs";
import { builtinModules } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf8")
);
const report = process.argv.includes("--report");
const minimumNode = "22.0.0";
const runtimePolicy = {
  "@jetio/validator": "Validates registry catalogs and item payloads against JSON Schemas.",
  "@topcli/prompts": "Interactive terminal prompts.",
  acorn: "Parses behavior modules as ESM before payload validation."
};
const developmentPurposes = {
  "@types/node": "Node.js type declarations.",
  lightningcss: "CSS parsing in registry validation.",
  tsx: "Runs TypeScript source and tests.",
  typescript: "Compiles the CLI and parses TypeScript in registry validation."
};
const errors = [];
const runtimeDependencies = packageJson.dependencies ?? {};
const developmentDependencies = packageJson.devDependencies ?? {};

function fail(message) {
  errors.push(message);
}

function sortedKeys(value) {
  return Object.keys(value).sort();
}

function hasEntries(value) {
  if (value === true) return true;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value) && Object.keys(value).length > 0;
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.isFile() && entry.name.endsWith(".ts") ? [path] : [];
  });
}

function packageName(specifier) {
  if (
    specifier.startsWith(".") ||
    specifier.startsWith("/") ||
    specifier.startsWith("node:") ||
    specifier.startsWith("file:")
  ) {
    return undefined;
  }
  const parts = specifier.split("/");
  if (builtinModules.includes(parts[0] ?? "")) return undefined;
  return specifier.startsWith("@")
    ? parts.slice(0, 2).join("/")
    : parts[0];
}

const imports = new Map();
for (const file of sourceFiles(join(packageRoot, "src"))) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  function visit(node) {
    let specifier;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifier = node.moduleSpecifier.text;
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      specifier = node.arguments[0].text;
    }
    if (specifier) {
      const name = packageName(specifier);
      if (name) {
        const files = imports.get(name) ?? new Set();
        files.add(relative(packageRoot, file));
        imports.set(name, files);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

const expectedRuntime = sortedKeys(runtimePolicy).sort();
const actualRuntime = sortedKeys(runtimeDependencies).sort();
if (JSON.stringify(actualRuntime) !== JSON.stringify(expectedRuntime)) {
  fail(
    `runtime dependencies must be ${expectedRuntime.join(", ")}; found ${actualRuntime.join(", ")}`
  );
}
if (packageJson.engines?.node !== `>=${minimumNode}`) {
  fail(`engines.node must be >=${minimumNode}; found ${packageJson.engines?.node}`);
}

for (const name of expectedRuntime) {
  const files = imports.get(name);
  if (!files || files.size === 0) {
    fail(`${name} is declared but not imported by src/`);
  }
}
for (const name of imports.keys()) {
  if (!(name in runtimeDependencies)) {
    fail(`${name} is imported by src/ but missing from dependencies`);
  }
}

const runtimeManifests = new Map();
for (const name of expectedRuntime) {
  let manifest;
  try {
    manifest = JSON.parse(
      readFileSync(join(packageRoot, "node_modules", name, "package.json"), "utf8")
    );
  } catch (error) {
    fail(`could not read the installed ${name} manifest: ${error.message}`);
    continue;
  }
  runtimeManifests.set(name, manifest);
  for (const field of [
    "dependencies",
    "optionalDependencies",
    "peerDependencies",
    "bundledDependencies",
    "bundleDependencies"
  ]) {
    if (hasEntries(manifest[field])) {
      fail(`${name} must have zero ${field}`);
    }
  }
}

const topCli = runtimeManifests.get("@topcli/prompts");
if (topCli) {
  if (!topCli.version?.startsWith("4.")) {
    fail(`@topcli/prompts must stay on 4.x for Node 22; found ${topCli.version}`);
  }
  if (!topCli.engines?.node?.includes(minimumNode)) {
    fail(
      `@topcli/prompts no longer supports Node ${minimumNode}: ${topCli.engines?.node}`
    );
  }
}

if (errors.length > 0) {
  console.error("Dependency policy failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (report) {
  console.log(`Node engine: ${packageJson.engines.node}`);
  console.log(`\nRuntime dependencies (${actualRuntime.length}):`);
  for (const name of actualRuntime) {
    console.log(`- ${name}@${runtimeDependencies[name]} — ${runtimePolicy[name]}`);
    const files = [...(imports.get(name) ?? [])].sort();
    console.log(`  ${files.join(", ")}`);
  }
  console.log(`\nDevelopment dependencies (${sortedKeys(developmentDependencies).length}):`);
  for (const name of sortedKeys(developmentDependencies)) {
    console.log(
      `- ${name}@${developmentDependencies[name]} — ${developmentPurposes[name] ?? "Development tooling."}`
    );
  }
} else {
  console.log(
    `Dependency policy: OK (${actualRuntime.length} runtime dependencies, Node >=${minimumNode})`
  );
}
