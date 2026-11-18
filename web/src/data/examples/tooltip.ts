import type { Example } from "./types";
import { save } from "./icons";

export const tooltipExamples: Example[] = [
    {
      title: "Default",
      html: `<button type="button" class="btn tooltip" data-variant="outline" data-tooltip="Add to library" data-arrow aria-describedby="demo-tooltip-default-description">
  Hover
</button>
<span class="sr-only" id="demo-tooltip-default-description">Add to library</span>`
    },
    {
      title: "Sides",
      html: `<div style="display: grid; grid-template-areas: '. top .' 'left . right' '. bottom .'; grid-template-columns: repeat(3, max-content); align-items: center; justify-items: center; gap: 1rem; padding-block: 2rem">
  <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" style="grid-area: top" data-tooltip="Top side" data-side="top" data-arrow id="demo-tooltip-side-top">
    Top
  </button>
  <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" style="grid-area: right" data-tooltip="Right side" data-side="right" data-arrow id="demo-tooltip-side-right">
    Right
  </button>
  <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" style="grid-area: bottom" data-tooltip="Bottom side" data-side="bottom" data-arrow id="demo-tooltip-side-bottom">
    Bottom
  </button>
  <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" style="grid-area: left" data-tooltip="Left side" data-side="left" data-arrow id="demo-tooltip-side-left">
    Left
  </button>
</div>`
    },
    {
      title: "Alignments",
      html: `<div style="display: grid; gap: 2rem; justify-items: center; padding-block: 3.5rem 2.5rem">
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem">
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="Align start" data-side="top" data-align="start" data-arrow id="demo-tooltip-align-top-start">
      Start
    </button>
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="Align center" data-side="top" data-align="center" data-arrow id="demo-tooltip-align-top-center">
      Center
    </button>
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="Align end" data-side="top" data-align="end" data-arrow id="demo-tooltip-align-top-end">
      End
    </button>
  </div>
  <div style="display: grid; gap: 0.75rem; justify-items: center">
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="Align start" data-side="left" data-align="start" data-arrow id="demo-tooltip-align-left-start">
      Start
    </button>
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="Align center" data-side="left" data-align="center" data-arrow id="demo-tooltip-align-left-center">
      Center
    </button>
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="Align end" data-side="left" data-align="end" data-arrow id="demo-tooltip-align-left-end">
      End
    </button>
  </div>
</div>`
    },
    {
      title: "Arrow",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.75rem; padding-block: 2rem">
  <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="Add to library" data-arrow id="demo-tooltip-with-arrow">
    With arrow
  </button>
  <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="Add to library" id="demo-tooltip-without-arrow">
    Without arrow
  </button>
</div>`
    },
    {
      title: "Keyboard shortcut",
      html: `<div style="display: flex; align-items: center; justify-content: center; padding-block: 2rem">
  <button type="button" class="btn tooltip" data-variant="outline" data-size="icon" data-tooltip="Save changes (S)" data-arrow aria-label="Save changes" aria-keyshortcuts="S" id="demo-tooltip-keyboard">
    ${save}
  </button>
</div>`
    },
    {
      title: "Disabled button",
      html: `<div style="display: flex; align-items: center; justify-content: center; padding-block: 2rem">
  <span class="tooltip" data-tooltip="This feature is currently unavailable" data-arrow style="display: inline-block">
    <button type="button" class="btn" data-variant="outline" disabled aria-describedby="demo-tooltip-disabled-description">
      Disabled
    </button>
    <span class="sr-only" id="demo-tooltip-disabled-description">This feature is currently unavailable</span>
  </span>
</div>`
    },
    {
      title: "Long content",
      html: `<div style="display: flex; align-items: center; justify-content: center; padding-block: 3rem">
  <button type="button" class="btn tooltip" data-variant="outline" data-tooltip="Tooltips wrap onto multiple lines once the text is longer than the 20rem maximum width." data-arrow id="demo-tooltip-long-content">
    Long content
  </button>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: grid; gap: 2rem; justify-items: center; padding-block: 2.5rem">
  <div style="display: flex; justify-content: center; gap: 0.75rem">
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="إضافة" data-side="inline-start" data-arrow id="demo-tooltip-rtl-inline-start">
      بداية السطر
    </button>
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="إضافة" data-side="inline-end" data-arrow id="demo-tooltip-rtl-inline-end">
      نهاية السطر
    </button>
  </div>
  <div style="display: flex; justify-content: center; gap: 0.75rem">
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="إضافة" data-side="right" data-arrow id="demo-tooltip-rtl-right">
      يمين
    </button>
    <button type="button" class="btn tooltip" data-variant="outline" data-size="sm" data-tooltip="إضافة" data-side="left" data-arrow id="demo-tooltip-rtl-left">
      يسار
    </button>
  </div>
</div>`
    }
];
