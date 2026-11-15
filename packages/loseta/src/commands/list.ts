import { defineCommand } from "citty";
import pc from "picocolors";
import {
  experimentalComponents,
  loadRegistry,
  stableComponents
} from "../registry.js";
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
    }
  },
  run({ args }) {
    const registry = loadRegistry();
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
      console.log(`\n${pc.bold("Experimental (Nova only)")}`);
      printItems(experimental);
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
