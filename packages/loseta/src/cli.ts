import { defineCommand, runMain } from "citty";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { styleCommand } from "./commands/style.js";
import { PACKAGE_DESCRIPTION, PACKAGE_VERSION } from "./package-info.js";

process.stdout.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EPIPE") {
    process.exit(0);
  }
  throw error;
});

const main = defineCommand({
  meta: {
    name: "loseta",
    version: PACKAGE_VERSION,
    description: PACKAGE_DESCRIPTION ?? "Native CSS component scaffolds."
  },
  subCommands: {
    init: initCommand,
    add: addCommand,
    style: styleCommand,
    list: listCommand
  }
});

runMain(main);
