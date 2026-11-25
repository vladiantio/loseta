import type { RegistryCatalog, RegistryItemPayload } from "./types.js";

export interface ResolvedRegistryItem {
  item: RegistryItemPayload;
  /** Absolute URL when installed from a URL, absent for the configured registry. */
  source?: string;
}

export interface RegistrySource {
  /** Base URL, or a diagnostic identifier for a local source. */
  readonly url: string;
  catalog(): Promise<RegistryCatalog>;
  item(name: string, style: string): Promise<ResolvedRegistryItem>;
  itemFromUrl(
    url: string,
    style: string,
    options?: { experimental?: boolean }
  ): Promise<ResolvedRegistryItem>;
}
