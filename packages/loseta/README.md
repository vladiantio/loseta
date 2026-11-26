# loseta

The CLI and authored registry for [loseta](https://github.com/vladiantio/loseta).

The registry is served remotely. The npm package ships the CLI and its runtime
dependencies, not the registry files. Requires Node 22+.

```bash
npx loseta init
npx loseta add button card field
```

## Commands

| Command | Description |
| --- | --- |
| `loseta init` | Create `loseta.json`, install the foundation files and generate `index.css`. |
| `loseta add <items...>` | Install components, their registry dependencies and behavior modules. |
| `loseta add <url>` | Install one public item payload from a URL. |
| `loseta add <item> --no-behavior` | Keep the CSS-only install for that run. |
| `loseta add <item> --behavior` | Backfill missing behavior modules for installed items. |
| `loseta add <item> --experimental` | Install an experimental component in a Nova project. |
| `loseta add all` | Install every stable component. |
| `loseta style <name>` | Switch the visual style of installed components. |
| `loseta list` | List stable components. |
| `loseta list --experimental` | Include experimental components. |
| `loseta list --all` | Include experimental, primitive and foundation items. |

`add` flags: `--overwrite`, `--no-deps`, `--behavior`, `--no-behavior`,
`--experimental`, `--html`, `--style`, `--yes`, `--registry`, `--no-cache`.
`loseta list` marks behavior-bearing components with `js`.
`init` flags: `--css-dir`, `--entrypoint`, `--style`, `--import`, `--yes`,
`--registry`, `--no-cache`. `list` and `style` also accept `--registry` and
`--no-cache`.

The registry base URL resolves from `--registry`, `LOSETA_REGISTRY`, the
`registry` field in `loseta.json`, then `https://loseta.vladiantio.com/r`.
Registry and item URLs must use HTTPS; HTTP is allowed only for localhost.
Responses are cached under the XDG cache directory; `--no-cache` bypasses the
cache. Requests time out after ten seconds and retry once on network or 5xx
errors. The CLI has no custom proxy agent; on Node 24 set
`NODE_USE_ENV_PROXY=1` to use the environment proxy. A cold install requires network access. URL installs are style-bound and
prompt for confirmation unless `--yes` is passed.

Re-running `init` resets `.loseta/manifest.json` to the foundation and
regenerates `index.css`. Component and behavior files stay on disk but are no
longer tracked; run `loseta add all` to restore stable components. Experimental
components must be re-added by name with `--experimental`.

## Registry layout

The authored source lives in `packages/loseta/registry/`:

```
registry/
  registry.json          # item manifest and wire metadata
  schema.json            # JSON Schema for the source manifest
  schema-item.json       # JSON Schema for installable item payloads
  schema-catalog.json    # JSON Schema for the served catalog
  validation-rules.json  # shared CSS and behavior rules
  tokens.css             # design tokens
  reset.css              # preflight-style reset
  base.css               # element defaults
  utilities.css          # sr-only
  primitives/            # shared popover, listbox, menu and dialog shells
  components/            # structural CSS per component
  behaviors/             # optional ESM behavior modules
  styles/                # visual CSS per declared style
  examples/              # example markup used by `add --html`
```

The npm tarball contains `bin/`, `dist/` and `NOTICE`; it does not contain
`registry/`. The docs build generates the served artifacts under
`web/public/r/` and `web/public/schema/v1/` and they are gitignored.

Each component item contains:

- a base file in `components/` (structure and behavior hooks),
- one style file per declared style in `styles/<style>/`,
- optional behavior modules in `behaviors/`,
- optional primitive dependencies,
- a root selector list,
- optional composition metadata.

Experimental items contain a base file and exactly one Nova style file. They
are installable by name with `--experimental`, outside the v1 contract, and are
promoted only after the other seven style files exist. No experimental
components ship in this release; the pipeline remains for future items.

`registry.json` declares the wire `schemaVersion`, `minCliVersion`, the available
styles and the items. There is no semantic registry version: the served catalog
carries a `build` identifier and the content is mutable. `loseta.json` records
the configured `registry` URL when it is not the default, and the style in use.
The CLI copies only the files for that style; `loseta style <name>` rewrites
them and regenerates `index.css`.

`index.css` is generated from the manifest and declares the layer order:

```css
@layer loseta.tokens, loseta.reset, loseta.base, loseta.components, loseta.style, loseta.utilities;
```

Behavior files are installed under `behaviors/` (configurable with
`behaviorDir` in `loseta.json`). Entry modules self-initialize on import; support
modules (`core.js`, `listbox.js`) export helpers and never auto-init. Tooltip
and hover-card share `hover-overlay.js`; message-scroller exports `mount(root)`
for late-mounted lists and uses one scoped `MutationObserver`; resizable also
exports `mount(root)` to sync late-mounted handles.
Input OTP, slider, scroll-area and sidebar are CSS-only by design. The CLI
generates `behaviors/index.js` from the installed entry modules:

```js
/* Generated by loseta. Do not edit this file directly. */

import "./dialog.js";
```

Load it once per page with `<script type="module" src="/behaviors/index.js"></script>`.
`--no-behavior` skips behavior files and does not update the index.
`--behavior` backfills missing modules for installed items. `behaviorDir` moves
the whole tree and the generated index with it.

## Remote registry

The docs site serves the registry as static JSON:

| URL | Contents |
| --- | --- |
| `https://loseta.vladiantio.com/r/registry.json` | Content-free catalog, `schemaVersion`, `minCliVersion`, `build`, styles and per-style hashes. |
| `https://loseta.vladiantio.com/r/styles/<style>/<name>.json` | Installable component or primitive for one style, with base, style, behavior and example content inlined. |
| `https://loseta.vladiantio.com/r/foundation/<name>.json` | Installable foundation item. |
| `https://loseta.vladiantio.com/schema/v1/registry.json` | Catalog JSON Schema. |
| `https://loseta.vladiantio.com/schema/v1/registry-item.json` | Item payload JSON Schema. |

The catalog is revalidated on every command; item payloads are reused from the
cache when their catalog hash matches and are verified after download. A hash
mismatch is refused, so a mirror must serve the generated bytes unchanged. When the catalog requires a newer schema or CLI, the
command fails with an upgrade message rather than installing a partial payload.
`minCliVersion` in `registry.json` must only move to an already-published CLI
version, because docs and registry deploys do not wait for npm releases.

URL installs accept `component` and `primitive` items only. The payload must
declare the project style, bare `registryDependencies` resolve against the
official registry, and external dependencies must be absolute URLs. The
manifest records each URL item's source; `loseta style` refuses to switch while
one is installed. Behavior modules in URL payloads execute in the page, so the
CLI lists the files and asks for confirmation unless `--yes` is passed.

`.loseta/manifest.json` records the registry `{ url, build }`, each item's
optional source URL and the hash of every installed file. `loseta add` is the
update path for mutable registry content: changed files prompt before being
overwritten.

## Development

```bash
pnpm install
pnpm --filter loseta build       # tsc -> dist/ and copied schemas/rules
pnpm --filter loseta test        # registry, install, remote, CLI and PTY tests
pnpm --filter loseta smoke       # interactive init prompt smoke test
pnpm --filter loseta deps:check  # enforce the runtime dependency policy
pnpm --filter loseta deps:report # list dependencies, purposes and import sites
pnpm --filter loseta validate    # source registry integrity and CSS parse
pnpm --filter loseta behaviors:check # JSDoc type-check the behavior modules
pnpm --filter loseta examples    # regenerate registry/examples from the docs
pnpm registry:remote             # generate web/public/r and schema, validate payloads
pnpm registry:remote:smoke       # install the generated payloads over HTTP
pnpm --filter loseta dev         # run the CLI with tsx
```

The prompt adapter in `src/prompts.ts` owns Ctrl-C cancellation, raw-mode
restoration and the TopCli compatibility mappings. The test suite exercises
normal completion and cancellation under a real pseudo-terminal, using the
local test registry instead of the network.

The source registry is validated for:

- schema conformance,
- file and example existence,
- dependency resolution and cycles,
- `@layer` wrapping,
- one complete style file per declared style for every stable component and primitive,
- no promotion scaffold markers in stable style files,
- exactly one Nova style file for every experimental component and primitive,
- valid `styles/<name>/` paths and no unreferenced style files,
- behavior file existence, ESM parseability, relative imports and no unreferenced modules,
- one Playwright spec per behavior entry module,
- forbidden Tailwind/legacy patterns and unsafe behavior patterns,
- CSS parseability with Lightning CSS.

The remote generator additionally validates every catalog entry and item payload
against the published JSON Schemas, checks CSS layers, forbidden patterns, path
containment, behavior ESM parsing and catalog hashes.

## License

MIT. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
