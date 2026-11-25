import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { readConfig } from "../src/config.js";
import { installItems } from "../src/install.js";
import { loadRegistry } from "../src/registry.js";
import { resolveRegistryItems } from "../src/resolve.js";
import { resolveAddStyle } from "../src/style-selection.js";
import { applyStyleSwitch, resolveStyleSwitch } from "../src/style-switch.js";
import type { LosetaConfig, Manifest } from "../src/types.js";
import { fixtureManifest, fixtureRegistry } from "./fixtures.js";
import { resolveFixture } from "./helpers.js";
import { startTestRegistry } from "./registry-server.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tsxBin = join(
  packageRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsx.cmd" : "tsx"
);
const cliPath = join(packageRoot, "src", "cli.ts");
const config: LosetaConfig = { cssDir: "styles/loseta", style: "nova" };

function project(): string {
  return mkdtempSync(join(tmpdir(), "loseta-style-"));
}

function emptyManifest(): Manifest {
  return { items: [] };
}

function runCli(
  cwd: string,
  args: string[],
  registryUrl: string
): Promise<{ status: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(tsxBin, [cliPath, ...args], {
      cwd,
      shell: process.platform === "win32",
      env: { ...process.env, LOSETA_REGISTRY: registryUrl }
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`CLI timed out: loseta ${args.join(" ")}`));
    }, 30_000);
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (status) => {
      clearTimeout(timer);
      resolve({ status, stdout, stderr });
    });
  });
}

async function installButton(projectRoot: string) {
  const { source, catalog, items } = await resolveFixture(["button"]);
  const result = await installItems({
    projectRoot,
    config,
    registry: catalog,
    registryUrl: source.url,
    build: catalog.build,
    manifest: emptyManifest(),
    items,
    onConflict: () => "keep"
  });
  return { source, catalog, manifest: result.manifest };
}

async function applyPlan(
  projectRoot: string,
  source: Awaited<ReturnType<typeof resolveFixture>>["source"],
  catalog: Awaited<ReturnType<typeof resolveFixture>>["catalog"],
  manifest: Manifest,
  plan: Extract<ReturnType<typeof resolveStyleSwitch>, { status: "switch" }>["plan"]
) {
  const items = await resolveRegistryItems(
    plan.items.map((item) => item.name),
    {
      source,
      catalog,
      style: plan.nextConfig.style,
      experimental: plan.nextConfig.style === "nova",
      includeDependencies: false
    }
  );
  return applyStyleSwitch({
    projectRoot,
    registry: catalog,
    registryUrl: source.url,
    build: catalog.build,
    manifest,
    plan,
    items
  });
}

test("add style accepts the project style and rejects a mismatch", () => {
  const registry = loadRegistry();

  assert.deepEqual(resolveAddStyle(registry, config, undefined), { style: "nova" });
  assert.deepEqual(resolveAddStyle(registry, config, "nova"), { style: "nova" });

  const mismatch = resolveAddStyle(registry, config, "vega");
  assert.ok("error" in mismatch);
  assert.match(mismatch.error, /loseta style vega/);

  const unknown = resolveAddStyle(registry, config, "other");
  assert.ok("error" in unknown);
  assert.match(unknown.error, /Unknown style: other/);
});

test("style switch resolution validates the target and installed items", () => {
  const registry = loadRegistry();
  const manifest: Manifest = {
    items: ["tokens", "button", "dialog", "dialog-shell"].map((name) => ({
      name,
      files: []
    }))
  };

  const missing = resolveStyleSwitch(registry, manifest, config, "");
  assert.equal(missing.status, "error");
  if (missing.status === "error") assert.match(missing.message, /Usage: loseta style/);

  const unknown = resolveStyleSwitch(registry, manifest, config, "other");
  assert.equal(unknown.status, "error");
  if (unknown.status === "error") assert.match(unknown.message, /Unknown style: other/);

  const noop = resolveStyleSwitch(registry, manifest, config, "nova");
  assert.equal(noop.status, "noop");

  const empty = resolveStyleSwitch(registry, emptyManifest(), config, "vega");
  assert.equal(empty.status, "error");
  if (empty.status === "error") assert.match(empty.message, /No components are installed/);

  const resolved = resolveStyleSwitch(registry, manifest, config, "vega");
  assert.equal(resolved.status, "switch");
  if (resolved.status !== "switch") return;

  assert.equal(resolved.plan.previous, "nova");
  assert.equal(resolved.plan.nextConfig.style, "vega");
  assert.deepEqual(
    resolved.plan.items.map((item) => item.name).sort(),
    ["button", "dialog", "dialog-shell"]
  );
});

test("style switch refuses to abandon experimental components", () => {
  const manifest = fixtureManifest(fixtureRegistry, ["alpha", "beta"]);

  const resolution = resolveStyleSwitch(
    fixtureRegistry,
    manifest,
    config,
    "vega"
  );
  assert.equal(resolution.status, "error");
  if (resolution.status === "error") {
    assert.match(resolution.message, /beta/);
    assert.match(resolution.message, /Nova-only/);
  }
});

test("style switch refuses URL-installed items", () => {
  const manifest: Manifest = {
    items: [
      { name: "button", files: [], source: "https://example.com/r/button.json" }
    ]
  };

  const resolution = resolveStyleSwitch(loadRegistry(), manifest, config, "vega");
  assert.equal(resolution.status, "error");
  if (resolution.status === "error") {
    assert.match(resolution.message, /URL-installed/);
    assert.match(resolution.message, /button/);
  }
});

test("style switch writes the selected style and keeps the old files", async (t) => {
  const projectRoot = project();
  t.after(() => rmSync(projectRoot, { recursive: true, force: true }));

  const { source, catalog, manifest } = await installButton(projectRoot);
  const resolved = resolveStyleSwitch(catalog, manifest, config, "vega");
  assert.equal(resolved.status, "switch");
  if (resolved.status !== "switch") return;

  const { result, kept } = await applyPlan(
    projectRoot,
    source,
    catalog,
    manifest,
    resolved.plan
  );

  assert.deepEqual(kept, []);
  assert.ok(result.written.includes("styles/vega/button.css"));
  assert.ok(!result.written.includes("styles/nova/button.css"));
  assert.equal(readConfig(projectRoot)?.style, "vega");

  const index = readFileSync(join(projectRoot, config.cssDir, "index.css"), "utf8");
  assert.match(index, /styles\/vega\/button\.css/);
  assert.doesNotMatch(index, /styles\/nova\/button\.css/);
  assert.ok(existsSync(join(projectRoot, config.cssDir, "styles", "vega", "button.css")));
  assert.ok(existsSync(join(projectRoot, config.cssDir, "styles", "nova", "button.css")));
});

test("style switch keeps modified base files and overwrites style files", async (t) => {
  const projectRoot = project();
  t.after(() => rmSync(projectRoot, { recursive: true, force: true }));

  const { source, catalog, manifest } = await installButton(projectRoot);
  const basePath = join(projectRoot, config.cssDir, "components", "button.css");
  const novaStylePath = join(projectRoot, config.cssDir, "styles", "nova", "button.css");
  appendFileSync(basePath, "\n/* local base */\n");
  appendFileSync(novaStylePath, "\n/* local style */\n");

  const toVega = resolveStyleSwitch(catalog, manifest, config, "vega");
  assert.equal(toVega.status, "switch");
  if (toVega.status !== "switch") return;

  const first = await applyPlan(projectRoot, source, catalog, manifest, toVega.plan);
  assert.deepEqual(first.kept, ["components/button.css"]);
  assert.match(readFileSync(basePath, "utf8"), /local base/);

  const vegaConfig = readConfig(projectRoot);
  assert.ok(vegaConfig);
  const backToNova = resolveStyleSwitch(catalog, first.result.manifest, vegaConfig, "nova");
  assert.equal(backToNova.status, "switch");
  if (backToNova.status !== "switch") return;

  const second = await applyPlan(
    projectRoot,
    source,
    catalog,
    first.result.manifest,
    backToNova.plan
  );
  assert.deepEqual(second.kept, ["components/button.css"]);
  assert.ok(second.result.written.includes("styles/nova/button.css"));
  assert.match(readFileSync(basePath, "utf8"), /local base/);
  assert.doesNotMatch(readFileSync(novaStylePath, "utf8"), /local style/);
});

test("CLI: add --style guard and style switch", async (t) => {
  const projectRoot = project();
  const registry = await startTestRegistry();
  t.after(async () => {
    await registry.close();
    rmSync(projectRoot, { recursive: true, force: true });
  });

  const init = await runCli(projectRoot, ["init", "--yes"], registry.url);
  assert.equal(init.status, 0, init.stderr);

  const add = await runCli(projectRoot, ["add", "button", "--yes"], registry.url);
  assert.equal(add.status, 0, add.stderr);

  const guard = await runCli(projectRoot, ["add", "card", "--style", "vega"], registry.url);
  assert.equal(guard.status, 1);
  assert.match(`${guard.stdout}${guard.stderr}`, /loseta style vega/);

  const switched = await runCli(projectRoot, ["style", "vega"], registry.url);
  assert.equal(switched.status, 0, switched.stderr);

  const projectConfig = readConfig(projectRoot);
  assert.ok(projectConfig);
  assert.equal(projectConfig.style, "vega");

  const index = readFileSync(join(projectRoot, projectConfig.cssDir, "index.css"), "utf8");
  assert.match(index, /styles\/vega\/button\.css/);
});
