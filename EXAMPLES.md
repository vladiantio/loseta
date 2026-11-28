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
- `web/src/scripts/docs-client/demo.ts` — remaining demo-only handlers for
  toggle state, the indeterminate checkbox and install/code copy. The generator
  strips `data-demo-*` hooks from installed examples.
- `packages/loseta/registry/behaviors/` — shipped behavior modules. The docs
  import the entry modules from
  `web/src/scripts/docs-client/behaviors.ts`; do not duplicate them in `demo.ts`.
- `web/tests/behaviors/` — Playwright specs for shipped behavior, run against
  `web/src/pages/fixtures/behaviors.astro` outside `.component-preview`.
- `web/src/pages/fixtures/behaviors.astro` — noindex behavior fixture route;
  excluded from OG generation.
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
   `web/src/data/examples/index.ts`. Components with shipped behavior use public
   ARIA, slots and dialog action hooks; use demo hooks only for components that
   do not ship behavior yet. See "Demo hooks" below.
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
   the column is 622px at the default 1280px viewport. Behavior changes also
   belong in `web/tests/behaviors/<entry>.spec.ts`; do not encode keyboard,
   focus or dismissal checks only in the docs integration suite.
7. Add a `style-matrix.spec.ts` case only when the style distance is part of
   the contract (for example the field row gap).
8. Run `pnpm test`, then one build plus the focused suite:
   `pnpm --filter web build` and
   `pnpm --filter web exec playwright test -g "<item>"`. After changing example
   colors or surfaces, run the page axe case before the full suite:
   `pnpm --filter web exec playwright test -g "axe: /docs/components/<item>"`.
   Overlay components also need the open-panel case:
   `pnpm --filter web exec playwright test -g "open overlay panels"`.
   Behavior changes also need the fixture specs:
   `pnpm --filter web exec playwright test tests/behaviors --project=chromium`.
   Run `pnpm gate:e2e` once, when the diff is final.
9. `git status` must show only source and regenerated files. Commit with
   `feat(registry): expand <item> examples and fix details`.

## Public behavior hooks

Components that ship behavior use only public contract: ARIA roles and states,
`data-slot` parts, `aria-haspopup` / `aria-controls` and the dialog action
attributes. `data-open-dialog="<id>"` and `data-close-dialog` are public and
survive the generator; every other `data-demo-*` attribute is stripped from the
installed example.

- `data-open-dialog="<id>"` — open the referenced `<dialog>` with `showModal()`.
- `data-close-dialog` — close the nearest dialog.
- Sheet and Drawer triggers include static `aria-haspopup="dialog"`,
  `aria-controls` and `aria-expanded="false"`; the dialog behavior keeps
  `aria-expanded` synchronized.
- Sheet `[data-slot="sheet-content"]` — the single direct panel. Native
  `::backdrop` provides the overlay, so there is no overlay element or slot.
- Drawer `[data-slot="handle"]` — optional direct handle that enables
  pointer/touch swipe-to-close; keep it `aria-hidden="true"` and out of the tab
  order.
- `[data-slot="input"]` — hidden value input on select and single combobox.
- `[data-slot="copy"]` / `[data-slot="wrap"]` — Code Block copy and wrap
  controls; `data-copied` is the transient copy state.
- `[data-slot="close"]` — Toast dismissal and the Sheet corner close button.
- Toast uses an `ol.toaster` list of `li.toast` items; `[data-slot="content"]`
  is the live region with `role="status"` or `role="alert"` and
  `aria-atomic="true"`.
- `[data-slot="toast-template"]` — the authored `li.toast` skeleton cloned by
  the toast manager; `data-toast-icon="success|info|warning|error|loading"`
  templates supply the status icons.
- `.toaster.addToast(options)`, `.toaster.updateToast(id, options)`,
  `.toaster.closeToast(id?)` and `.toaster.promiseToast(promise, states)` —
  the Toast manager API. Options are `id`, `type`, `title`, `description`,
  `timeout`, `priority` and `actionProps`; load the behavior module first.
- `data-open-toast="<id>..."` — reveal one or more hidden toasts by id and
  restart their timers.
- `data-close-toast` — dismiss the nearest toast from an action or custom
  control.
- `data-limited` — behavior-owned state on toasts beyond the stack cap; they
  stay mounted with `inert` and hidden until newer toasts close.
- `data-duration` — Toast timer in milliseconds (`0` is persistent).
- `data-type` — Toast status type: `success`, `info`, `warning`, `error` or
  `loading`.
- `data-toast-limit` — maximum visible toasts per toaster (`3` by default, `0`
  disables the cap).
- Context menu areas use `aria-haspopup="menu"`, `aria-controls` and
  `tabindex="0"`.
- Calendar uses `data-selection`, `data-min`, `data-max`, `data-unavailable`,
  `data-month` and `data-date` on standard day buttons.
- Carousel controls use `[data-slot="previous"]` and `[data-slot="next"]`;
  indicators stay in DOM order.
- Questionnaire navigation uses `[data-slot="previous"]` and
  `[data-slot="next"]`.
- Message-scroller uses `[data-slot="jump"]`; the module owns `hidden`.

## Demo hooks

Hooks below are docs-only and are stripped by the generator. Use them only for
interactions the shipped behavior does not cover, never as a substitute for the
public contract; the full set lives in
`web/src/scripts/docs-client/demo.ts`.

- `data-demo` — legacy scope marker retained in a few examples; the generator
  strips it and the docs client no longer reads it.
- `data-demo-toggle` — toggles `aria-pressed` on a button.
- `data-demo-indeterminate` — sets the native indeterminate state.

Prefer a native control and event, or the shipped behavior, when it
demonstrates the contract; add a demo hook only for the interaction the docs
page must simulate.

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
- Open overlays: `--eval "{ el.querySelector('[aria-haspopup]').click(); }"`
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

- component source: `apps/v4/registry/bases/base/ui/<item>.tsx` or
  `apps/v4/registry/bases/radix/ui/<item>.tsx`
- docs example markup: `apps/v4/examples/base/<item>-<example>.tsx`
- style recipe: `apps/v4/registry/styles/style-<style>.css` (the `cn-<item>` block)

Use the GitHub contents API to list `apps/v4/examples/base` when you need the
example names, then fetch only the files you need. For overlay, row and surface
values, read the matching role recipe in `STYLE-GUIDE.md` first; use the
upstream style file only to confirm a value the guide does not cover.
`https://ui.shadcn.com/r/styles/base/<item>.json` is a 404; do not start there.
