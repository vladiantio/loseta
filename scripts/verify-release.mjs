#!/usr/bin/env node
/**
 * Verify the release metadata and tag.
 *
 * Local mode (default) checks that the repository is on `main` with a clean
 * tree, that the package, registry and changelog agree on the version, and
 * that the generated sidebar examples show it. The tag may be absent (ready to
 * tag) or annotated at `HEAD` (tagged, ready to push).
 *
 * `--ci` checks `GITHUB_REF_NAME` against the package version instead of the
 * local branch, tree and tag; the Publish workflow runs it on the release tag.
 *
 * Usage:
 *   node scripts/verify-release.mjs
 *   node scripts/verify-release.mjs --ci
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const ci = args.includes("--ci");
const help = args.includes("--help") || args.includes("-h");
const known = new Set(["--ci", "--help", "-h"]);

if (help) {
  console.log("Usage: node scripts/verify-release.mjs [--ci]");
  process.exit(0);
}

for (const arg of args) {
  if (!known.has(arg)) {
    console.error(`release: unknown option ${arg}`);
    process.exit(2);
  }
}

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function git(...gitArgs) {
  return execFileSync("git", gitArgs, { cwd: root, encoding: "utf8" }).trim();
}

function gitSucceeds(...gitArgs) {
  try {
    execFileSync("git", gitArgs, { cwd: root, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

function readText(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const packageJson = readJson("packages/loseta/package.json");
const registry = readJson("packages/loseta/registry/registry.json");
const version = packageJson.version;
const tag = `v${version}`;

check(
  typeof version === "string" && /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version),
  `packages/loseta/package.json has an invalid version: ${JSON.stringify(version)}`
);
check(
  registry.version === version,
  `registry.json is ${registry.version}, package.json is ${version}`
);

const changelog = readText("CHANGELOG.md");
const topHeading = /^##\s+(.+)$/m.exec(changelog);
if (!topHeading) {
  failures.push("CHANGELOG.md has no ## section");
} else {
  const section = topHeading[1].trim();
  const dated = new RegExp(`^${escapeRegExp(version)}\\s+-\\s+\\d{4}-\\d{2}-\\d{2}$`);
  check(
    dated.test(section),
    `CHANGELOG.md top section is "${section}"; expected "## ${version} - YYYY-MM-DD"`
  );
}

const sidebar = readText("packages/loseta/registry/examples/sidebar.html");
check(
  sidebar.includes(`v${version}`),
  `examples/sidebar.html does not show v${version}; run pnpm registry:examples`
);
check(
  sidebar.includes(`الإصدار ${version}`),
  `examples/sidebar.html does not show the RTL version ${version}; run pnpm registry:examples`
);

if (ci) {
  const ref = process.env.GITHUB_REF_NAME ?? "";
  check(ref === tag, `GITHUB_REF_NAME is "${ref}"; expected "${tag}"`);
} else {
  const branch = git("branch", "--show-current");
  check(
    branch === "main",
    `releases are cut from main, not ${branch === "" ? "a detached HEAD" : branch}`
  );

  const status = git("status", "--porcelain");
  if (status !== "") {
    failures.push("working tree is dirty; commit release changes before verifying");
    console.error(status);
  }

  const tagRef = `refs/tags/${tag}`;
  if (gitSucceeds("rev-parse", "--verify", "--quiet", `${tagRef}^{commit}`)) {
    if (git("cat-file", "-t", tagRef) !== "tag") {
      failures.push(`tag ${tag} is not annotated; releases use annotated tags`);
    } else {
      const tagCommit = git("rev-parse", `${tagRef}^{commit}`);
      const headCommit = git("rev-parse", "HEAD");
      if (tagCommit !== headCommit) {
        failures.push(
          `tag ${tag} points at ${tagCommit.slice(0, 12)}, not HEAD ${headCommit.slice(0, 12)}`
        );
      }
    }
  }
}

if (failures.length > 0) {
  for (const message of failures) console.error(`release: ${message}`);
  process.exit(1);
}

const tagged =
  !ci && gitSucceeds("rev-parse", "--verify", "--quiet", `refs/tags/${tag}^{commit}`);
const verifying = ci || tagged;
const subject = verifying ? `tag ${tag}` : version;
const state = verifying ? "verifies" : "is ready to tag";
console.log(`release: ${subject} ${state}`);
console.log(`  package.json and registry.json are at ${version}`);
console.log(`  CHANGELOG.md has a dated ${version} section`);
console.log(`  examples/sidebar.html shows ${version}`);
if (ci) {
  console.log(`  GITHUB_REF_NAME is ${tag}`);
} else if (tagged) {
  console.log(`  tag ${tag} is annotated and at HEAD`);
} else {
  console.log(
    `  main is clean; create the tag with: git tag -a ${tag} -m "loseta ${version}"`
  );
}
