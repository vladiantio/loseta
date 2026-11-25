import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { hashFile } from "../src/fs.js";
import { installItems } from "../src/install.js";
import { registryDir } from "../src/registry.js";
import type { LosetaConfig, Manifest } from "../src/types.js";
import { resolveFixture } from "./helpers.js";

const config: LosetaConfig = { cssDir: "styles/loseta", style: "nova" };

function project(): string {
  return mkdtempSync(join(tmpdir(), "loseta-install-"));
}

function emptyManifest(): Manifest {
  return { items: [] };
}

function readManifest(projectRoot: string): Manifest {
  return JSON.parse(
    readFileSync(join(projectRoot, ".loseta", "manifest.json"), "utf8")
  ) as Manifest;
}

function readIndex(projectRoot: string): string {
  return readFileSync(join(projectRoot, config.cssDir, "index.css"), "utf8");
}

function readIndexFor(projectRoot: string, cssDir: string): string {
  return readFileSync(join(projectRoot, cssDir, "index.css"), "utf8");
}

async function install(
  projectRoot: string,
  names: string[],
  options: {
    style?: string;
    manifest?: Manifest;
    onConflict?: (file: { target: string }) => "keep" | "overwrite";
  } = {}
) {
  const { source, catalog, items } = await resolveFixture(names, {
    style: options.style ?? config.style
  });
  const styleConfig: LosetaConfig = {
    ...config,
    style: options.style ?? config.style
  };
  return installItems({
    projectRoot,
    config: styleConfig,
    registry: catalog,
    registryUrl: source.url,
    build: catalog.build,
    manifest: options.manifest ?? emptyManifest(),
    items,
    onConflict: options.onConflict ?? (() => "keep")
  });
}

test("installs base and style files, manifest and index", async (t) => {
  const projectRoot = project();
  t.after(() => rmSync(projectRoot, { recursive: true, force: true }));

  const result = await install(projectRoot, ["dialog"]);

  assert.deepEqual(result.installed, ["dialog-shell", "dialog"]);
  assert.ok(result.written.includes("components/dialog.css"));
  assert.ok(result.written.includes("styles/nova/dialog.css"));
  assert.ok(result.written.includes("primitives/dialog-shell.css"));
  assert.ok(result.written.includes("styles/nova/primitives/dialog-shell.css"));
  assert.equal(result.skipped.length, 0);

  const manifest = readManifest(projectRoot);
  assert.ok(manifest.registry);
  assert.equal(manifest.registry.build, result.manifest.registry?.build);
  assert.deepEqual(
    manifest.items.map((item) => item.name),
    ["dialog", "dialog-shell"]
  );
  assert.ok(
    manifest.items.every((item) => item.files.every((file) => file.hash.length === 64))
  );
  assert.ok(manifest.behaviors?.includes("behaviors/dialog.js"));
  assert.ok(manifest.behaviorEntries?.includes("behaviors/dialog.js"));
  assert.ok(!manifest.behaviorEntries?.includes("behaviors/core.js"));

  const index = readIndex(projectRoot);
  assert.match(
    index,
    /@layer loseta\.tokens, loseta\.reset, loseta\.base, loseta\.components, loseta\.style, loseta\.utilities;/
  );
  assert.ok(index.indexOf("./components/dialog.css") < index.indexOf("./styles/nova/dialog.css"));
  assert.ok(
    index.indexOf("./primitives/dialog-shell.css") <
      index.indexOf("./components/dialog.css")
  );
});

test("installs the selected style only", async (t) => {
  const projectRoot = project();
  t.after(() => rmSync(projectRoot, { recursive: true, force: true }));

  const result = await install(projectRoot, ["button"], { style: "vega" });

  assert.ok(result.written.includes("components/button.css"));
  assert.ok(result.written.includes("styles/vega/button.css"));
  assert.ok(!result.written.includes("styles/nova/button.css"));

  const index = readIndexFor(projectRoot, config.cssDir);
  assert.match(index, /\.\/styles\/vega\/button\.css/);
  assert.doesNotMatch(index, /\.\/styles\/nova\/button\.css/);

  const manifest = readManifest(projectRoot);
  const button = manifest.items.find((item) => item.name === "button");
  assert.deepEqual(
    button?.files.map((file) => file.path).sort(),
    ["components/button.css", "styles/vega/button.css"]
  );
});

test("reinstalling identical files skips without consulting onConflict", async (t) => {
  const projectRoot = project();
  t.after(() => rmSync(projectRoot, { recursive: true, force: true }));

  const first = await install(projectRoot, ["button"]);

  const second = await install(projectRoot, ["button"], {
    manifest: first.manifest,
    onConflict: () => {
      throw new Error("onConflict must not run for identical files");
    }
  });

  assert.equal(second.written.length, 0);
  assert.equal(second.skipped.length, first.written.length);
  assert.deepEqual(second.manifest, first.manifest);
});

test("keeping a modified file records the target hash", async (t) => {
  const projectRoot = project();
  t.after(() => rmSync(projectRoot, { recursive: true, force: true }));

  const first = await install(projectRoot, ["button"]);

  const target = join(projectRoot, config.cssDir, "components", "button.css");
  writeFileSync(target, `${readFileSync(target, "utf8")}\n/* local edit */\n`);

  const conflicts: string[] = [];
  await install(projectRoot, ["button"], {
    manifest: first.manifest,
    onConflict: (file) => {
      conflicts.push(file.target);
      return "keep";
    }
  });

  assert.deepEqual(conflicts, ["components/button.css"]);
  assert.match(readFileSync(target, "utf8"), /local edit/);

  const manifest = readManifest(projectRoot);
  const entry = manifest.items.find((item) => item.name === "button");
  const base = entry?.files.find((file) => file.path === "components/button.css");
  assert.equal(base?.hash, hashFile(target));
});

test("overwriting a modified file restores the registry source", async (t) => {
  const projectRoot = project();
  t.after(() => rmSync(projectRoot, { recursive: true, force: true }));

  const first = await install(projectRoot, ["button"]);

  const target = join(projectRoot, config.cssDir, "components", "button.css");
  const source = join(registryDir, "components", "button.css");
  writeFileSync(target, `${readFileSync(target, "utf8")}\n/* local edit */\n`);

  const result = await install(projectRoot, ["button"], {
    manifest: first.manifest,
    onConflict: () => "overwrite"
  });

  assert.ok(result.written.includes("components/button.css"));
  assert.equal(readFileSync(target, "utf8"), readFileSync(source, "utf8"));

  const manifest = readManifest(projectRoot);
  const entry = manifest.items.find((item) => item.name === "button");
  const base = entry?.files.find((file) => file.path === "components/button.css");
  assert.equal(base?.hash, hashFile(source));
});

test("records the registry build and migrates an old manifest", async (t) => {
  const projectRoot = project();
  t.after(() => rmSync(projectRoot, { recursive: true, force: true }));

  const legacy = {
    version: "0.19.0",
    items: [{ name: "button", version: "0.19.0", files: [] }]
  } as unknown as Manifest;

  const result = await install(projectRoot, ["button"], { manifest: legacy });
  const manifest = readManifest(projectRoot) as Manifest & { version?: string };

  assert.equal(manifest.version, undefined);
  assert.equal(manifest.registry?.build, result.manifest.registry?.build);
  assert.ok(manifest.registry?.url);
  assert.deepEqual(
    manifest.items.map((item) => item.name),
    ["button"]
  );
});
