import type { Example } from "./types";

export const switchExamples: Example[] = [
    {
      title: "Default",
      html: `<label class="label" for="demo-switch">
  <input class="switch" type="checkbox" role="switch" id="demo-switch" checked>
  Airplane mode
</label>`
    },
    {
      title: "With description",
      html: `<div class="field" data-orientation="horizontal" style="max-width: 24rem">
  <input class="switch" type="checkbox" role="switch" id="demo-switch-description" checked>
  <section>
    <label class="label" for="demo-switch-description">Share across devices</label>
    <p>Focus is shared across devices, and turns off when you leave the app.</p>
  </section>
</div>`
    },
    {
      title: "Choice card",
      html: `<label class="label" for="demo-switch-focus" style="max-width: 24rem">
  <div class="field" data-orientation="horizontal">
    <section>
      <h3>Share across devices</h3>
      <p>Focus is shared across devices, and turns off when you leave the app.</p>
    </section>
    <input class="switch" type="checkbox" role="switch" id="demo-switch-focus" checked>
  </div>
</label>`
    },
    {
      title: "Disabled",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem">
  <div class="field">
    <label class="label" for="demo-switch-disabled-unchecked">
      <input class="switch" type="checkbox" role="switch" id="demo-switch-disabled-unchecked" disabled>
      Disabled (unchecked)
    </label>
  </div>
  <div class="field">
    <label class="label" for="demo-switch-disabled-checked">
      <input class="switch" type="checkbox" role="switch" id="demo-switch-disabled-checked" checked disabled>
      Disabled (checked)
    </label>
  </div>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" data-orientation="horizontal" aria-invalid="true" style="max-width: 24rem">
  <input class="switch" type="checkbox" role="switch" id="demo-switch-invalid" aria-invalid="true">
  <section>
    <label class="label" for="demo-switch-invalid">Accept terms and conditions</label>
    <p role="alert">You must accept the terms and conditions to continue.</p>
  </section>
</div>`
    },
    {
      title: "Size",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem">
  <div class="field" data-orientation="horizontal">
    <input class="switch" type="checkbox" role="switch" id="demo-switch-sm" data-size="sm" checked>
    <label class="label" for="demo-switch-sm">Small</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="switch" type="checkbox" role="switch" id="demo-switch-default" data-size="default" checked>
    <label class="label" for="demo-switch-default">Default</label>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="max-width: 24rem">
  <div class="field" data-orientation="horizontal">
    <input class="switch" type="checkbox" role="switch" id="demo-switch-rtl" checked>
    <section>
      <label class="label" for="demo-switch-rtl">المشاركة عبر الأجهزة</label>
      <p>يتم مشاركة التركيز عبر الأجهزة، ويتوقف عند مغادرة التطبيق.</p>
    </section>
  </div>
</div>`
    }
];
