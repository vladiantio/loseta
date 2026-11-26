import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { styleCommand } from "./commands/style.js";
import {
  formatCommandHelp,
  formatRootHelp,
  parseCommandArgs,
  type CommandArguments,
  type CommandDefinition
} from "./command.js";
import { PACKAGE_DESCRIPTION, PACKAGE_VERSION } from "./package-info.js";

process.stdout.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EPIPE") {
    process.exit(0);
  }
  throw error;
});

const commands = [initCommand, addCommand, styleCommand, listCommand];
const cliMeta = {
  name: "loseta",
  version: PACKAGE_VERSION,
  description: PACKAGE_DESCRIPTION ?? "Native CSS component scaffolds."
};

function reportError(message: string): void {
  console.error(`Error: ${message}`);
  process.exitCode = 1;
}

async function runCommand<Definitions extends CommandArguments>(
  command: CommandDefinition<Definitions>,
  argv: string[]
): Promise<void> {
  let args;
  try {
    args = parseCommandArgs(command.args, argv);
  } catch (error) {
    reportError(error instanceof Error ? error.message : String(error));
    return;
  }

  if (args.help) {
    console.log(formatCommandHelp(command));
    return;
  }

  await command.run({ args });
}

async function main(): Promise<void> {
  const [name, ...argv] = process.argv.slice(2);

  if (!name || name === "--help" || name === "-h") {
    console.log(formatRootHelp(commands, cliMeta));
    return;
  }
  if (name === "--version" || name === "-v") {
    console.log(PACKAGE_VERSION);
    return;
  }
  if (name === "help") {
    const target = argv[0];
    const command = commands.find((entry) => entry.meta.name === target);
    if (!target) {
      console.log(formatRootHelp(commands, cliMeta));
    } else if (command) {
      console.log(formatCommandHelp(command));
    } else {
      reportError(`Unknown command "${target}".`);
    }
    return;
  }

  switch (name) {
    case "init":
      await runCommand(initCommand, argv);
      return;
    case "add":
      await runCommand(addCommand, argv);
      return;
    case "style":
      await runCommand(styleCommand, argv);
      return;
    case "list":
      await runCommand(listCommand, argv);
      return;
    default:
      reportError(`Unknown command "${name}".`);
      console.error(formatRootHelp(commands, cliMeta));
  }
}

await main();
