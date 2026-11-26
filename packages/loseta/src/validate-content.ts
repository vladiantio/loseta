import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { posix } from "node:path";
import { parse as parseModule } from "acorn";
import type { SchemaDefinition, ValidationError } from "@jetio/validator";
import { SCHEMA_VERSION } from "./constants.js";
import type {
  RegistryCatalog,
  RegistryExample,
  RegistryItemPayload
} from "./types.js";
import { compareVersions } from "./version.js";

export class RegistryValidationError extends Error {
  readonly errors: string[];

  constructor(message: string, errors: string[] = []) {
    super([message, ...errors].map((line) => `- ${line}`).join("\n"));
    this.name = "RegistryValidationError";
    this.errors = errors;
  }
}

interface RuleDefinition {
  pattern: string;
  flags: string;
  message: string;
}

interface CompiledRule {
  regex: RegExp;
  message: string;
}

interface ValidationRules {
  forbiddenEverywhere: CompiledRule[];
  forbiddenInBase: CompiledRule[];
  forbiddenInStyle: CompiledRule[];
  forbiddenInBaseColor: CompiledRule[];
  forbiddenOutsideTokens: CompiledRule[];
  promotionScaffold: RegExp;
  behaviorImportPattern: RegExp;
  forbiddenInBehaviors: CompiledRule[];
}

function readAsset(name: string): unknown {
  const candidates = [
    new URL(`./${name}`, import.meta.url),
    new URL(`../registry/${name}`, import.meta.url)
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return JSON.parse(readFileSync(candidate, "utf8")) as unknown;
    }
  }
  throw new Error(`Missing loseta registry asset: ${name}`);
}

function compileRules(definitions: RuleDefinition[]): CompiledRule[] {
  return definitions.map((definition) => ({
    regex: new RegExp(definition.pattern, definition.flags),
    message: definition.message
  }));
}

function loadRules(): ValidationRules {
  const raw = readAsset("validation-rules.json") as {
    forbiddenEverywhere: RuleDefinition[];
    forbiddenInBase: RuleDefinition[];
    forbiddenInStyle: RuleDefinition[];
    forbiddenInBaseColor: RuleDefinition[];
    forbiddenOutsideTokens: RuleDefinition[];
    promotionScaffold: string;
    behaviorImportPattern: string;
    forbiddenInBehaviors: RuleDefinition[];
  };

  return {
    forbiddenEverywhere: compileRules(raw.forbiddenEverywhere),
    forbiddenInBase: compileRules(raw.forbiddenInBase),
    forbiddenInStyle: compileRules(raw.forbiddenInStyle),
    forbiddenInBaseColor: compileRules(raw.forbiddenInBaseColor),
    forbiddenOutsideTokens: compileRules(raw.forbiddenOutsideTokens),
    promotionScaffold: new RegExp(raw.promotionScaffold),
    behaviorImportPattern: new RegExp(raw.behaviorImportPattern, "g"),
    forbiddenInBehaviors: compileRules(raw.forbiddenInBehaviors)
  };
}

const itemSchema = readAsset("schema-item.json");
const catalogSchema = readAsset("schema-catalog.json");
const rules = loadRules();

// @jetio/validator publishes its ESM entry as a `.js` file in a CommonJS
// package. Node 22.0.0 parses it as CommonJS, so named ESM imports fail on the
// minimum supported runtime; load the package's CJS entry instead.
const require = createRequire(import.meta.url);
const { JetValidator } = require("@jetio/validator") as typeof import("@jetio/validator");

const validator = new JetValidator({
  allErrors: true,
  strict: false
});
const validateItemSchema = validator.compile(itemSchema as SchemaDefinition);
const validateCatalogSchema = validator.compile(catalogSchema as SchemaDefinition);

function formatSchemaErrors(errors: ValidationError[] | null): string[] {
  return (errors ?? []).map(
    (error) => `${error.dataPath || "/"} ${error.message}`
  );
}

function isSafeRelativePath(value: string): boolean {
  if (!value || value.startsWith("/") || value.startsWith("\\")) return false;
  if (/^[A-Za-z]:[\\/]/.test(value)) return false;
  if (value.includes("\\")) return false;
  const segments = value.split("/");
  return segments.every(
    (segment) => segment !== "" && segment !== "." && segment !== ".."
  );
}

function checkRelativePath(
  label: string,
  value: string,
  errors: string[]
): void {
  if (!isSafeRelativePath(value)) {
    errors.push(`${label}: unsafe path ${JSON.stringify(value)}`);
  }
}

function testRules(
  source: string,
  definitions: CompiledRule[],
  label: string,
  errors: string[]
): void {
  for (const rule of definitions) {
    rule.regex.lastIndex = 0;
    if (rule.regex.test(source)) {
      errors.push(`${label}: ${rule.message}`);
    }
    rule.regex.lastIndex = 0;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasLayer(content: string, layer: string): boolean {
  return new RegExp(`@layer\\s+${escapeRegExp(layer)}\\s*\\{`).test(content);
}

function checkBehaviorImports(
  source: string,
  behaviorPath: string,
  behaviorPaths: Set<string>,
  errors: string[]
): void {
  rules.behaviorImportPattern.lastIndex = 0;
  for (const match of source.matchAll(rules.behaviorImportPattern)) {
    const specifier = match[1];
    if (!specifier) continue;
    if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
      errors.push(`${behaviorPath}: behavior imports must be relative: ${specifier}`);
      continue;
    }
    const resolved = posix.normalize(
      posix.join(posix.dirname(behaviorPath), specifier)
    );
    if (
      resolved.startsWith("../") ||
      resolved === ".." ||
      resolved.startsWith("/") ||
      !resolved.startsWith("behaviors/")
    ) {
      errors.push(`${behaviorPath}: import escapes behaviors/: ${specifier}`);
      continue;
    }
    if (!behaviorPaths.has(resolved)) {
      errors.push(
        `${behaviorPath}: imported module is not included in the payload: ${specifier}`
      );
    }
  }
}

function checkExample(example: RegistryExample, itemName: string, errors: string[]): void {
  if (!example.title.trim()) {
    errors.push(`${itemName}: example title must not be empty`);
  }
  if (!example.html.trim()) {
    errors.push(`${itemName}: example HTML must not be empty`);
  }
}

function validateFiles(
  item: RegistryItemPayload,
  style: string,
  errors: string[]
): void {
  const stylePrefix = `styles/${style}/`;
  const targets = new Set<string>();
  let baseFiles = 0;
  let styleFiles = 0;

  for (const file of item.files) {
    const label = `${item.name}: ${file.path}`;
    if (targets.has(file.target)) {
      errors.push(`${label}: duplicate file target ${file.target}`);
    }
    targets.add(file.target);
    checkRelativePath(`${label}: path`, file.path, errors);
    checkRelativePath(`${label}: target`, file.target, errors);

    if (file.role === "base") {
      baseFiles += 1;
      if (file.target.startsWith("styles/")) {
        errors.push(`${label}: base file target must not live under styles/: ${file.target}`);
      }
    } else {
      styleFiles += 1;
      if (!file.path.startsWith(stylePrefix)) {
        errors.push(`${label}: style file must live under ${stylePrefix}`);
      }
      if (!file.target.startsWith(stylePrefix)) {
        errors.push(`${label}: style target must start with ${stylePrefix}: ${file.target}`);
      }
      if (item.status === "stable" && rules.promotionScaffold.test(file.content)) {
        errors.push(`${label}: remove the promotion scaffold before promoting`);
      }
    }

    if (!hasLayer(file.content, file.layer)) {
      errors.push(`${label}: is not wrapped in @layer ${file.layer}`);
    }

    testRules(file.content, rules.forbiddenEverywhere, label, errors);
    if (file.role === "base") {
      testRules(file.content, rules.forbiddenInBase, label, errors);
    } else {
      testRules(file.content, rules.forbiddenInStyle, label, errors);
    }
    if (file.layer !== "loseta.tokens") {
      testRules(file.content, rules.forbiddenOutsideTokens, label, errors);
    }
    if (file.role === "base" && file.layer !== "loseta.tokens") {
      testRules(file.content, rules.forbiddenInBaseColor, label, errors);
    }
  }

  if (item.type === "component" || item.type === "primitive") {
    if (baseFiles === 0) errors.push(`${item.name}: expected a base file`);
    if (styleFiles === 0) {
      errors.push(`${item.name}: expected a ${style} style file`);
    }
  }

  if (item.type === "foundation") {
    if (styleFiles > 0) {
      errors.push(`${item.name}: foundation items do not have style files`);
    }
  }
}

function validateBehaviors(item: RegistryItemPayload, errors: string[]): void {
  const targets = new Set<string>();
  const behaviorPaths = new Set(
    (item.behaviors ?? []).map((behavior) => behavior.path)
  );
  let hasCore = false;

  for (const behavior of item.behaviors ?? []) {
    const label = `${item.name}: ${behavior.path}`;
    checkRelativePath(`${label}: path`, behavior.path, errors);
    checkRelativePath(`${label}: target`, behavior.target, errors);

    if (!behavior.path.startsWith("behaviors/")) {
      errors.push(`${label}: behavior source must start with behaviors/: ${behavior.path}`);
    }
    if (!behavior.target.startsWith("behaviors/")) {
      errors.push(`${label}: behavior target must start with behaviors/: ${behavior.target}`);
    }
    if (behavior.path !== behavior.target) {
      errors.push(
        `${label}: behavior source and target must match so relative imports keep working`
      );
    }
    if (targets.has(behavior.target)) {
      errors.push(`${label}: duplicate behavior target ${behavior.target}`);
    }
    targets.add(behavior.target);
    if (behavior.path === "behaviors/core.js" && behavior.kind === "support") {
      hasCore = true;
    }

    testRules(behavior.content, rules.forbiddenInBehaviors, label, errors);
    try {
      parseModule(behavior.content, {
        ecmaVersion: "latest",
        sourceType: "module",
        allowHashBang: true
      });
    } catch (error) {
      errors.push(`${label}: ESM parse error: ${(error as Error).message}`);
    }
    checkBehaviorImports(
      behavior.content,
      behavior.path,
      behaviorPaths,
      errors
    );
  }

  if ((item.behaviors ?? []).length > 0 && !hasCore) {
    errors.push(`${item.name}: behavior items must include behaviors/core.js as a support entry`);
  }
}

function checkDependencies(
  item: RegistryItemPayload,
  urlSource: boolean,
  errors: string[]
): void {
  for (const dependency of item.registryDependencies ?? []) {
    if (!dependency.trim()) {
      errors.push(`${item.name}: empty registry dependency`);
      continue;
    }
    if (urlSource) {
      let parsed: URL | undefined;
      try {
        parsed = new URL(dependency);
      } catch {
        parsed = undefined;
      }
      if (parsed) {
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          errors.push(`${item.name}: unsupported dependency URL: ${dependency}`);
        }
        continue;
      }
      if (!/^[a-z][a-z0-9-]*$/.test(dependency)) {
        errors.push(
          `${item.name}: URL installs require official names or absolute URLs for dependencies: ${dependency}`
        );
      }
    }
  }
}

export function assertCompatible(
  meta: { schemaVersion: number; minCliVersion: string },
  cliVersion: string
): void {
  if (meta.schemaVersion !== SCHEMA_VERSION) {
    throw new RegistryValidationError(
      `Unsupported registry schema version ${meta.schemaVersion}; this CLI supports ${SCHEMA_VERSION}. Run \`npx loseta@latest\`.`
    );
  }
  if (compareVersions(cliVersion, meta.minCliVersion) < 0) {
    throw new RegistryValidationError(
      `This registry requires loseta ${meta.minCliVersion} or newer; this CLI is ${cliVersion}. Run \`npx loseta@latest\`.`
    );
  }
}

export function validateCatalog(value: unknown): RegistryCatalog {
  if (!validateCatalogSchema(value)) {
    throw new RegistryValidationError(
      "Invalid registry catalog",
      formatSchemaErrors(validateCatalogSchema.errors)
    );
  }

  const catalog = value as RegistryCatalog;
  const errors: string[] = [];
  const styleNames = new Set<string>();
  for (const style of catalog.styles) {
    if (styleNames.has(style.name)) {
      errors.push(`duplicate style: ${style.name}`);
    }
    styleNames.add(style.name);
  }
  if (!styleNames.has("nova")) {
    errors.push('styles: the default "nova" style is not declared');
  }

  const itemNames = new Set<string>();
  for (const item of catalog.items) {
    if (itemNames.has(item.name)) {
      errors.push(`duplicate item: ${item.name}`);
    }
    itemNames.add(item.name);

    for (const file of item.files) {
      const label = `${item.name}: ${file.path}`;
      checkRelativePath(`${label}: path`, file.path, errors);
      checkRelativePath(`${label}: target`, file.target, errors);
      if (file.role === "style") {
        const match = /^styles\/([^/]+)\//.exec(file.path);
        if (!match) {
          errors.push(`${label}: style file must live under styles/<style>/`);
        } else {
          if (!styleNames.has(match[1] ?? "")) {
            errors.push(`${label}: undeclared style ${match[1]}`);
          }
          if (!file.target.startsWith(`styles/${match[1]}/`)) {
            errors.push(`${label}: style target does not match ${match[1]}: ${file.target}`);
          }
        }
      } else if (file.target.startsWith("styles/") || file.path.startsWith("styles/")) {
        errors.push(`${label}: base file must not live under styles/`);
      }
    }

    for (const behavior of item.behaviors ?? []) {
      checkRelativePath(`${item.name}: ${behavior.path}`, behavior.path, errors);
      checkRelativePath(`${item.name}: ${behavior.target}`, behavior.target, errors);
      if (!behavior.target.startsWith("behaviors/")) {
        errors.push(`${item.name}: behavior target must start with behaviors/: ${behavior.target}`);
      }
    }

    if (item.type === "component" || item.type === "primitive") {
      for (const style of styleNames) {
        if (item.status === "stable" && !item.hashes?.[style]) {
          errors.push(`${item.name}: missing ${style} hash`);
        }
      }
      if (item.status === "experimental") {
        if (!item.hashes?.nova) {
          errors.push(`${item.name}: experimental items need a nova hash`);
        }
        for (const style of Object.keys(item.hashes ?? {})) {
          if (style !== "nova") {
            errors.push(`${item.name}: experimental items are Nova-only; found ${style} hash`);
          }
        }
      }
    }
    if (item.type === "foundation" && !item.hash) {
      errors.push(`${item.name}: foundation items need a hash`);
    }

  }

  if (catalog.schemaVersion !== SCHEMA_VERSION) {
    errors.push(
      `catalog schema version ${catalog.schemaVersion} is not ${SCHEMA_VERSION}`
    );
  }

  if (errors.length > 0) {
    throw new RegistryValidationError("Invalid registry catalog", errors);
  }
  return catalog;
}

export interface PayloadValidationOptions {
  style: string;
  /** URL installs only accept component and primitive items. */
  urlSource?: boolean;
  /** Experimental URL installs require the opt-in. */
  experimental?: boolean;
  schemaVersion?: number;
  cliVersion?: string;
}

export function validateItemPayload(
  value: unknown,
  options: PayloadValidationOptions
): RegistryItemPayload {
  if (!validateItemSchema(value)) {
    throw new RegistryValidationError(
      "Invalid registry item payload",
      formatSchemaErrors(validateItemSchema.errors)
    );
  }

  const item = value as RegistryItemPayload;
  const errors: string[] = [];

  if (options.schemaVersion !== undefined && item.schemaVersion !== options.schemaVersion) {
    errors.push(
      `schema version ${item.schemaVersion} does not match ${options.schemaVersion}`
    );
  }
  if (options.cliVersion !== undefined) {
    try {
      assertCompatible(item, options.cliVersion);
    } catch (error) {
      errors.push((error as Error).message.replace(/^- /gm, ""));
    }
  }

  if (item.type === "style") {
    errors.push(`${item.name}: style items cannot be installed`);
  }
  if (options.urlSource && item.type !== "component" && item.type !== "primitive") {
    errors.push(
      `${item.name}: URL installs only accept component and primitive items`
    );
  }

  if (item.type === "component" || item.type === "primitive") {
    if (item.style !== options.style) {
      errors.push(
        `${item.name}: payload style ${item.style ?? "(none)"} does not match the project style ${options.style}`
      );
    }
  } else if (item.style !== undefined) {
    errors.push(`${item.name}: ${item.type} items must not declare a style`);
  }

  if (item.status === "experimental") {
    if (options.style !== "nova") {
      errors.push(`${item.name}: experimental items are Nova-only`);
    }
    if (options.urlSource && !options.experimental) {
      errors.push(`${item.name}: experimental items require --experimental`);
    }
  }

  checkDependencies(item, Boolean(options.urlSource), errors);
  validateFiles(item, options.style, errors);
  validateBehaviors(item, errors);
  for (const example of item.examples ?? []) {
    checkExample(example, item.name, errors);
  }

  if (errors.length > 0) {
    throw new RegistryValidationError(
      `Invalid registry item payload: ${item.name}`,
      errors
    );
  }
  return item;
}


