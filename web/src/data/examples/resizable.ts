import type { Example } from "./types";

const group = "height: 12.5rem; max-width: 24rem";
const content =
  "display: grid; place-items: center; block-size: 100%; padding: 1.5rem";

export const resizableExamples: Example[] = [
  {
    title: "Default",
    html: `<div class="resizable" style="${group}">
  <div class="resizable-panel" id="demo-resizable-default-one">
    <div style="${content}">
      <strong>One</strong>
    </div>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="Resize One and the nested panels" aria-controls="demo-resizable-default-one" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0">
    <span data-slot="grip" aria-hidden="true"></span>
  </div>
  <div class="resizable-panel">
    <div class="resizable" data-orientation="vertical" style="height: 100%">
      <div class="resizable-panel" id="demo-resizable-default-two" style="--panel-size: 25">
        <div style="${content}">
          <strong>Two</strong>
        </div>
      </div>
      <div data-slot="handle" role="separator" aria-orientation="horizontal" aria-label="Resize Two and Three" aria-controls="demo-resizable-default-two" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" tabindex="0">
        <span data-slot="grip" aria-hidden="true"></span>
      </div>
      <div class="resizable-panel" id="demo-resizable-default-three" style="--panel-size: 75">
        <div style="${content}">
          <strong>Three</strong>
        </div>
      </div>
    </div>
  </div>
</div>`
  },
  {
    title: "Vertical",
    html: `<div class="resizable" data-orientation="vertical" style="${group}">
  <div class="resizable-panel" id="demo-resizable-vertical-header" style="--panel-size: 25">
    <div style="${content}">
      <strong>Header</strong>
    </div>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="horizontal" aria-label="Resize Header and Content" aria-controls="demo-resizable-vertical-header" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
  <div class="resizable-panel" id="demo-resizable-vertical-content" style="--panel-size: 75">
    <div style="${content}">
      <strong>Content</strong>
    </div>
  </div>
</div>`
  },
  {
    title: "Handle",
    html: `<div class="resizable" style="${group}">
  <div class="resizable-panel" id="demo-resizable-handle-sidebar" style="--panel-size: 25">
    <div style="${content}">
      <strong>Sidebar</strong>
    </div>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="Resize Sidebar and Content" aria-controls="demo-resizable-handle-sidebar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" tabindex="0">
    <span data-slot="grip" aria-hidden="true"></span>
  </div>
  <div class="resizable-panel" id="demo-resizable-handle-content" style="--panel-size: 75">
    <div style="${content}">
      <strong>Content</strong>
    </div>
  </div>
</div>`
  },
  {
    title: "Three panels",
    html: `<div class="resizable" style="${group}">
  <div class="resizable-panel" id="demo-resizable-three-one" style="--panel-size: 20">
    <div style="${content}">
      <strong>One</strong>
    </div>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="Resize One and Two" aria-controls="demo-resizable-three-one" aria-valuenow="20" aria-valuemin="0" aria-valuemax="50" tabindex="0">
    <span data-slot="grip" aria-hidden="true"></span>
  </div>
  <div class="resizable-panel" id="demo-resizable-three-two" style="--panel-size: 30">
    <div style="${content}">
      <strong>Two</strong>
    </div>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="Resize Two and Three" aria-controls="demo-resizable-three-two" aria-valuenow="30" aria-valuemin="0" aria-valuemax="80" tabindex="0">
    <span data-slot="grip" aria-hidden="true"></span>
  </div>
  <div class="resizable-panel" id="demo-resizable-three-three" style="--panel-size: 50">
    <div style="${content}">
      <strong>Three</strong>
    </div>
  </div>
</div>`
  },
  {
    title: "Constraints",
    html: `<div class="resizable" style="${group}">
  <div class="resizable-panel" id="demo-resizable-constraints-sidebar" style="--panel-size: 30; --panel-min: 20; --panel-max: 80">
    <div style="${content}">
      <strong>Sidebar</strong>
    </div>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="Resize Sidebar and Content" aria-controls="demo-resizable-constraints-sidebar" aria-valuenow="30" aria-valuemin="20" aria-valuemax="80" tabindex="0">
    <span data-slot="grip" aria-hidden="true"></span>
  </div>
  <div class="resizable-panel" id="demo-resizable-constraints-content" style="--panel-size: 70">
    <div style="${content}">
      <strong>Content</strong>
    </div>
  </div>
</div>`
  },
  {
    title: "Corner",
    html: `<div class="resizable" data-orientation="vertical" style="${group}">
  <div class="resizable-panel" id="demo-resizable-corner-top">
    <div style="${content}">
      <strong>Top</strong>
    </div>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="horizontal" aria-label="Resize Top and Bottom" aria-controls="demo-resizable-corner-top" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
  <div class="resizable-panel">
    <div class="resizable" style="height: 100%">
      <div class="resizable-panel" id="demo-resizable-corner-left" style="--panel-size: 50">
        <div style="${content}">
          <strong>Left</strong>
        </div>
      </div>
      <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="Resize Left and Right" aria-controls="demo-resizable-corner-left" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0">
        <span data-slot="grip" aria-hidden="true"></span>
      </div>
      <div class="resizable-panel" id="demo-resizable-corner-right" style="--panel-size: 50">
        <div style="${content}">
          <strong>Right</strong>
        </div>
      </div>
    </div>
  </div>
</div>`
  },
  {
    title: "Right-to-left",
    html: `<div dir="rtl" lang="ar">
  <div class="resizable" style="${group}">
    <div class="resizable-panel" id="demo-resizable-rtl-one">
      <div style="${content}">
        <strong>واحد</strong>
      </div>
    </div>
    <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="تغيير حجم واحد واللوحات المتداخلة" aria-controls="demo-resizable-rtl-one" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0">
      <span data-slot="grip" aria-hidden="true"></span>
    </div>
    <div class="resizable-panel">
      <div class="resizable" data-orientation="vertical" style="height: 100%">
        <div class="resizable-panel" id="demo-resizable-rtl-two" style="--panel-size: 25">
          <div style="${content}">
            <strong>اثنان</strong>
          </div>
        </div>
        <div data-slot="handle" role="separator" aria-orientation="horizontal" aria-label="تغيير حجم اثنان وثلاثة" aria-controls="demo-resizable-rtl-two" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" tabindex="0">
          <span data-slot="grip" aria-hidden="true"></span>
        </div>
        <div class="resizable-panel" id="demo-resizable-rtl-three" style="--panel-size: 75">
          <div style="${content}">
            <strong>ثلاثة</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
  }
];
