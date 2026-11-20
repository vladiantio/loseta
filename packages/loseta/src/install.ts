import { basename, join, resolve } from "node:path";
import { behaviorDirPath } from "./config.js";
import { copyFile, exists, hashFile } from "./fs.js";
import { writeBehaviorIndex, writeIndex } from "./imports.js";
import { installedNames, upsertManifestItem, writeManifest } from "./manifest.js";
import type {
  InstallableFile,
  LosetaConfig,
  Manifest,
  ManifestFile,
  Registry,
  RegistryBehavior,
  RegistryFile,
  RegistryItem
} from "./types.js";

export type ConflictResolution = "overwrite" | "keep";

export interface InstallOptions {
  projectRoot: string;
  config: LosetaConfig;
  registry: Registry;
  /** Absolute path to the registry files. Injectable for tests. */
  sourceRoot: string;
  manifest: Manifest;
  items: RegistryItem[];
  /** Skip behavior files and the generated behavior index. */
  includeBehaviors?: boolean;
  onConflict(
    file: InstallableFile,
    item: RegistryItem
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
  sourceRoot: string;
  manifest: Manifest;
  items: RegistryItem[];
  onConflict(
    file: RegistryBehavior,
    item: RegistryItem
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

async function installBehaviorFiles(input: {
  projectRoot: string;
  config: LosetaConfig;
  sourceRoot: string;
  items: RegistryItem[];
  installed: Set<string>;
  onConflict(
    file: RegistryBehavior,
    item: RegistryItem
  ): ConflictResolution | Promise<ConflictResolution>;
}): Promise<{ written: string[]; skipped: string[] }> {
  const written: string[] = [];
  const skipped: string[] = [];

  for (const item of input.items) {
    for (const behavior of item.behaviors ?? []) {
      const source = join(input.sourceRoot, behavior.path);
      const target = behaviorTargetPath(input.projectRoot, input.config, behavior);
      const sourceHash = hashFile(source);
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
        copyFile(source, target);
        written.push(behavior.target);
      } else {
        skipped.push(behavior.target);
      }

      input.installed.add(behavior.target);
    }
  }

  return { written, skipped };
}

/**
 * Writes the resolved items, updates the manifest and regenerates index.css.
 * Identical files are skipped without consulting onConflict; a conflict is a
 * target whose hash differs from the registry source.
 */
export async function installItems({
  projectRoot,
  config,
  registry,
  sourceRoot,
  manifest: currentManifest,
  items,
  includeBehaviors = true,
  onConflict
}: InstallOptions): Promise<InstallResult> {
  const manifest: Manifest = {
    version: registry.version,
    items: [...currentManifest.items],
    behaviors: [...(currentManifest.behaviors ?? [])]
  };
  const cssDirAbs = resolve(projectRoot, config.cssDir);
  const stylePrefix = `styles/${config.style}/`;
  const written: string[] = [];
  const skipped: string[] = [];

  for (const item of items) {
    const files: ManifestFile[] = [];

    for (const file of item.files) {
      if (file.role === "style" && !file.path.startsWith(stylePrefix)) continue;
      const source = join(sourceRoot, file.path);
      const target = join(cssDirAbs, file.target);
      const sourceHash = hashFile(source);
      const targetHash = exists(target) ? hashFile(target) : undefined;

      let shouldCopy = true;
      if (targetHash !== undefined) {
        if (targetHash === sourceHash) {
          shouldCopy = false;
        } else {
          shouldCopy = (await onConflict(file, item)) === "overwrite";
        }
      }

      if (shouldCopy) {
        copyFile(source, target);
        written.push(file.target);
      } else {
        skipped.push(file.target);
      }

      files.push({ path: file.target, hash: hashFile(target) });
    }

    upsertManifestItem(manifest, {
      name: item.name,
      version: registry.version,
      files
    });
  }

  let behaviorsWritten: string[] = [];
  let behaviorsSkipped: string[] = [];
  if (includeBehaviors) {
    const installedBehaviors = new Set(manifest.behaviors ?? []);
    const result = await installBehaviorFiles({
      projectRoot,
      config,
      sourceRoot,
      items,
      installed: installedBehaviors,
      onConflict
    });
    behaviorsWritten = result.written;
    behaviorsSkipped = result.skipped;
    written.push(...result.written);
    skipped.push(...result.skipped);
    manifest.behaviors = [...installedBehaviors].sort();
  }

  writeManifest(projectRoot, manifest);
  writeIndex(projectRoot, config, registry, installedNames(manifest));
  if (includeBehaviors) {
    writeBehaviorIndex(
      projectRoot,
      config,
      registry,
      new Set(manifest.behaviors ?? [])
    );
  }

  return {
    manifest,
    written,
    skipped,
    installed: items.map((item) => item.name),
    behaviorsWritten,
    behaviorsSkipped
  };
}

/** Copies missing behavior files for already-installed items. */
export async function installBehaviors({
  projectRoot,
  config,
  registry,
  sourceRoot,
  manifest: currentManifest,
  items,
  onConflict
}: BehaviorInstallOptions): Promise<BehaviorInstallResult> {
  const manifest: Manifest = {
    ...currentManifest,
    version: registry.version,
    behaviors: [...(currentManifest.behaviors ?? [])]
  };
  const installed = new Set(manifest.behaviors ?? []);

  const { written, skipped } = await installBehaviorFiles({
    projectRoot,
    config,
    sourceRoot,
    items,
    installed,
    onConflict
  });

  manifest.behaviors = [...installed].sort();
  writeManifest(projectRoot, manifest);
  writeBehaviorIndex(projectRoot, config, registry, installed);

  return { manifest, written, skipped };
}
