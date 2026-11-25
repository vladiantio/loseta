import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { SCHEMA_VERSION } from "./constants.js";
import { fetchRegistryFile, RegistryFetchError } from "./fetch.js";
import { writeText } from "./fs.js";
import { PACKAGE_VERSION } from "./package-info.js";
import type { RegistryCatalog, RegistryItem, RegistryItemPayload } from "./types.js";
import type { RegistrySource, ResolvedRegistryItem } from "./source-types.js";
import {
  assertCompatible,
  RegistryValidationError,
  validateCatalog,
  validateItemPayload
} from "./validate-content.js";

interface CacheMeta {
  etag?: string;
  lastModified?: string;
  fetchedAt?: string;
}

export interface RemoteRegistrySourceOptions {
  url: string;
  noCache?: boolean;
  onWarning?: (message: string) => void;
  cliVersion?: string;
}

function cacheBase(): string {
  return process.env.XDG_CACHE_HOME || join(homedir(), ".cache");
}

function cacheDirectory(url: string): string {
  return join(
    cacheBase(),
    "loseta",
    "registry",
    createHash("sha256").update(url).digest("hex")
  );
}

function sha256(bytes: Buffer | string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

/** Fetches registry payloads over HTTP, with an optional on-disk cache. */
export class RemoteRegistrySource implements RegistrySource {
  readonly url: string;
  private readonly noCache: boolean;
  private readonly onWarning: (message: string) => void;
  private readonly cliVersion: string;
  private readonly directory: string;
  private catalogPromise: Promise<RegistryCatalog> | undefined;
  private warnedCacheWrite = false;

  constructor(options: RemoteRegistrySourceOptions) {
    this.url = options.url.replace(/\/+$/, "");
    this.noCache = options.noCache ?? false;
    this.onWarning = options.onWarning ?? (() => {});
    this.cliVersion = options.cliVersion ?? PACKAGE_VERSION;
    this.directory = cacheDirectory(this.url);
  }

  private path(...parts: string[]): string {
    return join(this.directory, ...parts);
  }

  private warn(message: string): void {
    this.onWarning(message);
  }

  private readCachedCatalog(): { catalog: RegistryCatalog; meta: CacheMeta } | undefined {
    if (this.noCache) return undefined;
    try {
      const text = readFileSync(this.path("catalog.json"), "utf8");
      const catalog = validateCatalog(JSON.parse(text));
      assertCompatible(catalog, this.cliVersion);
      const metaText = readFileSync(this.path("catalog.meta.json"), "utf8");
      return { catalog, meta: JSON.parse(metaText) as CacheMeta };
    } catch {
      return undefined;
    }
  }

  private writeCache(name: string, content: string): void {
    if (this.noCache) return;
    try {
      writeText(this.path(name), content);
    } catch (error) {
      if (!this.warnedCacheWrite) {
        this.warnedCacheWrite = true;
        this.warn(
          `Could not write the registry cache at ${this.directory}: ${(error as Error).message}`
        );
      }
    }
  }

  private loadCatalog(): Promise<RegistryCatalog> {
    const cached = this.readCachedCatalog();
    const headers: Record<string, string> = {};
    if (cached?.meta.etag) headers["If-None-Match"] = cached.meta.etag;
    if (cached?.meta.lastModified) {
      headers["If-Modified-Since"] = cached.meta.lastModified;
    }

    return fetchRegistryFile(`${this.url}/registry.json`, { headers })
      .then((response) => {
        if (response.notModified) {
          if (cached) return cached.catalog;
          return fetchRegistryFile(`${this.url}/registry.json`).then((fresh) => {
            const catalog = this.parseCatalog(fresh.text);
            this.storeCatalog(catalog, fresh.etag, fresh.lastModified);
            return catalog;
          });
        }

        const catalog = this.parseCatalog(response.text);
        this.storeCatalog(catalog, response.etag, response.lastModified);
        return catalog;
      })
      .catch((error: unknown) => {
        if (
          cached &&
          error instanceof RegistryFetchError &&
          (error.retryable || error.status === undefined)
        ) {
          this.warn(
            `Could not update the registry catalog from ${this.url}; using the cached copy.`
          );
          return cached.catalog;
        }
        throw error;
      });
  }

  private parseCatalog(text: string): RegistryCatalog {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      throw new RegistryValidationError(
        `Invalid JSON from ${this.url}/registry.json: ${(error as Error).message}`
      );
    }
    const catalog = validateCatalog(parsed);
    assertCompatible(catalog, this.cliVersion);
    return catalog;
  }

  private storeCatalog(
    catalog: RegistryCatalog,
    etag: string | undefined,
    lastModified: string | undefined
  ): void {
    this.writeCache("catalog.json", `${JSON.stringify(catalog, null, 2)}\n`);
    const meta: CacheMeta = {
      ...(etag ? { etag } : {}),
      ...(lastModified ? { lastModified } : {}),
      fetchedAt: new Date().toISOString()
    };
    this.writeCache("catalog.meta.json", `${JSON.stringify(meta, null, 2)}\n`);
  }

  catalog(): Promise<RegistryCatalog> {
    this.catalogPromise ??= this.loadCatalog();
    return this.catalogPromise;
  }

  private findItem(catalog: RegistryCatalog, name: string): RegistryItem {
    const item = catalog.items.find((entry) => entry.name === name);
    if (!item) {
      throw new RegistryValidationError(`Unknown item: ${name}`);
    }
    return item;
  }

  private itemUrl(item: RegistryItem, style: string): { url: string; hash: string } {
    if (item.type === "foundation") {
      if (!item.hash) {
        throw new RegistryValidationError(
          `Catalog entry ${item.name} has no foundation hash`
        );
      }
      return {
        url: `${this.url}/foundation/${encodeURIComponent(item.name)}.json`,
        hash: item.hash
      };
    }

    const hash = item.hashes?.[style];
    if (!hash) {
      throw new RegistryValidationError(
        `Catalog entry ${item.name} has no ${style} hash`
      );
    }
    return {
      url: `${this.url}/styles/${encodeURIComponent(style)}/${encodeURIComponent(item.name)}.json`,
      hash
    };
  }

  private readCachedItem(url: string, expectedHash: string, style: string): RegistryItemPayload | undefined {
    if (this.noCache) return undefined;
    try {
      const bytes = readFileSync(this.path("items", `${sha256(url)}.json`));
      if (sha256(bytes) !== expectedHash) return undefined;
      return this.parseItem(bytes.toString("utf8"), url, style);
    } catch {
      return undefined;
    }
  }

  private parseItem(text: string, url: string, style: string): RegistryItemPayload {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      throw new RegistryValidationError(
        `Invalid JSON from ${url}: ${(error as Error).message}`
      );
    }
    try {
      return validateItemPayload(parsed, {
        style,
        schemaVersion: SCHEMA_VERSION,
        cliVersion: this.cliVersion
      });
    } catch (error) {
      if (error instanceof RegistryValidationError) {
        throw new RegistryValidationError(
          `Invalid payload from ${url}`,
          error.errors
        );
      }
      throw error;
    }
  }

  private async loadItem(
    url: string,
    expectedHash: string,
    style: string
  ): Promise<RegistryItemPayload> {
    const cached = this.readCachedItem(url, expectedHash, style);
    if (cached) return cached;

    const response = await fetchRegistryFile(url);
    const actual = sha256(response.bytes);
    if (actual !== expectedHash) {
      throw new RegistryValidationError(
        `Hash mismatch for ${url}: the catalog expects ${expectedHash}, received ${actual}. Re-run the command; if it persists, the registry is serving inconsistent files.`
      );
    }

    const payload = this.parseItem(response.text, url, style);
    this.writeCache(join("items", `${sha256(url)}.json`), response.text);
    return payload;
  }

  async item(name: string, style: string): Promise<ResolvedRegistryItem> {
    const catalog = await this.catalog();
    const entry = this.findItem(catalog, name);
    const { url, hash } = this.itemUrl(entry, style);
    const payload = await this.loadItem(url, hash, style);

    if (payload.name !== entry.name) {
      throw new RegistryValidationError(
        `Registry returned ${payload.name} for ${entry.name} (${url})`
      );
    }
    if (payload.type !== entry.type) {
      throw new RegistryValidationError(
        `Registry returned type ${payload.type} for ${entry.name} (expected ${entry.type})`
      );
    }

    const catalogTargets = new Set(entry.files.map((file) => file.target));
    for (const file of payload.files) {
      if (!catalogTargets.has(file.target)) {
        throw new RegistryValidationError(
          `Registry payload ${entry.name} installs ${file.target}, which the catalog does not declare`
        );
      }
    }

    return { item: payload };
  }

  async itemFromUrl(
    url: string,
    style: string,
    options: { experimental?: boolean } = {}
  ): Promise<ResolvedRegistryItem> {
    const response = await fetchRegistryFile(url);
    const payload = this.parseItem(response.text, url, style);
    const validated = validateItemPayload(payload, {
      style,
      urlSource: true,
      experimental: options.experimental,
      schemaVersion: SCHEMA_VERSION,
      cliVersion: this.cliVersion
    });
    return { item: validated, source: url };
  }
}
