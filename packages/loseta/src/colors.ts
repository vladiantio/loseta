function supportsColor(): boolean {
  if ("NO_COLOR" in process.env) return false;

  const forced = process.env.FORCE_COLOR;
  if (forced !== undefined) {
    return forced !== "0" && forced !== "false";
  }

  return (
    process.platform === "win32" ||
    "CI" in process.env ||
    Boolean(process.stdout.isTTY && process.env.TERM !== "dumb")
  );
}

const enabled = supportsColor();

function style(open: number, close: number): (value: string) => string {
  return (value) =>
    enabled ? `\u001B[${open}m${value}\u001B[${close}m` : value;
}

/** Minimal terminal colors with the subset used by the CLI. */
export const pc = {
  bold: style(1, 22),
  dim: style(2, 22),
  cyan: style(36, 39),
  green: style(32, 39),
  yellow: style(33, 39),
  red: style(31, 39)
};
