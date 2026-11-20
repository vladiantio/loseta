# Changelog

## Unreleased

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
- Input OTP is now a label wrapper: `.input-otp` holds one
  `[data-slot="cell"]` span per code position and a `[data-slot="entry"]`
  around the native input. `data-spacing="joined"` connects the cells,
  `data-size="default|sm|lg"` sizes them, and the cell count must match the
  input's `maxlength` and `pattern`. The active cell indicator follows the end
  of the typed value; a completed code rings all cells. This is a breaking
  markup change.

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
