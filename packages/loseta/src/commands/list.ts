import { defineCommand } from "citty";
import pc from "picocolors";
import { ConfigError, readConfig } from "../config.js";
import { noCacheFlag, openRegistry } from "../command-context.js";
import { reportCommandError } from "../command-errors.js";
import { experimentalComponents, stableComponents } from "../registry.js";
import { printItems } from "../ui.js";

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "List available components."
  },
  args: {
    all: {
      type: "boolean",
      description: "Include experimental, primitive and foundation items",
      alias: "a"
    },
    experimental: {
      type: "boolean",
      description: "Include experimental components (Nova only)",
      alias: "e"
    },
    json: {
      type: "boolean",
      description: "Print the registry as JSON"
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
    let config;
    try {
      config = readConfig(process.cwd());
    } catch (error) {
      if (error instanceof ConfigError) {
        // `list` works without a project; only a broken config is fatal.
        console.error(error.message);
        process.exitCode = 1;
        return;
      }
      throw error;
    }

    let session;
    try {
      session = await openRegistry({
        registry: args.registry,
        noCache: noCacheFlag(args as unknown as Record<string, unknown>),
        configRegistry: config?.registry,
        onWarning: args.json
          ? (message) => console.error(message)
          : undefined
      });
    } catch (error) {
      reportCommandError(error);
      return;
    }

    const registry = session.catalog;
    const stable = stableComponents(registry);
    const experimental = experimentalComponents(registry);
    const includeExperimental = Boolean(args.all || args.experimental);

    if (args.json) {
      const items = args.all
        ? registry.items
        : includeExperimental
          ? [...stable, ...experimental]
          : stable;
      console.log(JSON.stringify(items, null, 2));
      return;
    }

    console.log(pc.bold("Components"));
    printItems(stable);

    if (includeExperimental) {
      if (experimental.length === 0) {
        console.log(`\n${pc.dim("No experimental components.")}`);
      } else {
        console.log(`\n${pc.bold("Experimental (Nova only)")}`);
        printItems(experimental);
      }
    } else if (experimental.length > 0) {
      console.log(
        `\n${pc.dim(
          `${experimental.length} experimental component(s). Run \`loseta list --experimental\`.`
        )}`
      );
    }

    if (args.all) {
      const primitives = registry.items.filter((item) => item.type === "primitive");
      const foundation = registry.items.filter((item) => item.type === "foundation");
      console.log(`\n${pc.bold("Primitives")}`);
      printItems(primitives);
      console.log(`\n${pc.bold("Foundation")}`);
      printItems(foundation);
    }
  }
});
