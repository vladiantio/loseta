import type { Example } from "./types";
import { check, chevronDown, chevronUp } from "./icons";

export const selectExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="select" style="max-width: 12rem">
  <input type="hidden" data-slot="input" name="value">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-default-panel" aria-label="Fruit" data-placeholder>
    <span data-slot="value">Select a fruit</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-default-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="group" aria-labelledby="demo-select-default-label">
        <div data-slot="label" id="demo-select-default-label">Fruits</div>
        <div role="option" aria-selected="false" data-value="apple">
          <span data-slot="text">Apple</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
        <div role="option" aria-selected="false" data-value="banana">
          <span data-slot="text">Banana</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
        <div role="option" aria-selected="false" data-value="blueberry">
          <span data-slot="text">Blueberry</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
        <div role="option" aria-selected="false" data-value="grapes">
          <span data-slot="text">Grapes</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
        <div role="option" aria-selected="false" data-value="pineapple">
          <span data-slot="text">Pineapple</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Small, selected",
      html: `<div class="select" data-size="sm" style="max-width: 12rem">
  <input type="hidden" data-slot="input" name="value" value="apple">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-small-panel" aria-label="Fruit">
    <span data-slot="value">Apple</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-small-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="group" aria-labelledby="demo-select-small-label">
        <div data-slot="label" id="demo-select-small-label">Fruits</div>
        <div role="option" aria-selected="true" data-value="apple">
          <span data-slot="text">Apple</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
        <div role="option" aria-selected="false" data-value="banana">
          <span data-slot="text">Banana</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
        <div role="option" aria-selected="false" data-value="orange">
          <span data-slot="text">Orange</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Below trigger",
      html: `<div class="select" data-align-trigger="false" style="max-width: 12rem">
  <input type="hidden" data-slot="input" name="value" value="apple">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-below-panel" aria-label="Fruit">
    <span data-slot="value">Apple</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-below-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="group" aria-labelledby="demo-select-below-label">
        <div data-slot="label" id="demo-select-below-label">Fruits</div>
        <div role="option" aria-selected="true" data-value="apple">
          <span data-slot="text">Apple</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
        <div role="option" aria-selected="false" data-value="banana">
          <span data-slot="text">Banana</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
        <div role="option" aria-selected="false" data-value="orange">
          <span data-slot="text">Orange</span>
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </div>
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
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-groups-panel" id="demo-select-groups-trigger" data-placeholder>
      <span data-slot="value">Select a food</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-groups-panel">
      <div role="listbox" aria-label="Food">
        <div role="group" aria-labelledby="demo-select-groups-fruits">
          <div data-slot="label" id="demo-select-groups-fruits">Fruits</div>
          <div role="option" aria-selected="false" data-value="apple">
            <span data-slot="text">Apple</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="banana">
            <span data-slot="text">Banana</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="blueberry">
            <span data-slot="text">Blueberry</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
        </div>
        <div role="separator" aria-hidden="true"></div>
        <div role="group" aria-labelledby="demo-select-groups-vegetables">
          <div data-slot="label" id="demo-select-groups-vegetables">Vegetables</div>
          <div role="option" aria-selected="false" data-value="carrot">
            <span data-slot="text">Carrot</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="broccoli">
            <span data-slot="text">Broccoli</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="spinach">
            <span data-slot="text">Spinach</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
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
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-disabled-panel" id="demo-select-disabled-trigger" data-placeholder disabled>
      <span data-slot="value">Select a fruit</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-disabled-panel">
      <div role="listbox" aria-label="Fruit">
        <div role="group" aria-labelledby="demo-select-disabled-label">
          <div data-slot="label" id="demo-select-disabled-label">Fruits</div>
          <div role="option" aria-selected="false" data-value="apple">
            <span data-slot="text">Apple</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="banana">
            <span data-slot="text">Banana</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="blueberry">
            <span data-slot="text">Blueberry</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" aria-disabled="true" data-value="grapes">
            <span data-slot="text">Grapes</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="pineapple">
            <span data-slot="text">Pineapple</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
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
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-invalid-panel" aria-invalid="true" aria-describedby="demo-select-invalid-error" id="demo-select-invalid-trigger" data-placeholder>
      <span data-slot="value">Select a fruit</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-invalid-panel">
      <div role="listbox" aria-label="Fruit">
        <div role="group" aria-labelledby="demo-select-invalid-label">
          <div data-slot="label" id="demo-select-invalid-label">Fruits</div>
          <div role="option" aria-selected="false" data-value="apple">
            <span data-slot="text">Apple</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="banana">
            <span data-slot="text">Banana</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="blueberry">
            <span data-slot="text">Blueberry</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="pineapple">
            <span data-slot="text">Pineapple</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
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
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-scrollable-panel" id="demo-select-scrollable-trigger" data-placeholder>
      <span data-slot="value">Select a timezone</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-scrollable-panel">
      <div data-slot="scroll-up" aria-hidden="true" hidden>
        ${chevronUp}
      </div>
      <div role="listbox" aria-label="Timezone">
        <div role="group" aria-labelledby="demo-select-scrollable-north-america">
          <div data-slot="label" id="demo-select-scrollable-north-america">North America</div>
          <div role="option" aria-selected="false" data-value="est"><span data-slot="text">Eastern Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="cst"><span data-slot="text">Central Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="mst"><span data-slot="text">Mountain Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="pst"><span data-slot="text">Pacific Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="akst"><span data-slot="text">Alaska Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="hst"><span data-slot="text">Hawaii Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
        </div>
        <div role="group" aria-labelledby="demo-select-scrollable-europe-africa">
          <div data-slot="label" id="demo-select-scrollable-europe-africa">Europe &amp; Africa</div>
          <div role="option" aria-selected="false" data-value="gmt"><span data-slot="text">Greenwich Mean Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="cet"><span data-slot="text">Central European Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="eet"><span data-slot="text">Eastern European Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="west"><span data-slot="text">Western European Summer Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="cat"><span data-slot="text">Central Africa Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="eat"><span data-slot="text">East Africa Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
        </div>
        <div role="group" aria-labelledby="demo-select-scrollable-asia">
          <div data-slot="label" id="demo-select-scrollable-asia">Asia</div>
          <div role="option" aria-selected="false" data-value="msk"><span data-slot="text">Moscow Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="ist"><span data-slot="text">India Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="cst-china"><span data-slot="text">China Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="jst"><span data-slot="text">Japan Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="kst"><span data-slot="text">Korea Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="ist-indonesia"><span data-slot="text">Indonesia Central Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
        </div>
        <div role="group" aria-labelledby="demo-select-scrollable-australia-pacific">
          <div data-slot="label" id="demo-select-scrollable-australia-pacific">Australia &amp; Pacific</div>
          <div role="option" aria-selected="false" data-value="awst"><span data-slot="text">Australian Western Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="acst"><span data-slot="text">Australian Central Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="aest"><span data-slot="text">Australian Eastern Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="nzst"><span data-slot="text">New Zealand Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="fjt"><span data-slot="text">Fiji Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
        </div>
        <div role="group" aria-labelledby="demo-select-scrollable-south-america">
          <div data-slot="label" id="demo-select-scrollable-south-america">South America</div>
          <div role="option" aria-selected="false" data-value="art"><span data-slot="text">Argentina Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="bot"><span data-slot="text">Bolivia Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="brt"><span data-slot="text">Brasilia Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
          <div role="option" aria-selected="false" data-value="clt"><span data-slot="text">Chile Standard Time</span><span data-slot="indicator" aria-hidden="true">${check}</span></div>
        </div>
      </div>
      <div data-slot="scroll-down" aria-hidden="true" hidden>
        ${chevronDown}
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
  <input type="hidden" data-slot="input" name="value" value="apple">
    <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-select-rtl-panel" id="demo-select-rtl-trigger">
      <span data-slot="value">تفاح</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" id="demo-select-rtl-panel">
      <div role="listbox" aria-label="الفاكهة">
        <div role="group" aria-labelledby="demo-select-rtl-fruits">
          <div data-slot="label" id="demo-select-rtl-fruits">الفواكه</div>
          <div role="option" aria-selected="true" data-value="apple">
            <span data-slot="text">تفاح</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="banana">
            <span data-slot="text">موز</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="blueberry">
            <span data-slot="text">توت أزرق</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="grapes">
            <span data-slot="text">عنب</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="pineapple">
            <span data-slot="text">أناناس</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
        </div>
        <div role="separator" aria-hidden="true"></div>
        <div role="group" aria-labelledby="demo-select-rtl-vegetables">
          <div data-slot="label" id="demo-select-rtl-vegetables">الخضروات</div>
          <div role="option" aria-selected="false" data-value="carrot">
            <span data-slot="text">جزر</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="broccoli">
            <span data-slot="text">بروكلي</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
          <div role="option" aria-selected="false" data-value="spinach">
            <span data-slot="text">سبانخ</span>
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <p>اختر الفاكهة المفضلة لديك.</p>
</div>`
    }
];
