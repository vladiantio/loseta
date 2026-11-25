/**
 * Compares two dotted numeric versions. Prerelease suffixes are ignored so
 * `0.20.0-beta.1` compares as `0.20.0`.
 */
export function compareVersions(left: string, right: string): number {
  const parse = (value: string): number[] =>
    value
      .trim()
      .replace(/^v/, "")
      .split(/[.+-]/)
      .map((part) => {
        const match = /^\d+/.exec(part);
        return match ? Number(match[0]) : 0;
      });

  const a = parse(left);
  const b = parse(right);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

export function isVersionAtLeast(version: string, minimum: string): boolean {
  return compareVersions(version, minimum) >= 0;
}
