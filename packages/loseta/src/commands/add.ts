import { defineCommand } from "citty";
import { cancel, confirm, intro, isCancel, log, outro } from "@clack/prompts";
import { resolveAddNames } from "../add-policy.js";
import { behaviorDir, ConfigError, readConfig } from "../config.js";
import { noCacheFlag, openRegistry } from "../command-context.js";
import { reportCommandError } from "../command-errors.js";
import { installBehaviors, installItems } from "../install.js";
import { installedNames, readManifest } from "../manifest.js";
import { isItemUrl } from "../registry-url.js";
import {
  experimentalComponents,
  missingFoundation,
  stableComponents
} from "../registry.js";
import { resolveRegistryItems } from "../resolve.js";
import { resolveAddStyle } from "../style-selection.js";
import type { LosetaConfig } from "../types.js";
import { installedSummary, printItems } from "../ui.js";

export const addCommand = defineCommand({
  meta: {
    name: "add",
    description: "Add components to your project."
  },
  args: {
    overwrite: {
      type: "boolean",
      description: "Overwrite existing files without prompting",
      alias: "o"
    },
    noDeps: {
      type: "boolean",
      description: "Do not install registry dependencies"
    },
    behavior: {
      type: "boolean",
      description: "Install missing behavior modules for already-installed items"
    },
    noBehavior: {
      type: "boolean",
      description: "Skip behavior modules and do not update behaviors/index.js"
    },
    experimental: {
      type: "boolean",
      description: "Add experimental components (Nova only, outside the v1 contract)"
    },
    html: {
      type: "boolean",
      description: "Print the example HTML for the added components"
    },
    style: {
      type: "string",
      description: "Style to use (must match loseta.json)"
    },
    yes: {
      type: "boolean",
      description: "Skip prompts; keep modified files untouched",
      alias: "y"
    },
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

    const installed = installedNames(manifest);
    const missing = missingFoundation(catalog, installed);
    if (missing.length > 0) {
      log.error(
        `The loseta foundation is incomplete (missing: ${missing.join(", ")}). Run \`loseta init\`.`
      );
      process.exitCode = 1;
      return;
    }

    const names = args._.map(String);
    if (names.length === 0) {
      intro("loseta add");
      printItems(stableComponents(catalog));
      if (experimentalComponents(catalog).length > 0) {
        log.info(
          "Experimental components are Nova-only. Run `loseta list --experimental` and add them with `--experimental`."
        );
      }
      outro("Run `loseta add <component...>` or `loseta add all`.");
      return;
    }

    const urlNames = names.filter((name) => isItemUrl(name));
    const bareNames = names.filter((name) => !isItemUrl(name));

    let selection: { names: string[]; experimental: string[] } = {
      names: [],
      experimental: []
    };
    if (bareNames.length > 0) {
      const hasExperimentalBare = bareNames.some(
        (name) =>
          catalog.items.find((item) => item.name === name)?.status ===
          "experimental"
      );
      // `--experimental` may be aimed at a URL item; do not reject it just
      // because the bare-name list happens to be stable.
      const experimentalFlag =
        Boolean(args.experimental) &&
        (hasExperimentalBare || urlNames.length === 0);
      const resolution = resolveAddNames(catalog, bareNames, {
        experimental: experimentalFlag,
        style: config.style
      });
      if ("error" in resolution) {
        log.error(resolution.error);
        process.exitCode = 1;
        return;
      }
      selection = resolution;
    }

    const styleResolution = resolveAddStyle(catalog, config, args.style);
    if ("error" in styleResolution) {
      log.error(styleResolution.error);
      process.exitCode = 1;
      return;
    }

    const noBehavior = Boolean(args.noBehavior) || args.behavior === false;
    const behaviorRequested = args.behavior === true;
    const noDeps =
      Boolean(args.noDeps) ||
      (args as unknown as { deps?: boolean }).deps === false;
    if (behaviorRequested && noBehavior) {
      log.error("`--behavior` and `--no-behavior` cannot be used together.");
      process.exitCode = 1;
      return;
    }

    if (manifest.registry?.build && manifest.registry.build !== catalog.build) {
      log.warn(
        `The registry has changed since this project was installed (${manifest.registry.build} -> ${catalog.build}). Files you modified are kept unless you choose to overwrite them.`
      );
    }

    const behaviorOnly =
      behaviorRequested &&
      urlNames.length === 0 &&
      selection.names.length > 0 &&
      selection.names.every((name) => installed.has(name));

    const requested = behaviorOnly
      ? selection.names.map(
          (name) =>
            manifest.items.find((item) => item.name === name)?.source ?? name
        )
      : [...selection.names, ...urlNames];

    let resolved;
    try {
      resolved = await resolveRegistryItems(requested, {
        source,
        catalog,
        style: config.style,
        experimental: Boolean(args.experimental),
        includeDependencies: !noDeps
      });
    } catch (error) {
      reportCommandError(error);
      return;
    }

    if (noDeps) {
      const resolvedNames = new Set(resolved.map(({ item }) => item.name));
      const missingDependencies = [
        ...new Set(
          resolved.flatMap(({ item }) =>
            (item.registryDependencies ?? []).filter(
              (dependency) =>
                !isItemUrl(dependency) &&
                !resolvedNames.has(dependency) &&
                !installed.has(dependency)
            )
          )
        )
      ];
      if (missingDependencies.length > 0) {
        log.warn(
          `--no-deps: missing ${missingDependencies.join(", ")}. The component may not work.`
        );
      }
    }

    const experimentalResolved = resolved
      .filter(({ item }) => item.status === "experimental")
      .map(({ item }) => item.name);
    if (experimentalResolved.length > 0) {
      log.warn(
        `Experimental: ${experimentalResolved.join(", ")}. Nova-only and outside the v1 contract.`
      );
    }

    const urlItems = resolved.filter(({ source: itemSource }) => itemSource);
    if (urlItems.length > 0) {
      for (const { item, source: itemSource } of urlItems) {
        log.info(`URL install: ${item.name} from ${itemSource}`);
        log.info(`Files: ${item.files.map((file) => file.target).join(", ")}`);
        if (!noBehavior && (item.behaviors ?? []).length > 0) {
          log.info(
            `Behavior: ${(item.behaviors ?? [])
              .map((behavior) => behavior.target)
              .join(", ")}`
          );
        }
      }
      if (!args.yes) {
        const proceed = await confirm({
          message: `Install ${urlItems.length} item(s) from external URLs?`,
          initialValue: false
        });
        if (isCancel(proceed) || !proceed) {
          cancel("Cancelled.");
          return;
        }
      }
    }

    for (const resolvedItem of resolved) {
      const installedItem = manifest.items.find(
        (entry) => entry.name === resolvedItem.item.name
      );
      if (!installedItem) continue;
      if ((installedItem.source ?? undefined) === (resolvedItem.source ?? undefined)) {
        continue;
      }
      const from = installedItem.source ?? catalog.name;
      const to = resolvedItem.source ?? catalog.name;
      if (args.yes) {
        if (!args.overwrite) {
          log.error(
            `${resolvedItem.item.name} is already installed from ${from}. Re-run with --overwrite to replace it with ${to}.`
          );
          process.exitCode = 1;
          return;
        }
        continue;
      }
      const answer = await confirm({
        message: `Replace ${resolvedItem.item.name} (${from}) with the version from ${to}?`,
        initialValue: false
      });
      if (isCancel(answer) || !answer) {
        cancel("Cancelled.");
        return;
      }
    }

    const onConflict = async (file: { target: string }) => {
      if (args.overwrite) return "overwrite" as const;
      if (args.yes) {
        log.warn(`Keeping modified file: ${file.target}`);
        return "keep" as const;
      }

      const answer = await confirm({
        message: `Overwrite ${file.target}?`,
        initialValue: false
      });
      return !isCancel(answer) && Boolean(answer) ? "overwrite" as const : "keep" as const;
    };

    if (behaviorOnly) {
      let result;
      try {
        result = await installBehaviors({
          projectRoot,
          config,
          registry: catalog,
          manifest,
          items: resolved,
          onConflict
        });
      } catch (error) {
        reportCommandError(error);
        return;
      }
      const withBehavior = resolved
        .filter(({ item }) => (item.behaviors ?? []).length > 0)
        .filter(({ item }) => item.type === "component")
        .map(({ item }) => item.name);

      if (result.written.length === 0) {
        log.info("Behavior is already installed.");
      } else {
        log.success(`Added behavior for ${installedSummary(withBehavior)}.`);
        log.info(
          `${result.written.length} behavior file(s) written, ${result.skipped.length} skipped.`
        );
        log.info(
          `Add <script type="module" src="/${behaviorDir(config)}/index.js"></script> to your page.`
        );
      }

      outro("Done.");
      return;
    }

    let result;
    try {
      result = await installItems({
        projectRoot,
        config,
        registry: catalog,
        registryUrl,
        build: catalog.build,
        manifest,
        items: resolved,
        includeBehaviors: !noBehavior,
        onConflict
      });
    } catch (error) {
      reportCommandError(error);
      return;
    }

    const added = resolved
      .filter(({ item }) => item.type === "component")
      .map(({ item }) => item.name);
    const primitives = resolved
      .filter(({ item }) => item.type === "primitive")
      .map(({ item }) => item.name);

    log.success(`Added ${installedSummary(added)}.`);
    if (primitives.length > 0) {
      log.info(`Installed dependencies: ${primitives.join(", ")}.`);
    }
    log.info(`${result.written.length} file(s) written, ${result.skipped.length} skipped.`);

    if (!noBehavior && result.behaviorsWritten.length > 0) {
      log.info(
        `Add <script type="module" src="/${behaviorDir(config)}/index.js"></script> to your page.`
      );
    }

    if (args.html) {
      for (const name of added) {
        const payload = resolved.find(({ item }) => item.name === name)?.item;
        const examples = payload?.examples ?? [];
        if (examples.length === 0) {
          log.warn(`No example HTML for ${name} yet.`);
          continue;
        }
        for (const example of examples) {
          console.log(`\n<!-- ${name}: ${example.title} -->\n${example.html.trim()}\n`);
        }
      }
    }

    outro("Done.");
  }
});
