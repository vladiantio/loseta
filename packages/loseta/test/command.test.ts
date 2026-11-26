import assert from "node:assert/strict";
import { test } from "node:test";
import {
  defineCommand,
  formatCommandHelp,
  formatRootHelp,
  parseCommandArgs
} from "../src/command.js";

const command = defineCommand({
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
    noBehavior: {
      type: "boolean",
      description: "Skip behavior modules"
    },
    style: {
      type: "string",
      description: "Style to use"
    },
    yes: {
      type: "boolean",
      description: "Skip prompts",
      alias: "y"
    }
  },
  async run() {}
});

test("parses long options, aliases and positionals", () => {
  assert.deepEqual(
    parseCommandArgs(command.args, [
      "button",
      "--no-behavior",
      "--style=vega",
      "-y"
    ]),
    {
      _: ["button"],
      noBehavior: true,
      style: "vega",
      yes: true,
      help: false
    }
  );
});

test("parses options after positionals and the option terminator", () => {
  assert.deepEqual(
    parseCommandArgs(command.args, [
      "button",
      "-o",
      "--",
      "--literal-item"
    ]),
    {
      _: ["button", "--literal-item"],
      overwrite: true,
      help: false
    }
  );
});

test("recognizes the shared help flag", () => {
  assert.equal(parseCommandArgs(command.args, ["-h"]).help, true);
});

test("rejects unknown options and missing string values", () => {
  assert.throws(
    () => parseCommandArgs(command.args, ["--unknown"]),
    { code: "ERR_PARSE_ARGS_UNKNOWN_OPTION" }
  );
  assert.throws(
    () => parseCommandArgs(command.args, ["--style"]),
    { code: "ERR_PARSE_ARGS_INVALID_OPTION_VALUE" }
  );
});

test("formats command and root help", () => {
  const commandHelp = formatCommandHelp(command);
  assert.match(commandHelp, /Usage: loseta add \[options\]/);
  assert.match(commandHelp, /-y, --yes/);
  assert.match(commandHelp, /--no-behavior/);

  const rootHelp = formatRootHelp([command], {
    name: "loseta",
    version: "1.2.3",
    description: "Native CSS component scaffolds."
  });
  assert.match(rootHelp, /loseta 1\.2\.3/);
  assert.match(rootHelp, /add\s+Add components/);
  assert.match(rootHelp, /--version/);
});
