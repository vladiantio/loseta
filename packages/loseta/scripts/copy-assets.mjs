import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const dist = join(packageRoot, "dist");
mkdirSync(dist, { recursive: true });

for (const name of [
  "schema-item.json",
  "schema-catalog.json",
  "validation-rules.json"
]) {
  copyFileSync(join(packageRoot, "registry", name), join(dist, name));
}
