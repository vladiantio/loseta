import type { Example } from "./types";
import { search } from "./icons";

export const kbdExamples: Example[] = [
    {
      title: "Default",
      html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem">
  <span class="kbd-group">
    <kbd class="kbd">⌘</kbd>
    <kbd class="kbd">⇧</kbd>
    <kbd class="kbd">⌥</kbd>
    <kbd class="kbd">⌃</kbd>
  </span>
  <span class="kbd-group">
    <kbd class="kbd">Ctrl</kbd>
    <span aria-hidden="true">+</span>
    <kbd class="kbd">B</kbd>
  </span>
</div>`
    },
    {
      title: "Shortcut hint",
      html: `<div style="display: flex; align-items: center; gap: 0.5rem">
  <span class="kbd-group">
    <kbd class="kbd">⌘</kbd>
    <kbd class="kbd">K</kbd>
  </span>
  <span>Open command menu</span>
</div>`
    },
    {
      title: "Group",
      html: `<p style="margin: 0; text-align: center">
  Use
  <span class="kbd-group">
    <kbd class="kbd">Ctrl</kbd>
    <kbd class="kbd">B</kbd>
  </span>
  or
  <span class="kbd-group">
    <kbd class="kbd">Ctrl</kbd>
    <kbd class="kbd">K</kbd>
  </span>
  to open the command palette
</p>`
    },
    {
      title: "In a button",
      html: `<button type="button" class="btn" data-variant="outline" aria-keyshortcuts="Enter">
  Accept
  <kbd class="kbd" data-icon="inline-end" aria-hidden="true">⏎</kbd>
</button>`
    },
    {
      title: "In a tooltip",
      html: `<span class="tooltip" id="demo-kbd-tooltip">
  <button type="button" class="btn" data-variant="outline" aria-keyshortcuts="S" aria-describedby="demo-kbd-tooltip-description">
    Save
  </button>
  <span data-slot="content" role="tooltip" id="demo-kbd-tooltip-description">Save changes <kbd class="kbd">S</kbd></span>
</span>`
    },
    {
      title: "In an input group",
      html: `<div style="width: 100%; max-width: 22rem">
  <div class="input-group" role="group" aria-label="Search">
    <input class="input" id="demo-kbd-search" type="search" placeholder="Search documentation..." aria-label="Search documentation">
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
    <span data-slot="addon" data-align="inline-end">
      <span class="kbd-group">
        <kbd class="kbd">⌘</kbd>
        <kbd class="kbd">K</kbd>
      </span>
    </span>
  </div>
</div>`
    },
    {
      title: "In a menu",
      html: `<div class="dropdown-menu" data-demo="dropdown" style="width: 14rem">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Open menu
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <button type="button" role="menuitem">Command palette <span class="kbd-group"><kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></span></button>
      <button type="button" role="menuitem">Save <kbd class="kbd">S</kbd></button>
    </div>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem">
  <span class="kbd-group">
    <kbd class="kbd">⌘</kbd>
    <kbd class="kbd">⇧</kbd>
    <kbd class="kbd">⌥</kbd>
    <kbd class="kbd">⌃</kbd>
  </span>
  <span class="kbd-group">
    <kbd class="kbd">Ctrl</kbd>
    <span aria-hidden="true">+</span>
    <kbd class="kbd">B</kbd>
  </span>
</div>`
    }
];
