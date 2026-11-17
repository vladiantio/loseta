import type { Example } from "./types";
import { globe, info } from "./icons";

export const markerExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="marker">
  <span data-slot="icon">${info}</span>
  <span data-slot="content">Assistant is thinking…</span>
</div>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem">
  <div class="marker">
    <span data-slot="icon">${info}</span>
    <span data-slot="content">Assistant is thinking…</span>
  </div>
  <div class="marker" data-variant="separator">
    <span data-slot="content">Today</span>
  </div>
  <div class="marker" data-variant="border">
    <span data-slot="icon">${globe}</span>
    <span data-slot="content">Searched 3 sources · <a href="#">View sources</a></span>
  </div>
</div>`
    }
];
