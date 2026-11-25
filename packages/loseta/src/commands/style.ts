import { defineCommand } from "citty";
import { intro, log, outro } from "@clack/prompts";
import { ConfigError, readConfig } from "../config.js";
import { noCacheFlag, openRegistry } from "../command-context.js";
import { reportCommandError } from "../command-errors.js";
import { readManifest } from "../manifest.js";
import { resolveRegistryItems } from "../resolve.js";
import { applyStyleSwitch, resolveStyleSwitch } from "../style-switch.js";
import type { LosetaConfig } from "../types.js";

export const styleCommand = defineCommand({
  meta: {
    name: "style",
    description: "Switch the visual style of installed components."
  },
  args: {
    registry: {
      type: "string",
      description: "Registry base URL"
    },
    noCache: {
      type: "boolean",
      description: "Bypass the registry cache"
    }
  },
  async run({ args }) {
    const projectRoot = process.cwd();
    let config: LosetaConfig | undefined;
    try {
      config = readConfig(projectRoot);
    } catch (error) {
      if (error instanceof ConfigError) {
        log.error(error.message);
        process.exitCode = 1;
        return;
      }
      throw error;
    }
    if (!config) {
      log.error("loseta.json not found. Run `loseta init` first.");
      process.exitCode = 1;
      return;
    }

    const manifest = readManifest(projectRoot);
    if (!manifest) {
      log.error(".loseta/manifest.json not found. Run `loseta init` first.");
      process.exitCode = 1;
      return;
    }

    let session;
    try {
      session = await openRegistry({
        registry: args.registry,
        noCache: noCacheFlag(args as unknown as Record<string, unknown>),
        configRegistry: config.registry
      });
    } catch (error) {
      reportCommandError(error);
      return;
    }
    const { url: registryUrl, source, catalog } = session;

    const name = String(args._[0] ?? "");
    const resolution = resolveStyleSwitch(catalog, manifest, config, name);
    if (resolution.status === "error") {
      log.error(resolution.message);
      process.exitCode = 1;
      return;
    }
    if (resolution.status === "noop") {
      log.info(resolution.message);
      return;
    }

    intro(`loseta style ${resolution.plan.nextConfig.style}`);
    let items;
    try {
      items = await resolveRegistryItems(
        resolution.plan.items.map((item) => item.name),
        {
          source,
          catalog,
          style: resolution.plan.nextConfig.style,
          experimental: resolution.plan.nextConfig.style === "nova",
          includeDependencies: false
        }
      );
    } catch (error) {
      reportCommandError(error);
      return;
    }

    let applied;
    try {
      applied = await applyStyleSwitch({
        projectRoot,
        registry: catalog,
        registryUrl,
        build: catalog.build,
        manifest,
        plan: resolution.plan,
        items
      });
    } catch (error) {
      reportCommandError(error);
      return;
    }
    const { result, kept } = applied;

    log.success(
      `Switched from "${resolution.plan.previous}" to "${resolution.plan.nextConfig.style}" (${result.written.length} file(s) written).`
    );
    if (kept.length > 0) {
      log.warn(`Kept locally modified base files: ${[...new Set(kept)].join(", ")}.`);
    }
    log.info(
      `The "${resolution.plan.previous}" style files remain under ${config.cssDir}/styles/${resolution.plan.previous}/ and are no longer imported.`
    );
    outro("Done.");
  }
});
