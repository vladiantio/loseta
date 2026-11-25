import { log } from "@clack/prompts";
import { resolveRegistryUrl } from "./registry-url.js";
import { RemoteRegistrySource } from "./remote-registry.js";
import type { RegistrySource } from "./source-types.js";
import type { RegistryCatalog } from "./types.js";

/**
 * citty implements `--no-X` by setting `X` to false rather than defining a
 * separate positive flag. Read both shapes so `--no-cache` works everywhere.
 */
export function noCacheFlag(args: Record<string, unknown>): boolean {
  return Boolean(args.noCache) || args.cache === false;
}

export interface RegistrySession {
  url: string;
  source: RegistrySource;
  catalog: RegistryCatalog;
}

export interface OpenRegistryOptions {
  registry?: string;
  noCache?: boolean;
  configRegistry?: string;
  onWarning?: (message: string) => void;
}

/** Resolves the registry URL, creates the source and loads the catalog. */
export async function openRegistry(
  options: OpenRegistryOptions = {}
): Promise<RegistrySession> {
  const url = resolveRegistryUrl({
    flag: options.registry,
    env: process.env.LOSETA_REGISTRY || undefined,
    config: options.configRegistry
  });
  const source = new RemoteRegistrySource({
    url,
    noCache: options.noCache,
    onWarning: options.onWarning ?? ((message) => log.warn(message))
  });
  const catalog = await source.catalog();
  return { url, source, catalog };
}
