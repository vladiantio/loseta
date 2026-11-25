#!/usr/bin/env node
/**
 * Installs the generated remote registry with the built CLI over HTTP.
 * Run after `pnpm registry:remote`; no external network is used.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const registryRoot = join(repoRoot, "web", "public", "r");
const cli = join(repoRoot, "packages", "loseta", "bin", "loseta.js");

function contentType(path) {
  return path.endsWith(".json") ? "application/json" : "text/plain";
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const relative = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  if (!relative.startsWith("r/")) {
    response.writeHead(404);
    response.end("not found");
    return;
  }
  const file = join(registryRoot, relative.slice(2));
  try {
    const body = readFileSync(file);
    response.writeHead(200, { "content-type": contentType(file) });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
if (!address || typeof address === "string") {
  throw new Error("Could not start the static registry server");
}
const registryUrl = `http://127.0.0.1:${address.port}/r`;

function run(cwd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd,
      env: { ...process.env, LOSETA_REGISTRY: registryUrl }
    });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      output += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (status) => resolve({ status, output }));
  });
}

const project = mkdtempSync(join(tmpdir(), "loseta-remote-smoke-"));
try {
  for (const args of [
    ["init", "--yes"],
    ["add", "button", "dialog", "--yes"],
    ["style", "vega"]
  ]) {
    const { status, output } = await run(project, args);
    if (status !== 0) {
      console.error(`loseta ${args.join(" ")} failed:\n${output}`);
      process.exit(1);
    }
  }

  const config = JSON.parse(readFileSync(join(project, "loseta.json"), "utf8"));
  if (config.style !== "vega" || config.registry !== registryUrl) {
    console.error("loseta.json does not record the remote registry and style");
    process.exit(1);
  }
  const index = readFileSync(join(project, config.cssDir, "index.css"), "utf8");
  if (!index.includes("styles/vega/button.css")) {
    console.error("index.css does not import the switched style");
    process.exit(1);
  }
  const manifest = JSON.parse(
    readFileSync(join(project, ".loseta", "manifest.json"), "utf8")
  );
  if (!manifest.registry?.build || !manifest.registry?.url) {
    console.error("manifest does not record the registry build and URL");
    process.exit(1);
  }

  console.log("Remote registry install smoke: OK");
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  rmSync(project, { recursive: true, force: true });
}
