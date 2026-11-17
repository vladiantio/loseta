import type { Example } from "./types";

export const messageExamples: Example[] = [
    {
      title: "Default",
      html: `<article class="message" data-align="start">
  <div data-slot="avatar">
    <span class="avatar" data-size="sm">
      <span data-slot="fallback">CN</span>
    </span>
  </div>
  <div data-slot="content">
    <div data-slot="header">shadcn</div>
    <div class="bubble" data-variant="muted">
      <div data-slot="content">How can I help you today?</div>
    </div>
    <div data-slot="footer">10:42 AM</div>
  </div>
</article>`
    },
    {
      title: "Conversation",
      html: `<div class="message-group" role="log" aria-label="Conversation">
  <article class="message" data-align="start">
    <div data-slot="avatar">
      <span class="avatar" data-size="sm">
        <span data-slot="fallback">CN</span>
      </span>
    </div>
    <div data-slot="content">
      <div data-slot="header">shadcn</div>
      <div class="bubble" data-variant="muted">
        <div data-slot="content">How can I help you today?</div>
      </div>
      <div data-slot="footer">10:42 AM</div>
    </div>
  </article>
  <article class="message" data-align="end">
    <div data-slot="avatar">
      <span class="avatar" data-size="sm">
        <span data-slot="fallback">YO</span>
      </span>
    </div>
    <div data-slot="content">
      <div data-slot="header">You</div>
      <div class="bubble">
        <div data-slot="content">Add a calendar and a date picker to the docs.</div>
      </div>
      <div data-slot="footer">Delivered</div>
    </div>
  </article>
</div>`
    }
];
