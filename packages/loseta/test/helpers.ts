import { LocalRegistrySource } from "../src/local-registry.js";
import { registryDir } from "../src/registry.js";
import { resolveRegistryItems } from "../src/resolve.js";
import type { ResolvedRegistryItem } from "../src/source-types.js";
import type { RegistryCatalog } from "../src/types.js";

export interface ResolvedFixture {
  source: LocalRegistrySource;
  catalog: RegistryCatalog;
  items: ResolvedRegistryItem[];
}

/** Resolves items from the authored registry for install-level tests. */
export async function resolveFixture(
  names: string[],
  options: { style?: string; experimental?: boolean } = {}
): Promise<ResolvedFixture> {
  const source = new LocalRegistrySource(registryDir);
  const catalog = await source.catalog();
  const items = await resolveRegistryItems(names, {
    source,
    catalog,
    style: options.style ?? "nova",
    experimental: options.experimental ?? false
  });
  return { source, catalog, items };
}
