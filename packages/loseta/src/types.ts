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
}

export interface RegistryBehavior {
  path: string;
  target: string;
  kind: BehaviorKind;
}

/** A file copied by `add`, CSS or behavior. */
export type InstallableFile = RegistryFile | RegistryBehavior;

export interface RegistryItem {
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
  examples?: string[];
}

export interface StyleDefinition {
  name: string;
  title: string;
  description: string;
}

export interface Registry {
  $schema?: string;
  name: string;
  version: string;
  styles: StyleDefinition[];
  items: RegistryItem[];
}

export interface LosetaConfig {
  $schema?: string;
  cssDir: string;
  behaviorDir?: string;
  entrypoint?: string;
  style: string;
}

export interface ManifestFile {
  path: string;
  hash: string;
}

export interface ManifestItem {
  name: string;
  version: string;
  files: ManifestFile[];
}

export interface Manifest {
  version: string;
  items: ManifestItem[];
  behaviors?: string[];
}
