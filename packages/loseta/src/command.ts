import { parseArgs } from "node:util";

export interface CommandArgument {
  type: "boolean" | "string";
  description: string;
  alias?: string;
}

export type CommandArguments = Record<string, CommandArgument>;

type ArgumentValue<Definition> = Definition extends { type: "string" }
  ? string
  : boolean;

export type CommandArgs<Definitions extends CommandArguments> = {
  [Name in keyof Definitions]?: ArgumentValue<Definitions[Name]>;
} & { _: string[] };

export type ParsedCommandArgs<Definitions extends CommandArguments> =
  CommandArgs<Definitions> & { help: boolean };

export interface CommandDefinition<Definitions extends CommandArguments> {
  meta: {
    name: string;
    description: string;
  };
  args: Definitions;
  run(context: { args: CommandArgs<Definitions> }): void | Promise<void>;
}

interface CommandHelp {
  meta: {
    name: string;
    description: string;
  };
  args: CommandArguments;
}

/** Declares a command without introducing a CLI framework dependency. */
export function defineCommand<const Definitions extends CommandArguments>(
  definition: CommandDefinition<Definitions>
): CommandDefinition<Definitions> {
  return definition;
}

function kebabCase(name: string): string {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function camelCase(name: string): string {
  return name.replace(/-([a-z])/g, (_match, letter: string) =>
    letter.toUpperCase()
  );
}

/** Parses one subcommand's arguments while preserving its typed definition. */
export function parseCommandArgs<Definitions extends CommandArguments>(
  definitions: Definitions,
  argv: string[]
): ParsedCommandArgs<Definitions> {
  const options: Record<
    string,
    { type: "boolean" | "string"; short?: string }
  > = { help: { type: "boolean", short: "h" } };

  for (const [name, definition] of Object.entries(definitions)) {
    options[kebabCase(name)] = {
      type: definition.type,
      ...(definition.alias ? { short: definition.alias } : {})
    };
  }

  const { values, positionals } = parseArgs({
    args: argv,
    options,
    allowPositionals: true,
    strict: true
  });
  const args: Record<string, unknown> = { _: positionals };
  for (const [name, value] of Object.entries(values)) {
    if (name !== "help") args[camelCase(name)] = value;
  }

  return {
    ...args,
    help: values.help === true
  } as ParsedCommandArgs<Definitions>;
}

function formatOption(name: string, definition: CommandArgument): string {
  const alias = definition.alias ? `-${definition.alias}, ` : "    ";
  const value = definition.type === "string" ? " <value>" : "";
  return `  ${alias}--${kebabCase(name)}${value}`.padEnd(32) +
    definition.description;
}

export function formatCommandHelp(command: CommandHelp): string {
  return [
    `loseta ${command.meta.name}`,
    "",
    command.meta.description,
    "",
    `Usage: loseta ${command.meta.name} [options]`,
    "",
    "Options:",
    ...Object.entries(command.args).map(([name, definition]) =>
      formatOption(name, definition)
    ),
    formatOption("help", { type: "boolean", description: "Show this help", alias: "h" })
  ].join("\n");
}

export function formatRootHelp(
  commands: readonly CommandHelp[],
  meta: { name: string; version: string; description: string }
): string {
  return [
    `${meta.name} ${meta.version}`,
    "",
    meta.description,
    "",
    "Usage: loseta <command> [options]",
    "",
    "Commands:",
    ...commands.map(
      (command) =>
        `  ${command.meta.name.padEnd(12)}${command.meta.description}`
    ),
    "",
    "Options:",
    "  -h, --help".padEnd(32) + "Show this help",
    "  -v, --version".padEnd(32) + "Show version"
  ].join("\n");
}
