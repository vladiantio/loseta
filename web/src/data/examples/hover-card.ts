import type { Example } from "./types";

export const hoverCardExamples: Example[] = [
    {
      title: "Default",
      html: `<div style="display: flex; align-items: center; justify-content: center; min-height: 14rem">
  <span class="hover-card">
    <a href="#" aria-describedby="hover-card-profile">@loseta</a>
    <div data-popover data-side="bottom" data-align="start" id="hover-card-profile">
      <div>
        <h3>loseta</h3>
        <p>Native CSS component scaffolds with the shadcn feel.</p>
      </div>
      <p>Joined November 2026</p>
    </div>
  </span>
</div>`
    }
];
