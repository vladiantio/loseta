# Expanding a component's examples

Use this when a request names a component and asks for more examples, or for
detail fixes found while reviewing it. The field, table and input work is the
reference for this checklist.

## Files

- `web/src/data/examples/` — one file per component, re-exported by `index.ts`
  as example markup keyed by item name. The first `"Default"` entry renders as
  the hero and is removed from the Examples list; every other entry becomes a
  titled preview.
- `web/src/data/examples/icons.ts` — shared inline SVGs and example helpers.
  Import only the icons a component uses; add a new icon here when an example
  needs it.
- `web/src/scripts/docs-client/demo.ts` — demo-only click, context-menu and
  dialog behavior. The generator strips the hooks from installed examples.
- `web/src/data/components.ts` — `groupBy` (sidebar group) and `notesBy` (one
  contract note per item; plain text, escaped by Astro).
- `packages/loseta/registry/registry.json` — `optionalDependencies` lists every
  item the examples compose, and `registry:examples` rewrites `examples`.
- `packages/loseta/registry/examples/<item>.html` — generated; never edit.
- `DESIGN.md` — the component table under "Parts and slots" (public class,
  attribute and part contract).
- `web/tests/docs.spec.ts` — one test per fixed behavior; the axe case is
  generated for every component page.
- `web/tests/style-matrix.spec.ts` — style-distance cases (one computed property
  with a value per style), not behavior tests.

## Steps

1. Read the base file and every style file of the item. List the parts the CSS
   already supports before inventing markup; a detail fix should follow from
   what the selectors promise.
2. Add examples to `web/src/data/examples/<item>.ts` from simple to composed:
   default, vertical, horizontal, each control, groups, responsive, validation,
   RTL. Use unique `demo-<item>-*` ids, then add the import and record entry to
   `web/src/data/examples/index.ts`. Add demo hooks only when the docs client
   must demonstrate behavior; see "Demo hooks" below.
3. Run `pnpm registry:examples`. It regenerates the HTML and the item's
   `examples` field.
4. Update the evidence around the examples:
   - `notesBy` with the composition contract;
   - the `DESIGN.md` row when a class, attribute or part changed;
   - `optionalDependencies` for every item a new example composes;
     `registry:check` fails when one is missing.
5. Review visually (see below).
6. Add a `docs.spec.ts` test for every behavior you fixed. Assert a relation
   for container-driven sizes (`width > 448`), never the docs column width:
   the column is 622px at the default 1280px viewport.
7. Add a `style-matrix.spec.ts` case only when the style distance is part of
   the contract (for example the field row gap).
8. Run `pnpm test`, then one build plus the focused suite:
   `pnpm --filter web build` and
   `pnpm --filter web exec playwright test -g "<item>"`. After changing example
   colors or surfaces, run the page axe case before the full suite:
   `pnpm --filter web exec playwright test -g "axe: /docs/components/<item>"`.
   Overlay components also need the open-panel case:
   `pnpm --filter web exec playwright test -g "open overlay panels"`.
   Run `pnpm --filter web test:e2e` once, when the diff is final.
9. `git status` must show only source and regenerated files. Commit with
   `feat(registry): expand <item> examples and fix details`.

## Demo hooks

The generator strips every `data-demo-*` attribute, `data-open-dialog` and
`data-close-dialog` from the installed example, so these hooks only drive the
docs client. The full set lives in `web/src/scripts/docs-client/demo.ts`; add a
hook there when an example needs behavior the client does not provide.

- `data-demo` — marks the root a demo is scoped to. Panels and triggers are
  resolved inside it.
- `data-demo-trigger` — toggles the example's `[data-popover]` and keeps
  `aria-expanded` in sync.
- `data-demo-menu-trigger` — opens the `[data-popover]` beside a nested menu
  item and keeps ancestor panels open. Use it instead of `data-demo-trigger`
  inside a menu.
- `data-demo-select-trigger` / `data-demo-combobox-input` — open the select or
  combobox panel.
- `data-demo-toggle` — toggles `aria-pressed` on a button.
- `data-open-dialog="<id>"` / `data-close-dialog` — open a dialog by id or
  close the ancestor dialog.
- `data-demo-context` — marks a right-click area; the client opens its
  `.context-menu` and sets `--context-x` and `--context-y`.

Prefer a native control and event when it demonstrates the contract; add a
demo hook only for the interaction the docs page must simulate.

## Visual review

Start the preview once:
`pnpm --filter web astro preview --port 4323 --background`; stop it with
`pnpm --filter web astro preview stop`.

- One example:
  `pnpm --filter web run probe <item> --example "<title>" --eval "getComputedStyle(el.querySelector('.field')).rowGap"`.
  `--style`, `--scheme dark`, `--width`, `--html <fixture>`, `--shot <file>` and
  `--all-examples` cover the rest. `el` is the `section.example` root.
  `--shot-el` is resolved inside the selected example, or inside `#probe-root`
  with `--html`.
- Open overlays: `--eval "{ el.querySelector('[data-demo-trigger]').click(); }"`
  with `--shot-el ".component-preview"` captures the panel over the code area;
  the default `--shot` captures `.docs-preview` only. `--all-examples` applies
  the same pass to every example. A panel that opens past the preview edge is
  clipped; see "Overlays and clipping" below.
- Whole component across styles:
  `pnpm --filter web run styles:review <item> --scheme both`. It accepts the
  same `--eval`/`--shot-el` pair for open overlays.

Probe the rendered preview, not the source. Two field fixes (a bare `<hr>` that
the selector never matched, and a fieldset that shrink-wrapped as a flex item)
were invisible in the CSS and obvious in the browser.

### Overlays and clipping

`.component-preview` has `overflow: hidden`, and an element screenshot clips at
the element's box. A nested submenu, a tall menu near the viewport edge or any
panel that opens past the preview edge is missing from the capture even while
it is open. `--page` captures `.docs-content` inside the same clip, so it does
not bypass it.

To capture an overflowing panel:

1. Put the markup in a fixture with enough width and `min-height`.
2. Probe it with `--html <fixture>` and the default `--shot`. With `--html`,
   the default target is `#probe-root`; do not also pass
   `--shot-el "#probe-root"`.
3. The probe appends `#probe-root` to the end of `.docs-content`. For a
   `position: fixed` context menu, prepend it and reset the scroll in
   `--eval`: `{ el.parentElement.prepend(el); window.scrollTo(0, 0); ... }`.
4. If the panel belongs inside the example, give the example wrapper enough
   room instead of relying on the preview overflow.

The probe injects `transition: none !important; animation: none !important` to
keep captures stable, so computed `transition` and `animation` values read
`none`. Inspect the declared rule when the timing matters.

## Upstream reference

The `ui.shadcn.com/docs/components/...` pages return only navigation chrome in
the fetched markup; do not fetch them for example source. When a behavior
needs the upstream source, fetch it from `shadcn-ui/ui` on `main`:

- component source: `apps/v4/registry/bases/base/ui/<item>.tsx`
- docs example markup: `apps/v4/examples/base/<item>-<example>.tsx`
- style recipe: `apps/v4/registry/styles/style-<style>.css` (the `cn-<item>` block)

Use the GitHub contents API to list `apps/v4/examples/base` when you need the
example names, then fetch only the files you need. For overlay, row and surface
values, read the matching role recipe in `STYLE-GUIDE.md` first; use the
upstream style file only to confirm a value the guide does not cover.
`https://ui.shadcn.com/r/styles/base/<item>.json` is a 404; do not start there.
