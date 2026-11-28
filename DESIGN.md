# loseta design baseline

This is the durable design contract for loseta v1. It defines the visual
language, token roles, component API, state contract, accessibility floor and
compatibility policy that the registry promises to consumers.

It is not an implementation guide. The installed CSS and ESM behavior files are
the reference implementation: if this document and the registry disagree,
[`packages/loseta/registry/tokens.css`](packages/loseta/registry/tokens.css),
[`registry.json`](packages/loseta/registry/registry.json) and the files under
[`packages/loseta/registry/behaviors/`](packages/loseta/registry/behaviors) win,
and this document must be corrected. This baseline covers loseta `0.20.0`.

Vocabulary is defined in [`GLOSSARY.md`](GLOSSARY.md). Style implementation
guidance lives in [`STYLE-GUIDE.md`](STYLE-GUIDE.md).

## Principles

1. **Native first.** Components are plain CSS built on modern platform
   features: nesting, `@layer`, `:has()`, `color-mix()`, logical properties,
   native `<dialog>`, `@starting-style` and `field-sizing`. There is no
   Tailwind, runtime or framework dependency.
2. **The consumer owns the code.** The CLI copies files into the project.
   Unmodified installed files are the contract; edited files are the
   consumer's own divergence.
3. **Structure, style and behavior are separate.** Base files describe anatomy,
   layout and state hooks. Style files supply the visual treatment. Behavior
   modules supply interaction and are optional.
4. **Semantic HTML and platform states come first.** Styling reads ARIA and
   native pseudo-classes, not bespoke state classes. CSS never depends on
   behavior; installed behavior modules are plain ESM the consumer owns.
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

The registry contains 62 stable components, four primitives and four
foundations:

- **Stable components**: accordion, alert, alert-dialog, aspect-ratio,
  attachment, avatar, badge, breadcrumb, bubble, button, button-group, calendar,
  card, carousel, chart, checkbox, code-block, collapsible, combobox, command,
  context-menu, dialog, drawer, dropdown-menu, empty, field, hover-card, input,
  input-group, input-otp, item, kbd, label, marker, menubar, message,
  message-scroller, native-select, navigation-menu, pagination, popover,
  progress, questionnaire, radio, resizable, scroll-area, select, separator,
  sheet, sidebar, skeleton, slider, spinner, switch, table, tabs, textarea,
  toast, toggle, toggle-group, tooltip and trace.
- **4 primitives**: `dialog-shell`, `listbox`, `menu` and `popover-primitive`.
  All four are stable. Primitives are installed automatically as dependencies
  and are not consumer-facing components.
- **4 foundations**: tokens, reset, base and utilities.
- **22 behavior-bearing components**: dialog, alert-dialog, sheet, drawer,
  popover, dropdown-menu, context-menu, menubar, navigation-menu, tabs, select,
  combobox, command, toast, code-block, calendar, carousel, resizable,
  questionnaire, message-scroller, tooltip and hover-card. Their modules live in
  `registry/behaviors/` and are optional; the CSS contract does not depend on
  them.
- **4 CSS-only by design**: input-otp, slider, scroll-area and sidebar. Their
  interactions are native or compose the dialog behavior; no module is
  installed for them.

No experimental components ship in this release. The experimental pipeline
remains for future items.

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
`@starting-style`, `field-sizing` or `light-dark()`. Behavior modules target
the same engines and rely on native `<dialog>`, `showModal()`,
`aria-activedescendant` and `:has()`; there is no transpilation or polyfill
layer.

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

Behavior is not a cascade layer. Behavior modules live under `behaviors/`,
never participate in the layer order and never change the CSS contract.

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
| `--chart-*` | Chart series colors, mapped by `data-series` on Chart. |
| `--sidebar-*` | Sidebar surface, accent, border, width and focus ring. |
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
  Cards, alerts, items, tables, menus, listbox options, tabs, code blocks,
  accordion content, avatar fallbacks and group counts, breadcrumb, pagination,
  hover cards, select triggers, sidebar links, toast items, command bodies,
  message rows, bubbles, markers and trace rows follow it. Navigation-menu
  triggers use it too; menubar triggers use it except Lyra and Mira, which use
  `--text-xs`. Sheets and drawers use `--text-sm`, except Lyra and Mira.
- Conversation metadata uses `--text-xs`: message headers and footers,
  attachment descriptions, trace status pills and reaction counts. Attachment
  titles and content follow the row size. Questionnaire legends use
  `--text-lg`; descriptions and choices use `--text-sm`. Bubble content uses a
  `1.625` line height for readable replies.
- Inputs, textareas and native selects use `--text-base` (`1rem`) below `48rem`
  and `--text-sm` at and above it. Combobox inputs follow the input scale.
  Select triggers use a fixed `--text-sm`, except Lyra and Mira, which use
  `--text-xs`; Mira uses a `1.625` line height. `data-size="sm"` only shortens
  the trigger.
- Card, dialog and alert-dialog titles use `--text-base` at their default size
  (the `sm` card uses `--text-sm`); alert, popover, empty and field titles use
  `--text-sm`. `lg` avatar fallbacks and group counts use `--text-base`. Sheet
  and drawer titles follow their per-style reference scale.
- Badges, kbd, tooltips, `sm` toggles and `xs` buttons use `--text-xs`; the
  `sm` button is a deliberate `0.8rem` exception. Menu headings, listbox group
  labels, command shortcuts, chart legends and tooltips, navigation-menu
  descriptions and sidebar footers also use `--text-xs`.
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
  `1rem`; select chevrons, listbox indicators, calendar navigation and carousel
  controls are `1rem`; breadcrumb separators are `0.875rem` and avatar badges
  use `0.5rem` (`sm` badges hide the icon). Avatar group count icons are `1rem`;
  `sm` counts use `0.75rem` and `lg` counts use `1.25rem`. Toast close buttons
  use the `icon-xs` size.

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
| Muted region | `--muted` at 50% for footers, table footers, subdued rows and table rows with an expanded trigger; `--muted` for skeletons and kbd. |
| Aspect ratio | `--muted` media frame; the child fills the box and `data-fit` sets `object-fit`. |
| Dialog backdrop | Black at 10% plus a 4px backdrop blur. |
| Empty | Dashed `--border` outline, no fill. |
| Accordion | Bottom `--border` divider between items; summary hover underline. |
| Attachment | `--card` surface with a `--border` outline; media uses `--muted`; error uses a destructive border and media tint. |
| Bubble | Default uses `--primary` / `--primary-foreground`; secondary and muted use their surfaces; tinted mixes primary into the background; destructive uses a destructive tint. |
| Marker | `--muted-foreground` text; separator and border variants use `--border`. |
| Message | Metadata uses `--muted-foreground`; the row itself has no surface. |
| Message scroller | `--background` surface with a `--border` outline; the jump button uses the background and a `--shadow-md`. |
| Questionnaire | Choice cards use the `--border` outline and a primary tint when checked; the progress track uses primary at 20%. |
| Trace | Bottom `--border` divider per row; body text is muted; status pills use `--muted`, destructive or primary tints. |
| Avatar | `--muted` fallback and group count, `--primary` badge and a 1px `--border` ring. |
| Calendar | Selected day uses `--primary` / `--primary-foreground`; ranges and multiple selection use a `--muted` band; today uses an inset `--ring`. |
| Carousel | Controls use `--border`; active indicators use `--primary`. |
| Chart | Legend swatches use `--chart-*`; tooltips use the popover surface. |
| Context menu | `--popover` surface, foreground-at-10% ring and `--shadow-md`. |
| Hover card | `--popover` surface through the popover primitive. |
| Input group, OTP | `--input` border, `--ring` control focus and destructive invalid ring. |
| Listbox panel | `--popover` surface, foreground-at-10% ring and `--shadow-md`; options use `--accent` for highlight. |
| Menu | Shared menu primitive: `--popover` surface, foreground-at-10% ring and the style's menu shadow. |
| Menubar | Transparent bar with a 1px `--border` outline; Vega adds `--shadow-xs`. Triggers use `--muted` for hover, expanded and focus-visible. |
| Navigation menu | `--popover` panels through the popover primitive. |
| Progress | `--primary` at 20% for the track and full `--primary` for the indicator. |
| Resizable | `--border` outline, 1px handle line and grip; `--ring` focus ring. Nested groups drop the outline and surface. |
| Scroll area | Native scrollbars from `--scrollbar-thumb`, `--scrollbar-track` and `--scrollbar-width`. |
| Select, combobox | `--input` border; `--ring` focus and destructive invalid ring. |
| Sheet | `--popover` panel, `--border` on the free edge, a style-specific shadow and backdrop. Attached panels stay square. |
| Drawer | `--popover` panel, `--border` on the free edge and the style's surface shadow; floating styles use a full outline. |
| Sidebar | `--sidebar`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-border` and `--sidebar-ring`. |
| Slider | Native track and thumb colored by `accent-color: --primary`. |
| Toast | Popover surface with `--border`; destructive uses a destructive tint. |
| Toggle | Transparent or outline surface; pressed uses `--accent` / `--accent-foreground`. |
| Pagination | Current page uses `--background` with a `--border` outline; links compose with button. |

Borders: use `--border` for separators, alerts and outline variants; cards use
a box-shadow ring instead of a border. Use `--input` for the border of text
fields, selects, checkboxes, radios and switches.

### State recipes

| State | Visual rule |
| --- | --- |
| Hover | Primary fills mix toward transparent at 20%; outline and ghost use `--muted`; link underlines; menu items use `--accent` while menubar triggers use `--muted`; table rows use muted at 50%, including while the row contains an expanded trigger. |
| Focus visible | 1px `--ring` border plus a 3px `--ring`-at-50% shadow. Tabs also draw a 1px `--ring` outline; menu items use the accent background instead of a ring, and menubar triggers use `--muted`. Code Block rings the block while its `pre` is focused. |
| Invalid | `--destructive` border plus a 3px destructive-at-20% shadow; dark mode uses stronger destructive mixes. A field containing an invalid control turns its text destructive. |
| Disabled | 50% opacity. Buttons, tabs and menu items also drop pointer events; inputs, textareas and selects use a not-allowed cursor. Input groups tint the surface with `--input` at 50% (80% in dark) and fade addons. |
| Active | Buttons translate down 1px, except triggers with `aria-haspopup`. |
| Selected | Tabs use a raised background and `--shadow-sm`; line tabs use a 2px foreground indicator. Table rows use `--muted`. Listbox options use font-weight 500 and a check indicator. Selectable label cards use a primary border and tint, and their descriptions rise to `--foreground`. |
| Current | `aria-current="page"` pagination links use an outline border and `--background`; breadcrumb current text uses `--foreground`. |
| Pressed | `aria-pressed="true"` toggles use `--accent` / `--accent-foreground`. |
| Open details | Accordion summaries rotate their trailing icon 180 degrees; the open state itself is native. |
| Indeterminate | Progress uses a moving primary gradient over a 20% primary track. Checkbox draws a current-color dash. |
| Highlighted | Menu items use `--accent` / `--accent-foreground`; destructive items use a destructive tint. |
| Expanded | Secondary, outline and ghost buttons keep their open-state fill via `aria-expanded="true"`. Table rows containing an expanded trigger use muted at 50%. |

Forced-colors mode: focusable controls that suppress the native outline draw a
transparent 2px outline with a 2px offset so the system focus indicator remains
visible. Progress uses a `Canvas` track with a `CanvasText` outline and a
`Highlight` indicator, including the indeterminate sweep.

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
| Command list | `18rem` maximum height | — |
| Context menu | `8rem`–`20rem` wide | — |
| Drawer | `calc(100dvh - 6rem)` maximum block size | `sm` 50dvh, `lg` 90dvh maximum; inline sides use 75vw, then 24rem from 40rem |
| Hover card | `18rem` wide | — |
| Input group | `2rem` minimum height | Auto with a textarea |
| Input OTP cell | `2.5rem` square | `sm` 2rem, `lg` 3rem |
| Menubar bar | `2rem` in Nova, Lyra and Rhea; `2.25rem` in Vega, Maia, Mira and Luma; `2.5rem` in Sera | Trigger height follows its content and padding |
| Navigation trigger | `2rem` high | — |
| Progress | `0.25rem` high | — |
| Resizable | Consumer-sized | Panels use `--panel-size`, `--panel-min` and `--panel-max`; nested groups reset them |
| Scroll area | Consumer-sized | `sm` narrower scrollbar |
| Select trigger | `2rem` high | `sm` 1.75rem |
| Sheet | Inline sides use `75vw`, then `24rem` at `40rem`; block sides size to content | Inline `sm` 20rem, `lg` 28rem; block `sm`/`lg` cap at `50vh`/`90vh`; `--sheet-width` and `--sheet-height` override |
| Sidebar | `16rem` wide | `--sidebar-width` |
| Slider | `1.25rem` hit area | `sm` 1rem, `lg` 1.5rem |
| Toast | `24rem` wide | The `.toaster` viewport is fixed at `1rem` from the block-end and inline edges; centered below `40rem`, end-aligned at and above it |
| Calendar | `18rem` wide | — |
| Carousel | Consumer-sized | `data-orientation` sets the axis |
| Chart plot | `16 / 9` aspect ratio | Consumer can override |
| Attachment | `10rem` minimum width horizontally | `sm`/`xs` shrink media; vertical is `7rem` wide |
| Bubble | `80%` maximum width | Ghost is full width |
| Marker | Full width, `1rem` minimum height | — |
| Message | Full width | — |
| Message scroller | Consumer-sized | The docs example uses `22rem` height |
| Questionnaire | Consumer-sized | Progress bar is `0.375rem` high |
| Trace | Full width | — |
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
  header alignment, dialog max width and sheet inline width.
- `48rem` (768px): input/textarea type size and description wrapping.
- `28rem` (448px) container query: responsive fields switch from stacked to
  horizontal inside their field group.

Component widths:

- Dialog panel: `24rem` maximum at `40rem` and above.
- Sheet panel: inline sides use `75vw` below `40rem` and `--sheet-width` at or
  above it; block sides span the inline axis and size to content unless capped.
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
`[data-rtl-flip]` icons in menus, breadcrumb and pagination. Code Block content
is always `dir="ltr"` even on an RTL page; its header follows the page
direction.

## Public component API

### Roots and anatomy

| Component | Root classes | Anatomy | Public modifiers |
| --- | --- | --- | --- |
| Accordion | `.accordion` | Container of native `<details>` with `<summary>` triggers and content directly after `summary`. | Exclusive groups use the native `name` attribute; disabled items use `inert` |
| Alert | `.alert` | Direct SVG icon; title (`h2`–`h6`, `strong` or `[data-slot="title"]`); description (`[data-slot="description"]` or `section`); action (`footer`). | `data-variant="destructive"`; default by omission |
| Alert dialog | `.alert-dialog` | Native `<dialog>` containing a panel; panel contains `header` (optional `figure` with an icon or image), title, description, `section` and `footer`. | `data-size="sm"` on the dialog or panel; `figure data-variant="destructive"`; default by omission |
| Aspect ratio | `.aspect-ratio` | A single media child (`img`, `video`, `iframe`, `canvas` or `svg`). | `--ratio` local property (default `16 / 9`); `data-fit="cover|contain"` |
| Attachment | `.attachment` | `[data-slot="media"]`, `[data-slot="content"]` with title/description and `[data-slot="actions"]`; optional `[data-slot="trigger"]` overlay. | `data-size="default|sm|xs"`; `data-orientation="horizontal|vertical"`; `aria-busy="true"` on the root |
| Avatar | `.avatar`, `.avatar-group` | Real `img`, `[data-slot="fallback"]` layer and optional `[data-slot="badge"]`; `.avatar-group` overlaps avatars and may end with `[data-slot="count"]`, which follows the group size. | `data-size="default|sm|lg"` |
| Badge | `.badge` | Text and optional SVG; `data-icon="inline-start|inline-end"` marks the icon so that edge tightens. Use on `span` or `a`; decorative icons need `aria-hidden="true"`. | `data-variant="primary|secondary|outline|destructive|ghost|link"`; `aria-invalid="true"` draws the destructive border and ring; `aria-busy="true"` while reporting progress |
| Breadcrumb | `.breadcrumb` | `nav` with `ol`/`li`, links or menu-trigger buttons and a current `span`; separators are `li[aria-hidden="true"]`; `[data-slot="ellipsis"]` for collapsed paths. | `aria-current="page"` on the current item; `data-rtl-flip` on directional separator icons |
| Bubble | `.bubble`, `.bubble-group` | `[data-slot="content"]` surface and optional `[data-slot="reactions"]` containing `[data-slot="reaction"]` buttons. | `data-variant="default|secondary|muted|tinted|outline|ghost|destructive"`; `data-align="start|end"`; reaction `aria-pressed` |
| Button | `.btn` | Text, optional SVG and inline spinner; `data-icon="inline-start|inline-end"` marks inline icons for padding. Use on `button` or `a`; icon-only buttons need an accessible name. | `data-variant="default|primary|secondary|outline|destructive|ghost|link"`; `data-size="default|xs|sm|lg|icon|icon-xs|icon-sm|icon-lg"` |
| Button group | `.btn-group` | Buttons, inputs, dropdown/popover/select wrappers, `span`/`label`/`output` and `hr[role="separator"]`. | `data-orientation="horizontal|vertical"` (horizontal by default) |
| Calendar | `.calendar` | Header with `[data-slot="previous"]`, `[data-slot="next"]` and `[data-slot="title"]` or `[data-slot="caption"]` containing `[data-slot="month"]`/`[data-slot="year"]` selects in `[data-slot="dropdown"]`; native `<table role="grid">` with column headers and `td[role="gridcell"]` day cells carrying `[data-date]` buttons. Week numbers use `th[scope="row"]`. | Cell `aria-selected`; grid `aria-multiselectable="true"` for ranges and multiple selection; day `aria-current="date"` and `aria-disabled`; `data-selection="single|range|multiple"`, `data-min`, `data-max`, `data-unavailable`, `data-month` |
| Card | `.card` | `header` with title/description/action, `section`, `footer`, optional leading/trailing image. | `data-size="default|sm"`; `data-separator="bottom"` on the header; `--card-spacing` overrides the section gap and inline inset |
| Carousel | `.carousel` | `.carousel-viewport`, `.carousel-track`, `.carousel-item` slides, `.carousel-controls`, `[data-slot="previous"]`/`[data-slot="next"]` buttons and `.carousel-indicator` buttons. | `data-orientation="horizontal|vertical"`; indicator `aria-current`; offscreen slides `aria-hidden` and `inert` |
| Chart | `.chart` | `[data-slot="plot"]`, legend with `[data-slot="legend-item"]`/`[data-slot="swatch"]` and `[data-slot="tooltip"]`. | `data-series="1"`–`"5"` |
| Checkbox | `.checkbox` | Native `input[type="checkbox"]`; must not carry `role="switch"`. Checked draws a check; indeterminate draws a dash. | — |
| Code Block | `.code-block` | Optional `header` with `[data-slot="title"]` and `[data-slot="actions"]`; required `pre` containing `code`; optional `footer`; line parts `[data-slot="line"]` wrapping `[data-slot="line-content"]`. Copy controls use `[data-slot="copy"]` with copy/check icons; wrap controls use `[data-slot="wrap"]`. | `data-size="default|sm"`; `data-variant="default|destructive"`; `pre` `data-line-numbers`, `data-wrap`, `--line-start`; line `data-variant="added|removed|highlighted"`; transient `data-copied` |
| Collapsible | `.collapsible` | Native `<details>` with a `<summary>` trigger and content directly after `summary`. | `[open]`; `inert` for disabled items |
| Combobox | `.combobox` | Input with `role="combobox"`, optional `[data-slot="input"]` hidden input and a `[data-popover]` panel containing `[role="listbox"]`; optional `[data-slot="clear"]`. | Listbox `aria-multiselectable="true"` for multiple; placement attributes on the panel |
| Command | `.command` | Popover surface with `[data-slot="command-input"]`, an input-group search field and a `[role="listbox"]` with groups, labels, separators, shortcuts, optional indicators and an empty state. | `[data-slot="shortcut"]`, `[data-slot="empty"]`, `[data-slot="indicator"]`; `[role="separator"]` dividers; option `aria-disabled` and `aria-selected` |
| Context menu | `.context-menu` | `[role="menu"]` panel with menu items, checkable items, headings, separators and shortcuts; nested menus use a `role="none"` wrapper around the trigger and its `[data-popover]` panel. | `--context-x`, `--context-y` on the panel; `aria-hidden="true|false"`; `aria-checked` on checkable items; the panel scrolls near the viewport edge |
| Dialog | `.dialog` | Native `<dialog>` containing a panel; panel contains `header`, title, description, `section`, `footer` and a close button or `form[method="dialog"]`. Section content scrolls between a fixed header and footer. | Footer `data-align="start"` |
| Drawer | `.drawer` | Native `<dialog>` with one direct `[data-slot="drawer-content"]` panel containing an optional `[data-slot="handle"]`, `header`, `section` and `footer`. The handle enables pointer swipe-to-close; the section scrolls between the header and footer. | `data-side="block-start|block-end|inline-start|inline-end"`; `data-size="default|sm|lg"` sets a maximum block size on vertical drawers; `--drawer-height`, `--drawer-width` and `--drawer-inset` override the defaults |
| Dropdown menu | `.dropdown-menu` | Trigger, `[data-popover]` panel, `[role="menu"]`, menu item roles, `[role="separator"]`, `[role="heading"]`, shortcut and indicator slots; nested menus use a `role="none"` wrapper around the sub-trigger and its panel. | Item `data-variant="destructive"`; default by omission; placement attributes; `data-inset`; `data-rtl-flip`; `aria-checked` on checkable items |
| Empty | `.empty` | `header` with optional `figure` (a single SVG becomes the icon box; image, avatar or avatar-group markup is used as-is), title (`h2`–`h4`) and description `p`; `section`; `footer`. | — |
| Field | `.field`, `.fieldset` | Label or legend, control, content `section` for a label/description pair, description `p`, error `[role="alert"]`, group/radiogroup container and `.field-separator` with an `hr`. | Legend `data-variant="label|legend"`; field `data-orientation="horizontal|responsive"`; group `data-slot="checkbox-group|radio-group"` |
| Hover card | `.hover-card` | Trigger and `[data-popover]` panel; the shipped behavior opens on hover or focus and dismisses with Escape, with the CSS hover/focus-within rules as the no-JS fallback. | Placement attributes; panel `aria-hidden` |
| Input | `.input` | Native `<input>`. | — |
| Input group | `.input-group` | `role="group"` with semantic `input`/`textarea` and `[data-slot="addon"]` parts. Custom controls opt in with `data-slot="input-group-control"`. | Addon `data-align="inline-start|inline-end|block-start|block-end"`, default `inline-start` |
| Input OTP | `.input-otp` | Label wrapper with one `[data-slot="cell"]` span per code position and a `[data-slot="entry"]` around the native `<input>`; keep the cell count equal to `maxlength` and `pattern`, add `required` with a full-length pattern, and give the input an accessible name. The row stays LTR; the active cell indicator follows the end of the value, and a completed code rings all cells. | `data-spacing="default|joined"`; `data-size="default|sm|lg"`; input `required`, `aria-invalid`, `disabled` |
| Item | `.item`, `.item-group` | `figure`, `section`, `aside`, `header`, `footer`; item groups accept `hr` separators. | Item `data-variant="default|outline|muted"`; `data-size="default|sm|xs"` |
| Kbd | `.kbd`, `.kbd-group` | Inline shortcut text or SVG; `.kbd-group` joins related keys. | — |
| Label | `.label` | Native `<label>`; also supported as a direct label inside `.field`. A label wrapping a `.field` becomes a selectable card. | — |
| Marker | `.marker` | `[data-slot="icon"]` and `[data-slot="content"]`. | `data-variant="default|separator|border"` |
| Menubar | `.menubar`, `.menubar-item` | `role="menubar"`, `role="none"` item wrappers, `role="menuitem"` triggers with `aria-haspopup`/`aria-expanded`, and `[data-popover]` submenus with `role="menu"`. Checkable items put `[data-slot="indicator"]` first. | Placement attributes on submenu panels; nested menus use a `role="none"` wrapper around the sub-trigger and its panel |
| Message | `.message`, `.message-group` | Row with `[data-slot="avatar"]` and `[data-slot="content"]` containing header, bubble and footer slots. | `data-align="start|end"` |
| Message scroller | `.message-scroller` | `.message-scroller-viewport` scroll container, `[data-slot="content"]` and optional `[data-slot="jump"]` button. The shipped behavior follows inserted messages and toggles the jump button. | Consumer-sized; `hidden` toggles the jump button; `change` reports `detail.following` |
| Native select | `.native-select` | Native `<select>`; `optgroup` groups options. | `data-size="default|sm"`; native `required` and `disabled`; `aria-invalid` |
| Navigation menu | `.navigation-menu` | `nav` with `ul`/`li`, trigger buttons or links, and `[data-popover]` panels with link lists and `[data-slot="icon"]`/`[data-slot="title"]`/`[data-slot="description"]` inside links. | Placement attributes on panels; the trigger chevron rotates while `aria-expanded="true"` |
| Pagination | `.pagination` | `nav` with `ul`/`li`; links compose with `.btn`; `[data-slot="ellipsis"]` and `[data-slot="label"]` parts. | `aria-current="page"` on the active link |
| Popover | `.popover` | Trigger with `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`, plus a `[data-popover]` `role="dialog"` panel named by `aria-labelledby`; optional header, title and description. | Placement attributes |
| Progress | `.progress` | Native `<progress>` with fallback text. | `value`/`max`; omit `value` for indeterminate |
| Questionnaire | `.questionnaire` | `[data-slot="progress"]`, fieldset steps with legends, `[data-slot="choices"]`, native inputs, `[data-slot="actions"]` and `[data-slot="previous"]`/`[data-slot="next"]` buttons. | `aria-current="step"` on the active step; `hidden` on inactive steps; native radio/checkbox/input |
| Radio | `.radio` | Native `input[type="radio"]`, normally inside `role="radiogroup"`. Compose rows with `.field` and a label, and group them with `[data-slot="radio-group"]` inside a `.fieldset`. | — |
| Resizable | `.resizable` | `.resizable-panel` panes with `--panel-size`, `--panel-min` and `--panel-max`, and `[data-slot="handle"]` separators with an optional `[data-slot="grip"]` child. The intersection of a nested inner handle with its immediate outer handle is a hidden two-axis corner. The shipped behavior supports any number of handles between adjacent panels, redistributes only the active pair, supports keyboard resizing and keeps nested groups independent. | `data-orientation="horizontal|vertical"`; panel `--panel-size` weight and `--panel-min`/`--panel-max` percentages; handle `aria-valuenow/min/max`, `aria-controls` and an accessible name; `change` reports every direct panel size |
| Scroll area | `.scroll-area` | Scroll container; the consumer sets dimensions and content. | `data-orientation="horizontal|vertical"`; `data-size="default|sm"` |
| Select | `.select` | Trigger with `role="combobox"` and `[data-slot="value"]`, optional `[data-slot="input"]` hidden input and a `[data-popover] > [role="listbox"]` panel. Options accept `data-value` and fall back to `[data-slot="text"]`. Group labels use `[data-slot="label"]`, dividers use `[role="separator"]`, optional `[data-slot="scroll-up"]`/`[data-slot="scroll-down"]` controls scroll long panels and the panel caps at `18rem`. | `data-size="default|sm"`; `data-placeholder` on the trigger; `aria-invalid` on the trigger |
| Separator | `.separator` | `<hr>` or `[role="separator"]`. | `data-orientation="horizontal|vertical"`; `aria-orientation` is also recognized |
| Sheet | `.sheet` | Native `<dialog>` with one direct `[data-slot="sheet-content"]` panel containing semantic `header`, `section`, `footer` and an optional close control. The section scrolls between the header and footer; the footer is a stacked column. | `data-side="inline-start|inline-end|block-start|block-end"` defaults to `inline-end`; `data-size="default|sm|lg"` sets inline width or a block-side maximum for `sm`/`lg`; `--sheet-width` and `--sheet-height` override; close uses shared `[data-slot="close"]`, a direct native form or a behavior-backed button |
| Sidebar | `.sidebar` | `<aside>` with `header`, `section` and `footer`; `nav` groups named by a heading or `[data-slot="group-label"]` with an optional `[data-slot="group-action"]`; nav rows with an optional `[data-slot="menu-badge"]` or `[data-slot="menu-action"]`; nested lists and collapsible groups. | `aria-current="page"` on links; `data-slot="brand"` |
| Skeleton | `.skeleton` | No required children; the consumer sets dimensions. | — |
| Slider | `.slider` | Native `<input type="range">`; horizontal, one thumb. | `data-size="default|sm|lg"` |
| Spinner | `.spinner` | Empty span; the CSS draws the ring. | `data-size="default|sm|lg"`; `role="status"` plus a label in markup |
| Switch | `.switch` | Native `input[type="checkbox"]` with `role="switch"` and a label. | `data-size="default|sm"` |
| Table | `.table-container`, `.table` | `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`; checkbox cells use a native `input[type="checkbox"]` or `role="checkbox"`. | Row `aria-selected="true"`; a row containing `aria-expanded="true"` stays highlighted |
| Tabs | `.tabs` | `[role="tablist"]`, `[role="tab"]`, `[role="tabpanel"]`. | Tablist `data-variant="default|line"`; `aria-orientation="horizontal|vertical"` |
| Textarea | `.textarea` | Native `<textarea>`. | — |
| Toast | `.toaster`, `.toast` | A labelled `ol.toaster` (`role="list"`) of `li.toast` items; `[data-slot="content"]` is the live region (`role="status"` or `role="alert"`, `aria-atomic="true"`) wrapping `[data-slot="icon"]`, a `section` with title/description, `[data-slot="action"]` and `[data-slot="close"]`. The `ol` also holds `[data-slot="toast-template"]` and `data-toast-icon="..."` templates. | `data-variant="default|destructive"`; `data-type="success|info|warning|error|loading"`; `data-duration` in milliseconds; `data-toast-limit` for the stack cap (default `3`, `0` disables); `data-limited` on capped toasts; `data-open-toast="<id>..."` on a trigger; `data-close-toast` on an action; manager methods `addToast`, `updateToast`, `closeToast` and `promiseToast`; `[data-slot="close"]` |
| Toggle | `.toggle` | Native `<button type="button">`; text and optional SVG. | `aria-pressed="true|false"`; `data-variant="default|outline"`; `data-size="default|sm|lg"` |
| Toggle group | `.toggle-group` | `role="group"` container of `.toggle` children. | `data-orientation="horizontal|vertical"`; `data-spacing="default|joined"`; group `data-variant`/`data-size` apply to children without their own |
| Tooltip | `.tooltip` | Wrapper around the trigger; `data-tooltip` for the text bubble or a direct `[data-slot="content"]` child with `role="tooltip"`; always-on tail. The shipped behavior adds Escape dismissal for content children; the shorthand stays CSS-only. | `data-side`, `data-align`; content `aria-hidden` |
| Trace | `.trace` | Native `<details>` with a `<summary>` line (`[data-slot="icon"]`, title and status) and `[data-slot="body"]`; `[data-slot="source"]` links compose inside the body. | `[open]`; `aria-busy="true"` while running; status `data-variant="error|success"` |

On buttons, `default` and `primary` are aliases; omitting `data-variant` is
the same as `primary`. On badges, `primary` and omission are equivalent and
`default` is not a badge value. Other components define their own default by
omission.

Card also accepts the compatibility aliases `.card-title`, `.card-description`
and `.card-action`; prefer the `data-slot` names in new markup. A direct
leading or trailing `img` fills the card width and the matching corners follow
the card radius. `--card-spacing` is set by the style per size and can be
overridden on the card root; it controls the section gap and inline inset.

### Parts and slots

The public slot vocabulary is shared across components:

- `data-slot="title"` — alert, calendar, card, chart tooltip, code block, dialog, alert-dialog, popover, sheet and toast.
- `data-slot="caption"`, `data-slot="dropdown"` — calendar month and year selectors.
- `data-slot="description"` — alert, card, chart tooltip, dialog, alert-dialog, popover, sheet and toast.
- `data-slot="content"` — attachment, bubble, marker, message, message-scroller, toast and the tooltip's rich bubble.
- `data-slot="action"` — card and toast.
- `data-slot="actions"` — code block.
- `data-slot="line"`, `data-slot="line-content"` — code block.
- `data-slot="header"` — popover.
- `data-slot="shortcut"` — dropdown menu, context menu, menubar and command.
- `data-slot="indicator"` — dropdown menu, context menu, menubar and listbox options, including command items.
- `data-slot="checkbox-group"`, `data-slot="radio-group"` — field.
- `data-slot="fallback"`, `data-slot="badge"`, `data-slot="count"` — avatar.
- `data-slot="ellipsis"` — breadcrumb and pagination.
- `data-slot="label"` — pagination previous/next text and listbox group labels.
- `data-slot="handle"` — drawer swipe surface and resizable.
- `data-slot="drawer-content"` — drawer's single direct panel.
- `data-slot="sheet-content"` — sheet's single direct panel.
- `data-slot="grip"` — optional visible grip inside a resizable handle.
- `data-slot="title"`, `data-slot="description"` — navigation menu panels.
- `data-slot="addon"` — input group.
- `data-slot="input-group-control"` — custom input group controls.
- `data-slot="command-input"` — command search-field wrapper.
- `data-slot="text"` — select, combobox and command option labels.
- `data-slot="empty"` — listbox and command empty state.
- `data-slot="scroll-up"`, `data-slot="scroll-down"` — optional select panel scroll controls.
- `data-slot="clear"` — combobox clear button.
- `data-slot="plot"`, `data-slot="legend"`, `data-slot="legend-item"`, `data-slot="swatch"`, `data-slot="tooltip"` — chart.
- `data-slot="brand"` — sidebar.
- `data-slot="group-label"`, `data-slot="group-action"` — sidebar nav group label text and trailing action.
- `data-slot="menu-badge"`, `data-slot="menu-action"` — sidebar row trailing count and action.
- `data-slot="close"` — toast and sheet.
- `data-slot="toast-template"` — the toast skeleton inside `.toaster`, cloned by the manager; `data-toast-icon="success|info|warning|error|loading"` templates provide the status icons inside the same toaster.
- `data-slot="avatar"`, `data-slot="content"`, `data-slot="header"`, `data-slot="footer"` — message.
- `data-slot="media"`, `data-slot="actions"`, `data-slot="trigger"` — attachment; title and description use the shared slots.
- `data-slot="reactions"`, `data-slot="reaction"` — bubble.
- `data-slot="icon"` — marker, toast, trace and navigation menu.
- `data-slot="progress"`, `data-slot="progress-label"`, `data-slot="item"`, `data-slot="choices"`, `data-slot="error"`, `data-slot="skip"` — questionnaire; `data-slot="label"` and `data-slot="text"` mark choice text.
- `data-slot="status"`, `data-slot="body"`, `data-slot="source"` — trace.
- `data-slot="jump"` — message scroller.

Semantic parts are equally public where documented: `header`, `section`,
`footer`, `figure`, `aside`, `pre`, `code`, `details`, `summary`, `nav`, `ol`,
`ul`, `li`, `progress`, `[role="menu"]`, `[role="menubar"]`,
`[role="menuitem"]`, `[role="tablist"]`, `[role="tab"]` and
`[role="tabpanel"]`. Do not invent a new `data-slot` name for a part that
already has a semantic element in the anatomy. Drawer's `drawer-content` and
Sheet's `sheet-content` identify their single non-semantic panel wrappers; the
native `<dialog>` remains semantic and needs no slot.

Toggle groups are multi-state: every `.toggle` child owns its own
`aria-pressed`. A single-choice control uses a radio group, not a toggle group.

### Placement attributes

Popover panels, dropdown panels and tooltips share placement hooks:

| Attribute | Values | Default | Applies to |
| --- | --- | --- | --- |
| `data-side` | `top`, `bottom`, `left`, `right`, `inline-start`, `inline-end`, `block-start`, `block-end` | `bottom` for popover and dropdown; `top` for tooltip; `inline-end` for sheets; required on drawers | Popover, dropdown, tooltip, sheet, drawer and navigation panels |
| `data-align` | `start`, `center`, `end` | `start` for popover, dropdown and navigation panels; `center` for tooltip | Popover, dropdown, tooltip and navigation panels |

The table is the union of placement values. Popovers, dropdowns, tooltips and
navigation panels accept their documented physical or logical values; sheets
and drawers accept only the four logical values.

Input-group addons also use `data-align`, but with
`inline-start`, `inline-end`, `block-start` and `block-end`; the default is
`inline-start`. Addons always follow the input or textarea in the DOM so the
control keeps its tab order; `data-align` and `order` position them visually.
`center` alignment uses a translate offset. `data-inset` adds leading padding to
menu items and headings; `data-rtl-flip` rotates an icon 180 degrees in RTL
contexts. Nested menu panels use `data-side="inline-end"` so they open away from
the parent menu in both directions.

Sheets use `inline-start`/`inline-end` for side sheets and
`block-start`/`block-end` for top and bottom sheets; omission defaults to
`inline-end`. Inline sides follow the writing direction and use `75vw`, switching
to `var(--sheet-width, 24rem)` at `40rem`. `data-size` sets the inline width; on
block sides, `sm` and `lg` set `50vh` and `90vh` maximums while the default sizes
to content. `--sheet-width` overrides the inline size and `--sheet-height`
overrides the block maximum. Drawers support the same four logical sides and use
`75vw`, switching to `var(--drawer-width, 24rem)` at `40rem`; `sm` and `lg` set a
`50dvh` or `90dvh` maximum while the default sizes to content up to
`calc(100dvh - 6rem)`. `--drawer-height` overrides the vertical maximum,
`--drawer-width` overrides the inline size and `--drawer-inset` floats the panel
from its viewport edges in styles that support it. Context menus are positioned
by the consumer through `--context-x` and `--context-y` on the panel. Those
coordinates are physical `left`/`top` values even in RTL; this is the only
physical-inset exception in the registry.

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
| Disabled, non-native | `aria-disabled="true"` | Tabs, menu items, listbox options, calendar day buttons and other elements that cannot use `:disabled`. |
| Selected | `aria-selected="true"` | Tabs, selectable table rows, listbox options and calendar day cells. |
| Checked, native | `:checked` | Checkbox, radio and switch. |
| Checked, menu item | `aria-checked="true"` | `menuitemcheckbox` and `menuitemradio`. |
| Highlighted | `data-highlighted` | Menu items and listbox-like composites. Presence only; no value required. |
| Current | `aria-current="page"` | Breadcrumb and pagination. `aria-current="date"` marks today in a calendar. `aria-current="step"` is reserved for multi-step flows. |
| Pressed | `aria-pressed="true"` | Toggle and toggle-group buttons. |
| Expanded | `aria-expanded="true"` | Menu, navigation, select and combobox triggers; panels use `aria-hidden`. |
| Open, details | Native `[open]` on `<details>` | Accordion items. |
| Open, dialog | Native `[open]` | Dialog, alert dialog, sheet and drawer. |
| Open, popover | `aria-hidden="false"` | `[data-popover]` panels; the trigger uses `aria-expanded`. |
| Indeterminate | Native `:indeterminate` | Progress without a value; a checkbox whose `indeterminate` property is set from JavaScript. |
| Range value | Native `value` and `max` | Progress; no ARIA override. |
| Disabled, inert | `inert` | Accordion items. |
| Focus | `:focus-visible` | All focusable controls. |
| Focus within | `:has(> :is(input, textarea, [data-slot="input-group-control"]):focus-visible)` | Input group; the group draws the ring for its control, and addon buttons keep their own focus ring. |

The state contract is deliberately small. Do **not** use `.active`,
`data-active`, `data-invalid`, `data-disabled`, `data-selected`,
`data-state="selected"` or similar class/data aliases. Beyond variant, size,
orientation, spacing, fit and placement attributes, `data-highlighted` (active
option), the transient `data-copied` (copy feedback) and `data-limited` on a
toast beyond `data-toast-limit` are the only public data-driven states;
`data-duration` configures the toast timer, `data-type` the status type and
`data-toast-limit` the stack cap. `data-open-toast` and `data-close-toast` are
action hooks, not visual states. Calendar also uses `data-selection`, `data-min`,
`data-max`, `data-unavailable`, `data-month` and `data-date` as configuration and
data; they are not visual states. Any other state must be expressible with a
native pseudo-class or ARIA.

Notes:

- Select's `data-placeholder` on the trigger and `data-value` on options carry
  authored configuration and form data, not visual state aliases. The optional
  `data-slot="scroll-up"`/`data-slot="scroll-down"` controls are parts, not
  states.
- `data-toast-initialized` is an internal behavior hook set by the shipped toast
  module once it measures and stacks a `.toaster`; `data-toast-managed` marks
  the generated `li` elements. The `--toast-index`, `--toast-behind`,
  `--toast-height`, `--toast-peek`, `--toast-gap`, `--toast-expanded` and
  `--toast-swipe-*` custom properties are runtime layout values, not public
  customization hooks.
- `[data-slot="toast-template"]` and `data-toast-icon` are authored template
  hooks, not states. The toast manager clones them and sets `data-type`,
  `data-duration`, the live-region role, `aria-atomic` and `aria-busy` on the
  generated toast.

- `aria-hidden="true"` hides a popover and drives its exit transform. The
  dialog shell also recognizes `:popover-open` for consumers using the native
  popover API, but the documented dialog pattern is `<dialog>` plus `[open]`.
- `aria-expanded="true"` is the trigger state for popovers, dropdown menus and
  buttons that open an overlay.
- `data-dropdown-menu-initialized` is an internal behavior hook set by the
  shipped menu module to disable the CSS-only hover fallback once JavaScript
  takes over keyboard navigation. It is not part of the public state contract.
- Tooltips with a content child keep the CSS `:hover` / `:has(:focus-visible)`
  fallback; the shipped hover-overlay behavior adds `aria-hidden` and Escape
  dismissal. The `data-tooltip` shorthand has no element to manage and stays
  CSS-only. Empty content does not open the bubble.
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
- A joined toggle group collapses the shared borders and rounds only the outer
  corners; the focused item paints above its siblings so its ring is not
  clipped at the seam.
- Menubar, dropdown-menu and context-menu items share the internal `menu`
  primitive. It styles `[role="menu"]`, the menu item roles, headings,
  separators, shortcuts and indicators. A nested menu wraps its sub-trigger and
  `[data-popover]` panel in a `role="none"` element; any such wrapper inside the
  menu, including one inside a `role="group"`, is the positioning anchor. The
  panel offsets by the menu surface padding so its first item aligns with the
  sub-trigger row, and the sub-trigger is highlighted while
  `aria-expanded="true"`. A menu surface that contains a submenu keeps its
  overflow visible so the nested panel is not clipped; keep those menus short
  instead of relying on their scroll container.
- Hover cards use the CSS `:hover` / `:focus-within` rules as the no-JS
  fallback; the shipped hover-overlay behavior adds `aria-hidden`, Escape
  dismissal and focus return. They are not a substitute for a popover that
  needs to stay open for interactive content.
- Context menus use `aria-hidden` on the panel. The shipped menu behavior sets
  `--context-x` and `--context-y`, manages focus and opens on right-click or
  Shift+F10; the CSS does not track the pointer. The area uses
  `aria-haspopup="menu"`, `aria-controls` and `tabindex="0"`; `aria-expanded`
  is not set on a generic container. The panel scrolls when its content would
  extend past the bottom of the viewport; choose coordinates that leave room
  for the requested side.
- Nested menu panels are absolutely positioned against their `role="none"`
  wrapper, so the wrapper needs no JavaScript hook beyond the trigger's
  `aria-expanded` and the panel's `aria-hidden`.
- The internal `listbox` primitive styles `[role="listbox"]`, `[role="option"]`,
  `[role="group"]`, group labels, separators and the empty state. The shipped
  behavior sets `aria-selected`, `data-highlighted` and `aria-activedescendant`;
  consumers may still drive the primitive directly and own those attributes.
- Select and combobox use the `listbox` helpers. Command uses the same ARIA and
  highlight vocabulary with command-specific fuzzy filtering and ranking. The
  shipped select and combobox modules open, close, filter, select and move the
  highlight; the `aria-expanded` / `aria-hidden` transitions are behavior-owned
  after install. Select reads `data-value`, syncs the authored
  `aria-selected="true"` option into the trigger and hidden input on load, and
  toggles the optional scroll controls. Those controls are absolute overlays
  with a popover-to-transparent gradient; when present they hide the panel's
  native scrollbar, and they stay hidden on coarse pointers.
- Command owns a popover surface and composes a wrapped input group with a
  listbox. Group labels use `data-slot="label"`, dividers are
  `[role="separator"]` (mark them `aria-hidden="true"` inside a listbox),
  shortcuts use `data-slot="shortcut"` and stay left-to-right in RTL containers,
  and optional `data-slot="indicator"` checks appear only with
  `aria-selected="true"`. The list caps at `18rem`, hides its scrollbar and keeps
  scroll padding. Active commands use `data-highlighted`, never `aria-selected`.
  The search input group keeps its resting border and draws no focus shadow.
- Sheets and drawers keep the footer at the bottom of the panel while the
  section scrolls. The shipped dialog behavior opens them with
  `data-open-dialog="<id>"` and closes them with `data-close-dialog`. Sheet and
  drawer triggers receive `aria-haspopup="dialog"`, `aria-controls` and a
  synchronized `aria-expanded`. A drawer's optional handle starts swipe-to-close
  in its `data-side` direction; the drawer behavior emits
  `dismiss({ reason: "swipe" })` before native `close()`. The sheet close control
  uses shared `[data-slot="close"]` on a button inside a direct child
  `form[method="dialog"]`, or on a direct behavior-backed `button`, at the inline
  end; style it with `.btn` and give icon-only controls an accessible label.
- Calendar day cells use `aria-selected`; day buttons use `aria-current="date"`
  and `aria-disabled`. A range or multiple selection sets
  `aria-multiselectable="true"` on the grid and marks every selected day. The
  shipped calendar behavior reads `data-selection`, `data-min`, `data-max`,
  `data-unavailable`, `data-month` and `data-date`, renders standard day
  buttons and owns month navigation, selection and keyboard grid movement.
- Carousel indicators use `aria-current="true"`; the shipped behavior moves
  between slides, updates indicators and manages `aria-hidden`/`inert` on
  offscreen slides. Autoplay and looping are not included.
- Resizable handles are `role="separator"` with `aria-orientation`, a label and
  `aria-valuenow`/`aria-valuemin`/`aria-valuemax`; the shipped behavior updates
  the values during pointer drag and keyboard resizing. `aria-valuenow` reports
  the leading panel's share of the group and `aria-valuemin`/`aria-valuemax` the
  range reachable by moving that handle. `aria-controls` references the leading
  panel when it has an id. Where a nested inner handle meets its immediate outer
  handle, the hidden intersection becomes a two-axis pointer target with a move
  cursor; the two separators remain the keyboard path.
- Chart `data-series` values map to `--chart-*` tokens and are presentation
  modifiers, not states.
- Attachment state uses `aria-busy="true"` for uploading or processing and a
  `role="alert"` description for errors. There is no `data-state` mirror.
- Message and standalone bubble alignment use `data-align="start|end"` as a
  presentation modifier, not a state. Message reactions use `aria-pressed`.
- Questionnaire steps use `aria-current="step"` on the active fieldset and the
  native `hidden` attribute on inactive steps. Progress is a native `<progress>`
  with an accessible name. Step changes, validation and submission are consumer
  JavaScript.
- Trace is a native `<details>` disclosure. `aria-busy="true"` marks a running
  step; the status pill uses `data-variant="error|success"` as presentation.
- The message scroller does not follow, anchor or restore scroll position. The
  consumer toggles `hidden` on `[data-slot="jump"]` and scrolls the viewport.
- Toast is a labelled `ol` list of `li` items. The
  `[data-slot="content"]` live region uses `role="status"` or `role="alert"` and
  `aria-atomic="true"`. The shipped behavior auto-dismisses after `5000ms`,
  honors `data-duration` in milliseconds (`0` is persistent), pauses every timer
  while the toaster is hovered or focus is inside, stacks the newest toast in
  front, expands the stack on hover/focus, swipes in any direction and dismisses
  from `[data-slot="close"]` or `[data-close-toast]`. `data-open-toast` reveals
  one or more hidden toasts by id, rear content is inert while the stack is
  collapsed, and dismissal emits `toggle` with `{ open: false }` plus `dismiss`
  with the reason. Each toaster is also augmented with `addToast`,
  `updateToast`, `closeToast` and `promiseToast`; the manager clones the authored
  templates, filling text or Nodes without `innerHTML`. Loading toasts are
  persistent, promise strings fill the description, reusing an id updates in
  place, `data-toast-limit` caps the stack (`3` by default, `0` disables) and
  limited toasts stay mounted and inert until newer toasts close.

## Behavior

Behavior is optional, copy-paste ESM. Installed modules are plain JavaScript
with JSDoc types, no dependencies and no build step. The CSS contract is
complete without them; `--no-behavior` must always produce a valid install.

- **Entry modules** self-initialize on import and register a document-level
  delegated dispatcher from `behaviors/core.js`. **Support modules**
  (`core.js`, `listbox.js`) export helpers and never auto-init.
- `init(root)` mounts the same handlers on a scoped root. Import is SSR-safe:
  top-level code does not touch `document`.
- Markup is the source of truth at rest. Modules toggle ARIA, focus,
  `tabindex`, `hidden`, `inert`, `data-highlighted` and transient
  `data-copied`. No `data-state`, no extra wrappers and no `innerHTML`. Toast is
  the exception for DOM creation: it clones its authored
  `[data-slot="toast-template"]` and `data-toast-icon` templates.
- Events bubble from the component root: `change` (`detail.value`,
  `detail.values`, `detail.range`, `detail.index`, `detail.sizes`,
  `detail.step`/`detail.total`, `detail.following` or `detail.checked`),
  `toggle` (`detail.open`) and `dismiss` (`detail.reason`).
- Static content and the page's own navigation stay readable without
  JavaScript. Overlay panels and selection widgets may be inert and are
  documented as behavior-dependent. Tooltip and hover-card keep their CSS
  hover/focus fallbacks; the tooltip `data-tooltip` shorthand stays
  visual-only.
- The modules are: `dialog` (dialog, alert-dialog, sheet and the shared drawer
  lifecycle), `drawer` (handle swipe-to-close), `popover`, `menu` (dropdown-menu,
  context-menu, menubar, navigation-menu), `tabs`, `listbox` plus `select`,
  `combobox` and `command`, `toast`, `code-block`, `calendar`, `carousel`,
  `resizable`, `questionnaire`, `message-scroller` and `hover-overlay` (tooltip
  and hover-card).
- Calendar reads `data-selection="single|range|multiple"`, `data-min`,
  `data-max`, `data-unavailable`, `data-month` and `data-date`, renders standard
  day buttons and uses `Intl` for labels and week numbers. Range uses two
  clicks (normalized), Shift-click extends and a third click starts over.
- Carousel ships controls, keyboard and offscreen state; it does not autoplay
  or loop. Resizable ships any number of handles between adjacent panels with
  per-panel weights and percentage minimum/maximum constraints, including
  nested groups. Where an inner handle meets its immediate outer handle, the
  intersection is a hidden two-axis pointer target that changes the cursor and
  drags both splits, emitting `change` for both groups; keyboard access stays on
  the separators. Collapse, pixel units and persistence are not included. A
  nested group resets `--panel-size`, `--panel-min`, `--panel-max` and its
  surface at the root so outer ratios do not leak into it.
  Questionnaire owns
  `[data-slot="previous"]`/`[data-slot="next"]`, progress and focus; validation
  and completion stay app-owned.
- Message-scroller follows inserted messages and preserves the reading position
  when the user is not following. Toast and message-scroller are the only
  modules allowed a scoped `MutationObserver`; message-scroller observes
  `[data-slot="content"]` child additions only.
- Toast is the only behavior that creates DOM. It clones the authored
  `[data-slot="toast-template"]` and `data-toast-icon` templates, fills
  title/description with text or Nodes and never uses `innerHTML`. Every
  `.toaster` gets `addToast`, `updateToast`, `closeToast` and `promiseToast`;
  options are `id`, `type`, `title`, `description`, `timeout`, `priority` and
  `actionProps`. `addToast` returns the id, reusing an id updates in place and
  refreshes the timer, `closeToast()` without an id closes all, promise strings
  map to `description`, loading stays persistent and success/error use the
  default timeout unless one is supplied. Update does not reorder the stack.
  Each toaster displays at most `data-toast-limit` toasts (`3` by default, `0`
  disables); older extras stay mounted with `data-limited` and `inert`, keep
  their timers and rejoin the stack as newer toasts close.
- Dialog actions use `data-open-dialog="<id>"` and `data-close-dialog`. Select
  writes `data-value` (or the option label) into a `[data-slot="input"]` hidden
  input; single-combobox forms sync the same slot. Toast
  reads `data-duration` and `data-type`, exposes `data-open-toast="<id>..."` and
  `data-close-toast`, and emits `toggle` plus `dismiss` with `reason`.
  Message scroller exposes `mount(root)` for a late-mounted subtree and Code
  Block uses `data-copied` for its transient check state.
- Drawer swipe writes the internal runtime properties
  `--drawer-gesture-duration`, `--drawer-swipe-transform` and
  `--drawer-swipe-progress`. They are removed after settling and are not public
  customization hooks.
- Behavior relies on the same browser target as the CSS: Chrome/Edge 125+,
  Safari 26+ and Firefox 147+.

## Motion

- Standard easing is `cubic-bezier(0.4, 0, 0.2, 1)`.
- Controls, hover states, tabs, table rows and tooltips transition in `150ms`.
- Accordion and collapsible content transition `block-size` and opacity in
  `150ms`, with a discrete `content-visibility` transition so the closing state
  animates too, where `::details-content` and `calc-size()` are supported; the
  open state itself is native and works without either feature.
- Code Block's floating actions fade in `150ms` on hover and focus-within.
- Overlays (popover, dropdown, dialog, alert dialog) transition in `100ms`;
  the underlying shell defaults to `150ms` when a style does not override it.
- Item hover and state transitions use `100ms`; the skeleton pulses on a `2s`
  loop with `cubic-bezier(0.4, 0, 0.6, 1)`.
- Menus, listbox panels and navigation panels transition in `100ms`; select
  chevrons rotate in `150ms`. Sheets use a `200ms` fade plus `2.5rem` directional
  slide with the standard easing, flipping inline motion in RTL; all Sheet motion
  stops under `prefers-reduced-motion: reduce`. Drawers use a directional `450ms`
  transform with `cubic-bezier(0.22, 1, 0.36, 1)`; handle swipe release scales the
  exit or snap-back duration between `80ms` and `360ms`, and all drawer motion
  stops under `prefers-reduced-motion: reduce`. Hover cards open after a `300ms`
  delay and hide immediately when the pointer leaves.
- Toasts enter from `150%` below, stack with `500ms` translate/scale and `250ms`
  opacity using `cubic-bezier(0.22, 1, 0.36, 1)`, and snap back in `500ms`
  after an incomplete swipe. All toast transitions stop under
  `prefers-reduced-motion: reduce`; the loading icon slows to `1.5s`.
- The spinner rotates on a `0.75s` linear loop; progress uses a `1.5s`
  indeterminate sweep that follows the inline direction.
- Dialog entry uses `@starting-style` and `allow-discrete`: the backdrop fades,
  the panel moves from 95% to 100% scale with opacity. Sheet entry uses the same
  native lifecycle but translates `2.5rem` from its `data-side` edge and fades the
  backdrop over `200ms`. Drawer entry translates from its `data-side` edge and
  fades the backdrop over `450ms`.
- Popovers scale from 95% and move `0.5rem` from their placement side. Menus
  and popovers fade with `visibility`.
- Tooltips fade in and scale from 95% on hover and focus; the bubble scales
  from its attachment edge and the tail scales in place, so the seam stays
  closed. The transition stops under `prefers-reduced-motion: reduce`.
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
  state through the contract above. Components that ship behavior provide it;
  consumers may replace it or install with `--no-behavior`, in which case they
  own the interaction.
- Accordion items must keep the trigger as the `<summary>`; disabled items use
  `inert`, which removes them and their content from the tab order. Exclusive
  groups use the native `name` attribute.
- Collapsible uses the same native `<details>`/`<summary>` contract. It does
  not impose exclusivity; consumers can add the native `name` attribute.
- Input groups need an accessible name on the group and on the inner control.
  Place addons after the control in the DOM so the control keeps its tab order;
  `data-align` positions them visually. Custom controls opt in with
  `data-slot="input-group-control"`. Addons are presentation; clicking an addon
  to focus the control is consumer JavaScript.
- Select triggers need `aria-haspopup="listbox"`, `aria-expanded` and
  `aria-controls`; the option list is a `[role="listbox"]`. The shipped
  `select` behavior owns keyboard navigation, selection, the trigger value,
  `data-placeholder`, initial sync, the scroll controls and the optional
  `[data-slot="input"]` hidden input. Option `data-value` is the submitted
  value; the visible `[data-slot="text"]` label is the fallback. The behavior
  updates a plain-text `[data-slot="value"]`; a value slot with element
  children stays consumer-rendered from the `change` event.
- Combobox inputs need a label, role `combobox`, `aria-expanded`,
  `aria-controls` and `aria-autocomplete="list"`. Multiple lists also set
  `aria-multiselectable="true"`. The shipped behavior filters client-side,
  moves the highlight and selects; selected chips stay app-rendered.
- Commands are popover surfaces with a labelled search field and a
  `[role="listbox"]`; place them inside a labelled dialog when a modal palette
  is needed. The input uses `role="combobox"`, `aria-controls`,
  `aria-expanded="true"` and `aria-autocomplete="list"`. The shipped behavior
  fuzzy-filters and ranks options, moves the highlight without looping, supports
  group navigation and activates the focused option; closing the containing
  dialog stays app-owned. Disabled options remain visible when they match but
  are skipped by navigation.
- Listbox options need an accessible name. The shipped behavior manages
  `aria-activedescendant`, `aria-selected`, `data-highlighted` and
  `aria-disabled="true"`; consumers driving the primitive directly own them.
- Calendar uses a native `<table role="grid">` with column headers and
  `gridcell` day cells. The grid needs an accessible name; day buttons need
  full-date labels; week numbers use row headers. The shipped behavior renders
  the month, moves focus with arrow/Home/End/PageUp/PageDown, selects with
  Enter/Space and manages `aria-selected`, `aria-current="date"` and
  `aria-disabled`. Calendars with custom day content opt out and stay CSS-only.
- Carousel slides need an accessible label and `aria-roledescription="slide"`;
  the viewport is focusable so keyboard users can scroll. Controls and
  indicators need labels; indicators use `aria-current`. The shipped behavior
  moves between slides, updates indicators and marks fully offscreen slides
  `aria-hidden` and `inert`.
- Charts need a text alternative on the SVG or canvas and a visible legend.
  Tooltips are supplementary and must not be the only source of the values.
- Resizable handles are focusable separators with a label and live
  `aria-valuenow`/`aria-valuemin`/`aria-valuemax`. The shipped behavior handles
  pointer drag, arrow keys at 5 percent, Home/End and `change` with every direct
  panel size. A nested corner drag moves both axes and is pointer-only. Handles
  focus on press and release focus after a drag; their pointer target is at
  least `0.625rem` on fine pointers and `1.25rem` on coarse pointers.
- Sidebar navigation needs a `nav` label and `aria-current="page"` on the active
  link. Label each group with a heading or `[data-slot="group-label"]`; give
  icon-only group and row actions an accessible name. The mobile composition
  uses a labelled sheet or dialog; active navigation stays app-owned and the
  shipped dialog behavior opens the sheet with `data-open-dialog`.
- Alerts do not add live-region behavior. Use `role="alert"` when the message
  appears after load; mark decorative icons `aria-hidden` and give an action in
  the footer an accessible name.
- The `.toaster` is a labelled `ol` list and each `.toast` is an `li`. The
  `[data-slot="content"]` is the live region: `role="status"` for polite updates,
  `role="alert"` for errors or manager `priority: "high"`, and
  `aria-atomic="true"`. Close buttons need labels. The shipped behavior creates
  the same list items and live regions from the template, and owns timing,
  pause/resume, stacking, swipe dismissal, the inserted-toast observer and the
  `data-open-toast` / `data-close-toast` actions. Toasts beyond
  `data-toast-limit` stay mounted but `inert` and hidden.
- Message groups should carry an accessible name; a live conversation uses
  `role="log"`. Message headers and footers are metadata, not headings.
- Attachments need a label for the media, a name for the root action and labels
  for icon-only actions. Error descriptions use `role="alert"`; busy uploads use
  `aria-busy="true"`.
- Bubble reactions are buttons with accessible labels and `aria-pressed`; do not
  rely on the emoji alone to convey the reaction.
- Questionnaire steps are fieldsets with legends. The progress element needs an
  accessible name. The shipped behavior owns previous/next, focus into the new
  step, `aria-current="step"` and the `hidden` state; validation and completion
  stay app-owned.
- Trace rows take their accessible name from the summary text. Decorative icons
  are `aria-hidden`; say what happened in the title, and repeat the status in
  words rather than relying on color. The summary is the native keyboard target.
- Message scroller viewports need `tabindex="0"` and an accessible name. The
  jump button needs a label and must be hidden when it has no effect. The
  shipped behavior follows inserted messages and toggles the button.
- OTP inputs need an accessible label, `inputmode="numeric"`,
  `autocomplete="one-time-code"`, `maxlength` and optionally `pattern`. There
  is no behavior module: the single native input is intentional, and per-digit
  focus/auto-advance is outside the contract.
- Scroll areas need `tabindex="0"` and an accessible name so keyboard users can
  scroll them.
- Sliders are native range inputs and need a label; keep min, max and value in
  markup. The native focus ring is not suppressed.
- Avatars need `alt` text on the image and an `aria-hidden` fallback; a
  decorative badge is `aria-hidden`. The consumer hides the image when loading
  fails. Avatar groups use `role="group"` with an accessible name. A count with
  a visual icon needs adjacent screen-reader text or an explicit label.
- Sheets and drawers are native `<dialog>` elements and follow the dialog
  labelling rules. Sheet and drawer triggers expose `aria-haspopup="dialog"`,
  `aria-controls` and `aria-expanded`, synchronized by the shipped behavior.
  The optional drawer handle is an `aria-hidden` pointer gesture surface for
  swipe-to-close; it is not focusable and adds no role. Keyboard users retain
  close controls and Escape. The sheet close control needs an accessible label
  when its button is icon-only, and a scrolling section without focusable
  content needs `role="region"`, an accessible name and `tabindex="0"`.
- Hover-card triggers need `aria-describedby` pointing at the panel. The panel
  is a non-modal preview; interactive content that must stay open belongs in a
  popover. The shipped hover-overlay behavior adds Escape dismissal and
  `aria-hidden`; the CSS hover/focus-within rules remain the fallback.
- Tooltips with a `[data-slot="content"]` child use `aria-describedby` pointing
  at `role="tooltip"`. The shipped hover-overlay behavior adds Escape dismissal
  and `aria-hidden`; the `data-tooltip` shorthand stays visual-only and
  CSS-only.
- Context menus must move focus into the menu, return it on close and support
  arrow-key navigation. The shipped menu behavior owns the right-click and
  Shift+F10 handlers, the `--context-x`/`--context-y` coordinates and focus.
- Menubars need one top-level trigger in the tab order, roving focus, arrow
  keys and `aria-expanded` on each submenu trigger. `ArrowLeft`/`ArrowRight`
  switch between top-level menus while one is open and skip disabled triggers.
  Submenu panels use `[role="menu"]` and its item roles, and nested panels open
  with `data-side="inline-end"`. The shipped menu behavior owns the keyboard
  and hover-switching model.
- Navigation menus need an accessible `nav` label, `aria-expanded` and
  `aria-controls` on panel triggers, and ordinary links inside panels. The
  shipped menu behavior owns open/close, ArrowDown and Escape; the mobile
  layout remains consumer work.
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
  present, `aria-describedby`. The shipped dialog behavior uses `showModal()`
  and `close()`, returns focus to the opener, traps Tab, ignores alert-dialog
  backdrop clicks and locks background scroll. A section that scrolls without
  focusable content needs `role="region"`, an accessible name and
  `tabindex="0"` so keyboard users can scroll it.
- Tabs must maintain `aria-selected`, `hidden` on inactive panels and roving
  `tabindex`; the shipped behavior switches them with automatic activation.
- Code Block must keep its content `dir="ltr"` and focusable through
  `tabindex="0"`; line numbers and diff markers are generated content and are
  excluded from selection. The shipped behavior copies the source, sets
  `data-copied` for its check state and toggles `data-wrap` + `aria-pressed`.
- Dropdown menus must maintain `aria-expanded` on the trigger,
  `aria-hidden` on the panel and roving focus; checkable items use
  `aria-checked`. The shipped menu behavior owns those transitions.
- Popovers must maintain `aria-expanded` and `aria-controls` on the trigger and
  `aria-hidden` on the panel. The panel uses `role="dialog"` and is named with
  `aria-labelledby` (and `aria-describedby` when it has a description). Make
  the panel focusable with `tabindex="-1"`. The shipped popover behavior moves
  focus into a `role="dialog"` panel, closes on Escape/outside/focus-out and
  restores focus to the trigger.
- Tooltips should use a direct `[data-slot="content"]` child with
  `role="tooltip"` and an id, referenced by `aria-describedby` on the trigger.
  The `data-tooltip` shorthand is visual-only and is not a substitute for an
  accessible name or description. A disabled trigger is pointer-only because
  disabled controls do not receive focus.
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

Components that need interaction also declare behavior files:

| Behavior kind | Source | Install target |
| --- | --- | --- |
| Entry | `behaviors/<name>.js` | `behaviors/<name>.js` |
| Support | `behaviors/core.js`, `behaviors/listbox.js` | `behaviors/<name>.js` |

The CLI writes CSS under the configured CSS directory (default
`src/styles/loseta`), behavior under the configured behavior directory (default
`behaviors`), records both in `.loseta/manifest.json`, and regenerates
`index.css` and `behaviors/index.js`. `loseta.json` holds the CSS and behavior
directories, entrypoint and style. The default style is Nova. `--no-behavior`
skips behavior files and does not update the behavior index; `--behavior`
backfills missing modules for installed items.

Experimental items are published and installable, but they ship exactly one
`styles/nova/` file and stay outside the compatibility contract.
`loseta add <name> --experimental` requires a Nova project, `loseta add all`
installs stable components only, and `loseta style` refuses to switch away
while an experimental item is installed. Promotion to stable requires all
eight style files, examples, docs, tests and an update to this baseline.

Registry dependencies are hard: installing `dialog` or `alert-dialog` also
installs `dialog-shell`; installing `sheet` or `drawer` also installs
`dialog-shell`; installing `dropdown-menu`, `context-menu` or `menubar` also
installs `menu`; installing `select` or `combobox` also installs `listbox` and
`popover-primitive`; installing `command` also installs `listbox` and
`input-group`; installing `popover`, `dropdown-menu`, `hover-card`, `menubar`
or `navigation-menu` also installs `popover-primitive`; installing
`toggle-group` also installs `toggle`; installing `sidebar` also installs
`collapsible`. Optional dependencies are composition hints only and are never
installed automatically. Notable optional pairs are field with its form
controls, button with spinner for loading states, button group with
button/input/select/popover/dropdown-menu, table with
checkbox/badge/button/dropdown-menu, dropdown-menu with button/avatar,
breadcrumb with dropdown-menu, pagination with button, sheet and drawer with
button, input group with input/textarea/button/field/kbd/spinner, combobox
with button, command with button/dialog/input, carousel and chart with card,
sidebar with sheet, toast with button, and code block with button for copy and
wrap controls.

The `menu` primitive styles every `[role="menu"]` in the project. It owns the
shared item, heading, separator, shortcut and indicator rules; `dropdown-menu`,
`context-menu` and `menubar` add their own trigger, surface and positioning
behavior. The `listbox` primitive does the same for
`[role="listbox"]` options, groups, group labels, separators and empty states.

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
- the `dialog-shell` side and bottom placement behavior;
- behavior module paths, the entry/support split, auto-init and `init(root)`;
- the `change`, `toggle` and `dismiss` event contract;
- `data-open-dialog` / `data-close-dialog` and the `[data-slot="input"]` hidden
  input on select and single combobox;
- the `.toaster` manager methods `addToast`, `updateToast`, `closeToast` and
  `promiseToast`, the `[data-slot="toast-template"]` and `data-toast-icon`
  templates;
- `data-duration` and `data-type` on toast, `data-toast-limit` and the
  `data-limited` state, `data-open-toast` / `data-close-toast`,
  transient `data-copied` on copy controls and the calendar `data-selection`,
  `data-min`, `data-max`, `data-unavailable`, `data-month` and `data-date`
  configuration;
- carousel `[data-slot="previous"]`/`[data-slot="next"]`, questionnaire
  `[data-slot="previous"]`/`[data-slot="next"]`, message-scroller
  `[data-slot="jump"]` and `mount(root)`;
- the shared `hover-overlay.js` module and `aria-hidden` on tooltip content and
  hover-card panels;
- the context-menu area's `aria-haspopup`, `aria-controls` and `tabindex`.

Additive changes (a new optional part, a new variant, a new token with a
fallback) are non-breaking. Drawer's `drawer-content` slot and its
`inline-start` / `inline-end` placement values are additive; existing
`block-start` / `block-end` markup remains valid. Sheet's optional
`sheet-content` slot, shared `close` slot and default `inline-end` placement are
additive; existing side, size, form and button markup remains valid. Visual
refinements that preserve anatomy and API are normal style work, but they must
keep contrast and focus visibility.
Experimental items are explicitly outside this contract until they are
promoted; their root classes, anatomy and state hooks may change in any
release.

Because distribution is copy-paste, installed files do not update
automatically. Consumers receive changes only by installing or re-adding
files; the registry is served as mutable content and `loseta add` is the update
path. The manifest records the registry URL, build and installed file hashes so
drift is visible. Local edits are outside the contract and should be treated as
a fork.

Until 1.0, the registry is explicitly pre-stable: breaking changes are still
possible, but every one must be called out in [`CHANGELOG.md`](CHANGELOG.md)
and reflected in this baseline. After 1.0, the compatibility contract follows
semantic versioning.

## Known gaps

- Most motion has no `prefers-reduced-motion` guard. The spinner rotation and
  the progress sweep slow down instead of stopping.
- Tooltip content children are behavior-managed, but the `data-tooltip`
  shorthand stays CSS-only and cannot be dismissed with Escape. Rich content
  remains non-interactive.
- Nova, Vega, Maia, Lyra, Mira, Luma, Sera and Rhea are the only shipped
  styles; style-specific visual regression snapshots are not part of CI.
- Toggle and toggle-group remain consumer-driven in this release.
- Combobox filtering is client-side; async search requires editing the copied
  module. Multiple combobox chips are app-rendered.
- Tabs use automatic activation only; there is no manual mode.
- Toasts hide immediately; there is no exit animation. Toast timers and message
  scrollers use the two scoped `MutationObserver`s in the behavior layer; no
  other module observes the DOM.
- There is no behavior teardown API; `init(root)` only adds roots.
- Code Block does not ship syntax highlighting, ANSI rendering, streaming or a
  Show More interaction; syntax highlighting stays in the consumer's
  highlighter and line numbers/diff/highlights require explicit line markup.
- No visual regression snapshots. CI covers axe, functional docs behavior and
  Sheet RTL geometry, but not pixel diffs or forced-colors rendering.
- Experimental items are published and installable but outside this contract.
  They ship Nova only and are not promoted until all eight style files,
  examples, docs and tests exist.
- Context menu coordinates are physical even in RTL; the behavior sets them
  from the pointer or the focused area.
- Drawer swipe starts only from the optional handle. Panel-wide swiping,
  snap points, swipe-to-open and animated nested stacking are not included.
- Menubars and navigation menus ship keyboard navigation; the mobile layout
  remains consumer work.
- Hover cards are previews. They can be dismissed with Escape, but should not
  wrap interactive content that needs to stay open; use popover for that.
- The `menu` primitive styles every `[role="menu"]` in the project.
- There is no `loseta remove` command; removing an experimental item before a
  style switch is a manual file and manifest edit.
- Accordion and collapsible animation relies on `::details-content` and
  `calc-size()`; older engines in the support window open and close instantly.
- Sliders use native tracks and thumbs. A custom thumb needs `appearance: none`
  and consumer-managed fill.
- OTP inputs use one native field; per-digit focus and auto-advance are not
  included.
- Input-group addons do not focus the control when clicked; that is consumer
  JavaScript. Place addons after the control in the DOM so the control keeps
  its tab order.
- Scroll areas use native scrollbars; there are no custom overlay thumb
  elements.
- Select ships single-select open/close, selection, highlight handling and
  scroll controls; combobox also filters. Command ships fuzzy filtering/ranking,
  non-looping highlight navigation and click activation. Server-side filtering,
  persistent command selection and app-specific side effects stay consumer
  work.
- Command owns its popover surface and can be placed directly in a dialog. Its
  group dividers are decorative, its list scrolls at `18rem` with a hidden
  scrollbar, and `aria-selected` controls the optional check indicator rather
  than the active highlight.
- Multiple combobox selections are not rendered as chips; compose them with
  badges in consumer markup.
- Calendar custom day content, presets, date-time inputs and coordination
  between separate calendars stay app-owned.
- Carousel autoplay and looping are not included.
- Chart rendering, data and tooltip positioning are consumer responsibilities;
  the registry provides chrome only.
- Resizable supports any number of panels and handles in a group,
  percentage-based minimum/maximum constraints, adjacent-only redistribution,
  double-click reset, nested groups and hidden pointer-only corner drags across
  the immediate inner and outer splits; collapse, pixel/rem sizes, persistence
  and an imperative API are not included.
- Sidebar active navigation remains app-owned; the mobile sheet uses the
  shipped dialog behavior.
- Toast timing and dismissal ship in the behavior module; `sonner` is
  documented as a compatibility note, not a registry item.
- Message rendering, reactions, attachments, trace status and questionnaire
  validation/completion are consumer JavaScript. Message scroller follows
  appended content; prepended content relies on native scroll anchoring.
- Dashboard, sidebar, login and signup are docs blocks, not registry items.
  Blocks compose existing public classes and shipped behavior; `loseta add`
  installs the listed components, while consumers own application files, data and
  authentication or navigation logic. Form, data-table, date-picker and typography
  are docs recipes, not registry items. Direction maps to the native `dir`
  attribute; Sonner maps to the toast compatibility note.
- Uncurated drafts remain in `packages/loseta/experimental/` and are not
  published.
- There is no spacing or motion token scale; spacing and durations are
  component-level values.
- Browser support is limited to the modern fidelity target above; there is no
  legacy fallback layer.
