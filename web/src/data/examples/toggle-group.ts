import type { Example } from "./types";
import { bold, cards, grid, italic, list, underline } from "./icons";

export const toggleGroupExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="toggle-group" role="group" aria-label="Text formatting">
  <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Bold</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Italic</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Underline</button>
</div>`
    },
    {
      title: "Outline",
      html: `<div class="toggle-group" role="group" aria-label="Text styles" data-variant="outline">
  <button type="button" class="toggle" aria-pressed="true" aria-label="Toggle bold" data-demo-toggle>${bold}</button>
  <button type="button" class="toggle" aria-pressed="false" aria-label="Toggle italic" data-demo-toggle>${italic}</button>
  <button type="button" class="toggle" aria-pressed="false" aria-label="Toggle underline" data-demo-toggle>${underline}</button>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: grid; gap: 0.75rem; justify-items: start">
  <div class="toggle-group" role="group" aria-label="Small alignment" data-variant="outline" data-size="sm">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Top</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bottom</button>
  </div>
  <div class="toggle-group" role="group" aria-label="Default alignment" data-variant="outline">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Top</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bottom</button>
  </div>
  <div class="toggle-group" role="group" aria-label="Large alignment" data-variant="outline" data-size="lg">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Top</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bottom</button>
  </div>
</div>`
    },
    {
      title: "Spacing",
      html: `<div style="display: grid; gap: 0.75rem; justify-items: start">
  <div class="toggle-group" role="group" aria-label="Default spacing" data-variant="outline" data-spacing="default">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Bold</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Italic</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Underline</button>
  </div>
  <div class="toggle-group" role="group" aria-label="Joined spacing" data-variant="outline" data-spacing="joined">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Bold</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Italic</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Underline</button>
  </div>
</div>`
    },
    {
      title: "Vertical",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: 1rem">
  <div class="toggle-group" role="group" aria-label="Text formatting vertical" data-variant="outline" data-orientation="vertical">
    <button type="button" class="toggle" aria-pressed="true" aria-label="Toggle bold" data-demo-toggle>${bold}</button>
    <button type="button" class="toggle" aria-pressed="true" aria-label="Toggle italic" data-demo-toggle>${italic}</button>
    <button type="button" class="toggle" aria-pressed="false" aria-label="Toggle underline" data-demo-toggle>${underline}</button>
  </div>
  <div class="toggle-group" role="group" aria-label="View density" data-orientation="vertical" data-spacing="joined" data-variant="outline" data-size="sm">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Compact</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Default</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Comfortable</button>
  </div>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="toggle-group" role="group" aria-label="Disabled formatting" data-variant="outline">
  <button type="button" class="toggle" aria-pressed="false" disabled>Bold</button>
  <button type="button" class="toggle" aria-pressed="true" disabled>Italic</button>
  <button type="button" class="toggle" aria-pressed="false" disabled>Underline</button>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar">
  <div class="toggle-group" role="group" aria-label="عرض المحتوى" data-variant="outline">
    <button type="button" class="toggle" aria-pressed="true" aria-label="قائمة" data-demo-toggle>${list}</button>
    <button type="button" class="toggle" aria-pressed="false" aria-label="شبكة" data-demo-toggle>${grid}</button>
    <button type="button" class="toggle" aria-pressed="false" aria-label="بطاقات" data-demo-toggle>${cards}</button>
  </div>
</div>`
    }
];
