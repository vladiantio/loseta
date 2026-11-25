import type { Manifest, Registry, RegistryItem } from "../src/types.js";

function styleFile(style: string, name: string) {
  return {
    path: `styles/${style}/${name}.css`,
    target: `styles/${style}/${name}.css`,
    role: "style" as const,
    layer: "loseta.style" as const
  };
}

function primitiveStyleFile(style: string, name: string) {
  return {
    path: `styles/${style}/primitives/${name}.css`,
    target: `styles/${style}/primitives/${name}.css`,
    role: "style" as const,
    layer: "loseta.style" as const
  };
}

function baseFile(name: string) {
  return {
    path: `components/${name}.css`,
    target: `components/${name}.css`,
    role: "base" as const,
    layer: "loseta.components" as const
  };
}

function component(
  name: string,
  status: RegistryItem["status"],
  dependencies: string[] = []
): RegistryItem {
  const styles = status === "stable" ? ["nova", "vega"] : ["nova"];
  return {
    name,
    type: "component",
    status,
    title: name,
    description: `${name} fixture`,
    root: [`.${name}`],
    registryDependencies: dependencies,
    files: [baseFile(name), ...styles.map((style) => styleFile(style, name))]
  };
}

/**
 * A minimal registry for tests that need both a stable and an experimental
 * item independent of the real registry's promotion status.
 */
export const fixtureRegistry: Registry = {
  name: "fixture",
  schemaVersion: 1,
  minCliVersion: "0.20.0",
  styles: [
    { name: "nova", title: "Nova", description: "Default fixture style" },
    { name: "vega", title: "Vega", description: "Second fixture style" }
  ],
  items: [
    component("alpha", "stable"),
    component("beta", "experimental"),
    {
      name: "gamma",
      type: "primitive",
      status: "stable",
      title: "gamma",
      description: "gamma fixture",
      root: [],
      files: [
        {
          path: "primitives/gamma.css",
          target: "primitives/gamma.css",
          role: "base",
          layer: "loseta.components"
        },
        primitiveStyleFile("nova", "gamma"),
        primitiveStyleFile("vega", "gamma")
      ]
    }
  ]
};

/** Builds a manifest whose items are named in the fixture registry. */
export function fixtureManifest(
  registry: Registry,
  names: string[]
): Manifest {
  return {
    ...(registry.build
      ? { registry: { url: "local:fixture", build: registry.build } }
      : {}),
    items: names.map((name) => ({
      name,
      files: []
    }))
  };
}
