import type { Example } from "./types";
import { shield } from "./icons";

export const itemExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="item" style="max-width: 24rem">
  <figure>${shield}</figure>
  <section>
    <h3>Security</h3>
    <p>Manage your account security settings.</p>
  </section>
  <aside>
    <button class="btn" data-size="sm" data-variant="outline">Manage</button>
  </aside>
</div>`
    },
    {
      title: "Item group",
      html: `<div class="item-group">
  <div class="item" data-variant="outline">
    <figure>${shield}</figure>
    <section>
      <h3>Security</h3>
      <p>Manage your account security settings.</p>
    </section>
    <aside>
      <button class="btn" data-size="sm" data-variant="outline">Manage</button>
    </aside>
  </div>
  <hr>
  <div class="item" data-variant="muted">
    <section>
      <h3>Notifications</h3>
      <p>Choose what you want to be notified about.</p>
    </section>
  </div>
</div>`
    }
];
