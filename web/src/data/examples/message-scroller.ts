import type { Example } from "./types";
import { arrowDown } from "./icons";

export const messageScrollerExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="message-scroller" style="height: 22rem">
  <div class="message-scroller-viewport" tabindex="0" role="log" aria-label="Conversation">
    <div data-slot="content">
      <div class="marker" data-variant="separator">
        <span data-slot="content">Today</span>
      </div>
      <div class="message" data-align="start">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">CN</span></span></div>
        <div data-slot="content">
          <div data-slot="header">shadcn</div>
          <div class="bubble" data-variant="muted"><div data-slot="content">I checked the registry build.</div></div>
        </div>
      </div>
      <div class="message" data-align="end">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">YO</span></span></div>
        <div data-slot="content">
          <div class="bubble"><div data-slot="content">Did the docs bundle pick up the new files?</div></div>
        </div>
      </div>
      <div class="message" data-align="start">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">CN</span></span></div>
        <div data-slot="content">
          <div class="bubble" data-variant="muted"><div data-slot="content">Yes. The main stylesheet includes the base and Nova files.</div></div>
        </div>
      </div>
      <div class="message" data-align="end">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">YO</span></span></div>
        <div data-slot="content">
          <div class="bubble"><div data-slot="content">Great. Run the registry validator before the browser suite.</div></div>
        </div>
      </div>
      <div class="message" data-align="start">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">CN</span></span></div>
        <div data-slot="content">
          <div class="bubble" data-variant="muted"><div data-slot="content">Both are green. The chat components are ready for review.</div></div>
        </div>
      </div>
      <div class="message" data-align="end">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">YO</span></span></div>
        <div data-slot="content">
          <div class="bubble"><div data-slot="content">Then this scroller needs enough history to prove the jump button.</div></div>
        </div>
      </div>
      <div class="message" data-align="start">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">CN</span></span></div>
        <div data-slot="content">
          <div class="bubble" data-variant="muted"><div data-slot="content">Scroll up and the jump button appears; it returns you here.</div></div>
        </div>
      </div>
    </div>
  </div>
  <button type="button" data-slot="jump" aria-label="Jump to latest">${arrowDown}</button>
</div>`
    }
];
