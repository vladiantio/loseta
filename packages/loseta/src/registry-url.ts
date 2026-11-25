import { DEFAULT_REGISTRY_URL } from "./constants.js";
import { ConfigError } from "./config.js";

export interface RegistryUrlInput {
  flag?: string;
  env?: string;
  config?: string;
}

function isLoopback(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]"
  );
}

/** Validates and normalizes a registry base URL. */
export function normalizeRegistryUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ConfigError(`Invalid registry URL: ${value}`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new ConfigError(
      `Registry URLs must use https:// (http:// is allowed for localhost): ${value}`
    );
  }
  if (url.protocol === "http:" && !isLoopback(url.hostname)) {
    throw new ConfigError(
      `Registry URLs must use https:// (http:// is allowed for localhost): ${value}`
    );
  }
  if (url.username || url.password) {
    throw new ConfigError(`Registry URLs must not include credentials: ${value}`);
  }
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/+$/, "");
}

/** Resolves the registry base URL: flag, environment, config, default. */
export function resolveRegistryUrl(input: RegistryUrlInput): string {
  const value =
    input.flag ?? input.env ?? input.config ?? DEFAULT_REGISTRY_URL;
  return normalizeRegistryUrl(value);
}

export function isCustomRegistryUrl(value: string): boolean {
  return normalizeRegistryUrl(value) !== normalizeRegistryUrl(DEFAULT_REGISTRY_URL);
}

/** True for absolute http(s) URLs, used to detect URL install targets. */
export function isItemUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Validates an item URL used as an `add` target. */
export function normalizeItemUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new ConfigError(`Item URLs must use https:// or http://: ${value}`);
  }
  if (url.protocol === "http:" && !isLoopback(url.hostname)) {
    throw new ConfigError(
      `Item URLs must use https:// (http:// is allowed for localhost): ${value}`
    );
  }
  if (url.username || url.password) {
    throw new ConfigError(`Item URLs must not include credentials: ${value}`);
  }
  return url.toString();
}
