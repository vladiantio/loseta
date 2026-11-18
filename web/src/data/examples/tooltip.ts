import type { Example } from "./types";
import { copy, save } from "./icons";

export const tooltipExamples: Example[] = [
    {
      title: "Default",
      html: `<span class="tooltip" id="demo-tooltip-default">
  <button type="button" class="btn" data-variant="outline" aria-describedby="demo-tooltip-default-description">
    Hover
  </button>
  <span data-slot="content" role="tooltip" id="demo-tooltip-default-description">Add to library</span>
</span>`
    },
    {
      title: "Sides",
      html: `<div style="display: grid; grid-template-areas: '. top .' 'left . right' '. bottom .'; grid-template-columns: repeat(3, max-content); align-items: center; justify-items: center; gap: 1rem; padding-block: 2rem">
  <span class="tooltip" data-tooltip="Top side" data-side="top" style="grid-area: top" id="demo-tooltip-side-top">
    <button type="button" class="btn" data-variant="outline" data-size="sm">Top</button>
  </span>
  <span class="tooltip" data-tooltip="Right side" data-side="right" style="grid-area: right" id="demo-tooltip-side-right">
    <button type="button" class="btn" data-variant="outline" data-size="sm">Right</button>
  </span>
  <span class="tooltip" data-tooltip="Bottom side" data-side="bottom" style="grid-area: bottom" id="demo-tooltip-side-bottom">
    <button type="button" class="btn" data-variant="outline" data-size="sm">Bottom</button>
  </span>
  <span class="tooltip" data-tooltip="Left side" data-side="left" style="grid-area: left" id="demo-tooltip-side-left">
    <button type="button" class="btn" data-variant="outline" data-size="sm">Left</button>
  </span>
</div>`
    },
    {
      title: "Alignments",
      html: `<div style="display: grid; gap: 2rem; justify-items: center; padding-block: 3.5rem 2.5rem">
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem">
    <span class="tooltip" data-tooltip="Align start" data-side="top" data-align="start" id="demo-tooltip-align-top-start">
      <button type="button" class="btn" data-variant="outline" data-size="sm">Start</button>
    </span>
    <span class="tooltip" data-tooltip="Align center" data-side="top" data-align="center" id="demo-tooltip-align-top-center">
      <button type="button" class="btn" data-variant="outline" data-size="sm">Center</button>
    </span>
    <span class="tooltip" data-tooltip="Align end" data-side="top" data-align="end" id="demo-tooltip-align-top-end">
      <button type="button" class="btn" data-variant="outline" data-size="sm">End</button>
    </span>
  </div>
  <div style="display: grid; gap: 0.75rem; justify-items: center">
    <span class="tooltip" data-tooltip="Align start" data-side="left" data-align="start" id="demo-tooltip-align-left-start">
      <button type="button" class="btn" data-variant="outline" data-size="sm">Start</button>
    </span>
    <span class="tooltip" data-tooltip="Align center" data-side="left" data-align="center" id="demo-tooltip-align-left-center">
      <button type="button" class="btn" data-variant="outline" data-size="sm">Center</button>
    </span>
    <span class="tooltip" data-tooltip="Align end" data-side="left" data-align="end" id="demo-tooltip-align-left-end">
      <button type="button" class="btn" data-variant="outline" data-size="sm">End</button>
    </span>
  </div>
</div>`
    },
    {
      title: "Keyboard shortcut",
      html: `<span class="tooltip" id="demo-tooltip-keyboard">
  <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Save changes" aria-keyshortcuts="S" aria-describedby="demo-tooltip-keyboard-description">
    ${save}
  </button>
  <span data-slot="content" role="tooltip" id="demo-tooltip-keyboard-description">
    Save changes <span class="kbd">S</span>
  </span>
</span>`
    },
    {
      title: "Disabled button",
      html: `<span class="tooltip" id="demo-tooltip-disabled">
  <button type="button" class="btn" data-variant="outline" disabled aria-describedby="demo-tooltip-disabled-description">
    Disabled
  </button>
  <span data-slot="content" role="tooltip" id="demo-tooltip-disabled-description">This feature is currently unavailable</span>
</span>`
    },
    {
      title: "Long content",
      html: `<span class="tooltip" id="demo-tooltip-long-content">
  <button type="button" class="btn" data-variant="outline" aria-describedby="demo-tooltip-long-content-description">
    Long content
  </button>
  <span data-slot="content" role="tooltip" id="demo-tooltip-long-content-description">Tooltips wrap onto multiple lines once the text is longer than the 20rem maximum width.</span>
</span>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: grid; gap: 2rem; justify-items: center; padding-block: 2.5rem">
  <div style="display: flex; justify-content: center; gap: 0.75rem">
    <span class="tooltip" data-side="inline-start" id="demo-tooltip-rtl-inline-start">
      <button type="button" class="btn" data-variant="outline" data-size="sm" aria-describedby="demo-tooltip-rtl-inline-start-description">بداية السطر</button>
      <span data-slot="content" role="tooltip" id="demo-tooltip-rtl-inline-start-description">إضافة</span>
    </span>
    <span class="tooltip" data-side="inline-end" id="demo-tooltip-rtl-inline-end">
      <button type="button" class="btn" data-variant="outline" data-size="sm" aria-describedby="demo-tooltip-rtl-inline-end-description">نهاية السطر</button>
      <span data-slot="content" role="tooltip" id="demo-tooltip-rtl-inline-end-description">إضافة</span>
    </span>
  </div>
  <div style="display: flex; justify-content: center; gap: 0.75rem">
    <span class="tooltip" data-side="right" id="demo-tooltip-rtl-right">
      <button type="button" class="btn" data-variant="outline" data-size="sm" aria-describedby="demo-tooltip-rtl-right-description">يمين</button>
      <span data-slot="content" role="tooltip" id="demo-tooltip-rtl-right-description">إضافة</span>
    </span>
    <span class="tooltip" data-side="left" id="demo-tooltip-rtl-left">
      <button type="button" class="btn" data-variant="outline" data-size="sm" aria-describedby="demo-tooltip-rtl-left-description">يسار</button>
      <span data-slot="content" role="tooltip" id="demo-tooltip-rtl-left-description">إضافة</span>
    </span>
  </div>
</div>`
    },
    {
      title: "Text shorthand",
      html: `<span class="tooltip" data-tooltip="Copy link (C)" id="demo-tooltip-shorthand">
  <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Copy link" aria-keyshortcuts="C">
    ${copy}
  </button>
</span>`
    }
];
