# Agent guide

loseta is a copy-paste registry of native CSS components with a documented
markup contract. The registry is the product; the docs site renders the same
files consumers install.

For "component examples and fixes" requests, start with `EXAMPLES.md`; it is
the runbook for the workflow, tests and upstream paths.

## Read first

- `GLOSSARY.md` — read when naming a concept, writing docs or choosing an
  attribute. It fixes the project vocabulary; use its terms.
- `DESIGN.md` — read before changing any public class, attribute, token, state
  or layer. It is the v1 contract for layers, tokens, component API,
  accessibility and compatibility. If it disagrees with the registry,
  `packages/loseta/registry/tokens.css` and `registry.json` are authoritative;
  correct the document.
- `packages/loseta/README.md` — read before changing CLI commands, install
  behavior or registry layout.
- `RELEASING.md` — read before changing the package version or claiming a
  release. A version is released only after the Publish workflow succeeds and
  `npm view loseta version` reports it; a version bump, changelog entry, tag,
  GitHub release or merged PR is preparation.
- `STYLE-GUIDE.md` — read before writing or reviewing a style file. It defines
  the per-style geometry, role recipes and reference components.
- `EXAMPLES.md` — read when adding or expanding a component's examples.

CodeGraph covers the CLI, docs site and tests (TypeScript and Astro). Registry
CSS and the design docs (`DESIGN.md`, `STYLE-GUIDE.md`) are found with `grep`
and `read`.

## Non-negotiables

- Native CSS only: no Tailwind, CSS-in-JS, preprocessor or framework
  dependency in the registry.
- The registry is CSS-only: loseta ships styling, not behavior. The docs client
  demo behavior in `web/src/scripts/docs-client/demo.ts` must not become a
  registry dependency.
- `.sr-only` is the only utility.
- Class names and tokens are prefix-free.
- The layer order is fixed: `loseta.tokens`, `loseta.reset`, `loseta.base`,
  `loseta.components`, `loseta.style`, `loseta.utilities`.
- Public API changes require updating `DESIGN.md` and the docs that describe
  them. Breaking changes also require a `CHANGELOG.md` entry.

## Layout

- `packages/loseta/registry/` — published catalog: foundations, primitives,
  components, Nova style, examples and `registry.json`.
- `packages/loseta/src/` — CLI (`init`, `add`, `list`, `style`).
- `packages/loseta/test/` — CLI tests (`node:test`); keep flag and config
  resolution in testable modules rather than prompt handlers.
- `packages/loseta/experimental/` — uncurated, unpublished drafts. Items become
  installable only after they move into `registry/` and are declared in
  `registry.json`, even while they remain experimental.
- `web/` — Astro docs site; it imports the registry CSS directly. Component
  pages are one dynamic route (`web/src/pages/docs/components/[id].astro`);
  per-item copy lives in `web/src/data/components.ts` and example markup in
  `web/src/data/examples.ts`.

## Base/style split

Every component and primitive ships two files:

- **Base** (`components/`, `primitives/`): anatomy, layout and behavior hooks.
- **Style** (`styles/<name>/`): color, typography, spacing, radii, surfaces,
  shadows and motion.

Base files may use tokens for structural state semantics (for example invalid
text or a selected row), but prefer the style file for visual treatment.
Dark color values and the `.dark` / `.light` contract: see `DESIGN.md`,
"Light and dark". Nova is the default style; Vega, Maia, Lyra, Mira, Luma,
Sera and Rhea ship alongside it.

Stable items ship one style file per declared style. Experimental items ship
exactly one Nova file until they are promoted; the validator enforces both
rules.

## Registry workflow

1. Edit the base and/or style file under `packages/loseta/registry/`.
2. Update the item in `registry.json`: `title`, `description`, `root`, `files`
   (one style file per declared style for stable items, one Nova file for
   experimental items), dependencies, `status`, `docs` and `examples` as
   applicable.
3. Edit example markup in `web/src/data/examples.ts`. Use the demo hooks
   (`data-demo`, `data-demo-trigger`, `data-demo-toggle`, `data-open-dialog`,
   `data-close-dialog`) only for docs behavior; the generator strips them.
4. Run `pnpm registry:examples` to regenerate
   `packages/loseta/registry/examples/` and the `examples` fields.
5. Run `pnpm test` and `pnpm docs:css`. For visual or docs changes, run
   `pnpm --filter web test:e2e`.

When adding a component, also add its group and any contract note in
`web/src/data/components.ts`. Experimental components are published and
installable with `--experimental`; they stay Nova-only and outside the v1
contract. To promote one, add the seven remaining style files, change
`status` to `stable`, and update `DESIGN.md`, tests and examples. Uncurated
work stays in `packages/loseta/experimental/` until it has base/style files,
registry metadata, an example and docs coverage.

When adding a style, mirror the `styles/nova/` tree under `styles/<name>/`
(including `primitives/`), declare it in the registry `styles` list, and add
its file to every stable component and primitive item. The validator requires
every declared style to be complete for stable items; experimental items stay
Nova-only until they are promoted.

## CSS rules

- Wrap every file in its exact layer: `@layer loseta.<layer> { ... }`.
- State lives in native pseudo-classes and ARIA: `:disabled`, `:checked`,
  `:indeterminate`, `:focus-visible`, `[open]`, `inert`, `aria-invalid`,
  `aria-selected`, `aria-checked`, `aria-pressed`, `aria-current`,
  `aria-disabled`, `aria-expanded`, `aria-hidden`.
- `data-highlighted` is the only public data-driven state beyond variant, size,
  orientation, spacing, fit and placement attributes. Express everything else
  with the hooks above.
- Name parts with `data-slot` when no semantic element already carries the
  role; prefer `header`, `section`, `footer`, `figure` and `aside` where the
  anatomy provides them.
- Use logical properties (`margin-inline`, `inset-inline-start`) and logical
  placement values.
- No `!important`. Derive transparency with
  `color-mix(in oklab, var(--token) N%, transparent)`; raw palette colors are
  limited to SVG data URIs and the dialog backdrop.

## Generated files

Regenerate these; do not edit them by hand:

- `packages/loseta/registry/examples/*.html` from
  `web/src/data/examples.ts` (`pnpm registry:examples`).
- `web/src/styles/loseta.css` from the stable registry items
  (`pnpm docs:css`, also run by `pnpm web:dev` and `pnpm web:build`).
- `web/public/styles/loseta-experimental.css` from the experimental base and
  Nova style files (`pnpm docs:css`).
- `web/public/styles/<name>.css` from the stable style files
  (`pnpm docs:css`).

CI fails when either generated artifact differs from the committed files.
`packages/loseta/dist/` and `web/.astro/` are build output and ignored.

## Verification

`pnpm test` is the default gate: it builds the CLI, validates the registry and
runs `astro check`.

```bash
pnpm install
pnpm test
pnpm registry:check      # fast registry and CSS validation
pnpm cli:smoke           # interactive init prompt smoke test
pnpm web:dev             # docs at http://localhost:4321
pnpm --filter web test:e2e
```

`pnpm test` runs the default gate through `scripts/gate.mjs`: it prints the
last 40 lines and exits with the command's status; `pnpm test:raw` prints the
full output. `pnpm gate:test` is an alias; `pnpm gate:registry` and
`pnpm gate:e2e` wrap the other gates. Never
pipe a gate into `tail` or `head`; the shell environment runs bash with
`pipefail`, so a pipeline already reports its first failing stage.

`registry:check` enforces schema conformance, file and example existence,
dependency resolution and cycles, exact layer wrapping, forbidden patterns
(including physical left/right spacing and borders in style files), stable
style completeness, the experimental Nova-only rule and CSS parseability. It
also checks example ID and ARIA-reference integrity, the popover dialog
contract, the shared overlay recipe and that every component root used by an
example is declared in `optionalDependencies`. Fix the source rather than
bypassing it.

For visual work, use Astro's preview lifecycle instead of keeping a server by
hand: `pnpm --filter web astro preview status`,
`pnpm --filter web astro preview --port 4323 --background`,
`pnpm --filter web astro preview logs --follow` and
`pnpm --filter web astro preview stop`. `--ignore-lock` belongs only in
Playwright's `webServer`; from a shell it starts a second server on the next
free port while scripts keep hitting 4323.

`pnpm --filter web run probe <item>` screenshots the first example preview.
Select one case with `--example "<title>"`, `--style`, `--scheme`, `--width` or
`--html <fixture>`; inspect it with `--eval "<js>"` (binds `el` to the example
root) and `--page` for the whole page. `--shot-el` captures one element; it is
scoped to the selected example with `--example` and inside `#probe-root` with
`--html`. `--all-examples` covers every preview.
For a contact sheet across styles, use
`pnpm --filter web run styles:review <item> --scheme both`.

Review `git diff` before the full suite. To iterate, build once
(`pnpm --filter web build`) and run
`pnpm --filter web exec playwright test -g <name>`; `pnpm --filter web test:e2e`
builds the site itself, so run it once, after the diff is final.

Before calling a change done, `pnpm test` must pass and `git status` must show
only the intended source and regenerated files. Write docs, comments and commit
messages in English; follow the existing Conventional Commit style
(`feat(scope):`, `fix(scope):`, `docs:`).
