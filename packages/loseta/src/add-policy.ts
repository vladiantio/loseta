import { stableComponents } from "./registry.js";
import type { Registry } from "./types.js";

export type AddNamesResolution =
  | { names: string[]; experimental: string[] }
  | { error: string };

/**
 * Resolves the names passed to `add` against the registry and the
 * experimental opt-in. Pure so the CLI policy is testable without a project.
 */
export function resolveAddNames(
  registry: Registry,
  rawNames: string[],
  options: { experimental: boolean; style: string }
): AddNamesResolution {
  if (rawNames.includes("all")) {
    if (options.experimental) {
      return {
        error:
          "Experimental items must be added by name. Run `loseta add <name> --experimental`."
      };
    }
    return {
      names: stableComponents(registry).map((item) => item.name),
      experimental: []
    };
  }

  const items = new Map(registry.items.map((item) => [item.name, item]));
  const experimental: string[] = [];

  for (const name of rawNames) {
    const item = items.get(name);
    if (!item) {
      return {
        error: `Unknown item: ${name}. Run \`loseta list\` to see available components.`
      };
    }
    if (item.type !== "component") {
      return {
        error: `${name} is a ${item.type} and cannot be added directly. Dependencies are installed automatically.`
      };
    }
    if (item.status === "experimental") {
      if (!options.experimental) {
        return {
          error: `${name} is experimental. Re-run with \`--experimental\`. Experimental items are Nova-only and outside the v1 contract.`
        };
      }
      if (options.style !== "nova") {
        return {
          error: `Experimental items are Nova-only. This project uses the "${options.style}" style; switch to Nova or wait for ${name} to be promoted.`
        };
      }
      experimental.push(name);
    }
  }

  if (options.experimental && experimental.length === 0) {
    return {
      error: "`--experimental` only applies to experimental components."
    };
  }

  return { names: rawNames, experimental };
}
