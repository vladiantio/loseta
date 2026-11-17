import type { Example } from "./types";
import { chevronDown } from "./icons";

export const accordionExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="accordion">
  <details open>
    <summary>
      Is it accessible?
      ${chevronDown}
    </summary>
    <div>
      <p>Yes. It uses native details and summary elements.</p>
    </div>
  </details>
  <details>
    <summary>
      Can I style it?
      ${chevronDown}
    </summary>
    <div>
      <p>Yes. The base file owns the anatomy and the Nova style owns the surface.</p>
    </div>
  </details>
</div>`
    },
    {
      title: "Exclusive",
      html: `<div class="accordion">
  <details name="demo-accordion" open>
    <summary>
      Shipping
      ${chevronDown}
    </summary>
    <div>
      <p>Orders placed before 14:00 ship the same day.</p>
    </div>
  </details>
  <details name="demo-accordion">
    <summary>
      Returns
      ${chevronDown}
    </summary>
    <div>
      <p>Returns are accepted within 30 days of delivery.</p>
    </div>
  </details>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="accordion">
  <details inert>
    <summary>
      Archived section
      ${chevronDown}
    </summary>
    <div>
      <p>This section cannot be opened.</p>
    </div>
  </details>
</div>`
    }
];
