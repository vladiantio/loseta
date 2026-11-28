# Changelog

## Unreleased

### Added

- Toast stacks are capped by `data-toast-limit` (`3` by default, `0` disables).
  Toasts beyond the cap stay mounted with `data-limited` and `inert`, and rejoin
  the visible stack as newer toasts close.
- Toast toasters now expose `addToast`, `updateToast`, `closeToast` and
  `promiseToast`. The manager clones the authored
  `[data-slot="toast-template"]` and `data-toast-icon` templates, supports id
  upserts, `priority`, `timeout` and `actionProps`, and keeps loading promise
  toasts persistent.
- Toast now supports `data-open-toast` triggers (one or more ids), a
  `data-close-toast` action hook and `data-type` status types
  (`success`, `info`, `warning`, `error`, `loading`) with a consumer-owned icon.
- Toast stacks the newest item in front, expands on hover/focus, pauses the
  whole stack, swipes in any direction and emits `toggle` alongside `dismiss`.
- Resizable now supports any number of panels and handles per group, with
  `--panel-min` and `--panel-max` percentage constraints, adjacent-only
  redistribution, double-click reset and `change` reporting every direct panel
  size.
- Resizable nested groups expose a hidden two-axis corner where an inner
  handle meets its immediate outer handle. Hovering changes the cursor and
  dragging moves both splits while the two separators keep keyboard access.
- Sheet now exposes optional `data-slot="sheet-content"` on its single direct
  panel and uses the shared `data-slot="close"` for the corner close button.
- Drawer now exposes `data-slot="drawer-content"` for its single direct panel
  and supports logical `inline-start` and `inline-end` placement in addition to
  top and bottom drawers.
- Drawer's optional handle now supports swipe-to-close with mouse, pen and
  touch. Successful swipes emit `dismiss` with `reason: "swipe"` before the
  existing close lifecycle; drawers without a handle are unchanged.
- Select options accept an optional `data-value` for the submitted value and
  fall back to the visible label. The shipped behavior syncs the authored
  `aria-selected="true"` option into the trigger, the placeholder state and the
  hidden input on load.
- Select panels support optional `[data-slot="scroll-up"]` and
  `[data-slot="scroll-down"]` controls. The shipped behavior reveals them only
  when the panel scrolls, scrolls on hover and steps on click.
- Select is item-aligned over the trigger by default: the selected (or first)
  row centers on the trigger value, the panel disables its enter transition in
  that mode and `data-align-trigger="false"` opts out. Coarse pointers and
  tight viewports fall back to the below-trigger popover.

### Changed

- Select follows the Base UI anatomy and the current shadcn v4 recipes across
  all eight styles: `data-placeholder` moves to the trigger, `data-size="sm"`
  only shortens the trigger, the trigger uses a fixed `--text-sm` (`--text-xs`
  in Lyra and Mira) and each style gets its shadcn padding, surface, ring,
  item, label and separator recipe. The shared listbox primitive carries the
  same item, label and separator recipe, so combobox and command inherit it. The
  panel keeps the shared `18rem` cap and the chevron rotation.
- Select scroll controls are absolute overlays with a popover-to-transparent
  gradient instead of inline bands. When the controls are present the panel
  hides its native scrollbar, the controls stay hidden on coarse pointers and
  the hover scroll steps one row at a time.
- Maia, Luma and Rhea overlay surfaces use the shadcn ring alpha: Maia 5% in
  both modes, Luma and Rhea 5% in light and 10% in dark. This applies to menus,
  context menus, popovers and listboxes.
- Toast follows the current shadcn v4 anatomy and visual language across all
  eight styles: a fixed viewport anchored at `1rem`, a `24rem` maximum width,
  the optional `content`/`icon`/`action` slots, centered content rows,
  status-type icons and the shared stacking motion. `.toaster` is a labelled
  `ol` list of `li` items, and `[data-slot="content"]` carries
  `role="status"`/`role="alert"` with `aria-atomic="true"`. The manager reads
  the authored toast and icon templates; the examples and Usage guide use the
  imperative API. Existing `.toaster`, `.toast`, direct `section`,
  `data-variant="destructive"` and `data-duration` markup remain valid.
- Menubar follows the current shadcn visual language across all eight styles: a
  transparent bar with per-style fixed heights, gaps, padding and radii, muted
  trigger states, per-style panel minimum widths and shared menu items with the
  indicator at the inline start. The examples now mirror shadcn's Default,
  Checkbox, Radio, Submenu, Icons and RTL demos.
- Resizable follows the current shadcn anatomy and visual language across all
  eight styles: a 1px separator with a 10px/20px hit target, optional 4×24px
  grip, 1px focus ring, panels without default padding and nested groups that
  reset the surface. Arrow keys move 5 percent without Shift, `aria-valuenow`
  reports the leading panel's share and `aria-valuemin`/`aria-valuemax` the
  reachable range. The examples now mirror shadcn's nested, vertical, handle,
  three-panel, constraints and RTL demos, plus a two-axis corner example.
- Sheet follows the current shadcn Base/Radix common anatomy and visual language
  across all eight styles while keeping the native dialog contract: popover
  surfaces, per-part padding, stacked footer actions, per-style typography and
  backdrops, square attached corners and 200ms directional motion with
  reduced-motion support.
- Sheet inline panels now use `75vw` below `40rem` and their size preset above
  it. Block panels size to content by default; `sm` and `lg` retain `50vh` and
  `90vh` maximums, and `--sheet-height` customizes the cap.
- Drawer follows the current shadcn Base UI anatomy and visual language across
  all eight styles: popover surfaces, directional borders and radii, per-style
  backdrops, stacked footer actions, optional handles and 450ms directional
  motion with reduced-motion support.
- Drawer `sm` and `lg` sizes now set maximum heights instead of fixed heights;
  the default is content-sized up to `calc(100dvh - 6rem)`.
- The Drawer swipe handle now spans the full swipe axis and draws its visible
  bar through `::after`, with vertical and horizontal dimensions defined per
  style.

### Fixed

- Select's item-aligned mode centers the anchored row in the listbox and clamps
  at both ends. Long lists keep their first group label above the anchored row,
  and the last items stay visible and aligned instead of falling below the
  scrolled viewport.
- Select now closes without the popover transition after choosing an item in
  item-aligned mode. The transition is restored once the panel is hidden, so the
  next below-trigger open keeps its normal motion.
- Select hides a one-pixel rounding overflow instead of showing a native
  scrollbar, which removes the stray scrollbar in the Right-to-left example.
- Toast entry now animates for the first toast in an empty toaster, and the
  stack reflow plus limited-toast reveal starts when a toast begins dismissing
  instead of waiting for its exit to finish.
- Toast examples now use the manager API from inline scripts, cover Default,
  With action, Types, Stacked, Persistent and Promise, and no longer
  auto-dismiss on page load.
- Menubar no longer centers panel menu items, keeps one top-level trigger in
  the tab order, switches between open top-level menus with
  `ArrowLeft`/`ArrowRight` and skips disabled triggers.
- Nested menu panels now anchor to their sub-trigger row, including when the
  `role="none"` wrapper sits inside a `role="group"`, and offset by the menu
  surface padding so their first item aligns with that row.
- Resizable handles now keep `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
  and `aria-controls` in sync with the leading panel in groups with more than
  two panels.
- Sheet triggers now maintain `aria-haspopup`, `aria-controls` and
  `aria-expanded`; examples link every description, use logical side labels and
  preserve header and footer position while the section scrolls.
- Drawer triggers now maintain `aria-haspopup`, `aria-controls` and
  `aria-expanded`, and drawer body typography and backdrop styling are applied
  consistently in every style.
- Floating Drawer styles now use a single inset popover surface instead of the
  legacy inner Vaul frame, removing the double border in Maia, Mira, Luma and
  Rhea.
- Inline Drawers no longer reserve handle space when no handle exists, and
  attached styles now draw their border on the free edge instead of the
  viewport edge.

## 0.22.1 - 2026-11-26

### Fixed

- The CLI now loads `@jetio/validator` through its CommonJS entry, so the
  published package works on the declared Node 22.0.0 minimum. Node 22.0.0 to
  22.6 parsed the dependency's ESM entry as CommonJS and failed with a missing
  `JetValidator` export.

## 0.22.0 - 2026-11-26

### Added

- A global documentation search palette, opened with `/` or `Ctrl/Cmd + K`,
  that searches pages and section headings with fuzzy filtering, grouped
  results, keyboard navigation and a generated `/search-index.json`.
- A docs Blocks gallery with Dashboard, Sidebar, Login and Signup
  compositions, previews, component install lists and accessibility coverage.
- `/llms.txt`, a curated entry point that maps coding agents to the canonical
  documentation and registry resources.

### Changed

- **Breaking:** Command now owns a popover surface, uses an `18rem` list with a
  hidden scrollbar and follows the current shadcn Base/Radix anatomy and Nova
  geometry. The search field gains `data-slot="command-input"`, and
  optional item indicators use `aria-selected="true"` independently of the
  active highlight. The search input group keeps its resting border and draws
  no focus shadow.
- Command filtering now uses fuzzy ranking, clamps keyboard navigation at the
  ends and supports group navigation. Disabled matches stay visible but are not
  navigable; activation remains a click and dialog closing stays app-owned.
- Upgraded `@topcli/prompts` to 4.x and migrated the prompt tests to the v4
  `PromptAgent` API.
- Raised the minimum supported Node.js version to 22.0.0, matching
  `@topcli/prompts` 4.x. Node 20 is no longer supported.
- Replaced `ajv` with the zero-dependency `@jetio/validator` for registry
  payload validation while preserving schema error reporting.

### Fixed

- Closing a menu now cancels pending hover timers, so a submenu no longer
  reopens after its parent closes.

### Migration

- Command is now the popover surface itself; remove an enclosing popover or
  card wrapper and keep the search field and listbox as its children.
- Wrap the command's input group in `<div data-slot="command-input">`.
- Optional `data-slot="indicator"` checks render only for options with
  `aria-selected="true"`; the active row keeps using `data-highlighted`.

## 0.21.0 - 2026-11-25

### Added

- End-to-end installation guides for Vite, Astro and manual CSS setup,
  covering scaffold paths, CSS imports, optional behavior loading and the
  Astro ClientRouter lifecycle.
- A pseudo-terminal test suite for interactive prompts, covering normal
  completion, cancellation and terminal raw-mode restoration. CI also runs
  the CLI tests on Node 20.12.0, the minimum supported version.
- Runtime dependency checks and reporting to keep the CLI dependency policy
  enforceable.

### Changed

- Replaced `citty` and `picocolors` with local Node-based command parsing,
  help formatting and terminal color helpers.
- Replaced `@clack/prompts` with the zero-dependency `@topcli/prompts` 2.x
  release and a local prompt adapter. Command behavior, help output and
  Ctrl-C cancellation are covered by regression tests.
- The CLI now declares Node 20.12.0 as its minimum supported version, matching
  `@topcli/prompts` 2.x. Node 20.0–20.11 is no longer supported.
- Standard output pipes closed by the reader, such as `loseta --help | head`,
  now exit cleanly instead of reporting an `EPIPE` error.

## 0.20.0 - 2026-11-21

### Changed

- The registry is served remotely from `https://loseta.vladiantio.com/r` and is
  no longer bundled in the npm tarball. `loseta` fetches the catalog and
  per-style item payloads, verifies catalog hashes, caches responses under the
  XDG cache directory and falls back to the cached catalog when the registry is
  unreachable. A cold install now requires network access; published 0.19.0 and
  earlier tarballs keep their bundled registries.
- Registry content is mutable and no longer carries a semantic version. The
  catalog reports `schemaVersion`, `minCliVersion` and a git `build`; an
  incompatible catalog fails with an upgrade message instead of installing a
  partial payload. `.loseta/manifest.json` records the registry URL, build and
  per-item URL sources instead of version fields.
- `loseta.json` accepts an optional `registry` URL. `--registry` and
  `LOSETA_REGISTRY` override it, and `--no-cache` bypasses the cache.
- `loseta add <url>` installs a style-bound component or primitive payload from
  an absolute URL after confirmation. URL installs accept only component and
  primitive items, resolve bare dependencies against the official registry,
  record their source in the manifest, and prevent `loseta style` from
  switching styles until they are removed.
- The authored registry, wire schemas and shared validation rules remain in
  `packages/loseta/registry/`; the docs build generates `/r/` and `/schema/v1/`
  from them. The `registry.version === package.version` rule is gone.

### Added

- Catalog, item payload and foundation schemas, per-style catalog hashes,
  remote registry and URL-install tests, and a local test registry server.

## 0.19.0 - 2026-11-21

### Added

- Behavior modules for calendar, carousel, resizable, questionnaire,
  message-scroller, tooltip and hover-card. Tooltip and hover-card share
  `hover-overlay.js`; all six entry modules are plain ESM with JSDoc types, no
  dependencies and no build step.
- Calendar renders the month, updates the title or native month/year selects,
  and handles single, range and multiple selection, unavailable dates, week
  numbers, RTL and keyboard grid movement. New public configuration:
  `data-selection="single|range|multiple"`, `data-min`, `data-max`,
  `data-unavailable`, `data-month` and `data-date` on standard day buttons.
- Carousel previous/next buttons, indicator clicks, keyboard
  arrows/Home/End, `aria-current` and `aria-hidden`/`inert` on fully offscreen
  slides, including vertical and RTL layouts. There is no autoplay or loop.
- Resizable pointer dragging and keyboard resizing for one handle between two
  adjacent panels, with live `aria-valuenow`, clamping to
  `aria-valuemin`/`aria-valuemax`, deferred pointer capture, missed-release
  recovery, focus release after a drag and `change` detail `{ sizes }`. Arrow
  keys move 5 percent, or 10 with Shift. Nested groups keep their own ratios,
  an optional `[data-slot="grip"]` child renders a visible grip, and the
  module exports `mount(root)` for late-mounted handles. There is no
  persistence.
- Questionnaire navigation with `[data-slot="previous"]` and
  `[data-slot="next"]`, step visibility, `aria-current="step"`, progress
  value/text, disabled end states and focus into the new step. Validation and
  completion stay app-owned.
- Message-scroller following, reading-position preservation, jump-button
  visibility and `change` detail `{ following }`. It uses the second and final
  scoped `MutationObserver` on `[data-slot="content"]` and exports
  `mount(root)` for late-mounted lists.
- Tooltip and hover-card Escape dismissal, `aria-hidden` state and focus
  return through the shared `hover-overlay.js` module. The CSS hover and
  focus-within rules remain the no-JS fallback; the tooltip `data-tooltip`
  shorthand stays CSS-only.
- Six Playwright behavior specs, carousel vertical and RTL examples, a calendar
  multiple-selection example, resizable vertical, grip, initial-size,
  constraint, RTL and nested examples, and no-JS coverage for the new
  controls.

### Changed

- Calendar examples carry `data-month`, `data-date`, `data-selection` and
  `data-unavailable`; the header buttons use `[data-slot="previous"]`/`next`
  and the selects use `[data-slot="month"]`/`year`.
- Carousel, questionnaire and message-scroller examples no longer use
  `data-demo-*` hooks; the shipped modules own their interaction.
- Tooltip and hover-card CSS open selectors respect
  `[aria-hidden="true"]` so Escape can close behavior-managed content.
- `/docs/behavior` now documents 22 behavior-bearing components, the calendar
  contract, the message-scroller observer exception and the four CSS-only
  components.
- Calendar custom day content, presets, date-time logic and multi-calendar
  range coordination remain app-owned; carousel autoplay/looping, resizable
  persistence, questionnaire validation/completion and per-digit OTP focus
  remain out of scope.

## 0.18.0 - 2026-11-20

### Added

- Optional behavior modules for dialog, alert-dialog, sheet, drawer, popover,
  dropdown-menu, context-menu, menubar, navigation-menu, tabs, select,
  combobox, command, toast and code-block. Modules are plain ESM with JSDoc
  types, no dependencies and no build step. Entry modules self-initialize;
  `core.js` and `listbox.js` are support modules.
- `loseta add` installs behavior by default; `--no-behavior` keeps the
  CSS-only install and `--behavior` backfills missing modules for installed
  items. The manifest tracks behavior targets and the CLI generates
  `behaviors/index.js` from the installed entry modules.
- Per-item `behaviors` metadata in `registry.json` with `entry` / `support`
  kinds; the registry validator checks target declarations, ESM parsing,
  relative imports, unreferenced modules and a Playwright spec per entry.
- A docs Behavior page, per-component behavior sections and a noindex
  `/fixtures/behaviors` route. Playwright covers the behavior specs in
  Chromium, WebKit and Firefox plus a no-JavaScript project.

### Changed

- Dialog, alert-dialog, sheet and drawer use the shipped dialog behavior.
  `data-open-dialog` and `data-close-dialog` are now public action hooks and
  survive example generation.
- Context-menu areas use `aria-haspopup="menu"`, `aria-controls` and
  `tabindex="0"`; the behavior sets the coordinates and manages focus.
- Command inputs use `role="combobox"`, `aria-controls`, `aria-expanded` and
  `aria-autocomplete="list"`; the behavior filters and activates options but
  leaves closing the containing surface app-owned.
- Select and single-combobox examples include a `[data-slot="input"]` hidden
  input; the behavior syncs it and dispatches `change` with `detail`.
- Code Block copy/wrap controls use `[data-slot="copy"]` and
  `[data-slot="wrap"]`; copies expose transient `data-copied`, and the base
  style swaps the copy glyph for a check.
- Menus, popovers, select, combobox and toast no longer rely on docs demo
  hooks; the docs site imports the shipped modules directly.
- The registry positioning is now CSS-first with optional behavior rather than
  CSS-only. The docs and this baseline describe the no-JavaScript contract:
  static content and page navigation stay readable, while overlays and
  selection widgets may be inert.

## 0.17.0 - 2026-11-20

### Added

- Expanded examples for badge, breadcrumb, calendar, card, kbd, native-select
  and select. The new cases cover icons, spinners, links, ellipsis and text
  menus, month and year selectors, ranges, presets, date pickers, images,
  spacing, key groups, option groups, disabled and invalid states, scrolling
  and right-to-left layouts.
- Badge `data-icon="inline-start|inline-end"` tightens the edge that holds the
  icon; badges report loading with `aria-busy="true"`, draw the invalid state
  with `aria-invalid="true"` and compose on an `a`.
- Breadcrumb items accept menu-trigger buttons, including inside a
  `.dropdown-menu` or `.popover` wrapper, and custom separators;
  `data-rtl-flip` mirrors directional separator icons.
- Calendar headers accept `[data-slot="caption"]` with native month and year
  selects in `[data-slot="dropdown"]`; a grid with `aria-multiselectable="true"`
  draws ranges and multiple selections as a continuous `--muted` band, and week
  numbers use row headers.
- Card exposes `--card-spacing` for the section gap and inline inset, and a
  direct leading or trailing `img` fills the card width.
- Kbd `.kbd-group` joins related keys. Shortcut hints stay aligned inside menu
  items, and keys inside tooltip content keep contrast on the inverted surface.
- Select panels cap at `18rem` with contained scrolling and style
  `[role="separator"]` dividers between option groups.
- The docs site emits canonical, Open Graph and Twitter metadata with a
  generated `1200x630` card for every page and an `og:preview` script.

### Changed

- Tooltip is now a wrapper around the trigger. Put `data-tooltip` on the
  wrapper for a text bubble, or add a direct `[data-slot="content"]` child with
  `role="tooltip"` and an id, referenced by `aria-describedby` on the trigger.
  The content child enables rich markup such as `kbd` and wins when both
  sources are present.
- The pointer is now a masked tail based on daisyUI's tooltip and is always
  rendered. `data-arrow` is removed.
- Hover and `:has(:focus-visible)` on the wrapper open the tooltip; disabled
  triggers remain pointer-only.
- Styles set the tooltip bubble radius with `--tooltip-radius` and derive the
  tail offset from it.
- Input OTP is now a label wrapper: `.input-otp` holds one
  `[data-slot="cell"]` span per code position and a `[data-slot="entry"]`
  around the native input. `data-spacing="joined"` connects the cells,
  `data-size="default|sm|lg"` sizes them, and the cell count must match the
  input's `maxlength` and `pattern`. The active cell indicator follows the end
  of the typed value; a completed code rings all cells. This is a breaking
  markup change.
- Badge focus and invalid rings moved from the base file to the style files so
  they paint above variant borders. Maia and Mira tint the outline variant,
  and Sera widens its key gap and keeps zero padding at the icon edge.
- Card spacing is a single style-defined `--card-spacing`, so `data-size="sm"`
  only lowers the value.
- Native select and Select use the base type scale below `48rem` and return to
  the `sm` scale at wider viewports; disabled native selects no longer take
  pointer events.
- Calendar header arrows and caption dropdowns use the `sm` control size.
- Menu shortcut alignment applies to menu items only, so nested content keeps
  its own layout.

### Fixed

- The tooltip bubble scales from its attachment edge and the tail scales in
  place, so the seam stays closed across placements and RTL.
- The Input OTP active cell follows the end of the typed value, a completed code
  rings all cells, and the row stays LTR inside an RTL field.
- Link and button styling in a breadcrumb applies to the item control only, and
  menu triggers align their icons with the link items.
- Calendar presets, unavailable dates, date-time and date-picker compositions,
  RTL arrows and selected ranges follow the documented contract in every style.
- Card images no longer break the rounded surface or the section spacing.
- Kbd keeps default text at `--foreground`; `--muted-foreground` failed WCAG AA
  on `--muted`.
- Native select keeps a forced-colors outline, and its `sm` size matches the
  compact field scale.
- Select keeps its trigger text from overflowing in narrow containers, and
  option groups, dividers and the scrollable panel match the listbox contract.
- Maia, Mira and Sera badge recipes match the reference for outline tint, icon
  edge and focus ring.

### Migration

- Move `.tooltip` from the trigger to a wrapper element and move `data-tooltip`
  to that wrapper.
- For rich content, add `<span data-slot="content" role="tooltip" id="...">`
  after the trigger and point `aria-describedby` at it.
- Remove `data-arrow`; the tail is part of every tooltip.
- Move `.input-otp` from the input to a `<label>` wrapper, add one
  `[data-slot="cell"]` span per code position, and put the native input in a
  `[data-slot="entry"]` wrapper with an accessible name, `required` and a
  full-length `pattern`. The old bare-input markup is no longer supported.

### Notes

- The registry still has 62 stable components and no experimental items.
- Examples are docs-only. The registry remains CSS-only; no JavaScript behavior
  was added.

## 0.16.0 - 2026-11-18

### Added

- Expanded examples for alert, alert-dialog, avatar, button, button-group,
  checkbox, command, context-menu, dialog, drawer, dropdown-menu, empty, field,
  input, input-group, input-otp, menubar, navigation-menu, popover, progress,
  radio, sheet, sidebar, slider, switch, table, textarea, toggle, toggle-group
  and tooltip. The new cases cover sizes, variants, composition, validation,
  disabled, forced-colors, right-to-left and responsive layouts.
- Avatar group counts: `[data-slot="count"]` follows the group size and uses
  the fallback type and icon scale in every style.
- Checkbox `:indeterminate` now draws a current-color dash.
- Input group custom controls opt into the group geometry and focus ring with
  `data-slot="input-group-control"`.
- Table checkbox cells accept a native `input[type="checkbox"]`, and a row with
  an expanded trigger keeps the muted highlight.
- Sidebar `[data-slot="group-label"]`, `[data-slot="group-action"]`,
  `[data-slot="menu-badge"]` and `[data-slot="menu-action"]` parts.
- Field content sections, `hr`-based field separators and labels that wrap a
  `.field` as a selectable card; navigation-menu link icons; checkable context
  and dropdown menu items.
- Sheet `block-start`/`block-end` sides and a documented close control; drawer
  handles are optional and `sm`/`lg` set explicit heights.
- Popover panels are documented and validated as labelled `role="dialog"`
  panels with focus management.
- Tooltip text wraps at `20rem` and the bubble fades and scales in on hover and
  focus.
- Component pages lead with a Default example and an Installation heading.

### Changed

- Progress uses slimmer per-style heights; Nova drops to `0.25rem` from
  `0.5rem`, and the documented scale is updated.
- Input group addons now follow the control in the DOM, and `data-align`
  defaults to `inline-start` so the control keeps its tab order.
- Tooltip defaults to `data-side="top"` and `data-align="center"`; placement no
  longer shifts while the bubble fades in.
- Dialog, drawer and sheet sections scroll between a fixed header and footer.
  Dialog footers accept `data-align="start"`, and button groups keep
  size-specific outer radii and stay above nested picker panels.
- `registry:check` now enforces style selector parity, logical properties in
  style files, example dependency declarations, unique IDs and ARIA
  references, the popover dialog contract and shared overlay recipes.

### Fixed

- Accordion and collapsible content stays rendered while it collapses, so the
  close animation runs instead of cutting off.
- Button padding mirrors in RTL and buttons used on anchors no longer inherit
  underlines.
- Checkbox, radio and switch keep their focus rings and state in forced-colors
  mode and have larger pointer targets; the switch thumb no longer overflows.
- Avatar badges and group counts are no longer clipped, and the group overlap
  no longer covers fallback initials.
- Empty draws its dashed outline and keeps media spacing and image ratios.
  Inputs and textareas share selection colors and focus outlines, and the Mira
  line height is corrected.
- Slider, progress, toggle-group and input-group geometry and right-to-left
  behavior are aligned across styles. Progress keeps its track and indicator
  visible in forced colors, and Kbd contrast is raised on muted surfaces.
- Popovers animate from their placement side, the Rhea overlay radius matches
  the menu primitive, and Mira ships the missing input and textarea selectors.
- Table captions and selected rows, sidebar group and row parts, sheet and
  drawer sizing, command dividers and menu scrolling follow the documented
  contract in every style.

### Notes

- The registry still has 62 stable components and no experimental items.
- Examples are docs-only. The registry remains CSS-only; no JavaScript behavior
  was added.

## 0.15.0 - 2026-11-15

### Changed

- Promoted `attachment`, `bubble`, `marker`, `message`, `message-scroller`,
  `questionnaire` and `trace` to stable. They now ship all eight styles and are
  covered by the v1 contract.
- All 62 registry components are stable. The experimental pipeline, CLI flag
  and Nova-only rule remain for future items.

### Notes

- The registry now has 62 stable components and no experimental components.
- `loseta add all` installs every component.
- Docs recipes, Direction and Sonner notes remain documentation-only.

## 0.14.0 - 2026-11-15

### Changed

- Promoted `calendar`, `carousel`, `chart`, `command`, `combobox`,
  `resizable`, `select` and the `listbox` primitive to stable. They now ship all
  eight styles and are covered by the v1 contract.

### Fixed

- Select placeholder text now switches to the foreground color on hover, focus
  and expanded states, meeting the 4.5:1 contrast threshold on the muted hover
  surface.

### Notes

- The registry now has 55 stable components and 7 experimental components.
- All four primitives are stable.
- The eight promoted items install without `--experimental` in every style, and
  `loseta add all` includes the components.

## 0.13.0 - 2026-11-15

### Changed

- Promoted `context-menu`, `drawer`, `hover-card`, `menubar`,
  `navigation-menu`, `sheet` and `toast` to stable. They now ship all eight
  styles and are covered by the v1 contract.

### Fixed

- Sheet and drawer titles and descriptions now use the intended type scale.
  The selectors skipped the `header` wrapper, so those parts rendered at
  browser defaults.

### Notes

- The registry now has 48 stable components and 14 experimental components.
- The seven promoted components install without `--experimental` in every
  style, and `loseta add all` includes them.

## 0.12.0 - 2026-11-15

### Changed

- Promoted `accordion`, `breadcrumb`, `collapsible`, `input-group`,
  `input-otp`, `pagination`, `scroll-area`, `sidebar` and `slider` to stable.
  They now ship all eight styles and are covered by the v1 contract.

### Notes

- The registry now has 41 stable components and 21 experimental components.
- The nine promoted components install without `--experimental` in every
  style, and `loseta add all` includes them.

## 0.11.0 - 2026-11-15

### Changed

- Promoted `aspect-ratio`, `avatar`, `progress`, `separator`, `spinner`,
  `toggle` and `toggle-group` to stable. They now ship all eight styles and are
  covered by the v1 contract.
- Fixed pressed outline toggles to use the accent surface instead of the outline
  background in every style.

### Notes

- The registry now has 32 stable components and 30 experimental components.
- The seven promoted components install without `--experimental` in every
  style, and `loseta add all` includes them.

## 0.10.0 - 2026-11-15

### Added

- Seven experimental conversation components: attachment, bubble, marker,
  message, message-scroller, questionnaire and trace.
- Docs-only message-scroller jump-to-latest and questionnaire step navigation.
- Docs-only recipes for Form, Data table and Date picker, plus a Typography
  guidelines page.
- Direction documentation for the native `dir` attribute and a Sonner
  compatibility note on the Toast page.
- `data-align`, `aria-busy="true"` and `aria-current="step"` are part of the
  documented state contract.

### Notes

- The registry now has 62 components: 25 stable and 37 experimental. All 65
  shadcn `registry:ui` names are accounted for.
- Experimental components remain outside the v1 compatibility contract and
  ship only the Nova style.
- Form, data-table, date-picker and typography stay docs-only; direction and
  Sonner are native/third-party concerns. Promotion of experimental items is a
  separate phase.

## 0.9.0 - 2026-11-15

### Added

- Six experimental components: calendar, carousel, chart, resizable, sidebar
  and toast. They replace the chart, sidebar and toast drafts.
- Chart consumes `--chart-1` through `--chart-5` through `data-series`.
- Sidebar consumes `--sidebar-*`; toast and the remaining overlays use the
  existing popover, border and status tokens.
- Docs-only carousel scrolling and toast dismissal. The registry remains
  CSS-only.

### Notes

- Experimental components remain outside the v1 compatibility contract and
  ship only the Nova style.
- Calendar navigation, carousel scrolling/autoplay, chart rendering, resizable
  dragging and toast timing are consumer JavaScript concerns.
- `sonner` remains a documentation compatibility note, not a registry item.

## 0.8.0 - 2026-11-15

### Added

- Experimental `listbox` primitive shared by `select`, `combobox` and
  `command`. It styles listboxes, options, groups, labels, empty states and
  selected indicators for the Nova style.
- Three experimental components: select, combobox and command. They replace
  the select, combobox and command drafts.
- Docs-only selection, filtering, clearing and command-palette behavior. The
  registry remains CSS-only.

### Notes

- Experimental components remain outside the v1 compatibility contract and
  ship only the Nova style.
- Select, combobox and command do not open, filter, select or move focus; those
  are consumer JavaScript concerns. Command has no surface and is composed
  inside a dialog, popover or card.

## 0.7.0 - 2026-11-15

### Added

- Five experimental components: collapsible, input-group, input-otp,
  scroll-area and slider. They replace the collapsible, input-group, range and
  scrollbar drafts.
- `scroll-area` consumes the reserved `--scrollbar-track`, `--scrollbar-thumb`,
  `--scrollbar-width`, `--scrollbar-sm-width` and `--scrollbar-radius` tokens.
- `input-group` addons (`[data-slot="addon"]`) support inline and block
  placement, and the group owns the focus and invalid rings.
- `input-otp` styles a single native input; `slider` uses a native range input
  with `accent-color` and no JavaScript fill logic.

### Changed

- The draft `range` component is now `slider`; the draft `scrollbar` component
  is now `scroll-area`.

### Notes

- Experimental components remain outside the v1 compatibility contract and
  ship only the Nova style.
- Sliders keep native tracks and thumbs; OTP inputs do not auto-advance or draw
  per-digit slots; input-group addons do not focus the control when clicked.
  Those are consumer JavaScript concerns.

## 0.6.0 - 2026-11-15

### Added

- Stable `menu` primitive shared by `dropdown-menu`, `context-menu` and
  `menubar`. It owns the menu item, heading, separator, shortcut and indicator
  rules in all eight styles.
- Six experimental components: context-menu, drawer, hover-card, menubar,
  navigation-menu and sheet. They are Nova-only and install with
  `--experimental`.
- `dialog-shell` side and bottom placements for sheets and drawers, driven by
  `data-side` on the dialog.
- Docs demo support for multiple menu triggers and pointer-positioned context
  menus.

### Changed

- `dropdown-menu` now depends on the `menu` primitive. Its public markup is
  unchanged, but installs add `primitives/menu.css` and the selected style's
  `primitives/menu.css`.
- `dialog-shell` now also covers `.sheet` and `.drawer` and recognizes
  `data-side="inline-start|inline-end|block-start|block-end"`.

### Notes

- Experimental components remain outside the v1 compatibility contract and
  ship only the Nova style.
- Sheets and drawers do not ship drag, swipe or focus-trap behavior; context
  menus do not track the pointer; menubars and navigation menus do not ship
  roving focus or mobile layouts. Those are consumer JavaScript concerns.

## 0.5.0 - 2026-11-15

### Added

- Experimental registry pipeline: items with `status: "experimental"` are
  published and installable with `loseta add <name> --experimental`, ship
  exactly one Nova style file and appear in docs with an Experimental banner and
  a dedicated stylesheet. `loseta list --experimental` lists them.
- Ten experimental components: accordion, aspect-ratio, avatar, breadcrumb,
  pagination, progress, separator, spinner, toggle and toggle-group. Accordion,
  avatar, breadcrumb and progress replace drafts that lived in
  `packages/loseta/experimental/`.

### Changed

- `loseta add all` remains stable-only. Passing `--experimental` with only
  stable names, or with `all`, is an error.
- `loseta add` rejects experimental items outside a Nova project, and
  `loseta style` refuses to switch away while an experimental item is
  installed.
- `loseta list --all` now includes experimental components in addition to
  primitives and foundation items.
- Docs generate `web/public/styles/loseta-experimental.css` from the
  experimental base and Nova style files; the stylesheet loads only on
  experimental component pages.
- `DESIGN.md` and `GLOSSARY.md` document the experimental pipeline, the new
  state hooks (`aria-current`, `aria-pressed`, `[open]` on `details`,
  `:indeterminate`, `inert`) and the ten component APIs.

### Notes

- Experimental items are outside the v1 compatibility contract and are
  Nova-only. Promotion requires all eight style files, examples, docs, tests
  and a baseline update.
- There is no `loseta remove` command yet; removing an experimental item before
  a style switch is a manual file and manifest edit.

## 0.4.0 - 2026-11-14

### Added

- `loseta init` prompts for the style with a selector that lists every registry
  style with its title and description. An explicit `--style` or a stored style
  is validated before prompting; an unknown stored style falls back to `nova`
  with a warning.

### Changed

- **Breaking:** `reset.css` is now a preflight-style reset. It normalizes
  padding, margins, borders, tables and form controls, applies default
  `--font-sans` and `--font-mono` stacks with system fallbacks, and adds
  cross-browser input and focus fixes. Consumers that relied on the host
  document's typography should set those custom properties or ship their own
  font rules.
- **Breaking:** Dark mode now follows `prefers-color-scheme` by default. Color
  tokens use `light-dark()` pairs where the light and dark values differ; `.dark`
  still forces dark, new `.light` forces light, and either class works on any
  container. Custom dark tokens must use `light-dark()`; a
  `.dark { --token: ... }` block no longer applies to system dark mode. Data-URI
  icon tokens keep a small media/class override because `light-dark()` only
  accepts colors.

## 0.3.0 - 2026-11-14

### Added

- All eight shadcn/ui styles: Nova (default), Vega, Maia, Lyra, Mira, Luma,
  Sera and Rhea. Each style covers every component and primitive, and the docs
  style switcher previews all eight across the site.
- Multi-style registry: `registry.json` declares the available styles and every
  component and primitive ships one style file per declared style. The CLI
  installs only the files for the selected style.
- `loseta style <name>` switches the visual style of an installed project,
  rewrites the style files, updates `loseta.json` and regenerates `index.css`.
- `/docs/styles` catalog and a docs-only style switcher that loads the
  generated stylesheet for each style.
- `loseta init --style` and `loseta add --style` select the style
  (default: `nova`).
- Code Block component with an optional header, actions, line numbers, diff and
  highlighted lines, wrap and size variants, and a destructive variant.
- Docs code snippets now use the registry Code Block anatomy.

### Changed

- **Breaking:** renamed the visual axis from "theme" to "style" to match
  shadcn/ui vocabulary. `loseta.json` now uses the `style` key instead of
  `theme`, the CLI flag is `--style`, installed visual files live under
  `styles/<name>/` instead of `themes/<name>/`, the registry file role is
  `style`, and the cascade layer is `loseta.style` instead of `loseta.theme`.
  Projects created with 0.1.0 must rename the config key, move the installed
  `themes/` directory to `styles/`, and re-add their items; the CLI reports the
  required steps when it reads an old config.
- The docs color-scheme preference now uses the storage key `scheme` and the
  `data-scheme` attribute instead of `theme` and `data-theme`.
- `loseta add` now records the registry version on the install manifest.
- Re-running `loseta init` warns that installed items stay on disk but are no
  longer tracked, and names `loseta add all` as the restore command.

### Notes

- Nova remains the default style. Styles change geometry, spacing, control
  sizes, radii and type scale; anatomy, markup, tokens and the state contract
  are shared.

## 0.1.0 - 2026-11-12

### Added

- Native CSS registry with 24 stable components.
- `loseta` CLI with `init`, `add`, `list`, `add all` and `--html`.
- Foundation files: tokens, reset, base and `sr-only`.
- Nova visual theme with light/dark tokens.
- Internal `popover-primitive` and `dialog-shell` dependencies.
- Registry JSON Schema, integrity validation and generated examples.
- Astro docs site that imports the registry CSS directly.
- Playwright + axe coverage for every docs page in light and dark mode.

### Changed

- The package, CLI, config file, manifest directory and CSS layers now use the
  `loseta` name.

### Notes

- The library is CSS-only. Components that need interaction document the
  required ARIA and data-attribute contract; the docs use a demo-only script.
- Experimental components live in `packages/loseta/experimental` and are not
  part of the published package.
