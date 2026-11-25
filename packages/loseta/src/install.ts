import { basename, join } from "node:path";
import { behaviorDirPath } from "./config.js";
import { exists, hashContent, hashFile, writeText } from "./fs.js";
import { writeBehaviorIndex, writeIndex } from "./imports.js";
import { upsertManifestItem, writeManifest } from "./manifest.js";
import type { ResolvedRegistryItem } from "./source-types.js";
import type {
  InstallableFile,
  LosetaConfig,
  Manifest,
  ManifestFile,
  Registry,
  RegistryBehavior,
  RegistryItemPayload
} from "./types.js";

export type ConflictResolution = "overwrite" | "keep";

export interface InstallOptions {
  projectRoot: string;
  config: LosetaConfig;
  /** Catalog used for diagnostics; files come from the payloads. */
  registry: Registry;
  /** Base URL recorded on the manifest. */
  registryUrl: string;
  /** Registry build recorded on the manifest. */
  build: string;
  manifest: Manifest;
  items: ResolvedRegistryItem[];
  /** Skip behavior files and the generated behavior index. */
  includeBehaviors?: boolean;
  onConflict(
    file: InstallableFile,
    item: RegistryItemPayload
  ): ConflictResolution | Promise<ConflictResolution>;
}

export interface InstallResult {
  manifest: Manifest;
  written: string[];
  skipped: string[];
  installed: string[];
  behaviorsWritten: string[];
  behaviorsSkipped: string[];
}

export interface BehaviorInstallOptions {
  projectRoot: string;
  config: LosetaConfig;
  registry: Registry;
  manifest: Manifest;
  items: ResolvedRegistryItem[];
  onConflict(
    file: RegistryBehavior,
    item: RegistryItemPayload
  ): ConflictResolution | Promise<ConflictResolution>;
}

export interface BehaviorInstallResult {
  manifest: Manifest;
  written: string[];
  skipped: string[];
}

function behaviorTargetPath(
  projectRoot: string,
  config: LosetaConfig,
  behavior: RegistryBehavior
): string {
  return join(behaviorDirPath(projectRoot, config), basename(behavior.target));
}

function initialBehaviorEntries(
  manifest: Manifest,
  registry: Registry
): Set<string> {
  if (manifest.behaviorEntries) {
    return new Set(manifest.behaviorEntries);
  }
  const installed = new Set(manifest.behaviors ?? []);
  const entries = new Set<string>();
  for (const item of registry.items) {
    for (const behavior of item.behaviors ?? []) {
      if (behavior.kind === "entry" && installed.has(behavior.target)) {
        entries.add(behavior.target);
      }
    }
  }
  return entries;
}

async function installBehaviorFiles(input: {
  projectRoot: string;
  config: LosetaConfig;
  items: ResolvedRegistryItem[];
  installed: Set<string>;
  entries: Set<string>;
  onConflict(
    file: RegistryBehavior,
    item: RegistryItemPayload
  ): ConflictResolution | Promise<ConflictResolution>;
}): Promise<{ written: string[]; skipped: string[] }> {
  const written: string[] = [];
  const skipped: string[] = [];

  for (const { item } of input.items) {
    for (const behavior of item.behaviors ?? []) {
      const content = behavior.content;
      if (content === undefined) {
        throw new Error(`${item.name}: behavior ${behavior.path} has no content`);
      }
      const target = behaviorTargetPath(input.projectRoot, input.config, behavior);
      const sourceHash = hashContent(content);
      const targetHash = exists(target) ? hashFile(target) : undefined;

      let shouldCopy = true;
      if (targetHash !== undefined) {
        if (targetHash === sourceHash) {
          shouldCopy = false;
        } else {
          shouldCopy = (await input.onConflict(behavior, item)) === "overwrite";
        }
      }

      if (shouldCopy) {
        writeText(target, content);
        written.push(behavior.target);
      } else {
        skipped.push(behavior.target);
      }

      input.installed.add(behavior.target);
      if (behavior.kind === "entry") {
        input.entries.add(behavior.target);
      }
    }
  }

  return { written, skipped };
}

/**
 * Writes the resolved item payloads, updates the manifest and regenerates
 * index.css. Identical files are skipped without consulting onConflict; a
 * conflict is a target whose hash differs from the registry payload.
 */
export async function installItems({
  projectRoot,
  config,
  registry,
  registryUrl,
  build,
  manifest: currentManifest,
  items,
  includeBehaviors = true,
  onConflict
}: InstallOptions): Promise<InstallResult> {
  const entries = initialBehaviorEntries(currentManifest, registry);
  const manifest: Manifest = {
    registry: { url: registryUrl, build },
    items: [...currentManifest.items],
    behaviors: [...(currentManifest.behaviors ?? [])],
    behaviorEntries: [...entries]
  };
  const written: string[] = [];
  const skipped: string[] = [];

  for (const resolved of items) {
    const item = resolved.item;
    const files: ManifestFile[] = [];

    for (const file of item.files) {
      if (file.content === undefined) {
        throw new Error(`${item.name}: file ${file.path} has no content`);
      }
      const sourceHash = hashContent(file.content);
      const absolute = join(projectRoot, config.cssDir, file.target);
      const targetHash = exists(absolute) ? hashFile(absolute) : undefined;

      let shouldCopy = true;
      if (targetHash !== undefined) {
        if (targetHash === sourceHash) {
          shouldCopy = false;
        } else {
          shouldCopy = (await onConflict(file, item)) === "overwrite";
        }
      }

      if (shouldCopy) {
        writeText(absolute, file.content);
        written.push(file.target);
      } else {
        skipped.push(file.target);
      }

      files.push({ path: file.target, hash: hashFile(absolute) });
    }

    upsertManifestItem(manifest, {
      name: item.name,
      ...(resolved.source ? { source: resolved.source } : {}),
      files
    });
  }

  let behaviorsWritten: string[] = [];
  let behaviorsSkipped: string[] = [];
  if (includeBehaviors) {
    const installed = new Set(manifest.behaviors ?? []);
    const result = await installBehaviorFiles({
      projectRoot,
      config,
      items,
      installed,
      entries,
      onConflict
    });
    behaviorsWritten = result.written;
    behaviorsSkipped = result.skipped;
    written.push(...result.written);
    skipped.push(...result.skipped);
    manifest.behaviors = [...installed].sort();
    manifest.behaviorEntries = [...entries].sort();
  }

  writeManifest(projectRoot, manifest);
  writeIndex(projectRoot, config, manifest, registry);
  if (includeBehaviors) {
    writeBehaviorIndex(projectRoot, config, manifest.behaviorEntries ?? []);
  }

  return {
    manifest,
    written,
    skipped,
    installed: items.map(({ item }) => item.name),
    behaviorsWritten,
    behaviorsSkipped
  };
}

/** Backfills behavior files for items that are already tracked. */
export async function installBehaviors({
  projectRoot,
  config,
  registry,
  manifest: currentManifest,
  items,
  onConflict
}: BehaviorInstallOptions): Promise<BehaviorInstallResult> {
  const entries = initialBehaviorEntries(currentManifest, registry);
  const manifest: Manifest = {
    ...(currentManifest.registry ? { registry: currentManifest.registry } : {}),
    items: [...currentManifest.items],
    behaviors: [...(currentManifest.behaviors ?? [])],
    behaviorEntries: [...entries]
  };
  const installed = new Set(manifest.behaviors ?? []);
  const result = await installBehaviorFiles({
    projectRoot,
    config,
    items,
    installed,
    entries,
    onConflict
  });

  manifest.behaviors = [...installed].sort();
  manifest.behaviorEntries = [...entries].sort();
  writeManifest(projectRoot, manifest);
  writeBehaviorIndex(projectRoot, config, manifest.behaviorEntries ?? []);

  return { manifest, ...result };
}
