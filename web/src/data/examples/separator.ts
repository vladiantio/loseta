import type { Example } from "./types";

export const separatorExamples: Example[] = [
    {
      title: "Default",
      html: `<hr class="separator" />`
    },
    {
      title: "Horizontal",
      html: `<div style="display: grid; gap: 0.75rem">
  <p>loseta components</p>
  <hr class="separator" />
  <p>Native CSS with copy-paste distribution.</p>
</div>`
    },
    {
      title: "Vertical",
      html: `<div style="display: flex; align-items: center; gap: 1rem; height: 1.5rem">
  <span>Blog</span>
  <div class="separator" role="separator" aria-orientation="vertical" data-orientation="vertical"></div>
  <span>Docs</span>
  <div class="separator" role="separator" aria-orientation="vertical" data-orientation="vertical"></div>
  <span>Source</span>
</div>`
    }
];
