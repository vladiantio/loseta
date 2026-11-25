import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { ITEM_SCHEMA_URL, REGISTRY_SCHEMA_URL } from "./constants.js";
import { join } from "node:path";
import type {
  RegistryCatalog,
  RegistryExample,
  RegistryItem,
  RegistryItemPayload
} from "./types.js";

export function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value !== null && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) {
      result[key] = canonicalize(source[key]);
    }
    return result;
  }
  return value;
}

/** Canonical JSON bytes used for hashing and serving payloads. */
export function serializePayload(value: unknown): string {
  return `${JSON.stringify(canonicalize(value), null, 2)}\n`;
}

export function parseExampleFile(content: string): RegistryExample[] {
  const pattern = /<!--\s*(.+?)\s*-->/g;
  const matches = [...content.matchAll(pattern)];
  if (matches.length === 0) {
    const html = content.trim();
    return html ? [{ title: "Example", html }] : [];
  }

  const examples: RegistryExample[] = [];
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    if (!match || match.index === undefined) continue;
    const next = matches[index + 1];
    const start = match.index + match[0].length;
    const end = next?.index ?? content.length;
    const html = content.slice(start, end).trim();
    if (!html) continue;
    examples.push({ title: match[1] ?? "Example", html });
  }
  return examples;
}

export interface BuildPayloadOptions {
  registryDir: string;
  style: string;
  build: string;
  schemaVersion: number;
  minCliVersion: string;
}

/** Builds an installable payload from the authored registry files. */
export function buildItemPayload(
  item: RegistryItem,
  options: BuildPayloadOptions
): RegistryItemPayload {
  const stylePrefix = `styles/${options.style}/`;
  const files = item.files
    .filter(
      (file) =>
        file.role === "base" ||
        (file.role === "style" && file.path.startsWith(stylePrefix))
    )
    .map((file) => ({
      ...file,
      content: readFileSync(join(options.registryDir, file.path), "utf8")
    }));

  const behaviors = (item.behaviors ?? []).map((behavior) => ({
    ...behavior,
    content: readFileSync(join(options.registryDir, behavior.path), "utf8")
  }));

  const examples = (item.examples ?? []).flatMap((example) =>
    parseExampleFile(readFileSync(join(options.registryDir, example), "utf8"))
  );

  const payload: RegistryItemPayload = {
    $schema: ITEM_SCHEMA_URL,
    name: item.name,
    type: item.type,
    status: item.status,
    title: item.title,
    description: item.description,
    ...(item.docs ? { docs: item.docs } : {}),
    root: item.root,
    ...(item.registryDependencies
      ? { registryDependencies: item.registryDependencies }
      : {}),
    ...(item.optionalDependencies
      ? { optionalDependencies: item.optionalDependencies }
      : {}),
    ...(item.type === "component" || item.type === "primitive"
      ? { style: options.style }
      : {}),
    files,
    ...(behaviors.length > 0 ? { behaviors } : {}),
    ...(examples.length > 0 ? { examples } : {}),
    schemaVersion: options.schemaVersion,
    minCliVersion: options.minCliVersion,
    build: options.build
  };

  return payload;
}

/** Catalog entry for one source item, with content stripped. */
export function toCatalogItem(
  item: RegistryItem,
  hashes?: { hashes?: Record<string, string>; hash?: string }
): RegistryItem {
  return {
    name: item.name,
    type: item.type,
    status: item.status,
    title: item.title,
    description: item.description,
    ...(item.docs ? { docs: item.docs } : {}),
    root: item.root,
    ...(item.registryDependencies
      ? { registryDependencies: item.registryDependencies }
      : {}),
    ...(item.optionalDependencies
      ? { optionalDependencies: item.optionalDependencies }
      : {}),
    files: item.files.map(({ path, target, role, layer }) => ({
      path,
      target,
      role,
      layer
    })),
    ...(item.behaviors && item.behaviors.length > 0
      ? {
          behaviors: item.behaviors.map(({ path, target, kind }) => ({
            path,
            target,
            kind
          }))
        }
      : {}),
    ...(item.examples ? { examples: item.examples } : {}),
    ...(hashes?.hashes ? { hashes: hashes.hashes } : {}),
    ...(hashes?.hash ? { hash: hashes.hash } : {})
  };
}

export interface BuildCatalogOptions extends BuildPayloadOptions {
  registry: {
    name: string;
    homepage?: string;
    "$schema"?: string;
    styles: RegistryCatalog["styles"];
    items: RegistryItem[];
  };
}

/** Builds the content-free catalog with a hash for every payload. */
export function buildCatalog(options: BuildCatalogOptions): RegistryCatalog {
  const items = options.registry.items.map((item) => {
    if (item.type === "foundation") {
      const payload = buildItemPayload(item, options);
      return toCatalogItem(item, {
        hash: hashPayload(payload)
      });
    }

    const hashes: Record<string, string> = {};
    for (const style of options.registry.styles) {
      if (item.status === "experimental" && style.name !== "nova") continue;
      const payload = buildItemPayload(item, { ...options, style: style.name });
      hashes[style.name] = hashPayload(payload);
    }
    return toCatalogItem(item, { hashes });
  });

  return {
    $schema: REGISTRY_SCHEMA_URL,
    name: options.registry.name,
    ...(options.registry.homepage ? { homepage: options.registry.homepage } : {}),
    schemaVersion: options.schemaVersion,
    minCliVersion: options.minCliVersion,
    build: options.build,
    styles: options.registry.styles,
    items
  };
}

export function hashPayload(payload: unknown): string {
  return createHash("sha256").update(serializePayload(payload)).digest("hex");
}
