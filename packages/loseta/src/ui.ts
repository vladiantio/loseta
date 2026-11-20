import pc from "picocolors";
import type { RegistryItem } from "./types.js";

/** Prints a compact list of registry items. */
export function printItems(items: RegistryItem[]): void {
  for (const item of items) {
    const name = pc.cyan(item.name.padEnd(18));
    const kind = pc.dim(item.type.padEnd(11));
    const behavior = (item.behaviors ?? []).some((entry) => entry.kind === "entry")
      ? pc.green("js")
      : pc.dim("  ");
    console.log(`${name} ${kind} ${behavior} ${item.description}`);
  }
}

/** Prints a one-line summary of installed item names. */
export function installedSummary(names: string[]): string {
  return names.length > 0 ? names.join(", ") : "nothing";
}
