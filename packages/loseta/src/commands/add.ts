import { defineCommand } from "citty";
import { cancel, confirm, intro, isCancel, log, outro } from "@clack/prompts";
import { join } from "node:path";
import { resolveAddNames } from "../add-policy.js";
import { behaviorDir, ConfigError, readConfig } from "../config.js";
import { readTextIfExists } from "../fs.js";
import { installBehaviors, installItems } from "../install.js";
import { installedNames, readManifest } from "../manifest.js";
import {
  experimentalComponents,
  findItem,
  loadRegistry,
  missingFoundation,
  registryDir,
  resolveItems,
  stableComponents
} from "../registry.js";
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

    const registry = loadRegistry();
    const installed = installedNames(manifest);
    const missing = missingFoundation(registry, installed);
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
      printItems(stableComponents(registry));
      if (experimentalComponents(registry).length > 0) {
        log.info(
          "Experimental components are Nova-only. Run `loseta list --experimental` and add them with `--experimental`."
        );
      }
      outro("Run `loseta add <component...>` or `loseta add all`.");
      return;
    }

    const selection = resolveAddNames(registry, names, {
      experimental: Boolean(args.experimental),
      style: config.style
    });
    if ("error" in selection) {
      log.error(selection.error);
      process.exitCode = 1;
      return;
    }

    const styleResolution = resolveAddStyle(registry, config, args.style);
    if ("error" in styleResolution) {
      log.error(styleResolution.error);
      process.exitCode = 1;
      return;
    }

    if (args.behavior && args.noBehavior) {
      log.error("`--behavior` and `--no-behavior` cannot be used together.");
      process.exitCode = 1;
      return;
    }

    let resolved;
    if (args.noDeps) {
      resolved = selection.names.map((name) => findItem(registry, name));
      const missing = resolved
        .flatMap((item) => item.registryDependencies ?? [])
        .filter((dependency) => !installed.has(dependency));
      if (missing.length > 0) {
        log.warn(`--no-deps: missing ${[...new Set(missing)].join(", ")}. The component may not work.`);
      }
    } else {
      resolved = resolveItems(registry, selection.names);
    }

    const experimentalResolved = resolved
      .filter((item) => item.status === "experimental")
      .map((item) => item.name);
    if (experimentalResolved.length > 0) {
      log.warn(
        `Experimental: ${experimentalResolved.join(", ")}. Nova-only and outside the v1 contract.`
      );
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

    const behaviorOnly =
      Boolean(args.behavior) &&
      selection.names.every((name) => installed.has(name));

    if (behaviorOnly) {
      const result = await installBehaviors({
        projectRoot,
        config,
        registry,
        sourceRoot: registryDir,
        manifest,
        items: resolved,
        onConflict
      });
      const withBehavior = resolved
        .filter((item) => (item.behaviors ?? []).length > 0)
        .filter((item) => item.type === "component")
        .map((item) => item.name);

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

    const result = await installItems({
      projectRoot,
      config,
      registry,
      sourceRoot: registryDir,
      manifest,
      items: resolved,
      includeBehaviors: !args.noBehavior,
      onConflict
    });

    const added = resolved.filter((item) => item.type === "component").map((item) => item.name);
    const primitives = resolved
      .filter((item) => item.type === "primitive")
      .map((item) => item.name);

    log.success(`Added ${installedSummary(added)}.`);
    if (primitives.length > 0) {
      log.info(`Installed dependencies: ${primitives.join(", ")}.`);
    }
    log.info(`${result.written.length} file(s) written, ${result.skipped.length} skipped.`);

    if (!args.noBehavior && result.behaviorsWritten.length > 0) {
      log.info(
        `Add <script type="module" src="/${behaviorDir(config)}/index.js"></script> to your page.`
      );
    }

    if (args.html) {
      for (const name of added) {
        const example = readTextIfExists(join(registryDir, "examples", `${name}.html`));
        if (example === undefined) {
          log.warn(`No example HTML for ${name} yet.`);
          continue;
        }
        console.log(`\n<!-- ${name} -->\n${example.trim()}\n`);
      }
    }

    outro("Done.");
  }
});
