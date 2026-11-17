import type { Example } from "./types";
import { volumeHigh, volumeLow } from "./icons";

export const sliderExamples: Example[] = [
    {
      title: "Default",
      html: `<input class="slider" type="range" min="0" max="100" value="60" aria-label="Volume">`
    },
    {
      title: "With label and value",
      html: `<div class="field" style="max-width: 24rem">
  <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
    <label class="label" for="demo-slider-temperature">Temperature</label>
    <output for="demo-slider-temperature" style="color: var(--muted-foreground); font-variant-numeric: tabular-nums">21°C</output>
  </div>
  <input class="slider" type="range" id="demo-slider-temperature" min="0" max="40" value="21">
  <p>Set the target temperature for this room.</p>
</div>`
    },
    {
      title: "Step interval",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-slider-step">Opacity</label>
  <input class="slider" type="range" id="demo-slider-step" min="0" max="100" step="10" value="40">
  <p>Changes in increments of 10.</p>
</div>`
    },
    {
      title: "With icons",
      html: `<div style="display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.75rem; inline-size: 100%; max-width: 24rem; color: var(--muted-foreground)">
  ${volumeLow}
  <input class="slider" type="range" min="0" max="100" value="60" aria-label="Volume">
  ${volumeHigh}
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: grid; gap: 0.75rem; inline-size: 100%; max-width: 24rem">
  <div class="field">
    <label class="label" for="demo-slider-sm">Small</label>
    <input class="slider" data-size="sm" type="range" id="demo-slider-sm" min="0" max="100" value="30">
  </div>
  <div class="field">
    <label class="label" for="demo-slider-default">Default</label>
    <input class="slider" type="range" id="demo-slider-default" min="0" max="100" value="60">
  </div>
  <div class="field">
    <label class="label" for="demo-slider-lg">Large</label>
    <input class="slider" data-size="lg" type="range" id="demo-slider-lg" min="0" max="100" value="70">
  </div>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-slider-disabled">Volume</label>
  <input class="slider" type="range" id="demo-slider-disabled" min="0" max="100" value="50" disabled>
  <p>Disabled sliders keep their value but cannot be changed.</p>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="field" dir="rtl" lang="ar" style="max-width: 24rem">
  <label class="label" for="demo-slider-rtl">مستوى الصوت</label>
  <input class="slider" type="range" id="demo-slider-rtl" min="0" max="100" value="60">
  <p>يمتلئ المسار من اليمين إلى اليسار.</p>
</div>`
    }
];
