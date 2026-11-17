import type { Example } from "./types";
import { chevronDown } from "./icons";

export const selectExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="select" data-demo="select">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="select-fruit-panel" aria-label="Fruit" data-demo-select-trigger>
    <span data-slot="value" data-placeholder>Select a fruit</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="select-fruit-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Apple</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Banana</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Orange</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-disabled="true">
        <span data-slot="text">Pineapple</span>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Small, selected",
      html: `<div class="select" data-size="sm" data-demo="select">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="select-fruit-small-panel" aria-label="Fruit" data-demo-select-trigger>
    <span data-slot="value">Apple</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="select-fruit-small-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="true" data-demo-option>
        <span data-slot="text">Apple</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Banana</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Orange</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
    </div>
  </div>
</div>`
    }
];
