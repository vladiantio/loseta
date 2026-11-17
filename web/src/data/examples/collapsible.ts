import type { Example } from "./types";
import { chevronDown } from "./icons";

export const collapsibleExamples: Example[] = [
    {
      title: "Default",
      html: `<details class="collapsible">
  <summary>
    Show details
    ${chevronDown}
  </summary>
  <div>
    <p>This content is revealed with the native details element.</p>
  </div>
</details>`
    },
    {
      title: "Open",
      html: `<details class="collapsible" open>
  <summary>
    Shipping information
    ${chevronDown}
  </summary>
  <div>
    <p>Orders placed before 14:00 ship the same day.</p>
    <p>Tracking details arrive by email.</p>
  </div>
</details>`
    }
];
