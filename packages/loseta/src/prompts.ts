/**
 * TopCli renders prompts but leaves terminal raw-mode restoration to the caller.
 * Keep Ctrl-C handling, cleanup, zero-column fallback, placeholder and
 * initial-selection adaptation here; prompts-pty.test.ts covers the contract.
 */
import {
  confirm as promptConfirm,
  question as promptQuestion,
  select as promptSelect
} from "@topcli/prompts";
import { pc } from "./colors.js";

const CANCEL = Symbol("loseta.cancel");

export type Cancel = typeof CANCEL;

interface Keypress {
  name?: string;
  ctrl?: boolean;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

async function withPrompt<T>(
  prompt: (signal: AbortSignal) => Promise<T>
): Promise<T | Cancel> {
  const controller = new AbortController();
  const wasRaw = Boolean(process.stdin.isRaw);
  if (process.stdout.isTTY && !process.stdout.columns) {
    process.stdout.columns = 80;
  }
  const onKeypress = (_value: string, key: Keypress) => {
    if (key.ctrl && key.name === "c") {
      queueMicrotask(() => controller.abort());
    }
  };
  const onSigint = () => controller.abort();

  process.stdin.on("keypress", onKeypress);
  process.once("SIGINT", onSigint);

  try {
    if (controller.signal.aborted) return CANCEL;
    return await prompt(controller.signal);
  } catch (error) {
    if (controller.signal.aborted || isAbortError(error)) return CANCEL;
    throw error;
  } finally {
    process.stdin.off("keypress", onKeypress);
    process.off("SIGINT", onSigint);
    if (!wasRaw && process.stdin.isTTY && process.stdin.isRaw) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  }
}

function writeLog(symbol: string, message: string): void {
  const [first = "", ...rest] = message.split("\n");
  console.log(`${symbol}  ${first}`);
  for (const line of rest) console.log(`${pc.dim("│")}  ${line}`);
}

export const log = {
  info: (message: string) => writeLog(pc.cyan("●"), message),
  success: (message: string) => writeLog(pc.green("✔"), message),
  warn: (message: string) => writeLog(pc.yellow("▲"), message),
  error: (message: string) => writeLog(pc.red("✖"), message)
};

export function intro(message: string): void {
  console.log(`\n${pc.bold(message)}\n`);
}

export function outro(message: string): void {
  console.log(`${pc.dim(message)}\n`);
}

export function cancel(message: string): void {
  console.log(`${pc.red(message)}\n`);
}

export function isCancel(value: unknown): value is Cancel {
  return value === CANCEL;
}

export interface TextOptions {
  message: string;
  placeholder?: string;
  defaultValue?: string;
}

export async function text(
  options: TextOptions
): Promise<string | Cancel> {
  const message =
    options.placeholder && !options.defaultValue
      ? `${options.message} (e.g. ${options.placeholder})`
      : options.message;
  return withPrompt((signal) =>
    promptQuestion(message, {
      defaultValue: options.defaultValue,
      signal
    })
  );
}

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
}

export interface SelectOptions<T extends string = string> {
  message: string;
  options: SelectOption<T>[];
  initialValue?: T;
}

export async function select<T extends string>(
  options: SelectOptions<T>
): Promise<T | Cancel> {
  const initialIndex = options.initialValue
    ? options.options.findIndex((option) => option.value === options.initialValue)
    : -1;
  const initial = options.options[initialIndex];
  const ordered =
    initialIndex > 0 && initial
      ? [
          initial,
          ...options.options.slice(0, initialIndex),
          ...options.options.slice(initialIndex + 1)
        ]
      : options.options;

  return withPrompt((signal) =>
    promptSelect(options.message, {
      choices: ordered.map((option) => ({
        value: option.value,
        label: option.label,
        description: option.hint
      })),
      signal
    })
  );
}

export interface ConfirmOptions {
  message: string;
  initialValue?: boolean;
}

export async function confirm(
  options: ConfirmOptions
): Promise<boolean | Cancel> {
  return withPrompt((signal) =>
    promptConfirm(options.message, {
      initial: options.initialValue ?? false,
      signal
    })
  );
}
