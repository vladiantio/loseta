# Style guide

This guide turns the eight shipped styles into repeatable decisions for base and
style files. It exists so a promoted component looks like the style it ships,
not like a recolored Nova file.

`DESIGN.md` is the public contract. This document is the implementation guide
for style files. If the two disagree, `registry.json` and the installed CSS win,
and this guide is corrected.

## Non-negotiables

- Wrap every file in its exact layer: `@layer loseta.style { ... }`.
- Use the shared tokens; do not add style-local color palettes.
- Use logical properties (`padding-inline`, `margin-block`, `inset-inline`).
- No `!important`, no Tailwind utilities, no framework classes.
- State lives in native pseudo-classes and ARIA, never in new `data-*` state.
- Keep `light-dark()` and dark color decisions in the style layer.
- Keep forced-colors outlines and `prefers-reduced-motion` guards from the base
  and Nova reference.
- Stable items ship one style file for every declared style.

## Style personality

Default / `sm` / `lg` heights are listed in rem.

| Style | Control radius | Surface radius | Heights | Type and density | Signature |
| --- | --- | --- | --- | --- | --- |
| Nova | `--radius-lg` | `--radius-xl` | `2 / 1.75 / 2.25` | `sm`, tight | Reference style |
| Vega | `--radius-md` | `--radius-xl` | `2.25 / 2 / 2.5` | `sm`, balanced | `--shadow-xs` on bordered controls and cards |
| Maia | `--radius-full` | `--radius-2xl` | `2.25 / 2 / 2.5` | `sm`, generous | Pill controls, softer surfaces |
| Lyra | `0` | `0` | `2 / 1.75 / 2.25` | `xs`, compact | Square corners, precise mono-friendly scale |
| Mira | `--radius-md` / `--radius-sm` | `--radius-lg` | `1.75 / 1.5 / 2` | `sm` / `xs`, densest | Tightest spacing and type |
| Luma | `--radius-full` | `--radius-3xl`–`--radius-4xl` | `2.25 / 2 / 2.5` | `sm`, generous | `--shadow-md`, luminous surfaces |
| Sera | `0` | `0` | `2.5 / 2.25 / 2.75` | `sm`, editorial | Uppercase headings, underline fields |
| Rhea | `--radius-2xl` | `--radius-2xl`–`min(var(--radius-4xl), 24px)` | `2 / 1.75 / 2.25` | `sm`, compact-soft | `--shadow-sm`, Luma softness with Nova density |

Notes:

- “Surface radius” is a range because cards, dialogs, menus and popovers do not
  all use the same radius in a style. Match the stable reference component.
- `sm` and `xs` controls sometimes cap the radius with `min()` in Nova and Vega.
  Copy the reference component rather than flattening the cap.
- Sera uses the largest control heights and the most padding. Do not shrink it
  to match Nova.
- Mira is the only style that consistently reduces both control height and type.

## Role recipes

Every visual declaration in a promoted item should map to one of these roles.

### Control

Use for buttons, toggle buttons, pagination links, select triggers, calendar
header arrows and calendar day cells.

- Radius: control radius from the style table.
- Height: default / `sm` / `lg` from the style table.
- Padding: Nova and Vega `0.625rem`, Maia and Luma `0.75rem`, Lyra `0.625rem`,
  Mira `0.5rem`, Sera `1.5rem` default, `1rem` `sm`, `2rem` `lg`, Rhea
  `0.625rem`. Small and large controls follow the reference's own padding.
- Type: `--text-sm`, except Lyra `--text-xs`; Mira uses `--text-sm` for default
  controls and `--text-xs` for small ones.
- Focus: 1px `--ring` border plus a 3px `--ring`-at-50% shadow.
- Pressed/active: follow the reference button, including the 1px active
  translate where the base supports it.

Calendar day cells use the control height and radius. Header arrows and caption
dropdowns use the `sm` control size.

### Field

Use for inputs, textareas, native selects, select and combobox triggers, input
groups, OTP inputs, command inputs and questionnaire inputs.

- Radius: the field radius, which is the control radius except Luma uses
  `--radius-3xl` for the input and Sera squares the field.
- Height: follow the stable input, not the button. Nova, Lyra and Rhea use
  `2rem`; Vega, Maia and Luma use `2.25rem`; Mira uses `1.75rem`; Sera uses
  `2.5rem`.
- Padding: Nova, Vega, Lyra and Rhea `0.625rem`; Maia and Luma `0.75rem`; Mira
  `0.5rem`; Sera `0` with an underline border.
- Type: Nova, Vega, Maia, Luma, Sera and Rhea use `--text-base` below `48rem` and
  `--text-sm` above it. Lyra uses `--text-xs`; Mira uses `--text-sm` then
  `--text-xs` above `48rem`.
- Sera: transparent side/top borders, `border-bottom-color: var(--input)`, no
  inline padding and the same dark background mix as `styles/sera/input.css`.
- Invalid: destructive border and a 3px destructive-at-20% shadow; dark mode may
  use a stronger mix, matching the reference.

### Surface

Use for cards, alerts, toasts, attachments, sheet and drawer panels, sidebar
surfaces, resizable panels and chart tooltips.

- Radius: match the reference surface. Cards and attachments use the card
  radius; menus and popovers use the overlay radius; dialogs, sheets and
  drawers use the dialog radius.
- Padding: copy the stable reference. Cards expose `--card-spacing` for the
  section gap and inline inset: Nova, Lyra and Mira `1rem`; Vega, Maia and Luma
  `1.5rem`; Rhea `1.25rem`; Sera `2rem`. The `sm` size uses `0.75rem` in Nova,
  Lyra and Mira, `1rem` in Vega, Maia, Luma and Rhea and `1.25rem` in Sera.
  Dialogs use Nova `1rem`; Vega, Maia, Luma, Sera and Rhea `1.5rem`. Do not
  invent one universal surface padding.
- Shadow: Nova ring only; Vega `--shadow-xs`; Luma `--shadow-md`; Sera and Rhea
  `--shadow-sm`; Maia, Lyra and Mira ring only.
- Borders: use `--border` for outlines; use the foreground-at-10% ring for cards
  where the reference card does.

### Overlay

Use for menus, listboxes, popovers, hover cards, context menus, menubars and
navigation-menu panels.

- Radius: Nova `--radius-lg`, Vega `--radius-md`, Maia `--radius-2xl`, Lyra `0`,
  Mira `--radius-lg`, Luma `--radius-3xl`, Sera `0`, Rhea `--radius-2xl`.
  These values come from the menu primitive; listbox must match it.
- Shadow: copy the menu primitive for the style. Nova, Vega, Lyra, Mira and Sera
  use `--shadow-md`; Maia uses `--shadow-2xl`; Luma and Rhea use `--shadow-lg`.
  Surface shadows are separate: cards use `--shadow-xs` in Vega, `--shadow-md`
  in Luma and `--shadow-sm` in Sera and Rhea.
- Padding: options use `0.375rem 0.5rem` in Nova and Vega, larger in Maia/Luma,
  tighter in Lyra/Mira. Copy the menu primitive for the same style.
- Selected and highlighted options: `--accent` background and
  `--accent-foreground`; selected listbox options also use font-weight 500 and
  the check indicator.

### Tooltip

Use for the tooltip bubble and its tail.

- Radius: Nova, Vega and Mira `--radius-md`; Maia `--radius-2xl`; Luma and Rhea
  `--radius-xl`; Lyra and Sera `0`. Set `--tooltip-radius` on `.tooltip` and use
  it for the bubble radius; the base derives the tail offset from the same
  value.
- Surface: `--foreground` background, `--background` text, no shadow. Type is
  `--text-xs` with `0.375rem 0.75rem` padding; the bubble wraps at `20rem`.
- Tail: keep the masked tail at the bubble surface color. Do not add a border
  radius to the tail.

### Row

Use for menu items, listbox options, sidebar links, breadcrumb and pagination
links, accordion summaries and collapsible summaries.

- Height: use the control height for interactive rows; accordion and collapsible
  summaries keep their reference block padding.
- Radius: control radius for standalone rows; 0 for rows inside a bordered
  surface unless the reference uses a radius.
- Type: `--text-sm` in most styles; Lyra `--text-xs`; Mira small rows `--text-xs`.
- Hover: `--muted` or `--accent` according to the reference; sidebar rows use
  `--sidebar-accent`.
- Focus: ring border and 3px ring-at-50% shadow, except menu items, which use the
  accent background.

### Chip

Use for badges, status pills, reaction chips and keyboard hints.

- Height: `1.25rem` for badges; status pills may use padding instead of a fixed
  height.
- Radius: Nova/Vega/Maia `--radius-4xl`, Lyra `0`, Mira `--radius-full`, Luma
  `--radius-3xl`, Sera `0`, Rhea `--radius-2xl`.
- Type: `--text-xs`; Mira and Sera use `0.625rem`. Sera is uppercase with
  `letter-spacing: 0.1em`.
- Color: follow the reference badge and the semantic surface recipe; do not
  introduce a new palette.

### Avatar

Avatar group counts reuse the avatar radius, muted surface, fallback text color
and border ring. Their type follows the fallback scale: `sm` uses `--text-xs`,
default uses `--text-sm` and `lg` uses `--text-base`; Mira and Lyra keep their
compact fallback sizes. Count icons are `0.75rem` at `sm`, `1rem` by default and
`1.25rem` at `lg`.

### Conversation

Use for `attachment`, `bubble`, `marker`, `message`, `message-scroller`,
`questionnaire` and `trace`. The batch 0.15.0 baseline:

| Style | Bubble radius | Bubble padding | Attachment radius | Questionnaire choice |
| --- | --- | --- | --- | --- |
| Nova | `--radius-xl` | `0.75rem / 0.5rem` | `--radius-xl` | `--radius-lg` |
| Vega | `--radius-xl` | `0.75rem / 0.5rem` | `--radius-xl` | `--radius-md` |
| Maia | `--radius-2xl` | `0.875rem / 0.625rem` | `--radius-2xl` | `--radius-2xl` |
| Lyra | `0` | `0.5rem / 0.375rem` | `0` | `0` |
| Mira | `--radius-lg` | `0.5rem / 0.375rem` | `--radius-lg` | `--radius-lg` |
| Luma | `--radius-4xl` | `0.875rem / 0.625rem` | `--radius-4xl` | `--radius-3xl` |
| Sera | `0` | `1rem / 0.625rem` | `0` | `0` |
| Rhea | `min(var(--radius-4xl), 24px)` | `0.75rem / 0.5rem` | `--radius-2xl` | `--radius-2xl` |

Message metadata uses `--text-xs` and `--muted-foreground`. Message rows and
bubbles use `--text-sm`. Trace status pills follow the chip recipe. Questionnaire
legends use `--text-lg`; descriptions and choices use `--text-sm`. Attachment
descriptions use `--text-xs`.

Adjust these values only with visual review. They are the shared baseline for
the batch, not a per-item guess.

## Special cases

### Sera

- Uppercase card, dialog, alert-dialog, badge and heading text with
  `letter-spacing: 0.05em`–`0.1em`.
- Inputs, textareas and native selects are underline fields: no side/top border,
  no inline padding, `border-bottom-color: var(--input)`, and the dark background
  mix from `styles/sera/input.css`.
- Larger padding and control heights. Do not use Nova density.
- Square corners everywhere; do not round a control just because it is circular
  in another style.

### Lyra

- Square corners, compact heights, `--text-xs` control type.
- Keep the menu, listbox and table rows tight.
- Do not add shadows that the Lyra reference does not use.

### Mira

- Densest style: default controls `1.75rem`, `sm` `1.5rem`, `lg` `2rem`.
- Smaller type on secondary text and small controls.
- Tight padding and gaps; keep hit areas at least the reference height.
- Do not copy Nova spacing into a Mira file.

### Maia and Luma

- Pill controls (`--radius-full`) and larger surfaces.
- Generous inline padding: Maia/Luma use `0.75rem` where Nova uses `0.625rem`.
- Luma adds `--shadow-md` and the largest surface radii. Maia keeps the ring and
  soft padding without the large shadow.

### Rhea

- Luma softness with Nova density: `--radius-2xl` controls, compact heights,
  `--shadow-sm`.
- Surfaces cap the large radius with `min(var(--radius-4xl), 24px)`.
- Keep the Nova control heights and padding; do not expand to Luma sizes.

### Vega

- Classic shadcn geometry: `--radius-md` controls, `2.25rem` default height,
  balanced padding and `--shadow-xs` on bordered controls and cards.
- Dialogs use `1.5rem` padding and a footer without the Nova muted strip. Match
  the existing Vega dialog and dialog-shell files.

## Reference map

| Item | Primary roles | Stable reference |
| --- | --- | --- |
| `accordion` | Row, disclosure | `tabs` |
| `aspect-ratio` | Media surface | `card` |
| `attachment` | Surface, conversation | `card`, `alert` |
| `avatar` | Chip, control | `badge`, `card` |
| `breadcrumb` | Row, navigation | `pagination` |
| `bubble` | Surface, conversation | `card`, `alert` |
| `calendar` | Control, row | `button`, `table` |
| `carousel` | Surface, control | `card` |
| `chart` | Surface, chip | `card` |
| `collapsible` | Row, disclosure | `accordion` |
| `combobox` | Field | `select`, `input` |
| `command` | Overlay, field | `listbox`, `menu` |
| `context-menu` | Overlay | `dropdown-menu`, `menu` |
| `drawer` | Surface, overlay | `sheet`, `dialog` |
| `hover-card` | Overlay | `popover` |
| `input-group` | Field | `input`, `button-group` |
| `input-otp` | Field | `input` |
| `listbox` | Overlay, row | `menu` |
| `marker` | Conversation, row | `badge` |
| `menubar` | Overlay, control | `dropdown-menu`, `menu` |
| `message` | Conversation, row | `card` |
| `message-scroller` | Surface, conversation | `card` |
| `navigation-menu` | Overlay | `menubar`, `popover` |
| `pagination` | Control | `button` |
| `progress` | Indicator | `skeleton` |
| `questionnaire` | Field, conversation | `field`, `card` |
| `resizable` | Surface, row | `separator` |
| `scroll-area` | Surface | `table` |
| `select` | Field, control | `native-select`, `input` |
| `separator` | Line | — |
| `sheet` | Surface, overlay | `dialog`, `drawer` |
| `sidebar` | Surface, row | `card`, `navigation-menu` |
| `slider` | Field, control | `progress`, `switch` |
| `spinner` | Indicator | — |
| `toast` | Surface | `alert`, `card` |
| `toggle` | Control | `button` |
| `toggle-group` | Control group | `button-group` |
| `trace` | Conversation, row | `accordion`, `card` |

## Promotion checklist

For every item:

- [ ] All eight style files exist and are declared in `registry.json`.
- [ ] The `loseta:promotion-scaffold` marker is gone.
- [ ] Each style file matches the role recipe and its reference component.
- [ ] Base files contain no obvious visual leakage (radius, shadow, spacing,
      typography) beyond structural state semantics.
- [ ] Logical properties are used; no new physical left/right declarations.
- [ ] Forced-colors outlines and reduced-motion guards are preserved.
- [ ] The docs page has no experimental banner and no `--experimental` install
      flag.
- [ ] Axe passes in light and dark.
- [ ] The item installs in every declared style and survives `loseta style`.
- [ ] `DESIGN.md`, `README.md` and `CHANGELOG.md` reflect the new status.
