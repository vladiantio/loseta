import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveAddNames } from "../src/add-policy.js";
import { loadRegistry } from "../src/registry.js";

const registry = loadRegistry();

test("add names resolves stable components without the experimental flag", () => {
  const result = resolveAddNames(registry, ["button", "card"], {
    experimental: false,
    style: "nova"
  });

  assert.deepEqual(result, { names: ["button", "card"], experimental: [] });
});

test("add names requires the experimental flag for experimental items", () => {
  const result = resolveAddNames(registry, ["accordion"], {
    experimental: false,
    style: "nova"
  });

  assert.ok("error" in result);
  assert.match(result.error, /accordion is experimental/);
  assert.match(result.error, /--experimental/);
});

test("add names accepts experimental items in a Nova project", () => {
  const result = resolveAddNames(registry, ["accordion", "button"], {
    experimental: true,
    style: "nova"
  });

  assert.deepEqual(result, {
    names: ["accordion", "button"],
    experimental: ["accordion"]
  });
});

test("add names rejects experimental items outside Nova", () => {
  const result = resolveAddNames(registry, ["accordion"], {
    experimental: true,
    style: "vega"
  });

  assert.ok("error" in result);
  assert.match(result.error, /Nova-only/);
});

test("add names rejects the experimental flag for stable-only requests", () => {
  const result = resolveAddNames(registry, ["button"], {
    experimental: true,
    style: "nova"
  });

  assert.ok("error" in result);
  assert.match(result.error, /only applies to experimental/);
});

test("add all stays stable-only and rejects the experimental flag", () => {
  const stable = resolveAddNames(registry, ["all"], {
    experimental: false,
    style: "nova"
  });

  assert.ok(!("error" in stable));
  if ("error" in stable) return;
  assert.ok(stable.names.includes("button"));
  assert.ok(!stable.names.includes("accordion"));
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
