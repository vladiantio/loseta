import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { Server } from "node:http";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { LocalRegistrySource } from "../src/local-registry.js";
import { serializePayload } from "../src/payload.js";
import { registryDir } from "../src/registry.js";
import { RemoteRegistrySource } from "../src/remote-registry.js";
import { RegistryNameConflictError, resolveRegistryItems } from "../src/resolve.js";
import { RegistryValidationError } from "../src/validate-content.js";
import { startTestRegistry } from "./registry-server.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tsxBin = join(
  packageRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsx.cmd" : "tsx"
);
const cliPath = join(packageRoot, "src", "cli.ts");

interface JsonServer {
  url: string;
  close(): Promise<void>;
}

async function serveJson(
  handler: (pathname: string) => unknown | undefined
): Promise<JsonServer> {
  const server: Server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    const body = handler(url.pathname);
    if (body === undefined) {
      response.writeHead(404, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "not found" }));
      return;
    }
    response.writeHead(200, { "content-type": "application/json" });
    response.end(serializePayload(body));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not start the test server");
  }
  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.closeAllConnections();
        server.close((error) => (error ? reject(error) : resolve()));
      })
  };
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

test("remote source loads a catalog and verifies item hashes", async (t) => {
  const server = await startTestRegistry();
  t.after(() => server.close());

  const source = new RemoteRegistrySource({ url: server.url, noCache: true });
  const catalog = await source.catalog();
  assert.equal(catalog.name, "loseta");
  assert.equal(catalog.build, "local");

  const { item } = await source.item("button", "nova");
  assert.equal(item.style, "nova");
  assert.ok(item.files.every((file) => Boolean(file.content)));
  assert.ok(!item.files.some((file) => file.path.startsWith("styles/vega/")));
});

test("remote source falls back to the cache when the registry is offline", async (t) => {
  const previous = process.env.XDG_CACHE_HOME;
  const cache = mkdtempSync(join(tmpdir(), "loseta-cache-"));
  process.env.XDG_CACHE_HOME = cache;
  t.after(() => {
    process.env.XDG_CACHE_HOME = previous;
    rmSync(cache, { recursive: true, force: true });
  });

  const server = await startTestRegistry();
  const online = new RemoteRegistrySource({ url: server.url });
  await online.catalog();
  await online.item("button", "nova");
  await server.close();

  const warnings: string[] = [];
  const offline = new RemoteRegistrySource({
    url: server.url,
    onWarning: (message) => warnings.push(message)
  });
  const catalog = await offline.catalog();
  assert.equal(catalog.name, "loseta");
  assert.match(warnings.join("\n"), /cached copy/);

  const { item } = await offline.item("button", "nova");
  assert.equal(item.name, "button");
});

test("an incompatible minCliVersion is a hard error", async (t) => {
  const local = new LocalRegistrySource(registryDir);
  const catalog = await local.catalog();
  const server = await serveJson((pathname) => {
    if (pathname !== "/registry.json") return undefined;
    return { ...catalog, minCliVersion: "99.0.0" };
  });
  t.after(() => server.close());

  const source = new RemoteRegistrySource({ url: server.url, noCache: true });
  await assert.rejects(
    () => source.catalog(),
    (error: unknown) =>
      error instanceof RegistryValidationError && /requires loseta 99/.test(error.message)
  );
});

test("a hash mismatch is refused", async (t) => {
  const local = new LocalRegistrySource(registryDir);
  const catalog = await local.catalog();
  const button = await local.item("button", "nova");
  const broken = {
    ...catalog,
    items: catalog.items.map((item) =>
      item.name === "button"
        ? { ...item, hashes: { ...item.hashes, nova: "0".repeat(64) } }
        : item
    )
  };

  const server = await serveJson((pathname) => {
    if (pathname === "/registry.json") return broken;
    if (pathname === "/styles/nova/button.json") return button.item;
    return undefined;
  });
  t.after(() => server.close());

  const source = new RemoteRegistrySource({ url: server.url, noCache: true });
  await assert.rejects(
    () => source.item("button", "nova"),
    (error: unknown) =>
      error instanceof RegistryValidationError && /Hash mismatch/.test(error.message)
  );
});

test("URL payloads are style-bound and reject unsafe targets", async (t) => {
  const server = await startTestRegistry();
  t.after(() => server.close());

  const source = new RemoteRegistrySource({ url: server.url, noCache: true });
  const resolved = await source.itemFromUrl(
    `${server.url}/external/button.json`,
    "nova"
  );
  assert.equal(resolved.source, `${server.url}/external/button.json`);

  await assert.rejects(
    () => source.itemFromUrl(`${server.url}/external/button.json`, "vega"),
    (error: unknown) =>
      error instanceof RegistryValidationError && /does not match the project style/.test(error.message)
  );

  const local = new LocalRegistrySource(registryDir);
  const button = await local.item("button", "nova");
  const unsafe = {
    ...button.item,
    files: button.item.files.map((file, index) =>
      index === 0 ? { ...file, target: "../escape.css" } : file
    )
  };
  const unsafeServer = await serveJson((pathname) =>
    pathname === "/unsafe.json" ? unsafe : undefined
  );
  t.after(() => unsafeServer.close());

  const unsafeSource = new RemoteRegistrySource({
    url: unsafeServer.url,
    noCache: true
  });
  await assert.rejects(
    () => unsafeSource.itemFromUrl(`${unsafeServer.url}/unsafe.json`, "nova"),
    (error: unknown) =>
      error instanceof RegistryValidationError && /unsafe path/.test(error.message)
  );
});

test("resolver follows URL dependencies through the official registry", async (t) => {
  const server = await startTestRegistry();
  t.after(() => server.close());

  const source = new RemoteRegistrySource({ url: server.url, noCache: true });
  const catalog = await source.catalog();

  const resolved = await resolveRegistryItems(
    [`${server.url}/external/dialog.json`],
    { source, catalog, style: "nova", experimental: false }
  );

  assert.deepEqual(
    resolved.map(({ item }) => item.name),
    ["dialog-shell", "dialog"]
  );
  assert.equal(resolved[0]?.source, undefined);
  assert.equal(resolved[1]?.source, `${server.url}/external/dialog.json`);
});

test("resolver refuses a URL item that shadows an official item", async (t) => {
  const server = await startTestRegistry();
  t.after(() => server.close());

  const source = new RemoteRegistrySource({ url: server.url, noCache: true });
  const catalog = await source.catalog();

  await assert.rejects(
    () =>
      resolveRegistryItems(["dialog", `${server.url}/external/dialog.json`], {
        source,
        catalog,
        style: "nova",
        experimental: false
      }),
    RegistryNameConflictError
  );
});

test("CLI: URL install records its source and blocks style switching", async (t) => {
  const server = await startTestRegistry();
  const project = mkdtempSync(join(tmpdir(), "loseta-url-"));
  t.after(async () => {
    await server.close();
    rmSync(project, { recursive: true, force: true });
  });

  const init = await runCli(
    project,
    ["init", "--yes", "--registry", server.url],
    ""
  );
  assert.equal(init.status, 0, init.stderr);

  const add = await runCli(
    project,
    ["add", `${server.url}/external/button.json`, "--yes", "--registry", server.url],
    ""
  );
  assert.equal(add.status, 0, add.stderr);

  const manifest = JSON.parse(
    readFileSync(join(project, ".loseta", "manifest.json"), "utf8")
  ) as {
    items: Array<{ name: string; source?: string }>;
  };
  const button = manifest.items.find((item) => item.name === "button");
  assert.equal(button?.source, `${server.url}/external/button.json`);

  const listed = await runCli(
    project,
    ["list", "--registry", server.url, "--no-cache"],
    ""
  );
  assert.equal(listed.status, 0, listed.stderr);
  assert.match(listed.stdout, /Components/);

  const switched = await runCli(project, ["style", "vega"], "");
  assert.equal(switched.status, 1);
  assert.match(`${switched.stdout}${switched.stderr}`, /URL-installed/);
});

test("CLI: behavior backfill for a URL item uses its recorded source", async (t) => {
  const server = await startTestRegistry();
  const project = mkdtempSync(join(tmpdir(), "loseta-url-behavior-"));
  t.after(async () => {
    await server.close();
    rmSync(project, { recursive: true, force: true });
  });

  const init = await runCli(
    project,
    ["init", "--yes", "--registry", server.url],
    ""
  );
  assert.equal(init.status, 0, init.stderr);

  const add = await runCli(
    project,
    [
      "add",
      `${server.url}/external/dialog.json`,
      "--yes",
      "--no-behavior",
      "--registry",
      server.url
    ],
    ""
  );
  assert.equal(add.status, 0, add.stderr);
  assert.throws(() =>
    readFileSync(join(project, "behaviors", "dialog.js"), "utf8")
  );

  const backfill = await runCli(project, ["add", "dialog", "--behavior", "--yes"], "");
  assert.equal(backfill.status, 0, backfill.stderr);
  assert.match(
    readFileSync(join(project, "behaviors", "dialog.js"), "utf8"),
    /Generated|dialog|init|core/
  );

  const manifest = JSON.parse(
    readFileSync(join(project, ".loseta", "manifest.json"), "utf8")
  ) as { items: Array<{ name: string; source?: string }> };
  assert.equal(
    manifest.items.find((item) => item.name === "dialog")?.source,
    `${server.url}/external/dialog.json`
  );
});

test("CLI: --no-deps skips registry dependencies", async (t) => {
  const server = await startTestRegistry();
  const project = mkdtempSync(join(tmpdir(), "loseta-no-deps-"));
  t.after(async () => {
    await server.close();
    rmSync(project, { recursive: true, force: true });
  });

  const init = await runCli(project, ["init", "--yes"], server.url);
  assert.equal(init.status, 0, init.stderr);

  const add = await runCli(project, ["add", "dialog", "--no-deps", "--yes"], server.url);
  assert.equal(add.status, 0, add.stderr);

  const config = JSON.parse(
    readFileSync(join(project, "loseta.json"), "utf8")
  ) as { cssDir: string };
  assert.ok(
    readFileSync(join(project, config.cssDir, "components", "dialog.css"), "utf8")
  );
  assert.throws(() =>
    readFileSync(
      join(project, config.cssDir, "primitives", "dialog-shell.css"),
      "utf8"
    )
  );
});
