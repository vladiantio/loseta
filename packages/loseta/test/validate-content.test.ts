import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { LocalRegistrySource } from "../src/local-registry.js";
import {
  RegistryValidationError,
  validateCatalog,
  validateItemPayload
} from "../src/validate-content.js";

const registryDir = resolve(dirname(fileURLToPath(import.meta.url)), "../registry");

test("validateCatalog reports schema error paths", async () => {
  const source = new LocalRegistrySource(registryDir);
  const catalog = await source.catalog();

  assert.throws(
    () => validateCatalog({ ...catalog, schemaVersion: "1" }),
    (error: unknown) =>
      error instanceof RegistryValidationError &&
      error.errors.some((line) => line.startsWith("/schemaVersion "))
  );
});

test("validateItemPayload reports schema error paths", async () => {
  const source = new LocalRegistrySource(registryDir);
  const { item } = await source.item("button", "nova");

  assert.throws(
    () => validateItemPayload({ ...item, name: 42 }, { style: "nova" }),
    (error: unknown) =>
      error instanceof RegistryValidationError &&
      error.errors.some((line) => line.startsWith("/name "))
  );
});
