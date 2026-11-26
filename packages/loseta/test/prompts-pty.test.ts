import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { startTestRegistry } from "./registry-server.js";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tsxBin = join(
  packageRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsx.cmd" : "tsx"
);
const cliPath = join(packageRoot, "src", "cli.ts");
const fixturePath = join(packageRoot, "test", "fixtures", "prompt-pty.ts");

type PtyMode = "util-linux" | "bsd";

function detectPtyMode(): PtyMode | undefined {
  if (process.platform === "win32") return undefined;
  if (
    spawnSync("script", ["-qec", "true", "/dev/null"], {
      stdio: "ignore"
    }).status === 0
  ) {
    return "util-linux";
  }
  if (
    spawnSync("script", ["-q", "/dev/null", "true"], {
      stdio: "ignore"
    }).status === 0
  ) {
    return "bsd";
  }
  return undefined;
}

const ptyMode = detectPtyMode();
const ptySkip = ptyMode
  ? false
  : "script(1) with pseudo-terminal support is required";

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

interface PtyStep {
  waitFor: string;
  input: string;
}

async function runPty(
  command: string[],
  options: { cwd: string; env?: NodeJS.ProcessEnv; steps: PtyStep[] }
): Promise<{ output: string; status: number | null }> {
  assert.ok(ptyMode, "PTY support was not detected");
  const shellCommand = command.map(shellQuote).join(" ");
  const args =
    ptyMode === "util-linux"
      ? ["-qec", shellCommand, "/dev/null"]
      : ["-q", "/dev/null", "bash", "-c", shellCommand];
  const child = spawn("script", args, {
    cwd: options.cwd,
    env: { ...process.env, NO_COLOR: "1", ...options.env },
    stdio: ["pipe", "pipe", "pipe"]
  });
  let output = "";
  let status: number | null = null;
  let error: Error | undefined;
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => {
    output += chunk;
  });
  child.stderr.on("data", (chunk: string) => {
    output += chunk;
  });
  child.stdin.on("error", () => {});
  child.on("error", (cause) => {
    error = cause;
  });
  child.on("close", (code) => {
    status = code;
  });

  async function waitFor(text: string): Promise<void> {
    const deadline = Date.now() + 15_000;
    while (!output.includes(text)) {
      if (error) throw error;
      if (status !== null) {
        throw new Error(`PTY command exited before ${JSON.stringify(text)}:\n${output}`);
      }
      if (Date.now() > deadline) {
        child.kill();
        throw new Error(`Timed out waiting for ${JSON.stringify(text)}:\n${output}`);
      }
      await new Promise<void>((done) => setTimeout(done, 25));
    }
  }

  for (const step of options.steps) {
    await waitFor(step.waitFor);
    child.stdin.write(step.input);
  }

  const deadline = Date.now() + 30_000;
  while (status === null) {
    if (error) throw error;
    if (Date.now() > deadline) {
      child.kill();
      throw new Error(`PTY command timed out:\n${output}`);
    }
    await new Promise<void>((done) => setTimeout(done, 25));
  }
  return { output, status };
}

function readPtyResult(output: string): {
  cancelled: boolean;
  value: string | null;
  beforeRaw: boolean;
  afterRaw: boolean;
} {
  const match = /PTY_RESULT=(\{[^\r\n]+\})/.exec(output);
  assert.ok(match, `missing PTY result marker:\n${output}`);
  return JSON.parse(match[1] ?? "") as {
    cancelled: boolean;
    value: string | null;
    beforeRaw: boolean;
    afterRaw: boolean;
  };
}

test(
  "init applies prompt defaults under a PTY with the local registry",
  { skip: ptySkip, timeout: 60_000 },
  async (t) => {
    const server = await startTestRegistry();
    const project = mkdtempSync(join(tmpdir(), "loseta-pty-init-"));
    t.after(async () => {
      rmSync(project, { recursive: true, force: true });
      await server.close();
    });

    const result = await runPty([tsxBin, cliPath, "init"], {
      cwd: project,
      env: { LOSETA_REGISTRY: server.url },
      steps: [
        {
          waitFor: "Where should the loseta CSS live?",
          input: "\r"
        },
        { waitFor: "Style", input: "\r" },
        {
          waitFor: "CSS entrypoint (leave empty to skip)",
          input: "\r"
        }
      ]
    });

    assert.equal(result.status, 0, result.output);
    assert.doesNotMatch(result.output, /Infinity/);
    const config = JSON.parse(
      readFileSync(join(project, "loseta.json"), "utf8")
    ) as { cssDir?: string; style?: string; entrypoint?: string };
    assert.equal(config.cssDir, "src/styles/loseta");
    assert.equal(config.style, "nova");
    assert.equal(config.entrypoint, undefined);
  }
);

test(
  "prompt adapter restores raw mode after normal completion",
  { skip: ptySkip, timeout: 30_000 },
  async () => {
    const result = await runPty([tsxBin, fixturePath], {
      cwd: packageRoot,
      steps: [{ waitFor: "PTY fixture prompt", input: "\r" }]
    });

    assert.equal(result.status, 0, result.output);
    assert.doesNotMatch(result.output, /Infinity/);
    assert.deepEqual(readPtyResult(result.output), {
      cancelled: false,
      value: "default value",
      beforeRaw: false,
      afterRaw: false
    });
  }
);

test(
  "prompt adapter restores raw mode after Ctrl-C",
  { skip: ptySkip, timeout: 30_000 },
  async () => {
    const result = await runPty([tsxBin, fixturePath], {
      cwd: packageRoot,
      steps: [{ waitFor: "PTY fixture prompt", input: "\u0003" }]
    });

    assert.equal(result.status, 0, result.output);
    assert.deepEqual(readPtyResult(result.output), {
      cancelled: true,
      value: null,
      beforeRaw: false,
      afterRaw: false
    });
  }
);
