import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MIN_CLI_VERSION, SCHEMA_VERSION } from "./constants.js";
import { buildCatalog, buildItemPayload } from "./payload.js";
import type { Registry, RegistryCatalog, RegistryItem } from "./types.js";
import { validateCatalog } from "./validate-content.js";
import type { RegistrySource, ResolvedRegistryItem } from "./source-types.js";

/**
 * Reads the authored registry from disk. Used by tests and local development;
 * the published CLI fetches from a registry URL instead.
 */
export class LocalRegistrySource implements RegistrySource {
  readonly url: string;
  private readonly registryDir: string;
  private readonly registry: Registry;
  private readonly build: string;
  private catalogPromise: Promise<RegistryCatalog> | undefined;

  constructor(registryDir: string, options: { build?: string } = {}) {
    this.registryDir = registryDir;
    this.url = `local:${registryDir}`;
    this.registry = JSON.parse(
      readFileSync(join(registryDir, "registry.json"), "utf8")
    ) as Registry;
    this.build = options.build ?? "local";
  }

  catalog(): Promise<RegistryCatalog> {
    this.catalogPromise ??= Promise.resolve().then(() => {
      const catalog = buildCatalog({
        registry: this.registry,
        registryDir: this.registryDir,
        style: this.registry.styles[0]?.name ?? "nova",
        build: this.build,
        schemaVersion: this.registry.schemaVersion ?? SCHEMA_VERSION,
        minCliVersion: this.registry.minCliVersion ?? MIN_CLI_VERSION
      });
      return validateCatalog(catalog);
    });
    return this.catalogPromise;
  }

  private findItem(name: string): RegistryItem {
    const item = this.registry.items.find((entry) => entry.name === name);
    if (!item) {
      throw new Error(`Unknown item: ${name}`);
    }
    return item;
  }

  async item(name: string, style: string): Promise<ResolvedRegistryItem> {
    const item = this.findItem(name);
    const payload = buildItemPayload(item, {
      registryDir: this.registryDir,
      style,
      build: this.build,
      schemaVersion: this.registry.schemaVersion ?? SCHEMA_VERSION,
      minCliVersion: this.registry.minCliVersion ?? MIN_CLI_VERSION
    });
    return { item: payload };
  }

  async itemFromUrl(): Promise<ResolvedRegistryItem> {
    throw new Error("The local registry source cannot fetch item URLs.");
  }
}
