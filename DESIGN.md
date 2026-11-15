# loseta design baseline

This is the durable design contract for loseta v1. It defines the visual
language, token roles, component API, state contract, accessibility floor and
compatibility policy that the registry promises to consumers.

It is not an implementation guide. The installed CSS is the reference
implementation: if this document and the registry disagree,
[`packages/loseta/registry/tokens.css`](packages/loseta/registry/tokens.css)
and [`registry.json`](packages/loseta/registry/registry.json) win, and this
document must be corrected. The baseline covers registry version `0.7.0`.

Vocabulary is defined in [`GLOSSARY.md`](GLOSSARY.md).

## Principles

1. **Native first.** Components are plain CSS built on modern platform
   features: nesting, `@layer`, `:has()`, `color-mix()`, logical properties,
   native `<dialog>`, `@starting-style` and `field-sizing`. There is no
   Tailwind, runtime or framework dependency.
2. **The consumer owns the code.** The CLI copies files into the project.
   Unmodified installed files are the contract; edited files are the
   consumer's own divergence.
3. **Structure and style are separate.** Base files describe anatomy, layout
   and state hooks. Style files supply the visual treatment.
4. **Semantic HTML and platform states come first.** Styling reads ARIA and
   native pseudo-classes, not bespoke state classes. loseta ships no
   JavaScript behavior.
5. **Tokens are the customization surface.** Visual decisions should be
   changeable through tokens before they require editing a component or style
   file.
6. **Quiet by default.** The default system is neutral, with strong foreground
   and background contrast in light and dark mode, and restrained: primary
   actions carry the strongest fill; destructive color is reserved for
   destructive intent and validation.
7. **Composition over configuration.** Field, button group, card and item
   compose by markup. Components do not require a parent wrapper class to
   work together.
8. **Accessibility is part of the API.** Focus visibility, semantics and
   state exposure are contract, not polish.

## Scope

The registry contains 25 stable components, 21 experimental components, three
primitives and four foundations:

- **Stable components**: alert, alert-dialog, badge, button, button-group,
  card, checkbox, code-block, dialog, dropdown-menu, empty, field, input, item,
  kbd, label, native-select, popover, radio, skeleton, switch, table, tabs,
  textarea and tooltip.
- **Experimental components**: accordion, aspect-ratio, avatar, breadcrumb,
  collapsible, context-menu, drawer, hover-card, input-group, input-otp,
  menubar, navigation-menu, pagination, progress, scroll-area, separator,
  sheet, slider, spinner, toggle and toggle-group. They are installable by
  name with `loseta add <name> --experimental`, ship exactly one Nova style
  file and are explicitly outside the v1 compatibility contract.
- **3 primitives**: `dialog-shell`, `menu` and `popover-primitive`. They are
  installed automatically as dependencies and are not consumer-facing
  components.
- **4 foundations**: tokens, reset, base and utilities.

Uncurated drafts live in `packages/loseta/experimental/`. They are neither
published nor covered by this baseline. Promotion of an experimental item to
stable requires all eight style files, examples, docs, tests and an entry in
this document. The one shipped utility is `.sr-only`.

## Styles

The registry declares its styles in `registry.json`. Nova is the default. The
complete set is Vega, Nova, Maia, Lyra, Mira, Luma, Sera and Rhea. A style owns
geometry, spacing, control sizes, radii and the type scale. Anatomy, markup,
tokens, layers and the state contract are shared, so switching styles never
requires markup changes.

`loseta.json` selects one style per project. `loseta init --style` chooses it,
`loseta style <name>` switches it, and the CLI copies only the style files for
the selected style. A style-only change does not rewrite base files.
Experimental items are Nova-only: `loseta add` rejects them outside a Nova
project, and `loseta style` refuses to switch away while any experimental item
is installed.

The browser fidelity target is Chrome/Edge 125+, Safari 26+ and Firefox 147+.
Older engines may render a reduced experience where they lack `:has()`,
`@starting-style`, `field-sizing` or `light-dark()`.

## Layer contract

Every generated `index.css` declares this order before importing any file:

```css
@layer loseta.tokens, loseta.reset, loseta.base, loseta.components, loseta.style, loseta.utilities;
```

| Layer | Owner | Responsibility |
| --- | --- | --- |
| `loseta.tokens` | foundation | Custom properties, light/dark token values, `color-scheme`. |
| `loseta.reset` | foundation | Preflight-style reset: box sizing, margins and padding, borders, media and table defaults, form inheritance, default font stacks and focus defaults. |
| `loseta.base` | foundation | Global element defaults: page colors, button cursor, selection color, outline color. |
| `loseta.components` | base files and primitives | Anatomy, layout, behavior hooks and structural state rules. |
| `loseta.style` | style files | Color, typography, spacing, radii, shadows, surfaces and animations. |
| `loseta.utilities` | foundation | Only `.sr-only` in v1. |

Rules:

- The order is fixed. Consumers may add their own layers after it.
- Base and style files for an item are installed separately and imported by
  the generated entrypoint: base files first, style files second.
- A new visual decision belongs in the style layer. Base files may consume
  tokens for structural semantics (for example, invalid text or a selected
  row), but they must not become the primary place for visual styling.
- Do not use `!important` to cross layers. Fix ownership instead.
- Class names and tokens are unprefixed. Use one design system per project to
  avoid collisions.

## Tokens

Tokens are the shadcn-compatible custom properties in
`packages/loseta/registry/tokens.css`. The token file is the source of truth
for values; this table defines intent.

### Color roles

| Role | Intent |
| --- | --- |
| `--background`, `--foreground` | Page surface and primary text. |
| `--card`, `--card-foreground` | Cards and alerts. |
| `--popover`, `--popover-foreground` | Dialogs, popovers, menus and tooltips. |
| `--primary`, `--primary-foreground` | Primary actions and checked controls. |
| `--secondary`, `--secondary-foreground` | Secondary actions and badges. |
| `--muted`, `--muted-foreground` | Subdued surfaces, descriptions and secondary text. |
| `--accent`, `--accent-foreground` | Highlighted and focused menu items. |
| `--destructive` | Destructive actions, invalid borders and invalid text. |
| `--border` | Separators, card outlines and outline-variant borders. |
| `--input` | Form-control borders and subtle control fills in the dark scheme. |
| `--ring` | Focus border and focus shadow. |
| `--chart-*`, `--sidebar-*` | Reserved token families shipped with the style; v1 components do not consume them. |
| `--scrollbar-*` | Scroll Area track, thumb, width and radius. |

Transparency is derived with `color-mix(in oklab, var(--token) N%, transparent)`
or `currentColor`; raw palette colors do not belong in component CSS except
for embedded SVG data URIs and the dialog backdrop.

### Light and dark

- `:root` sets `color-scheme: light dark`, so the OS preference drives the
  default. Color tokens use `light-dark(light, dark)` pairs where the values
  differ; the token file also sets `color-scheme` so native controls follow the
  active scheme.
- `.dark` and `.light` force a scheme by setting `color-scheme: only dark` or
  `only light`. They work on `<html>` or any container, so a section can use a
  different scheme from the page.
- Components reference role tokens. A style uses `light-dark()` for contrast
  adjustments, but a component must not invent a separate dark palette.
- Custom tokens use `light-dark()`. A `.dark { --token: ... }` block only
  applies when `.dark` is present and does not respond to the OS default.
- Data-URI icon tokens cannot use `light-dark()` because it only accepts
  colors. They are the only token-level exception: the light URL is the
  default, and `.dark` / `.light` plus a root `prefers-color-scheme` query swap
  the URL.
- Every documented page is exercised in system light/dark in CI; the styles page
  also runs forced light/dark.

#### Color-scheme wiring

- Tokens and scheme classes: `packages/loseta/registry/tokens.css`.
- Per-style dark values: `packages/loseta/registry/styles/<style>/*.css`.
- Docs switcher: `web/src/scripts/docs-client/preferences.ts` and `controls.ts`.
- Pre-paint bootstrap: `web/src/layouts/Layout.astro` duplicates the preference
  bootstrap in `applyPreferences()`; keep both in sync.
- Docs-only colors and Shiki: `web/src/styles/docs.css`.
- Generated bundles: `web/src/styles/loseta.css` and `web/public/styles/*.css`
  (`pnpm docs:css`).
- Coverage: `web/tests/docs.spec.ts` (scheme switch, scoped overrides,
  native-select, four-mode axe matrix and system/forced equivalence).

### Radius

`--radius` is `0.625rem`. The scale is multiplicative:

| Token | Multiplier | Typical use |
| --- | --- | --- |
| `--radius-sm` | `0.6` | Kbd and item media. |
| `--radius-md` | `0.8` | Menu items, tooltip, skeleton, small controls. |
| `--radius-lg` | `1` | Buttons, inputs, selects, alerts, items, menus, popovers. |
| `--radius-xl` | `1.4` | Cards, dialogs and alert dialogs. |
| `--radius-2xl`–`--radius-4xl` | `1.8`–`2.6` | Available scale; badge uses `--radius-4xl` for a pill. |
| `--radius-full` | infinite | Radios, switches and circular media. |

Small controls cap their radius with `min(var(--radius-md), 10px or 12px)` so
they do not become visually rounder than their surface. Checkboxes use a
fixed 4px radius. Code Block uses `--radius-xl`; its `sm` size uses
`--radius-lg`. These caps are part of the Nova style; Vega uses
`--radius-md` for controls and caps them at smaller values.

### Typography

- The reset sets default `--font-sans` and `--font-mono` stacks on the document,
  with system fallbacks, and makes form controls inherit them. Consumers can
  override either custom property without touching component CSS; no component
  or style file requires a global font token.
- Code Block keeps an explicit monospace stack with `var(--font-mono, …)` so it
  still renders correctly when the reset is not installed.
- UI text defaults to `--text-sm` (`0.875rem`), with its paired line height.
  Cards, alerts, items, tables, menus, tabs, code blocks, accordion content,
  avatar fallbacks, breadcrumb, pagination, hover cards, sheets, drawers and
  dialog bodies follow it. Menubar and navigation-menu triggers use it too.
- Inputs and textareas use `--text-base` (`1rem`) below `48rem` and `--text-sm`
  at and above it.
- Card, dialog and alert-dialog titles use `--text-base` at their default size
  (the `sm` card uses `--text-sm`); alert, popover, empty and field titles use
  `--text-sm`. `lg` avatar fallbacks and sheet/drawer titles use `--text-base`.
- Badges, kbd, tooltips, `sm` toggles and `xs` buttons use `--text-xs`; the
  `sm` button is a deliberate `0.8rem` exception. Menu headings and
  navigation-menu descriptions also use `--text-xs`.
- Input group addons use `--text-sm`; the inner input and textarea controls
  keep the input type scale. OTP inputs use `--text-lg` by default,
  `--text-base` at `sm` and `--text-xl` at `lg`.
- Line heights are paired tokens (`--text-*--line-height`) or explicit unitless
  values where the component needs a tighter title or description rhythm. Code
  Block uses `1.6` for code lines.

### Shadows and icons

- Shadow tokens `--shadow-2xs` through `--shadow-2xl` are available. The
  default style uses a 1px foreground ring shadow for cards and dialogs, and
  that ring plus `--shadow-md` for popovers and menus.
- Icons inherit `currentColor`; components disable pointer events on the
  decorative SVG that sits inside their interaction targets.
- `--icon-size` is a local component variable, not a global token. The
  fallback is `1rem`; button sizes override it to `0.75rem` (`xs`) or
  `0.875rem` (`sm`). Kbd and badge icons are `0.75rem`; the alert-dialog figure
  icon is `1.5rem`. Code Block title icons are `1rem`; its copy and wrap
  controls use the `icon-xs` button size (`0.75rem` icons). Accordion,
  collapsible and pagination icons are `1rem`; input-group addon icons are
  `1rem`; breadcrumb separators are `0.875rem` and avatar badges use `0.5rem`
  (`sm` badges hide the icon).

### Spacing

v1 does not expose a spacing token scale. Component spacing uses rem values on
a `0.125rem` grid. Consumers should customize spacing by editing the style
file they own, not by expecting a spacing API.

## Surfaces and state recipes

### Surfaces

| Surface | Treatment |
| --- | --- |
| Page | `--background` / `--foreground`. |
| Card | `--card` surface, 1px foreground-at-10% ring shadow, `--radius-xl`. |
| Alert | `--card` surface, 1px `--border` border, `--radius-lg`; no shadow. |
| Popover, menu, dialog | `--popover` surface, 1px foreground-at-10% ring, `--shadow-md` for popovers/menus, `--radius-lg` or `--radius-xl` by component. |
| Code Block | `--muted` surface, 1px foreground-at-5% ring, `--radius-xl`; no header divider. Destructive uses a destructive tint, text and ring. |
| Muted region | `--muted` at 50% for footers, table footers and subdued rows; `--muted` for skeletons and kbd. |
| Dialog backdrop | Black at 10% plus a 4px backdrop blur. |
| Empty | Dashed `--border` outline, no fill. |
| Accordion | Bottom `--border` divider between items; summary hover underline. |
| Avatar | `--muted` fallback, `--primary` badge and a 1px `--border` ring. |
| Context menu | `--popover` surface, foreground-at-10% ring and `--shadow-md`. |
| Hover card | `--popover` surface through the popover primitive. |
| Input group, OTP | `--input` border, `--ring` focus-within/focus and destructive invalid ring. |
| Menu | Shared menu primitive: `--popover` surface, foreground-at-10% ring and the style's menu shadow. |
| Menubar | `--background` bar with a 1px `--border` outline and `--shadow-xs`. |
| Navigation menu | `--popover` panels through the popover primitive. |
| Progress | `--primary` at 20% for the track and full `--primary` for the indicator. |
| Scroll area | Native scrollbars from `--scrollbar-thumb`, `--scrollbar-track` and `--scrollbar-width`. |
| Sheet, drawer | `--background` panel, `--border` side edge on sheets and `--shadow-lg`. |
| Slider | Native track and thumb colored by `accent-color: --primary`. |
| Toggle | Transparent or outline surface; pressed uses `--accent` / `--accent-foreground`. |
| Pagination | Current page uses `--background` with a `--border` outline; links compose with button. |

Borders: use `--border` for separators, alerts and outline variants; cards use
a box-shadow ring instead of a border. Use `--input` for the border of text
fields, selects, checkboxes, radios and switches.

### State recipes

| State | Visual rule |
| --- | --- |
| Hover | Primary fills mix toward transparent at 20%; outline and ghost use `--muted`; link underlines; menu items use `--accent`; table rows use muted at 50%. |
| Focus visible | 1px `--ring` border plus a 3px `--ring`-at-50% shadow. Tabs also draw a 1px `--ring` outline; menu items use the accent background instead of a ring. Code Block rings the block while its `pre` is focused. |
| Invalid | `--destructive` border plus a 3px destructive-at-20% shadow; dark mode uses stronger destructive mixes. A field containing an invalid control turns its text destructive. |
| Disabled | 50% opacity. Buttons, tabs and menu items also drop pointer events; inputs, textareas and selects use a not-allowed cursor. |
| Active | Buttons translate down 1px, except triggers with `aria-haspopup`. |
| Selected | Tabs use a raised background and `--shadow-sm`; line tabs use a 2px foreground indicator. Table rows use `--muted`. |
| Current | `aria-current="page"` pagination links use an outline border and `--background`; breadcrumb current text uses `--foreground`. |
| Pressed | `aria-pressed="true"` toggles use `--accent` / `--accent-foreground`. |
| Open details | Accordion summaries rotate their trailing icon 180 degrees; the open state itself is native. |
| Indeterminate | Progress uses a moving primary gradient over a 20% primary track. |
| Highlighted | Menu items use `--accent` / `--accent-foreground`; destructive items use a destructive tint. |
| Expanded | Secondary, outline and ghost buttons keep their open-state fill via `aria-expanded="true"`. |

Forced-colors mode: focusable controls that suppress the native outline draw a
transparent 2px outline with a 2px offset so the system focus indicator remains
visible.

## Layout and sizing

| Element | Default | Variants |
| --- | --- | --- |
| Button | `2rem` high | `xs` 1.5rem, `sm` 1.75rem, `lg` 2.25rem |
| Icon button | `2rem` square | `icon-xs` 1.5rem, `icon-sm` 1.75rem, `icon-lg` 2.25rem |
| Input | `2rem` high | — |
| Native select | `2rem` high | `sm` 1.75rem |
| Textarea | `min-height: 4rem` | Grows with `field-sizing: content` |
| Checkbox, radio | `1rem` square | — |
| Switch | `32 × 18.4px` | `sm`: `24 × 14px` |
| Badge | `1.25rem` high | — |
| Avatar | `2rem` square | `sm` 1.5rem, `lg` 2.5rem |
| Accordion summary | No fixed height | `0.625rem` block padding |
| Collapsible summary | No fixed height | `0.25rem` block padding |
| Context menu | `8rem`–`20rem` wide | — |
| Drawer | `80vh` maximum height | `sm` 50vh, `lg` 90vh |
| Hover card | `18rem` wide | — |
| Input group | `2rem` minimum height | Auto with a textarea |
| Input OTP | `2.5rem` high | `sm` 2rem, `lg` 3rem |
| Menubar trigger | `1.75rem` high | — |
| Navigation trigger | `2rem` high | — |
| Progress | `0.5rem` high | — |
| Scroll area | Consumer-sized | `sm` narrower scrollbar |
| Sheet | `24rem` wide | `sm` 20rem, `lg` 28rem |
| Slider | `1.25rem` hit area | `sm` 1rem, `lg` 1.5rem |
| Separator | `1px` | Vertical: `1px` wide and stretches |
| Spinner | `1rem` square | `sm` 0.75rem, `lg` 1.5rem |
| Toggle | `2rem` high, `2rem` minimum width | `sm` 1.75rem, `lg` 2.25rem |
| Pagination | Links use the button default (`2rem`) | Icon links use `data-size="icon"` |
| Tablist | `2rem` high | Vertical tablists use content height |
| Kbd | `1.25rem` high, `1.25rem` minimum width | — |
| Code Block | No fixed height; the `pre` scrolls | `sm`: `--text-xs`, `0.75rem` padding and `--radius-lg` |

The table describes the default Nova style. Vega raises control heights by
`0.25rem` (input and native select `2.25rem`, buttons `2.25rem`, `lg`
`2.5rem`), uses `--radius-md` for controls, adds `--shadow-xs` to bordered
controls and cards, and gives dialogs `1.5rem` padding. Maia and Luma round
controls further; Lyra and Sera square them; Mira is the densest; Rhea pairs
Luma's soft surfaces with compact controls.

Breakpoints:

- `40rem` (640px): dialog and alert-dialog footer direction, alert-dialog
  header alignment and dialog max width.
- `48rem` (768px): input/textarea type size and description wrapping.
- `28rem` (448px) container query: responsive fields switch from stacked to
  horizontal inside their field group.

Component widths:

- Dialog panel: `24rem` maximum at `40rem` and above.
- Alert dialog panel: `20rem` maximum by default, `24rem` at `40rem` and above;
  `data-size="sm"` keeps `20rem`.
- Popover panel: `18rem`.
- Dropdown menu: at least `8rem`, at least as wide as its trigger.
- Tooltip: `20rem` maximum.
- Empty header, section and footer: `24rem` maximum.
- Cards, items and code blocks have no fixed width; consumers set their layout
  width. Code Block content scrolls horizontally unless `data-wrap` is present.

Directionality: layout uses logical properties. RTL-specific rules exist for
the switch thumb, native-select chevron, popover/tooltip placement and
`[data-rtl-flip]` icons in menus. Code Block content is always `dir="ltr"` even
on an RTL page; its header follows the page direction.

## Public component API

### Roots and anatomy

| Component | Root classes | Anatomy | Public modifiers |
| --- | --- | --- | --- |
| Accordion | `.accordion` | Container of native `<details>` with `<summary>` triggers and content directly after `summary`. | Exclusive groups use the native `name` attribute; disabled items use `inert` |
| Alert | `.alert` | Direct SVG icon; title (`h2`–`h6`, `strong` or `[data-slot="title"]`); description (`[data-slot="description"]` or `section`); action (`footer`). | `data-variant="destructive"`; default by omission |
| Alert dialog | `.alert-dialog` | Native `<dialog>` containing a panel; panel contains `header` (optional `figure`), title, description, `section` and `footer`. | `data-size="sm"` on the dialog or panel; default by omission |
| Aspect ratio | `.aspect-ratio` | A single media child (`img`, `video`, `iframe`, `canvas` or `svg`). | `--ratio` local property (default `16 / 9`); `data-fit="cover|contain"` |
| Avatar | `.avatar`, `.avatar-group` | Real `img`, `[data-slot="fallback"]` layer and optional `[data-slot="badge"]`; `.avatar-group` overlaps avatars. | `data-size="default|sm|lg"` |
| Badge | `.badge` | Text and optional SVG. | `data-variant="primary|secondary|outline|destructive|ghost|link"` |
| Breadcrumb | `.breadcrumb` | `nav` with `ol`/`li`, links and a current `span`; separators are `li[aria-hidden="true"]`; `[data-slot="ellipsis"]` for collapsed paths. | `aria-current="page"` on the current item |
| Button | `.btn` | Text and optional SVG; `data-icon="inline-start|inline-end"` marks inline icons for padding. | `data-variant="default|primary|secondary|outline|destructive|ghost|link"`; `data-size="default|xs|sm|lg|icon|icon-xs|icon-sm|icon-lg"` |
| Button group | `.btn-group` | Buttons, inputs, dropdown/popover wrappers, `span`/`label`/`output` and `hr[role="separator"]`. | `data-orientation="horizontal|vertical"` |
| Card | `.card` | `header` with title/description/action, `section`, `footer`, optional leading/trailing image. | `data-size="default|sm"`; `data-separator="bottom"` on the header |
| Checkbox | `.checkbox` | Native `input[type="checkbox"]`; must not carry `role="switch"`. | — |
| Code Block | `.code-block` | Optional `header` with `[data-slot="title"]` and `[data-slot="actions"]`; required `pre` containing `code`; optional `footer`; line parts `[data-slot="line"]` wrapping `[data-slot="line-content"]`. | `data-size="default|sm"`; `data-variant="default|destructive"`; `pre` `data-line-numbers`, `data-wrap`, `--line-start`; line `data-variant="added|removed|highlighted"` |
| Collapsible | `.collapsible` | Native `<details>` with a `<summary>` trigger and content directly after `summary`. | `[open]`; `inert` for disabled items |
| Context menu | `.context-menu` | `[role="menu"]` panel with menu items, headings, separators and shortcuts. | `--context-x`, `--context-y` on the panel; `aria-hidden="true|false"` |
| Dialog | `.dialog` | Native `<dialog>` containing a panel; panel contains `header`, title, description, `section`, `footer` and a close button or `form[method="dialog"]`. | — |
| Drawer | `.drawer` | Native `<dialog>` with `data-side` and a panel containing `[data-slot="handle"]`, `header`, `section` and `footer`. | `data-side="block-start|block-end"`; `data-size="default|sm|lg"` |
| Dropdown menu | `.dropdown-menu` | Trigger, `[data-popover]` panel, `[role="menu"]`, menu item roles, `[role="separator"]`, `[role="heading"]`, shortcut and indicator slots. | Item `data-variant="destructive"`; default by omission; placement attributes; `data-inset`; `data-rtl-flip` |
| Empty | `.empty` | `header` with `figure`, title and description; `section`; `footer`. | — |
| Field | `.field`, `.fieldset` | Label or legend, control, description `p`, error `[role="alert"]`, group/radiogroup container and `.field-separator`. | Legend `data-variant="label|legend"`; field `data-orientation="horizontal|responsive"`; group `data-slot="checkbox-group|radio-group"` |
| Hover card | `.hover-card` | Trigger and `[data-popover]` panel; CSS-only open on hover and focus-within. | Placement attributes; no open state |
| Input | `.input` | Native `<input>`. | — |
| Input group | `.input-group` | `role="group"` with semantic `input`/`textarea` and `[data-slot="addon"]` parts. | Addon `data-align="inline-start|inline-end|block-start|block-end"` |
| Input OTP | `.input-otp` | Native `<input>` with `inputmode="numeric"`, `autocomplete="one-time-code"`, `maxlength` and `pattern`. | `data-size="default|sm|lg"` |
| Item | `.item`, `.item-group` | `figure`, `section`, `aside`, `header`, `footer`; item groups accept `hr` separators. | Item `data-variant="default|outline|muted"`; `data-size="default|sm|xs"` |
| Kbd | `.kbd` | Inline shortcut text or SVG. | — |
| Label | `.label` | Native `<label>`; also supported as a direct label inside `.field`. | — |
| Menubar | `.menubar`, `.menubar-item` | `role="menubar"`, `role="none"` item wrappers, `role="menuitem"` triggers with `aria-haspopup`/`aria-expanded`, and `[data-popover]` submenus with `role="menu"`. | Placement attributes on submenu panels |
| Native select | `.native-select` | Native `<select>`. | `data-size="sm"`; default by omission |
| Navigation menu | `.navigation-menu` | `nav` with `ul`/`li`, trigger buttons or links, and `[data-popover]` panels with link lists and `[data-slot="title"]`/`[data-slot="description"]`. | Placement attributes on panels |
| Pagination | `.pagination` | `nav` with `ul`/`li`; links compose with `.btn`; `[data-slot="ellipsis"]` and `[data-slot="label"]` parts. | `aria-current="page"` on the active link |
| Popover | `.popover` | Trigger and `[data-popover]` panel with optional header, title and description. | Placement attributes |
| Progress | `.progress` | Native `<progress>` with fallback text. | `value`/`max`; omit `value` for indeterminate |
| Radio | `.radio` | Native `input[type="radio"]`, normally inside `role="radiogroup"`. | — |
| Scroll area | `.scroll-area` | Scroll container; the consumer sets dimensions and content. | `data-orientation="horizontal|vertical"`; `data-size="default|sm"` |
| Separator | `.separator` | `<hr>` or `[role="separator"]`. | `data-orientation="horizontal|vertical"`; `aria-orientation` is also recognized |
| Sheet | `.sheet` | Native `<dialog>` with `data-side` and a panel containing `header`, `section` and `footer`. | `data-side="inline-start|inline-end"`; `data-size="default|sm|lg"` |
| Skeleton | `.skeleton` | No required children; the consumer sets dimensions. | — |
| Slider | `.slider` | Native `<input type="range">`. | `data-size="default|sm|lg"` |
| Spinner | `.spinner` | Empty span; the CSS draws the ring. | `data-size="default|sm|lg"`; `role="status"` plus a label in markup |
| Switch | `.switch` | Native `input[type="checkbox"]` with `role="switch"` and a label. | `data-size="default|sm"` |
| Table | `.table-container`, `.table` | `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`; checkbox cells use `role="checkbox"`. | Row `aria-selected="true"` |
| Tabs | `.tabs` | `[role="tablist"]`, `[role="tab"]`, `[role="tabpanel"]`. | Tablist `data-variant="default|line"`; `aria-orientation="horizontal|vertical"` |
| Textarea | `.textarea` | Native `<textarea>`. | — |
| Toggle | `.toggle` | Native `<button type="button">`; text and optional SVG. | `aria-pressed="true|false"`; `data-variant="default|outline"`; `data-size="default|sm|lg"` |
| Toggle group | `.toggle-group` | `role="group"` container of `.toggle` children. | `data-orientation="horizontal|vertical"`; `data-spacing="default|joined"`; group `data-variant`/`data-size` apply to children without their own |
| Tooltip | `.tooltip[data-tooltip]` | Pseudo-element content from `data-tooltip`; optional arrow. | `data-side`, `data-align`, `data-arrow` |

On buttons, `default` and `primary` are aliases; omitting `data-variant` is
the same as `primary`. On badges, `primary` and omission are equivalent and
`default` is not a badge value. Other components define their own default by
omission.

Card also accepts the compatibility aliases `.card-title`, `.card-description`
and `.card-action`; prefer the `data-slot` names in new markup.

### Parts and slots

The public slot vocabulary is shared across components:

- `data-slot="title"` — alert, card, code block, dialog, alert-dialog, popover.
- `data-slot="description"` — alert, card, dialog, alert-dialog, popover.
- `data-slot="action"` — card.
- `data-slot="actions"` — code block.
- `data-slot="line"`, `data-slot="line-content"` — code block.
- `data-slot="header"` — popover.
- `data-slot="shortcut"` — dropdown menu, context menu and menubar.
- `data-slot="indicator"` — dropdown menu, context menu and menubar.
- `data-slot="checkbox-group"`, `data-slot="radio-group"` — field.
- `data-slot="fallback"`, `data-slot="badge"` — avatar.
- `data-slot="ellipsis"` — breadcrumb and pagination.
- `data-slot="label"` — pagination previous/next text.
- `data-slot="handle"` — drawer.
- `data-slot="title"`, `data-slot="description"` — navigation menu panels.
- `data-slot="addon"` — input group.

Semantic parts are equally public where documented: `header`, `section`,
`footer`, `figure`, `aside`, `pre`, `code`, `details`, `summary`, `nav`, `ol`,
`ul`, `li`, `progress`, `[role="menu"]`, `[role="menubar"]`,
`[role="menuitem"]`, `[role="tablist"]`, `[role="tab"]` and
`[role="tabpanel"]`. Do not invent a new `data-slot` name for a part that
already has a semantic element in the anatomy.

Toggle groups are multi-state: every `.toggle` child owns its own
`aria-pressed`. A single-choice control uses a radio group, not a toggle group.

### Placement attributes

Popover panels, dropdown panels and tooltips share placement hooks:

| Attribute | Values | Default | Applies to |
| --- | --- | --- | --- |
| `data-side` | `top`, `bottom`, `left`, `right`, `inline-start`, `inline-end`, `block-start`, `block-end` | `bottom` for popover/dropdown/tooltip; required on sheets and drawers | Popover, dropdown, tooltip, sheet, drawer and navigation panels |
| `data-align` | `start`, `center`, `end` | `start` | Popover, dropdown, tooltip and navigation panels |
| `data-arrow` | Present or absent | No arrow | Tooltip |

Input-group addons also use `data-align`, but with
`inline-start`, `inline-end`, `block-start` and `block-end`.

Physical sides (`left`/`right`) and logical sides (`inline-start`/`inline-end`)
are both supported. `center` alignment uses a translate offset. `data-inset`
adds leading padding to menu items and headings; `data-rtl-flip` rotates an
icon 180 degrees in RTL contexts.

Sheets use `inline-start`/`inline-end`; drawers use `block-start`/`block-end`.
`data-size` on a sheet or drawer sets its width or height. Context menus are
positioned by the consumer through `--context-x` and `--context-y` on the
panel. Those coordinates are physical `left`/`top` values even in RTL; this is
the only physical-inset exception in the registry.

`data-orientation` is component-specific: `horizontal|vertical` on button
groups, tablists, separators and toggle groups, `horizontal|responsive` on
fields. Do not assume one value set applies everywhere. `data-spacing` applies
only to toggle groups (`default|joined`), and `data-fit` applies only to aspect
ratios (`cover|contain`).

## State contract

Components style state from native pseudo-classes and ARIA. These are the only
public state hooks:

| State | Public expression | Applies to |
| --- | --- | --- |
| Invalid | `aria-invalid="true"` | Inputs, textareas, native selects, checkbox, radio, switch, buttons, badges and `.field` (including descendants). |
| Disabled | Native `:disabled` | Buttons, inputs, textareas, selects, menu items and native controls. |
| Disabled, non-native | `aria-disabled="true"` | Tabs, menu items and other elements that cannot use `:disabled`. |
| Selected | `aria-selected="true"` | Tabs and selectable table rows. |
| Checked, native | `:checked` | Checkbox, radio and switch. |
| Checked, menu item | `aria-checked="true"` | `menuitemcheckbox` and `menuitemradio`. |
| Highlighted | `data-highlighted` | Menu items and listbox-like composites. Presence only; no value required. |
| Current | `aria-current="page"` | Breadcrumb and pagination. `aria-current="step"` is reserved for multi-step flows. |
| Pressed | `aria-pressed="true"` | Toggle and toggle-group buttons. |
| Expanded | `aria-expanded="true"` | Menu and navigation triggers; panels use `aria-hidden`. |
| Open, details | Native `[open]` on `<details>` | Accordion items. |
| Open, dialog | Native `[open]` | Dialog and alert dialog. |
| Open, popover | `aria-hidden="false"` | `[data-popover]` panels; the trigger uses `aria-expanded`. |
| Indeterminate | Native `:indeterminate` | Progress without a value. |
| Range value | Native `value` and `max` | Progress; no ARIA override. |
| Disabled, inert | `inert` | Accordion items. |
| Focus | `:focus-visible` | All focusable controls. |
| Focus within | `:focus-within` | Input group; the group draws the ring instead of the inner control. |

The state contract is deliberately small. Do **not** use `.active`,
`data-active`, `data-invalid`, `data-disabled`, `data-selected`,
`data-state="selected"` or similar class/data aliases. Beyond variant, size,
orientation, spacing, fit and placement attributes, `data-highlighted` is the
only public data-driven state; any other state must be expressible with a
native pseudo-class or ARIA.

Notes:

- `aria-hidden="true"` hides a popover and drives its exit transform. The
  dialog shell also recognizes `:popover-open` for consumers using the native
  popover API, but the documented dialog pattern is `<dialog>` plus `[open]`.
- `aria-expanded="true"` is the trigger state for popovers, dropdown menus and
  buttons that open an overlay.
- `data-dropdown-menu-initialized` is an internal behavior hook used to
  disable the CSS-only hover fallback once JavaScript takes over keyboard
  navigation. It is not part of the public state contract.
- The CSS-only tooltip shows on `:hover` and `:focus-visible`; it has no
  JavaScript open state.
- Code Block's `data-line-numbers`, `data-wrap` and line `data-variant` are
  presentation modifiers, not states. `--line-start` on the `pre` is a local
  customization property, not a global token.
- Accordion disabled items use `inert`, not `aria-disabled`: only `inert`
  prevents the native `details` toggle from the keyboard.
- Toggle state is `aria-pressed`; the CSS has no `data-state="on"` alias.
- Progress state comes from the native `<progress>` value. Omitting `value`
  selects the indeterminate state through `:indeterminate`.
- Toggle group `data-variant` and `data-size` apply to children that do not
  declare their own attribute.
- Menubar, dropdown-menu and context-menu items share the internal `menu`
  primitive. It styles `[role="menu"]`, the menu item roles, headings,
  separators, shortcuts and indicators.
- Hover cards have no open state: CSS shows the panel on `:hover` and
  `:focus-within`. They are not a substitute for a popover that needs explicit
  dismissal.
- Context menus use `aria-hidden` on the panel. The consumer sets
  `--context-x` and `--context-y` and manages focus; the CSS does not track the
  pointer.

## Motion

- Standard easing is `cubic-bezier(0.4, 0, 0.2, 1)`.
- Controls, hover states, tabs, table rows and tooltips transition in `150ms`.
- Accordion and collapsible content transition `block-size` and opacity in
  `150ms` where `::details-content` and `calc-size()` are supported; the open
  state itself is native and works without either feature.
- Code Block's floating actions fade in `150ms` on hover and focus-within.
- Overlays (popover, dropdown, dialog, alert dialog) transition in `100ms`;
  the underlying shell defaults to `150ms` when a style does not override it.
- Item hover and state transitions use `100ms`; the skeleton pulses on a `2s`
  loop with `cubic-bezier(0.4, 0, 0.6, 1)`.
- Menus and navigation panels transition in `100ms`; sheets and drawers use the
  dialog shell's `150ms` entry. Hover cards open after a `300ms` delay and hide
  immediately when the pointer leaves.
- The spinner rotates on a `0.75s` linear loop; progress uses a `1.5s`
  indeterminate sweep.
- Dialog entry uses `@starting-style` and `allow-discrete`: the backdrop fades,
  the panel moves from 95% to 100% scale with opacity.
- Popovers scale from 95% and move `0.5rem` from their placement side. Menus
  and popovers fade with `visibility`.
- Tooltips fade with `visibility` on hover and focus; their `0.5rem` placement
  offsets are static. Their pseudo-element is currently held at 95% scale, so
  the tooltip does not scale in (see Known gaps).
- Motion is primarily opacity, scale, translate and rotate. There are no
  springs or bounces.

Most motion still has no `prefers-reduced-motion` guard; the spinner and the
progress sweep slow down instead of stopping. This remains a known gap.

## Accessibility

- Native elements are preferred: `<button>`, `<input>`, `<select>`,
  `<textarea>`, `<dialog>`, `<details>`, `<summary>`, `<progress>` and
  `<table>`. ARIA roles are used for composite widgets that have no native
  equivalent (`tablist`, `tab`, `menu`, `menuitem`, `radiogroup`, `group`).
- Every interactive component must be operable by keyboard and expose its
  state through the contract above. loseta provides styling only; the
  consumer provides behavior.
- Accordion items must keep the trigger as the `<summary>`; disabled items use
  `inert`, which removes them and their content from the tab order. Exclusive
  groups use the native `name` attribute.
- Collapsible uses the same native `<details>`/`<summary>` contract. It does
  not impose exclusivity; consumers can add the native `name` attribute.
- Input groups need an accessible name on the group and on the inner control.
  Addons are presentation; clicking an addon to focus the control is consumer
  JavaScript.
- OTP inputs need an accessible label, `inputmode="numeric"`,
  `autocomplete="one-time-code"`, `maxlength` and optionally `pattern`. CSS
  does not auto-advance or draw per-digit slots.
- Scroll areas need `tabindex="0"` and an accessible name so keyboard users can
  scroll them.
- Sliders are native range inputs and need a label; keep min, max and value in
  markup. The native focus ring is not suppressed.
- Avatars need `alt` text on the image and an `aria-hidden` fallback; a
  decorative badge is `aria-hidden`. The consumer hides the image when loading
  fails.
- Sheets and drawers are native `<dialog>` elements and follow the dialog
  labelling rules. The drawer handle is decorative unless the consumer makes it
  a focusable drag control; swipe and drag gestures are consumer JavaScript.
- Hover-card triggers need `aria-describedby` pointing at the panel. The panel
  is a non-modal preview; interactive content that must stay open belongs in a
  popover.
- Context menus must move focus into the menu, return it on close and support
  arrow-key navigation; the consumer also owns the right-click handler and the
  `--context-x`/`--context-y` coordinates.
- Menubars need roving focus, arrow keys and `aria-expanded` on each submenu
  trigger. Submenu panels use `[role="menu"]` and its item roles.
- Navigation menus need an accessible `nav` label, `aria-expanded` and
  `aria-controls` on panel triggers, and ordinary links inside panels. Keyboard
  navigation and the mobile layout are consumer JavaScript; there is no
  built-in mobile fallback.
- Breadcrumb and pagination need an accessible `nav` label; the current item
  uses `aria-current="page"`. Pagination icon links need an `aria-label`.
- Progress needs an accessible name through `aria-label` or a `<label>`; keep
  the text fallback inside the element. Do not add ARIA value overrides to the
  native element.
- Separators are semantic through `<hr>` or `role="separator"`; decorative
  rules use `role="presentation"` or `aria-hidden="true"`.
- Spinners that stand alone use `role="status"` and a visually hidden label;
  a spinner next to visible loading text is `aria-hidden`.
- Toggle and toggle-group buttons use `aria-pressed`. A toggle group needs a
  group label and supports multiple pressed buttons; single-choice selection
  belongs to a radio group.
- Dialogs must be labelled with `aria-labelledby` and, when the description is
  present, `aria-describedby`. Use `showModal()` and `close()`.
- Tabs must maintain `aria-selected`, `hidden` on inactive panels and roving
  `tabindex`; CSS does not switch panels.
- Code Block must keep its content `dir="ltr"` and focusable through
  `tabindex="0"`; line numbers and diff markers are generated content and are
  excluded from selection. Copy controls need an accessible label and a
  consumer-managed announcement; a wrap toggle uses `aria-pressed`.
- Dropdown menus must maintain `aria-expanded` on the trigger,
  `aria-hidden` on the panel and roving focus; checkable items use
  `aria-checked`.
- Popovers must maintain `aria-expanded` on the trigger and `aria-hidden` on
  the panel.
- Tooltips must have an accessible name or description on the trigger; the
  visual bubble is generated from `data-tooltip` and is not a substitute for
  `aria-label` or `aria-describedby`.
- Components that suppress the native outline provide a visible replacement
  in the documented markup; the dialog close button must carry `.btn` (or an
  equivalent focus style). The default focus ring is a 1px `--ring` border plus a
  3px 50% ring shadow; forced-colors mode restores a transparent 2px outline
  for system focus rendering.
- CI runs axe with `wcag2a`, `wcag2aa`, `wcag21a` and `wcag21aa` on every docs
  page in system light/dark, and on the styles page in forced light/dark, in
  Chromium and WebKit, and fails on `serious` or `critical` violations. This is
  a floor, not a substitute for manual testing.

## Distribution and change policy

Install targets:

| Item kind | Base file | Style file |
| --- | --- | --- |
| Foundation | `tokens.css`, `reset.css`, `base.css`, `utilities.css` | — |
| Primitive | `primitives/<name>.css` | `styles/<style>/primitives/<name>.css` |
| Component | `components/<name>.css` | `styles/<style>/<name>.css` |

The CLI writes these under the configured CSS directory (default
`src/styles/loseta`), records them in `.loseta/manifest.json`, and regenerates
`index.css` with the fixed layer declaration and imports. `loseta.json` holds
the CSS directory, entrypoint and style. The default style is Nova.

Experimental items are published and installable, but they ship exactly one
`styles/nova/` file and stay outside the compatibility contract.
`loseta add <name> --experimental` requires a Nova project, `loseta add all`
installs stable components only, and `loseta style` refuses to switch away
while an experimental item is installed. Promotion to stable requires all
eight style files, examples, docs, tests and an update to this baseline.

Registry dependencies are hard: installing `dialog` or `alert-dialog` also
installs `dialog-shell`; installing `sheet` or `drawer` also installs
`dialog-shell`; installing `dropdown-menu`, `context-menu` or `menubar` also
installs `menu`; installing `popover`, `dropdown-menu`, `hover-card`,
`menubar` or `navigation-menu` also installs `popover-primitive`; installing
`toggle-group` also installs `toggle`. Optional dependencies are composition
hints only and are never installed automatically. Notable optional pairs are
field with its form controls, button group with
button/input/popover/dropdown-menu, table with checkbox, dropdown-menu with
kbd, breadcrumb with dropdown-menu, pagination with button, sheet and drawer
with button, input group with input/textarea/button, and code block with button
for copy and wrap controls.

The `menu` primitive styles every `[role="menu"]` in the project. It owns the
shared item, heading, separator, shortcut and indicator rules; `dropdown-menu`,
`context-menu` and `menubar` add their own trigger, surface and positioning
behavior.

### Compatibility contract

The following are public API and require a breaking-change note when changed:

- root classes and documented install targets;
- public slots and documented semantic parts;
- variant, size, orientation and placement attribute names and values;
- the state contract;
- the color-scheme hooks (`color-scheme`, `.dark`, `.light`) and the
  `light-dark()` token authoring contract;
- token names and their semantic roles;
- the declared style names and their install targets;
- the fixed layer order and the meaning of each layer;
- documented anatomy requirements and optional/required children;
- the shared `menu` primitive's `[role="menu"]` styling;
- the `dialog-shell` side and bottom placement behavior.

Additive changes (a new optional part, a new variant, a new token with a
fallback) are non-breaking. Visual refinements that preserve anatomy and API
are normal style work, but they must keep contrast and focus visibility.
Experimental items are explicitly outside this contract until they are
promoted; their root classes, anatomy and state hooks may change in any
release.

Because distribution is copy-paste, installed files do not update
automatically. Consumers receive changes only by installing or re-adding
files. Local edits are outside the contract and should be treated as a fork.

Until 1.0, the registry is explicitly pre-stable: breaking changes are still
possible, but every one must be called out in [`CHANGELOG.md`](CHANGELOG.md)
and reflected in this baseline. After 1.0, the compatibility contract follows
semantic versioning.

## Known gaps

- Most motion has no `prefers-reduced-motion` guard. The spinner rotation and
  the progress sweep slow down instead of stopping.
- Tooltip entry only fades; the pseudo-element remains at 95% scale instead of
  animating to 100%.
- Nova, Vega, Maia, Lyra, Mira, Luma, Sera and Rhea are the only shipped
  styles; style-specific visual regression snapshots are not part of CI.
- No JavaScript behavior is shipped. Dialogs, popovers, dropdown menus, tabs,
  toggle buttons and Code Block copy/wrap controls require consumer code.
- Code Block does not ship syntax highlighting, ANSI rendering, streaming or a
  Show More interaction; syntax highlighting stays in the consumer's
  highlighter and line numbers/diff/highlights require explicit line markup.
- No visual regression snapshots. CI covers axe and functional docs behavior,
  not pixel diffs, forced-colors rendering or RTL layouts.
- Experimental items are published and installable but outside this contract.
  They ship Nova only and are not promoted until all eight style files,
  examples, docs and tests exist.
- Context menus do not track the pointer. The consumer sets
  `--context-x`/`--context-y` and manages focus.
- Drawers ship no swipe or drag behavior; the handle is a visual affordance.
- Menubars and navigation menus ship no roving focus, arrow-key navigation or
  mobile layout; those are consumer behavior.
- Hover cards are CSS-only previews. They cannot be dismissed explicitly and
  should not wrap interactive content that needs to stay open.
- The `menu` primitive styles every `[role="menu"]` in the project.
- There is no `loseta remove` command; removing an experimental item before a
  style switch is a manual file and manifest edit.
- Accordion and collapsible animation relies on `::details-content` and
  `calc-size()`; older engines in the support window open and close instantly.
- Sliders use native tracks and thumbs. A custom thumb needs `appearance: none`
  and consumer-managed fill.
- OTP inputs do not auto-advance or draw per-digit slots.
- Input-group addons do not focus the control when clicked; that is consumer
  JavaScript.
- Scroll areas use native scrollbars; there are no custom overlay thumb
  elements.
- Uncurated drafts remain in `packages/loseta/experimental/` and are not
  published.
- There is no spacing or motion token scale; spacing and durations are
  component-level values.
- The button group retains composition hooks for an experimental `.select`;
  that selector is not part of the stable v1 registry.
- Browser support is limited to the modern fidelity target above; there is no
  legacy fallback layer.
