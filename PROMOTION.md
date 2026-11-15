# Promotion plan

This document tracks the promotion of every experimental registry item to
stable. It is the working plan for the promotion phase that follows `0.10.0`.

## Scope

- 37 experimental components plus the `listbox` primitive: **38 items**.
- Seven additional style files per item: **266 new style files**.
- End state: **62 stable components, 0 experimental components**, and all four
  primitives stable.
- The experimental pipeline, CLI flag, schema and docs path stay in place for
  future experimental work.

Promotion is not a mass rename. A stable item ships all eight styles, a docs
page without the experimental banner, an install command without
`--experimental`, contract coverage, browser coverage and a release.

## Constraints

- The validator has no “in review” state. An experimental item must ship exactly
  one Nova style file, so its status can only flip when all eight files exist.
- `listbox` is experimental and is a hard dependency of `select`, `combobox` and
  `command`. It must be promoted in the same batch as its consumers or earlier.
- Unit and docs tests currently hard-code `accordion` and `toggle-group` as
  experimental. They must be refactored before the first promotion.
- Style variants are design work, not copies. A Nova clone passes validation but
  fails the style contract.
- Visual review and installation in every style are part of the definition of
  done, not optional follow-up.

## Phase 0 — promotion infrastructure

No release. One infrastructure commit.

### 1. Style guide

Write [`STYLE-GUIDE.md`](STYLE-GUIDE.md) with:

- the per-style personality table (radii, heights, density, type, shadows);
- role recipes for controls, fields, surfaces, overlays, rows, chips and
  conversation parts;
- explicit Sera, Lyra, Maia/Luma, Mira and Rhea special cases;
- a reference-component map for every promoted item;
- the promotion checklist.

Link the guide from `DESIGN.md` and `AGENTS.md`.

### 2. Promotion scaffolder

Add `packages/loseta/scripts/promote-items.mjs`:

- accepts experimental component or primitive names;
- verifies the item is experimental and has exactly one Nova style file;
- copies Nova into the other seven styles with a
  `/* loseta:promotion-scaffold */` marker;
- updates `status` and appends style files in declared style order;
- refuses to overwrite existing non-Nova style files;
- prints the remaining review steps.

Add a validator rule: a stable style file containing
`loseta:promotion-scaffold` fails. The marker is removed only after the style
has been differentiated and reviewed.

### 3. Test refactor

- Add a fixture registry for `add-policy` and `style-switch` tests.
- Make `add all` coverage dynamic: every stable component included, every
  experimental item excluded.
- Add invariants:
  - no stable item depends on an experimental item;
  - every stable component and primitive has exactly one style file per declared
    style.
- Replace the hard-coded experimental install test with a dynamic one or a
  stable-item equivalent.
- Make the docs experimental-banner test choose the first experimental
  component and skip when none exist.

### 4. Style QA

- Add `web/tests/style-matrix.spec.ts`: load a representative stable page in
  every style, assert a signature computed style changes, and run axe in light
  and dark. Expand the page list as items are promoted.
- Add `web/scripts/style-review.mjs`: screenshot each promoted item’s first
  preview in every style, compose contact sheets with ImageMagick, and leave
  them outside the repository. This is a review tool, not a CI snapshot test.

### 5. Baseline gate

Run the full gate and commit:

```bash
pnpm registry:examples
pnpm docs:css
pnpm registry:check
pnpm test
pnpm --filter web test:e2e
pnpm cli:smoke
```

## Batches

Each batch is one release. Do not start the next batch until the previous one is
published and verified.

| Release | Batch | Items | Files | Weight |
| --- | --- | --- | ---: | --- |
| `0.11.0` | Simple controls and feedback | `aspect-ratio`, `avatar`, `progress`, `separator`, `spinner`, `toggle`, `toggle-group` | 49 | light |
| `0.12.0` | Navigation and disclosure | `accordion`, `collapsible`, `breadcrumb`, `input-group`, `input-otp`, `pagination`, `scroll-area`, `sidebar`, `slider` | 63 | medium |
| `0.13.0` | Overlays and menus | `context-menu`, `drawer`, `hover-card`, `menubar`, `navigation-menu`, `sheet`, `toast` | 49 | medium |
| `0.14.0` | Listbox, pickers and data | `listbox`, `calendar`, `carousel`, `chart`, `command`, `combobox`, `resizable`, `select` | 56 | medium |
| `0.15.0` | Conversation | `attachment`, `bubble`, `marker`, `message`, `message-scroller`, `questionnaire`, `trace` | 49 | heavy |

Counts after each release:

- `0.11.0`: 32 stable / 30 experimental components.
- `0.12.0`: 41 / 21.
- `0.13.0`: 48 / 14.
- `0.14.0`: 55 / 7; all four primitives stable.
- `0.15.0`: 62 / 0.

Dependency notes:

- `toggle-group` needs `toggle`; same batch.
- `sidebar` needs `collapsible`; same batch.
- `listbox` is promoted first within batch 0.14.0, before `select`, `combobox` and
  `command`.
- `message` uses `avatar` (0.11.0) and `bubble` (same batch);
  `message-scroller` composes both in the same batch.

## Per-item workflow

1. Scaffold the item with the promotion script.
2. Read the base and Nova files and list every visual decision: height, radius,
   padding, gap, type, shadow and state color.
3. Map each decision to a role recipe and fill the seven style files. Remove the
   scaffold marker.
4. Diff each new style file against the same style’s reference stable component.
   Geometry must match the style, not Nova.
5. Audit the base file:
   - move clearly visual values (radius, shadow, spacing, typography) into style
     files;
   - keep structural state tokens in the base;
   - use logical properties;
   - keep forced-colors outlines and reduced-motion guards.
6. Purely structural items (`aspect-ratio`, `separator`, `spinner`,
   `scroll-area`) may ship identical style files. Do not invent differences.
7. Screenshot-review every item in all eight styles, light and dark, at 1280px
   and 375px. Check clipping, density, focus, hover, selected, disabled and
   invalid states.
8. Update docs copy and contract rows, then run the batch gate.

## Per-batch gate

- [ ] `pnpm registry:check`
- [ ] `pnpm test`
- [ ] `pnpm --filter web test:e2e`
- [ ] `pnpm cli:smoke`
- [ ] `pnpm registry:examples && pnpm docs:css` produces no diff
- [ ] Visual contact sheets reviewed for every item × 8 styles
- [ ] Install matrix: each style installs one batch item; `loseta style` switches
- [ ] `grep -rn experimental` is clean for promoted items in docs and README
- [ ] Counts in `DESIGN.md` and `README.md` match `registry.json`
- [ ] `git diff --check`; only intended source and generated files changed

Release procedure follows [`RELEASING.md`](RELEASING.md): promotion commit,
version and changelog commit, tag, push, GitHub release, watch Publish, then
verify `npm view loseta version` and a fresh install.

## Final cleanup after 0.15.0

- `DESIGN.md`: 62 stable, 0 experimental; `listbox` stable; remove the
  experimental list and stale gaps about experimental `listbox` and `select`.
- `README.md` and `packages/loseta/README.md`: stable list, counts and
  experimental wording.
- Docs:
  - `installation.astro`: remove the concrete `accordion --experimental` example
    and describe the flags as future-facing.
  - `components/index.astro`: conditional lead text so it does not say
    “0 experimental”.
  - `styles.astro`: every stable component ships all eight styles.
  - `recipes/date-picker.astro`: remove the `experimental` prop and
    `--experimental` command.
  - `data/components.ts`: update the native-select note.
  - `data/examples.ts`: remove the “experimental bundle” conversation copy.
- CLI: `list --experimental` prints “No experimental components” instead of an
  empty heading; `add` without names does not print the experimental hint when
  none exist.
- Tests: keep the experimental banner test dynamic and skipped when empty; keep
  policy coverage on fixtures.
- Generated artifacts: `loseta-experimental.css` becomes empty; all eight style
  bundles include every component.
- Keep the experimental flags, schema and bundle for future items.

## Risks

| Risk | Mitigation |
| --- | --- |
| Nova clones committed as styles | Scaffold marker, validator guard, reference diffs, visual review |
| Sera and Lyra special rules missed | Role recipes and a per-style checklist for fields and headings |
| Cross-component coupling breaks a style | Batch ordering and joint review of coupled items |
| Tests fail mid-phase from hard-coded names | Phase 0 fixture refactor |
| Contrast or clipping only in dense styles | Style-matrix axe and 375px screenshots |
| Release fatigue | Five small releases; do not ship one 266-file release |
| Docs claim stable before review | Review the worktree before committing the status flip |
| Bundle growth | Expected; check generated CSS sizes per batch |

Promotion ends at `0.15.0`, not `1.0.0`. Full parity is a prerequisite for 1.0,
but the stability and compatibility decision is separate.
