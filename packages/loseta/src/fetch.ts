import { Buffer } from "node:buffer";
import {
  REGISTRY_MAX_BYTES,
  REGISTRY_MAX_REDIRECTS,
  REGISTRY_RETRIES,
  REGISTRY_TIMEOUT_MS
} from "./constants.js";
import { PACKAGE_VERSION } from "./package-info.js";

export interface FetchOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  retries?: number;
}

export interface FetchResult {
  status: number;
  notModified: boolean;
  url: string;
  bytes: Buffer;
  text: string;
  etag?: string;
  lastModified?: string;
}

export class RegistryFetchError extends Error {
  readonly url: string;
  readonly status?: number;
  readonly retryable: boolean;

  constructor(
    message: string,
    options: { url: string; status?: number; retryable?: boolean; cause?: unknown }
  ) {
    super(message, { cause: options.cause });
    this.name = "RegistryFetchError";
    this.url = options.url;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
  }
}

function isLoopback(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]"
  );
}

function isRedirect(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptFetch(url: string, options: FetchOptions): Promise<FetchResult> {
  const timeoutMs = options.timeoutMs ?? REGISTRY_TIMEOUT_MS;
  const headers = new Headers({
    Accept: "application/json",
    "User-Agent": `loseta/${PACKAGE_VERSION}`,
    ...options.headers
  });

  let current = new URL(url);
  for (let redirects = 0; ; redirects += 1) {
    let response: Response;
    try {
      response = await fetch(current, {
        headers,
        redirect: "manual",
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (error) {
      throw new RegistryFetchError(
        `Could not fetch ${current.toString()}: ${(error as Error).message}`,
        { url: current.toString(), retryable: true, cause: error }
      );
    }

    if (isRedirect(response.status)) {
      if (redirects >= REGISTRY_MAX_REDIRECTS) {
        throw new RegistryFetchError(
          `Too many redirects while fetching ${url}`,
          { url }
        );
      }
      const location = response.headers.get("location");
      if (!location) {
        throw new RegistryFetchError(
          `Redirect without a Location header from ${current.toString()}`,
          { url: current.toString() }
        );
      }
      const next = new URL(location, current);
      if (
        current.protocol === "https:" &&
        next.protocol === "http:" &&
        !isLoopback(next.hostname)
      ) {
        throw new RegistryFetchError(
          `Refusing an HTTPS to HTTP redirect: ${next.toString()}`,
          { url: next.toString() }
        );
      }
      if (next.protocol !== "https:" && next.protocol !== "http:") {
        throw new RegistryFetchError(
          `Unsupported redirect protocol: ${next.toString()}`,
          { url: next.toString() }
        );
      }
      current = next;
      continue;
    }

    if (response.status === 304) {
      return {
        status: 304,
        notModified: true,
        url: current.toString(),
        bytes: Buffer.alloc(0),
        text: "",
        etag: response.headers.get("etag") ?? undefined,
        lastModified: response.headers.get("last-modified") ?? undefined
      };
    }

    if (!response.ok) {
      throw new RegistryFetchError(
        `Registry request failed (${response.status} ${response.statusText}): ${current.toString()}`,
        {
          url: current.toString(),
          status: response.status,
          retryable: response.status >= 500
        }
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.toLowerCase().includes("json")) {
      throw new RegistryFetchError(
        `Expected JSON from ${current.toString()}, received ${contentType}`,
        { url: current.toString() }
      );
    }

    const declaredLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > REGISTRY_MAX_BYTES) {
      throw new RegistryFetchError(
        `Registry payload is too large (${declaredLength} bytes): ${current.toString()}`,
        { url: current.toString() }
      );
    }

    let bytes: Buffer;
    try {
      bytes = Buffer.from(await response.arrayBuffer());
    } catch (error) {
      throw new RegistryFetchError(
        `Could not read ${current.toString()}: ${(error as Error).message}`,
        { url: current.toString(), retryable: true, cause: error }
      );
    }
    if (bytes.length > REGISTRY_MAX_BYTES) {
      throw new RegistryFetchError(
        `Registry payload is too large (${bytes.length} bytes): ${current.toString()}`,
        { url: current.toString() }
      );
    }

    return {
      status: response.status,
      notModified: false,
      url: current.toString(),
      bytes,
      text: bytes.toString("utf8"),
      etag: response.headers.get("etag") ?? undefined,
      lastModified: response.headers.get("last-modified") ?? undefined
    };
  }
}

/** Fetches a JSON document with redirect, size and timeout limits. */
export async function fetchRegistryFile(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult> {
  const retries = options.retries ?? REGISTRY_RETRIES;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await attemptFetch(url, options);
    } catch (error) {
      lastError = error;
      if (
        !(error instanceof RegistryFetchError) ||
        !error.retryable ||
        attempt >= retries
      ) {
        throw error;
      }
      await delay(250 * (attempt + 1));
    }
  }

  throw lastError;
}
