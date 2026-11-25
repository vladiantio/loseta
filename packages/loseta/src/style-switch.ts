import { writeConfig } from "./config.js";
import { installItems } from "./install.js";
import type { InstallResult } from "./install.js";
import { installedNames } from "./manifest.js";
import { availableStyles, isStyleName } from "./registry.js";
import type { ResolvedRegistryItem } from "./source-types.js";
import type { LosetaConfig, Manifest, Registry, RegistryItem } from "./types.js";

export interface StyleSwitchPlan {
  previous: string;
  nextConfig: LosetaConfig;
  items: RegistryItem[];
}

export type StyleSwitchResolution =
  | { status: "error"; message: string }
  | { status: "noop"; message: string }
  | { status: "switch"; plan: StyleSwitchPlan };

/**
 * Decides whether `loseta style <name>` can run. Pure: no filesystem access,
 * so the command policy is testable without a project.
 */
export function resolveStyleSwitch(
  registry: Registry,
  manifest: Manifest,
  config: LosetaConfig,
  name: string | undefined
): StyleSwitchResolution {
  const available = availableStyles(registry);
  if (!name) {
    return {
      status: "error",
      message: `Usage: loseta style <name>. Available styles: ${available.join(", ")}.`
    };
  }
  if (!isStyleName(registry, name)) {
    return {
      status: "error",
      message: `Unknown style: ${name}. Available styles: ${available.join(", ")}.`
    };
  }
  if (name === config.style) {
    return {
      status: "noop",
      message: `This project already uses the "${name}" style.`
    };
  }

  const installed = installedNames(manifest);
  const items = registry.items.filter(
    (item) =>
      installed.has(item.name) &&
      (item.type === "component" || item.type === "primitive")
  );
  if (items.length === 0) {
    return {
      status: "error",
      message: "No components are installed yet. Run `loseta add <component>` first."
    };
  }

  const urlItems = manifest.items
    .filter((item) => item.source)
    .map((item) => item.name);
  if (urlItems.length > 0) {
    return {
      status: "error",
      message: `Style switching is not available while URL-installed items are present: ${urlItems.join(
        ", "
      )}. Remove them or reinstall them from the official registry first.`
    };
  }

  if (name !== "nova") {
    const experimental = items
      .filter((item) => item.status === "experimental")
      .map((item) => item.name);
    if (experimental.length > 0) {
      return {
        status: "error",
        message: `Experimental components are Nova-only: ${experimental.join(
          ", "
        )}. Delete their files and manifest entries before switching styles, or stay on Nova.`
      };
    }
  }

  return {
    status: "switch",
    plan: {
      previous: config.style,
      nextConfig: { ...config, style: name },
      items
    }
  };
}

export interface StyleSwitchResult {
  result: InstallResult;
  kept: string[];
}

/**
 * Applies a resolved style switch: writes the new style files, keeps modified
 * base files, and records the new style in loseta.json.
 */
export async function applyStyleSwitch(input: {
  projectRoot: string;
  registry: Registry;
  registryUrl: string;
  build: string;
  manifest: Manifest;
  plan: StyleSwitchPlan;
  items: ResolvedRegistryItem[];
}): Promise<StyleSwitchResult> {
  const kept: string[] = [];
  const result = await installItems({
    projectRoot: input.projectRoot,
    config: input.plan.nextConfig,
    registry: input.registry,
    registryUrl: input.registryUrl,
    build: input.build,
    manifest: input.manifest,
    items: input.items,
    includeBehaviors: false,
    onConflict: (file) => {
      if ("role" in file && file.role === "style") return "overwrite";
      kept.push(file.target);
      return "keep";
    }
  });
  writeConfig(input.projectRoot, input.plan.nextConfig);
  return { result, kept };
}
