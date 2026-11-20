# loseta docs

Astro site for the loseta component docs and playground. The site imports the
registry CSS directly from `packages/loseta/registry`, so the examples and the
published files never drift.

## Commands

```bash
pnpm dev          # start Astro
pnpm build        # regenerate docs CSS + static build
pnpm preview      # preview the build
pnpm check        # astro check
pnpm test:e2e     # build + Playwright + axe
```

From the repo root, use `pnpm web:dev` or `pnpm web:build`.

## Open Graph images

`pnpm build` renders one 1200×630 PNG per built page into `dist/og/` (and
`dist/og.png` for the home page) with Takumi and the local Inter variable font,
including the site's `ss02` feature.
The integration reads `og:title` and the meta description from each built
document, so `Layout.astro` stays the source of truth; it fails the build when a
page is missing metadata or an image.

Static route copy lives in `src/data/page-meta.json`; component copy comes from
the registry. Preview one card without a full build:

```bash
pnpm og:preview /docs/components/button
```

Images are written to `.og-preview/` and are never committed.

## Client behavior

`src/scripts/docs-client/` owns browser-side docs behavior: stored preferences,
navigation chrome, the table of contents and demo interactions. Layouts and
components stay markup-only; the layout imports the client entry once, and a
small inline boot applies the stored color scheme before first paint.

Demo interactions are docs-only. They must never become a registry dependency.

The generated `web/src/styles/loseta.css` is committed. Run `pnpm docs:css`
after adding or removing a registry item.
