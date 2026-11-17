import type { Example } from "./types";

export const spinnerExamples: Example[] = [
    {
      title: "Default",
      html: `<span class="spinner" role="status"><span class="sr-only">Loading</span></span>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; align-items: center; gap: 1rem">
  <span class="spinner" data-size="sm" role="status"><span class="sr-only">Loading</span></span>
  <span class="spinner" role="status"><span class="sr-only">Loading</span></span>
  <span class="spinner" data-size="lg" role="status"><span class="sr-only">Loading</span></span>
</div>`
    },
    {
      title: "With a label",
      html: `<div style="display: flex; align-items: center; gap: 0.5rem">
  <span class="spinner" data-size="sm" aria-hidden="true"></span>
  <span>Loading results…</span>
</div>`
    }
];
