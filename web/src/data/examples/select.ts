import type { Example } from "./types";
import { chevronDown } from "./icons";

export const selectExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="select" style="max-width: 12rem">
  <input type="hidden" data-slot="input" name="value">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-default-panel" aria-label="Fruit">
    <span data-slot="value" data-placeholder>Select a fruit</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-default-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="false">
        <span data-slot="text">Apple</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false">
        <span data-slot="text">Banana</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false">
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
      html: `<div class="select" data-size="sm" style="max-width: 12rem">
  <input type="hidden" data-slot="input" name="value">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-small-panel" aria-label="Fruit">
    <span data-slot="value">Apple</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-small-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="true">
        <span data-slot="text">Apple</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false">
        <span data-slot="text">Banana</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false">
        <span data-slot="text">Orange</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Groups",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-select-groups-trigger">Food</label>
  <div class="select" style="max-width: 12rem">
  <input type="hidden" data-slot="input" name="value">
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-groups-panel" id="demo-select-groups-trigger">
      <span data-slot="value" data-placeholder>Select a food</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-groups-panel">
      <div role="listbox" aria-label="Food">
        <div role="group" aria-labelledby="demo-select-groups-fruits">
          <div data-slot="label" id="demo-select-groups-fruits">Fruits</div>
          <div role="option" aria-selected="false">
            <span data-slot="text">Apple</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false">
            <span data-slot="text">Banana</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false">
            <span data-slot="text">Blueberry</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
        </div>
        <div role="separator" aria-hidden="true"></div>
        <div role="group" aria-labelledby="demo-select-groups-vegetables">
          <div data-slot="label" id="demo-select-groups-vegetables">Vegetables</div>
          <div role="option" aria-selected="false">
            <span data-slot="text">Carrot</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false">
            <span data-slot="text">Broccoli</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false">
            <span data-slot="text">Spinach</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-select-disabled-trigger">Fruit</label>
  <div class="select" style="max-width: 12rem">
  <input type="hidden" data-slot="input" name="value">
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-disabled-panel" id="demo-select-disabled-trigger" disabled>
      <span data-slot="value">Apple</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-disabled-panel">
      <div role="listbox" aria-label="Fruit">
        <div role="option" aria-selected="true">
          <span data-slot="text">Apple</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
        <div role="option" aria-selected="false">
          <span data-slot="text">Banana</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
        <div role="option" aria-selected="false">
          <span data-slot="text">Orange</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
      </div>
    </div>
  </div>
  <p>This field is currently disabled.</p>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-select-invalid-trigger">Fruit</label>
  <div class="select" style="max-width: 12rem">
  <input type="hidden" data-slot="input" name="value">
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-invalid-panel" aria-invalid="true" aria-describedby="demo-select-invalid-error" id="demo-select-invalid-trigger">
      <span data-slot="value" data-placeholder>Select a fruit</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-invalid-panel">
      <div role="listbox" aria-label="Fruit">
        <div role="option" aria-selected="false">
          <span data-slot="text">Apple</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
        <div role="option" aria-selected="false">
          <span data-slot="text">Banana</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
        <div role="option" aria-selected="false">
          <span data-slot="text">Orange</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
      </div>
    </div>
  </div>
  <p id="demo-select-invalid-error" role="alert">Please select a fruit.</p>
</div>`
    },
    {
      title: "Scrollable",
      html: `<div class="field" style="max-width: 16rem">
  <label class="label" for="demo-select-scrollable-trigger">Timezone</label>
  <div class="select">
  <input type="hidden" data-slot="input" name="value">
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-scrollable-panel" id="demo-select-scrollable-trigger">
      <span data-slot="value" data-placeholder>Select a timezone</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-scrollable-panel">
      <div role="listbox" aria-label="Timezone">
        <div role="group" aria-labelledby="demo-select-scrollable-north-america">
          <div data-slot="label" id="demo-select-scrollable-north-america">North America</div>
          <div role="option" aria-selected="false"><span data-slot="text">Eastern Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Central Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Mountain Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Pacific Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Alaska Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Hawaii Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
        </div>
        <div role="separator" aria-hidden="true"></div>
        <div role="group" aria-labelledby="demo-select-scrollable-europe-africa">
          <div data-slot="label" id="demo-select-scrollable-europe-africa">Europe &amp; Africa</div>
          <div role="option" aria-selected="false"><span data-slot="text">Greenwich Mean Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Central European Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Eastern European Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Central Africa Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">East Africa Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
        </div>
        <div role="separator" aria-hidden="true"></div>
        <div role="group" aria-labelledby="demo-select-scrollable-asia">
          <div data-slot="label" id="demo-select-scrollable-asia">Asia</div>
          <div role="option" aria-selected="false"><span data-slot="text">Moscow Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">India Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">China Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Japan Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Korea Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
        </div>
        <div role="separator" aria-hidden="true"></div>
        <div role="group" aria-labelledby="demo-select-scrollable-australia-pacific">
          <div data-slot="label" id="demo-select-scrollable-australia-pacific">Australia &amp; Pacific</div>
          <div role="option" aria-selected="false"><span data-slot="text">Australian Western Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Australian Central Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Australian Eastern Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">New Zealand Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Fiji Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
        </div>
        <div role="separator" aria-hidden="true"></div>
        <div role="group" aria-labelledby="demo-select-scrollable-south-america">
          <div data-slot="label" id="demo-select-scrollable-south-america">South America</div>
          <div role="option" aria-selected="false"><span data-slot="text">Argentina Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Bolivia Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Brasilia Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
          <div role="option" aria-selected="false"><span data-slot="text">Chile Standard Time</span><span data-slot="indicator" aria-hidden="true">✓</span></div>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="field" dir="rtl" lang="ar" style="max-width: 20rem">
  <label class="label" for="demo-select-rtl-trigger">الفاكهة</label>
  <div class="select" style="max-width: 12rem">
  <input type="hidden" data-slot="input" name="value">
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-rtl-panel" id="demo-select-rtl-trigger">
      <span data-slot="value" data-placeholder>اختر فاكهة</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-rtl-panel">
      <div role="listbox" aria-label="الفاكهة">
        <div role="option" aria-selected="false">
          <span data-slot="text">تفاح</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
        <div role="option" aria-selected="false">
          <span data-slot="text">موز</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
        <div role="option" aria-selected="false">
          <span data-slot="text">برتقال</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
        <div role="option" aria-selected="false">
          <span data-slot="text">عنب</span>
          <span data-slot="indicator" aria-hidden="true">✓</span>
        </div>
      </div>
    </div>
  </div>
  <p>اختر الفاكهة المفضلة لديك.</p>
</div>`
    }
];
