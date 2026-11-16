#!/usr/bin/env node
/**
 * Run a gate command, print the end of its output, and preserve its exit
 * status. This exists because `pnpm test 2>&1 | tail -30` reports the status
 * of `tail`, not of the gate.
 *
 * Usage:
 *   node scripts/gate.mjs [--tail 40] <command> [args...]
 *   pnpm gate:test
 *   pnpm gate:registry
 *   pnpm gate:e2e
 */
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
let tail = 40;

if (args[0] === "--tail") {
  const value = Number(args[1]);
  if (!Number.isInteger(value) || value < 1) {
    console.error("gate: --tail needs a positive integer");
    process.exit(2);
  }
  tail = value;
  args.splice(0, 2);
}

if (args[0] === "--") args.shift();

if (args.length === 0) {
  console.error("gate: pass a command, for example: pnpm gate -- pnpm test");
  process.exit(2);
}

const result = spawnSync(args[0], args.slice(1), {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
  stdio: ["inherit", "pipe", "pipe"]
});

if (result.error) {
  console.error(`gate: ${result.error.message}`);
  process.exit(1);
}

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trimEnd();
const lines = output ? output.split("\n") : [];

if (lines.length > tail) {
  console.log(`… ${lines.length - tail} lines omitted …`);
}
if (lines.length > 0) {
  console.log(lines.slice(-tail).join("\n"));
}

process.exit(result.status ?? 1);
