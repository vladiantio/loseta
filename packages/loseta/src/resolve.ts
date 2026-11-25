import { isItemUrl, normalizeItemUrl } from "./registry-url.js";
import type { RegistrySource, ResolvedRegistryItem } from "./source-types.js";
import type { RegistryCatalog } from "./types.js";

export class RegistryResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryResolutionError";
  }
}

export class RegistryNameConflictError extends Error {
  readonly itemName: string;

  constructor(name: string, firstSource: string, secondSource: string) {
    super(
      `The item "${name}" exists in both ${firstSource} and ${secondSource}. Remove one of them or install it in a separate command.`
    );
    this.name = "RegistryNameConflictError";
    this.itemName = name;
  }
}

export interface ResolveRegistryItemsOptions {
  source: RegistrySource;
  catalog: RegistryCatalog;
  style: string;
  experimental: boolean;
  includeDependencies?: boolean;
}

function sourceLabel(source: string | undefined, registryUrl: string): string {
  return source ?? registryUrl;
}

/**
 * Resolves requested names and URLs, plus their registry dependencies, in
 * install order. Official names resolve against the configured registry; bare
 * dependencies inside URL payloads do the same; external dependencies must be
 * absolute URLs.
 */
export async function resolveRegistryItems(
  requested: string[],
  options: ResolveRegistryItemsOptions
): Promise<ResolvedRegistryItem[]> {
  const includeDependencies = options.includeDependencies ?? true;
  const ordered: ResolvedRegistryItem[] = [];
  const done = new Set<string>();
  const visiting: string[] = [];
  const byName = new Map<
    string,
    { key: string; source: string | undefined }
  >();

  const checkExperimental = (
    item: ResolvedRegistryItem["item"],
    source: string | undefined
  ): void => {
    if (item.status !== "experimental") return;
    if (!options.experimental) {
      throw new RegistryResolutionError(
        `${item.name} is experimental (${sourceLabel(source, options.source.url)}). Re-run with \`--experimental\`. Experimental items are Nova-only and outside the v1 contract.`
      );
    }
    if (options.style !== "nova") {
      throw new RegistryResolutionError(
        `${item.name} is experimental and Nova-only. This project uses the "${options.style}" style.`
      );
    }
  };

  const register = (resolved: ResolvedRegistryItem, key: string): void => {
    const existing = byName.get(resolved.item.name);
    if (existing && existing.key !== key) {
      throw new RegistryNameConflictError(
        resolved.item.name,
        sourceLabel(existing.source, options.source.url),
        sourceLabel(resolved.source, options.source.url)
      );
    }
    if (existing) return;
    byName.set(resolved.item.name, { key, source: resolved.source });
    ordered.push(resolved);
  };

  const run = async (key: string, trail: string[], load: () => Promise<ResolvedRegistryItem>): Promise<void> => {
    if (done.has(key)) return;
    if (visiting.includes(key)) {
      throw new RegistryResolutionError(
        `Dependency cycle: ${[...trail, key].join(" -> ")}`
      );
    }
    visiting.push(key);
    let resolved: ResolvedRegistryItem;
    try {
      resolved = await load();
      checkExperimental(resolved.item, resolved.source);
      if (includeDependencies) {
        for (const dependency of resolved.item.registryDependencies ?? []) {
          if (isItemUrl(dependency)) {
            await visitUrl(dependency, [...trail, key]);
          } else {
            await visitName(dependency, [...trail, key]);
          }
        }
      }
      register(resolved, key);
      done.add(key);
    } finally {
      visiting.pop();
    }
  };

  const visitName = async (name: string, trail: string[]): Promise<void> => {
    const key = `registry:${name}`;
    await run(key, trail, async () => {
      const item = options.catalog.items.find((entry) => entry.name === name);
      if (!item) {
        throw new RegistryResolutionError(`Unknown item: ${name}`);
      }
      return options.source.item(name, options.style);
    });
  };

  const visitUrl = async (url: string, trail: string[]): Promise<void> => {
    const normalized = normalizeItemUrl(url);
    const key = `url:${normalized}`;
    await run(key, trail, () =>
      options.source.itemFromUrl(normalized, options.style, {
        experimental: options.experimental
      })
    );
  };

  for (const entry of requested) {
    if (isItemUrl(entry)) {
      await visitUrl(entry, []);
    } else {
      await visitName(entry, []);
    }
  }

  return ordered;
}
