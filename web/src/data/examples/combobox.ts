import type { Example } from "./types";

export const comboboxExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="combobox" data-demo="combobox">
  <input role="combobox" aria-expanded="false" aria-controls="combobox-default-panel" aria-autocomplete="list" placeholder="Select a framework..." aria-label="Select a framework" data-demo-combobox-input>
  <div data-popover data-side="bottom" aria-hidden="true" id="combobox-default-panel">
    <div role="listbox" aria-label="Frameworks">
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">React</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Vue</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Svelte</span></div>
      <div data-slot="empty" hidden>No framework found.</div>
    </div>
  </div>
</div>`
    },
    {
      title: "Single",
      html: `<div class="combobox" data-demo="combobox">
  <input role="combobox" aria-expanded="false" aria-controls="combobox-fruit-panel" aria-autocomplete="list" placeholder="Search fruit..." aria-label="Search fruit" data-demo-combobox-input>
  <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="clear" data-demo-clear aria-label="Clear">×</button>
  <div data-popover data-side="bottom" aria-hidden="true" id="combobox-fruit-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Apple</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Banana</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Orange</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Pineapple</span></div>
      <div data-slot="empty" hidden>No fruit found.</div>
    </div>
  </div>
</div>`
    },
    {
      title: "Multiple",
      html: `<div class="combobox" data-demo="combobox">
  <input role="combobox" aria-expanded="false" aria-controls="combobox-tag-panel" aria-autocomplete="list" placeholder="Search tags..." aria-label="Search tags" data-demo-combobox-input>
  <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="clear" data-demo-clear aria-label="Clear">×</button>
  <div data-popover data-side="bottom" aria-hidden="true" id="combobox-tag-panel">
    <div role="listbox" aria-label="Tags" aria-multiselectable="true">
      <div role="option" aria-selected="true" data-demo-option><span data-slot="text">Design</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Engineering</span></div>
      <div role="option" aria-selected="true" data-demo-option><span data-slot="text">Docs</span></div>
      <div data-slot="empty" hidden>No tags found.</div>
    </div>
  </div>
</div>`
    }
];
