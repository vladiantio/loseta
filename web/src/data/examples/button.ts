import type { Example } from "./types";
import { arrowRight, branch, chevronDown, fork, plus, search } from "./icons";

export const buttonExamples: Example[] = [
    {
      title: "Default",
      html: `<button type="button" class="btn">Button</button>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn">Default</button>
  <button type="button" class="btn" data-variant="secondary">Secondary</button>
  <button type="button" class="btn" data-variant="outline">Outline</button>
  <button type="button" class="btn" data-variant="ghost">Ghost</button>
  <button type="button" class="btn" data-variant="link">Link</button>
  <button type="button" class="btn" data-variant="destructive">Destructive</button>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="btn" data-size="xs">Extra small</button>
  <button type="button" class="btn" data-size="sm">Small</button>
  <button type="button" class="btn">Default</button>
  <button type="button" class="btn" data-size="lg">Large</button>
</div>`
    },
    {
      title: "Icon buttons",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="btn" data-size="icon-xs" aria-label="Add">${plus}</button>
  <button type="button" class="btn" data-size="icon-sm" aria-label="Search">${search}</button>
  <button type="button" class="btn" data-size="icon" aria-label="Next">${arrowRight}</button>
  <button type="button" class="btn" data-size="icon-lg" aria-label="More options">${chevronDown}</button>
</div>`
    },
    {
      title: "With icons",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="btn">${branch}New branch</button>
  <button type="button" class="btn" data-variant="outline">${fork}Fork</button>
  <button type="button" class="btn" data-variant="ghost">Continue<svg data-icon="inline-end" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
</div>`
    },
    {
      title: "Rounded",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" style="border-radius: var(--radius-full)">Get started</button>
  <button type="button" class="btn" data-variant="outline" style="border-radius: var(--radius-full)">Documentation</button>
</div>`
    },
    {
      title: "Loading",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" aria-busy="true"><span class="spinner" data-icon="inline-start" aria-hidden="true"></span>Generating</button>
  <button type="button" class="btn" data-variant="outline" aria-busy="true"><span class="spinner" data-icon="inline-start" aria-hidden="true"></span>Downloading</button>
</div>`
    },
    {
      title: "Disabled and invalid",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" disabled>Disabled</button>
  <button type="button" class="btn" data-variant="outline" disabled>Disabled</button>
  <button type="button" class="btn" aria-invalid="true">Invalid</button>
</div>`
    },
    {
      title: "As link",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <a class="btn" href="#">Login</a>
  <a class="btn" data-variant="outline" href="#">Read the docs</a>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn">${branch}New branch</button>
  <button type="button" class="btn" data-variant="outline">${fork}Fork</button>
</div>`
    }
];
