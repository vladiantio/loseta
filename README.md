# loseta

Native CSS component scaffolds with the shadcn feel.

loseta is a registry of component CSS, markup contracts and optional behavior
modules. The CLI copies readable, layered CSS and small ESM behavior files into
your project, so you own the code and can edit anything. No Tailwind, no
runtime, no framework lock-in.

## Quick start

Requires Node 22+.

```bash
npx loseta init
npx loseta add button card field
```

`init` creates the foundation files (tokens, reset, base, utilities) and a
generated `index.css`. `add` downloads the structural CSS, the selected style
file, any primitive dependency and the component's behavior modules from the
registry at `https://loseta.vladiantio.com/r`.

```bash
npx loseta init --style vega  # choose a style (default: nova)
npx loseta style vega         # switch an installed project
npx loseta add all            # every stable component
npx loseta add button --no-behavior # CSS only
npx loseta add dialog --behavior    # backfill behavior later
npx loseta list               # available components
npx loseta list --experimental # experimental items, when present
npx loseta list --all         # include experimental, primitives and foundation
npx loseta add button --html  # print the example markup
npx loseta add https://example.com/r/styles/nova/button.json
npx loseta add button --registry https://mirror.example.com/r
```

Registry content is mutable and fetched at install time. Responses are cached
under the XDG cache directory; `--no-cache` bypasses the cache and a cold
install needs network access. `--registry`, `LOSETA_REGISTRY` and the
`registry` field in `loseta.json` point the CLI at a mirror, in that order.

Components that ship behavior print the generated index snippet after an add.
Load it once per page:

```html
<script type="module" src="/behaviors/index.js"></script>
```

## What you get

- **Native CSS**: nesting, `@layer`, `:has()`, `color-mix()`, logical
  properties, `@starting-style` and `field-sizing`.
- **Copy-paste ownership**: the CLI writes plain CSS and ESM files into your
  project.
- **Tokens and styles**: shadcn-compatible CSS variables, system-driven
  light/dark with `.dark` / `.light` overrides, and eight visual styles: Vega,
  Nova, Maia, Lyra, Mira, Luma, Sera and Rhea.
- **CSS-first, behavior optional**: structural and style CSS never depend on
  JavaScript. Components that need interaction ship a readable ESM module with
  the same copy-paste ownership; `--no-behavior` keeps the CSS-only install.
  The docs run the shipped modules directly.

The v1 registry includes 62 stable components: accordion, alert, alert-dialog,
aspect-ratio, attachment, avatar, badge, breadcrumb, bubble, button,
button-group, calendar, card, carousel, chart, checkbox, code-block,
collapsible, combobox, command, context-menu, dialog, drawer, dropdown-menu,
empty, field, hover-card, input, input-group, input-otp, item, kbd, label,
marker, menubar, message, message-scroller, native-select, navigation-menu,
pagination, popover, progress, questionnaire, radio, resizable, scroll-area,
select, separator, sheet, sidebar, skeleton, slider, spinner, switch, table,
tabs, textarea, toast, toggle, toggle-group, tooltip and trace.

No experimental components ship in this release. The experimental pipeline,
CLI flag and Nova-only rule remain for future items.

## Behavior

Twenty-two stable components ship a behavior module: the original fifteen
(dialog, alert-dialog, sheet, drawer, popover, dropdown-menu, context-menu,
menubar, navigation-menu, tabs, select, combobox, command, toast and code-block)
plus calendar, carousel, resizable, questionnaire, message-scroller, tooltip
and hover-card. Tooltip and hover-card share `hover-overlay.js`. The modules are
plain ESM with JSDoc types, no dependencies and no build step; they
self-initialize on import and expose `init(root)` for scoped mounts. Selection
widgets, calendar, carousel, resizable, questionnaire and message-scroller
dispatch `change`; overlays dispatch `toggle`; toasts dispatch `dismiss`.
Markup stays the source of truth at rest; behavior only toggles ARIA state,
focus and the transient `data-highlighted` / `data-copied` attributes.

Calendar reads `data-selection`, `data-min`, `data-max`, `data-unavailable`,
`data-month` and `data-date`. Carousel has no autoplay or loop; resizable
handles any number of adjacent panel pairs with percentage constraints;
questionnaire leaves validation and completion app-owned; message-scroller uses
one scoped `MutationObserver` on the message content. Four components are
CSS-only by design: input-otp (one native field), slider (native range),
scroll-area (native overflow) and sidebar (`aria-current` plus the dialog
behavior for mobile).

Static content and the page's own navigation stay readable without JavaScript.
Overlay panels and selection widgets are behavior-dependent and documented as
such. See the docs Behavior page for the event contract, flags and limits.

## Repository

```
packages/loseta/    CLI, authored registry, wire schemas and examples
web/                Astro docs site, remote registry output and playground
```

See [`packages/loseta/README.md`](packages/loseta/README.md) for the CLI and
registry details.

## Project documents

- [`GLOSSARY.md`](GLOSSARY.md) defines the project vocabulary.
- [`DESIGN.md`](DESIGN.md) records the durable design baseline: tokens, component
  API, state contract, accessibility floor and change policy.
- [`RELEASING.md`](RELEASING.md) documents the npm and GitHub release process.

## Development

```bash
pnpm install
pnpm cli:build        # compile the TypeScript CLI
pnpm registry:check   # validate the authored registry and parse every CSS file
pnpm registry:remote  # generate and validate web/public/r + schema
pnpm web:dev          # docs site at http://localhost:4321
pnpm web:build        # static docs build
pnpm test             # CLI, registry, remote install smoke + Astro check
```

The docs site imports the registry CSS directly, so the examples and the
shipped files cannot drift. Playwright and axe cover every docs page in light
and dark mode:

```bash
pnpm --filter web exec playwright test
```

## License

MIT. See [LICENSE](LICENSE) and [NOTICE](NOTICE) for attribution to shadcn/ui
and Tailwind CSS.
