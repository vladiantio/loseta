import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveAddNames } from "../src/add-policy.js";
import {
  experimentalComponents,
  loadRegistry,
  stableComponents
} from "../src/registry.js";
import { fixtureRegistry } from "./fixtures.js";

const registry = loadRegistry();

test("add names resolves stable components without the experimental flag", () => {
  const result = resolveAddNames(registry, ["button", "card"], {
    experimental: false,
    style: "nova"
  });

  assert.deepEqual(result, { names: ["button", "card"], experimental: [] });
});

test("add names requires the experimental flag for experimental items", () => {
  const result = resolveAddNames(fixtureRegistry, ["beta"], {
    experimental: false,
    style: "nova"
  });

  assert.ok("error" in result);
  assert.match(result.error, /beta is experimental/);
  assert.match(result.error, /--experimental/);
});

test("add names accepts experimental items in a Nova project", () => {
  const result = resolveAddNames(fixtureRegistry, ["beta", "alpha"], {
    experimental: true,
    style: "nova"
  });

  assert.deepEqual(result, {
    names: ["beta", "alpha"],
    experimental: ["beta"]
  });
});

test("add names rejects experimental items outside Nova", () => {
  const result = resolveAddNames(fixtureRegistry, ["beta"], {
    experimental: true,
    style: "vega"
  });

  assert.ok("error" in result);
  assert.match(result.error, /Nova-only/);
});

test("add names rejects the experimental flag for stable-only requests", () => {
  const result = resolveAddNames(fixtureRegistry, ["alpha"], {
    experimental: true,
    style: "nova"
  });

  assert.ok("error" in result);
  assert.match(result.error, /only applies to experimental/);
});

test("add all includes every stable component and no experimental item", () => {
  const stable = resolveAddNames(registry, ["all"], {
    experimental: false,
    style: "nova"
  });

  assert.ok(!("error" in stable));
  if ("error" in stable) return;

  const expected = stableComponents(registry)
    .map((item) => item.name)
    .sort();
  const experimental = new Set(
    experimentalComponents(registry).map((item) => item.name)
  );

  assert.deepEqual([...stable.names].sort(), expected);
  assert.ok(stable.names.every((name) => !experimental.has(name)));
  assert.deepEqual(stable.experimental, []);

  const allExperimental = resolveAddNames(registry, ["all"], {
    experimental: true,
    style: "nova"
  });
  assert.ok("error" in allExperimental);
  if ("error" in allExperimental) {
    assert.match(allExperimental.error, /added by name/);
  }
});

test("add names rejects unknown and non-component items", () => {
  const unknown = resolveAddNames(registry, ["missing"], {
    experimental: false,
    style: "nova"
  });
  assert.ok("error" in unknown);
  if ("error" in unknown) assert.match(unknown.error, /Unknown item: missing/);

  const primitive = resolveAddNames(registry, ["dialog-shell"], {
    experimental: false,
    style: "nova"
  });
  assert.ok("error" in primitive);
  if ("error" in primitive) assert.match(primitive.error, /primitive/);
});

test("stable components never depend on experimental items", () => {
  const byName = new Map(registry.items.map((item) => [item.name, item]));

  for (const item of stableComponents(registry)) {
    for (const dependency of item.registryDependencies ?? []) {
      const target = byName.get(dependency);
      assert.ok(target, `${item.name}: missing dependency ${dependency}`);
      assert.equal(
        target.status,
        "stable",
        `${item.name}: stable component depends on experimental ${dependency}`
      );
    }
  }
});
