# Expanding a component's examples

Use this when a request names a component and asks for more examples, or for
detail fixes found while reviewing it. The field, table and input work is the
reference for this checklist.

## Files

- `web/src/data/examples.ts` — example markup keyed by registry item name. The
  first `"Default"` entry renders as the hero and is removed from the Examples
  list; every other entry becomes a titled preview.
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
2. Add examples to `web/src/data/examples.ts` from simple to composed: default,
   vertical, horizontal, each control, groups, responsive, validation, RTL. Use
   unique `demo-<item>-*` ids. Add demo hooks only when the docs client must
   demonstrate behavior.
3. Run `pnpm registry:examples`. It regenerates the HTML and the item's
   `examples` field.
4. Update the evidence around the examples:
   - `notesBy` with the composition contract;
   - the `DESIGN.md` row when a class, attribute or part changed;
   - `optionalDependencies` for every item a new example composes.
5. Review visually (see below).
6. Add a `docs.spec.ts` test for every behavior you fixed. Assert a relation
   for container-driven sizes (`width > 448`), never the docs column width:
   the column is 622px at the default 1280px viewport.
7. Add a `style-matrix.spec.ts` case only when the style distance is part of
   the contract (for example the field row gap).
8. Run `pnpm test`, then one build plus the focused suite:
   `pnpm --filter web build` and
   `pnpm --filter web exec playwright test -g "<item>"`. Run
   `pnpm --filter web test:e2e` once, when the diff is final.
9. `git status` must show only source and regenerated files. Commit with
   `feat(registry): expand <item> examples and fix details`.

## Visual review

Start the preview once:
`pnpm --filter web astro preview --port 4323 --background`; stop it with
`pnpm --filter web astro preview stop`.

- One example:
  `pnpm --filter web run probe <item> --example "<title>" --eval "getComputedStyle(el.querySelector('.field')).rowGap"`.
  `--style`, `--scheme dark`, `--width`, `--html <fixture>`, `--shot <file>` and
  `--all-examples` cover the rest. `el` is the `section.example` root.
- Open overlays: `--eval "{ el.querySelector('[data-demo-trigger]').click(); }"`
  with `--shot-el ".component-preview"` captures the panel over the code area;
  the default `--shot` captures `.docs-preview` only. `--all-examples` applies
  the same pass to every example.
- Whole component across styles:
  `pnpm --filter web run styles:review <item> --scheme both`. It accepts the
  same `--eval`/`--shot-el` pair for open overlays.

Probe the rendered preview, not the source. Two field fixes (a bare `<hr>` that
the selector never matched, and a fieldset that shrink-wrapped as a flex item)
were invisible in the CSS and obvious in the browser.

## Upstream reference

The docs mirror shadcn's component pages. When a behavior needs the upstream
source, fetch it from `shadcn-ui/ui` on `main`:

- component source: `apps/v4/registry/bases/base/ui/<item>.tsx`
- docs example markup: `apps/v4/examples/base/<item>-<example>.tsx`

`https://ui.shadcn.com/r/styles/base/<item>.json` is a 404; do not start there.
