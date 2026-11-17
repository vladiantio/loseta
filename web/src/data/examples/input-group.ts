import type { Example } from "./types";
import { arrowRight, circleAlert, copy, globe, search } from "./icons";

export const inputGroupExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="input-group" role="group" aria-label="Search">
  <input class="input" type="search" placeholder="Search components..." aria-label="Search components">
  <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
</div>`
    },
    {
      title: "Inline addons",
      html: `<div class="input-group" role="group" aria-label="Email">
  <input class="input" id="demo-input-group-email" type="email" placeholder="you@example.com" aria-label="Email">
  <span data-slot="addon" data-align="inline-start" aria-hidden="true">@</span>
  <span data-slot="addon" data-align="inline-end">
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Copy email">${copy}</button>
  </span>
</div>`
    },
    {
      title: "Block addons",
      html: `<div style="width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="Username">
    <input class="input" id="demo-input-group-username" value="loseta" aria-label="Username">
    <span data-slot="addon" data-align="block-start">Username</span>
    <span data-slot="addon" data-align="block-end">6/20 characters</span>
  </div>
</div>`
    },
    {
      title: "Textarea",
      html: `<div style="width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="Message">
    <textarea class="textarea" id="demo-input-group-message" placeholder="Type your message here." aria-label="Message"></textarea>
    <span data-slot="addon" data-align="block-start">Message</span>
    <span data-slot="addon" data-align="block-end">
      <span>0/280 characters</span>
      <button type="button" class="btn" data-size="icon-xs" aria-label="Send message" style="margin-inline-start: auto">${arrowRight}</button>
    </span>
  </div>
</div>`
    },
    {
      title: "Buttons",
      html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="Search">
    <input class="input" type="search" placeholder="Search..." aria-label="Search">
    <span data-slot="addon" data-align="inline-start">
      <button type="button" class="btn" data-variant="secondary" data-size="xs">Search</button>
    </span>
  </div>
  <div class="input-group" role="group" aria-label="Email">
    <input class="input" id="demo-input-group-subscribe" type="email" placeholder="you@example.com" aria-label="Email">
    <span data-slot="addon" data-align="inline-end">
      <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Copy email">${copy}</button>
      <button type="button" class="btn" data-variant="secondary" data-size="xs">Subscribe</button>
    </span>
  </div>
</div>`
    },
    {
      title: "Keyboard shortcut",
      html: `<div class="input-group" role="group" aria-label="Search documentation">
  <input class="input" id="demo-input-group-docs" type="search" placeholder="Search documentation..." aria-label="Search documentation">
  <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
  <span data-slot="addon" data-align="inline-end">12 results</span>
  <span data-slot="addon" data-align="inline-end"><span class="kbd">⌘K</span></span>
</div>`
    },
    {
      title: "Loading",
      html: `<div class="input-group" role="group" aria-label="Workspace name">
  <input class="input" id="demo-input-group-loading" value="acme" aria-label="Workspace name">
  <span data-slot="addon" data-align="inline-start" aria-hidden="true">${globe}</span>
  <span data-slot="addon" data-align="inline-end" role="status">
    <span class="spinner" data-size="sm" aria-hidden="true"></span>
    Saving...
  </span>
</div>`
    },
    {
      title: "States",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 28rem">
  <div class="field">
    <label class="label" for="demo-input-group-disabled">Email</label>
    <div class="input-group" role="group" aria-label="Email">
      <input class="input" id="demo-input-group-disabled" type="email" value="ada@example.com" disabled>
      <span data-slot="addon" data-align="inline-start" aria-hidden="true">@</span>
    </div>
    <p>This field is currently disabled.</p>
  </div>
  <div class="field">
    <label class="label" for="demo-input-group-invalid">Username</label>
    <div class="input-group" role="group" aria-label="Username">
      <input class="input" id="demo-input-group-invalid" value="invalid name" aria-invalid="true" aria-describedby="demo-input-group-invalid-error">
      <span data-slot="addon" data-align="inline-end" aria-hidden="true">${circleAlert}</span>
    </div>
    <p id="demo-input-group-invalid-error" role="alert">Username may only contain letters and numbers.</p>
  </div>
</div>`
    },
    {
      title: "Custom control",
      html: `<div style="width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="Message">
    <div role="textbox" contenteditable="true" aria-label="Message" aria-multiline="true" data-slot="input-group-control" spellcheck="false">Build me a landing page for a CSS registry.</div>
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">${globe}</span>
    <span data-slot="addon" data-align="inline-end">
      <button type="button" class="btn" data-size="icon-xs" aria-label="Send message">${arrowRight}</button>
    </span>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="البحث في المكوّنات">
    <input class="input" type="search" placeholder="ابحث في المكوّنات..." aria-label="ابحث في المكوّنات">
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
    <span data-slot="addon" data-align="inline-end">١٢ نتيجة</span>
  </div>
</div>`
    }
];
