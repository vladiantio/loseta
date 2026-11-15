import assert from "node:assert/strict";
import { test } from "node:test";
import {
  experimentalComponents,
  loadRegistry,
  missingFoundation,
  resolveItems,
  stableFoundation
} from "../src/registry.js";
import type { Registry } from "../src/types.js";
import { fixtureRegistry } from "./fixtures.js";

test("stableFoundation returns the four stable foundation items", () => {
  const names = stableFoundation(loadRegistry()).map((item) => item.name);

  assert.deepEqual(names, ["tokens", "reset", "base", "utilities"]);
});

test("missingFoundation reports only the missing foundation names", () => {
  const registry = loadRegistry();

  assert.deepEqual(missingFoundation(registry, new Set(["tokens", "reset"])), [
    "base",
    "utilities"
  ]);
  assert.deepEqual(
    missingFoundation(registry, new Set(["tokens", "reset", "base", "utilities"])),
    []
  );
});

test("resolveItems installs registry dependencies before their dependents", () => {
  const registry = loadRegistry();
  const names = resolveItems(registry, ["dialog"]).map((item) => item.name);

  const dependency = names.indexOf("dialog-shell");
  const dependent = names.indexOf("dialog");

  assert.notEqual(dependency, -1);
  assert.notEqual(dependent, -1);
  assert.ok(dependency < dependent);
});

test("resolveItems fails on unknown items", () => {
  const registry = loadRegistry();

  assert.throws(() => resolveItems(registry, ["missing"]), /Unknown item: missing/);
});

test("experimentalComponents returns experimental items with one Nova style", () => {
  const items = experimentalComponents(fixtureRegistry);

  assert.deepEqual(items.map((item) => item.name), ["beta"]);
  for (const item of items) {
    assert.equal(item.status, "experimental");
    const styles = item.files
      .filter((file) => file.role === "style")
      .map((file) => file.path);
    assert.deepEqual(styles, ["styles/nova/beta.css"]);
  }
});

test("every stable component and primitive has one style file per style", () => {
  const registry = loadRegistry();
  const styles = registry.styles.map((style) => style.name).sort();

  for (const item of registry.items) {
    if (
      (item.type !== "component" && item.type !== "primitive") ||
      item.status !== "stable"
    ) {
      continue;
    }
    const styleFiles = item.files
      .filter((file) => file.role === "style")
      .map((file) => /^styles\/([^/]+)\//.exec(file.path)?.[1])
      .filter((style): style is string => Boolean(style))
      .sort();

    assert.deepEqual(styleFiles, styles, item.name);
  }
});

test("resolveItems fails on dependency cycles", () => {
  const registry: Registry = {
    name: "test",
    version: "0.0.0",
    items: [
      {
        name: "a",
        type: "component",
        status: "stable",
        title: "A",
        description: "A",
        root: [],
        registryDependencies: ["b"],
        files: []
      },
      {
        name: "b",
        type: "component",
        status: "stable",
        title: "B",
        description: "B",
        root: [],
        registryDependencies: ["a"],
        files: []
      }
    ]
  };

  assert.throws(() => resolveItems(registry, ["a"]), /Dependency cycle: a -> b -> a/);
});
