# Changelog

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
