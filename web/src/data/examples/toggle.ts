import type { Example } from "./types";
import { bold, bookmark, italic, underline } from "./icons";

export const toggleExamples: Example[] = [
    {
      title: "Default",
      html: `<button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bold</button>`
    },
    {
      title: "Outline",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" data-variant="outline" aria-pressed="true" data-demo-toggle>${italic}Italic</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="false" data-demo-toggle>${bold}Bold</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="false" data-demo-toggle>${underline}Underline</button>
</div>`
    },
    {
      title: "With text",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>${bookmark}Bookmark</button>
  <button type="button" class="toggle" data-variant="outline" data-size="sm" aria-pressed="true" data-demo-toggle>${bookmark}Saved</button>
</div>`
    },
    {
      title: "Icon only",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" data-size="sm" aria-pressed="false" aria-label="Toggle bold" data-demo-toggle>${bold}</button>
  <button type="button" class="toggle" aria-pressed="true" aria-label="Toggle italic" data-demo-toggle>${italic}</button>
  <button type="button" class="toggle" data-variant="outline" data-size="lg" aria-pressed="false" aria-label="Toggle underline" data-demo-toggle>${underline}</button>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="toggle" data-variant="outline" data-size="sm" aria-pressed="false" data-demo-toggle>Small</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="false" data-demo-toggle>Default</button>
  <button type="button" class="toggle" data-variant="outline" data-size="lg" aria-pressed="false" data-demo-toggle>Large</button>
</div>`
    },
    {
      title: "Disabled",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" aria-pressed="false" disabled>Disabled</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="true" disabled>Disabled</button>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" data-variant="outline" data-size="sm" aria-pressed="false" data-demo-toggle>${bookmark}إشارة مرجعية</button>
</div>`
    }
];
