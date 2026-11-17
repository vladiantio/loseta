import type { Example } from "./types";
import { circleAlert, fileText, ratioImage } from "./icons";

export const attachmentExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="attachment">
  <div data-slot="media">${fileText}</div>
  <div data-slot="content">
    <span data-slot="title">report.pdf</span>
    <span data-slot="description">PDF · 2.4 MB</span>
  </div>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Remove report.pdf">×</button>
  </div>
</div>`
    },
    {
      title: "States",
      html: `<div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem">
  <div class="attachment">
    <div data-slot="media">${fileText}</div>
    <div data-slot="content">
      <span data-slot="title">report.pdf</span>
      <span data-slot="description">PDF · 2.4 MB</span>
    </div>
    <div data-slot="actions">
      <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Remove report.pdf">×</button>
    </div>
  </div>
  <div class="attachment" aria-busy="true">
    <div data-slot="media"><span class="spinner" data-size="sm"></span></div>
    <div data-slot="content">
      <span data-slot="title">sales-dashboard.csv</span>
      <span data-slot="description">Uploading · 64%</span>
    </div>
  </div>
  <div class="attachment">
    <div data-slot="media">${circleAlert}</div>
    <div data-slot="content">
      <span data-slot="title">workspace.zip</span>
      <span data-slot="description" role="alert">Upload failed. The file is larger than 10 MB.</span>
    </div>
  </div>
</div>`
    },
    {
      title: "Media",
      html: `<div class="attachment" data-orientation="vertical">
  <div data-slot="media">
    <img src="${ratioImage}" alt="Workspace preview">
  </div>
  <div data-slot="content">
    <span data-slot="title">cover.png</span>
    <span data-slot="description">PNG · 840 KB</span>
  </div>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="secondary" data-size="icon-xs" aria-label="Remove cover.png">×</button>
  </div>
</div>`
    }
];
