export type ItemType = "component" | "primitive" | "foundation" | "style";
export type ItemStatus = "stable" | "experimental";
export type FileRole = "base" | "style";

export type LayerName =
  | "loseta.tokens"
  | "loseta.reset"
  | "loseta.base"
  | "loseta.components"
  | "loseta.style"
  | "loseta.utilities";

export type BehaviorKind = "entry" | "support";

export interface RegistryFile {
  path: string;
  target: string;
  role: FileRole;
  layer: LayerName;
  /** Present on installable payloads fetched from a registry. */
  content?: string;
}

export interface RegistryBehavior {
  path: string;
  target: string;
  kind: BehaviorKind;
  /** Present on installable payloads fetched from a registry. */
  content?: string;
}

/** A file copied by `add`, CSS or behavior. */
export type InstallableFile = RegistryFile | RegistryBehavior;

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: ItemType;
  status: ItemStatus;
  title: string;
  description: string;
  docs?: string;
  root: string[];
  registryDependencies?: string[];
  optionalDependencies?: string[];
  files: RegistryFile[];
  behaviors?: RegistryBehavior[];
  /** Example paths in the source registry and catalog. */
  examples?: string[];
  /** Catalog: sha256 per style for style-bearing payloads. */
  hashes?: Record<string, string>;
  /** Catalog: sha256 of the foundation payload. */
  hash?: string;
}

export interface StyleDefinition {
  name: string;
  title: string;
  description: string;
}

/**
 * The source registry manifest or a catalog served by a registry. `build` and
 * the version fields are present on catalogs; callers that only need the item
 * graph can accept this shape.
 */
export interface Registry {
  $schema?: string;
  name: string;
  homepage?: string;
  schemaVersion?: number;
  minCliVersion?: string;
  build?: string;
  styles: StyleDefinition[];
  items: RegistryItem[];
}

/** A catalog fetched from a registry, with the wire metadata required. */
export interface RegistryCatalog extends Registry {
  schemaVersion: number;
  minCliVersion: string;
  build: string;
}

export interface RegistryExample {
  title: string;
  html: string;
}

/** An installable item fetched from a registry, with inlined content. */
export interface RegistryItemPayload
  extends Omit<RegistryItem, "examples" | "hashes" | "hash" | "files" | "behaviors"> {
  schemaVersion: number;
  minCliVersion: string;
  build: string;
  /** Set on style-bearing items (component and primitive). */
  style?: string;
  files: Array<RegistryFile & { content: string }>;
  behaviors?: Array<RegistryBehavior & { content: string }>;
  examples?: RegistryExample[];
}

export interface LosetaConfig {
  $schema?: string;
  cssDir: string;
  behaviorDir?: string;
  entrypoint?: string;
  style: string;
  /** Custom registry base URL. Absent means the default registry. */
  registry?: string;
}

export interface ManifestRegistry {
  url: string;
  build: string;
}

export interface ManifestFile {
  path: string;
  hash: string;
}

export interface ManifestItem {
  name: string;
  /** Absolute URL for an item installed from a URL, absent for the registry. */
  source?: string;
  files: ManifestFile[];
}

export interface Manifest {
  registry?: ManifestRegistry;
  items: ManifestItem[];
  behaviors?: string[];
  /** Installed behavior entry modules, used to generate behaviors/index.js. */
  behaviorEntries?: string[];
}
