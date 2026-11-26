import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { PACKAGE_VERSION } from "../src/package-info.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tsxBin = join(
  packageRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsx.cmd" : "tsx"
);
const cliPath = join(packageRoot, "src", "cli.ts");

function runCli(args: string[]) {
  const result = spawnSync(tsxBin, [cliPath, ...args], {
    cwd: packageRoot,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
    timeout: 10_000
  });
  if (result.error) throw result.error;
  return result;
}

test("CLI prints root help with no command", () => {
  const result = runCli([]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: loseta <command> \[options\]/);
  assert.match(result.stdout, /init\s+Set up loseta/);
  assert.match(result.stdout, /list\s+List available components/);
});

test("CLI prints its version", () => {
  const result = runCli(["--version"]);
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), PACKAGE_VERSION);
});

test("CLI prints subcommand help without running the command", () => {
  const result = runCli(["add", "--help"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: loseta add \[options\]/);
  assert.match(result.stdout, /--no-behavior/);
  assert.match(result.stdout, /--no-cache/);
});

test("CLI rejects unknown commands and options", () => {
  const command = runCli(["unknown"]);
  assert.equal(command.status, 1);
  assert.match(command.stderr, /Unknown command "unknown"/);

  const option = runCli(["add", "--unknown"]);
  assert.equal(option.status, 1);
  assert.match(option.stderr, /Unknown option '--unknown'/);
});
