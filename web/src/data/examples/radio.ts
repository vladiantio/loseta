import type { Example } from "./types";

export const radioExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="field" role="radiogroup" aria-label="Plan">
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-plan" id="demo-radio-plan-starter" value="starter" checked>
    <label class="label" for="demo-radio-plan-starter">Starter</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-plan" id="demo-radio-plan-pro" value="pro">
    <label class="label" for="demo-radio-plan-pro">Pro</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-plan" id="demo-radio-plan-enterprise" value="enterprise">
    <label class="label" for="demo-radio-plan-enterprise">Enterprise</label>
  </div>
</div>`
    },
    {
      title: "With description",
      html: `<div class="field" role="radiogroup" aria-label="Spacing">
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-spacing" id="demo-radio-spacing-default" value="default">
    <section>
      <label class="label" for="demo-radio-spacing-default">Default</label>
      <p>Standard spacing for most use cases.</p>
    </section>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-spacing" id="demo-radio-spacing-comfortable" value="comfortable" checked>
    <section>
      <label class="label" for="demo-radio-spacing-comfortable">Comfortable</label>
      <p>More space between elements.</p>
    </section>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-spacing" id="demo-radio-spacing-compact" value="compact">
    <section>
      <label class="label" for="demo-radio-spacing-compact">Compact</label>
      <p>Minimal spacing for dense layouts.</p>
    </section>
  </div>
</div>`
    },
    {
      title: "Choice card",
      html: `<div class="field" role="radiogroup" aria-label="Plan" style="max-width: 24rem">
  <label class="label" for="demo-radio-card-plus">
    <div class="field" data-orientation="horizontal">
      <section>
        <h3>Plus</h3>
        <p>For individuals and small teams.</p>
      </section>
      <input class="radio" type="radio" name="demo-radio-card-plan" id="demo-radio-card-plus" value="plus" checked>
    </div>
  </label>
  <label class="label" for="demo-radio-card-pro">
    <div class="field" data-orientation="horizontal">
      <section>
        <h3>Pro</h3>
        <p>For growing businesses.</p>
      </section>
      <input class="radio" type="radio" name="demo-radio-card-plan" id="demo-radio-card-pro" value="pro">
    </div>
  </label>
  <label class="label" for="demo-radio-card-enterprise">
    <div class="field" data-orientation="horizontal">
      <section>
        <h3>Enterprise</h3>
        <p>For large teams and enterprises.</p>
      </section>
      <input class="radio" type="radio" name="demo-radio-card-plan" id="demo-radio-card-enterprise" value="enterprise">
    </div>
  </label>
</div>`
    },
    {
      title: "Fieldset",
      html: `<fieldset class="fieldset" style="max-width: 20rem">
  <legend data-variant="label">Subscription Plan</legend>
  <p>Yearly and lifetime plans offer significant savings.</p>
  <div role="radiogroup" data-slot="radio-group" aria-label="Subscription plan">
    <div class="field" data-orientation="horizontal">
      <input class="radio" type="radio" name="demo-radio-subscription" id="demo-radio-monthly" value="monthly" checked>
      <label class="label" for="demo-radio-monthly">Monthly ($9.99/month)</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="radio" type="radio" name="demo-radio-subscription" id="demo-radio-yearly" value="yearly">
      <label class="label" for="demo-radio-yearly">Yearly ($99.99/year)</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="radio" type="radio" name="demo-radio-subscription" id="demo-radio-lifetime" value="lifetime">
      <label class="label" for="demo-radio-lifetime">Lifetime ($299.99)</label>
    </div>
  </div>
</fieldset>`
    },
    {
      title: "Disabled",
      html: `<div class="field" role="radiogroup" aria-label="Options">
  <div class="field" data-orientation="horizontal" aria-disabled="true">
    <input class="radio" type="radio" name="demo-radio-disabled" id="demo-radio-disabled-1" value="option-1" disabled>
    <label class="label" for="demo-radio-disabled-1">Disabled</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-disabled" id="demo-radio-disabled-2" value="option-2" checked>
    <label class="label" for="demo-radio-disabled-2">Option 2</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-disabled" id="demo-radio-disabled-3" value="option-3">
    <label class="label" for="demo-radio-disabled-3">Option 3</label>
  </div>
</div>`
    },
    {
      title: "Invalid",
      html: `<fieldset class="fieldset" style="max-width: 20rem">
  <legend data-variant="label">Notification Preferences</legend>
  <p>Choose how you want to receive notifications.</p>
  <div role="radiogroup" data-slot="radio-group" aria-label="Notification preferences">
    <div class="field" data-orientation="horizontal" aria-invalid="true">
      <input class="radio" type="radio" name="demo-radio-notifications" id="demo-radio-email" value="email" checked aria-invalid="true">
      <label class="label" for="demo-radio-email">Email only</label>
    </div>
    <div class="field" data-orientation="horizontal" aria-invalid="true">
      <input class="radio" type="radio" name="demo-radio-notifications" id="demo-radio-sms" value="sms" aria-invalid="true">
      <label class="label" for="demo-radio-sms">SMS only</label>
    </div>
    <div class="field" data-orientation="horizontal" aria-invalid="true">
      <input class="radio" type="radio" name="demo-radio-notifications" id="demo-radio-both" value="both" aria-invalid="true">
      <label class="label" for="demo-radio-both">Both Email &amp; SMS</label>
    </div>
  </div>
</fieldset>`
    }
];
