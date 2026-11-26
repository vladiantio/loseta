import { readdir } from "node:fs/promises";
import path from "node:path";

const META_TAG_PATTERN = /<meta\b[^>]*>/gi;
const ATTRIBUTE_PATTERN = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " "
};

export function decodeHtmlEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity.startsWith("#")) {
      const isHex = entity[1]?.toLowerCase() === "x";
      const code = Number.parseInt(isHex ? entity.slice(2) : entity.slice(1), isHex ? 16 : 10);

      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }

    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

export function extractMeta(html) {
  const byProperty = new Map();
  const byName = new Map();

  for (const tag of html.match(META_TAG_PATTERN) ?? []) {
    const attributes = {};

    for (const match of tag.matchAll(ATTRIBUTE_PATTERN)) {
      const name = match[1].toLowerCase();
      attributes[name] = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? "");
    }

    if (attributes.property) {
      byProperty.set(attributes.property, attributes.content ?? "");
    }

    if (attributes.name) {
      byName.set(attributes.name, attributes.content ?? "");
    }
  }

  return { byProperty, byName };
}

export async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
}
