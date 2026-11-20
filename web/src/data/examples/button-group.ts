import type { Example } from "./types";
import { arrowRight, bot, chevronDown, minus, plus, search } from "./icons";

export const buttonGroupExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="btn-group" role="group" aria-label="History">
  <button type="button" class="btn" data-variant="outline">Undo</button>
  <button type="button" class="btn" data-variant="outline">Redo</button>
</div>`
    },
    {
      title: "Orientation",
      html: `<div style="display: flex; align-items: flex-start; gap: 1rem">
  <div class="btn-group" role="group" aria-label="Zoom">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Zoom out">${minus}</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Zoom in">${plus}</button>
  </div>
  <div class="btn-group" role="group" aria-label="Volume" data-orientation="vertical">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Volume up">${plus}</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Volume down">${minus}</button>
  </div>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem">
  <div class="btn-group" role="group" aria-label="Small actions">
    <button type="button" class="btn" data-variant="outline" data-size="sm">Small</button>
    <button type="button" class="btn" data-variant="outline" data-size="sm">Button</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon-sm" aria-label="Add">${plus}</button>
  </div>
  <div class="btn-group" role="group" aria-label="Default actions">
    <button type="button" class="btn" data-variant="outline">Default</button>
    <button type="button" class="btn" data-variant="outline">Button</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Add">${plus}</button>
  </div>
  <div class="btn-group" role="group" aria-label="Large actions">
    <button type="button" class="btn" data-variant="outline" data-size="lg">Large</button>
    <button type="button" class="btn" data-variant="outline" data-size="lg">Button</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon-lg" aria-label="Add">${plus}</button>
  </div>
</div>`
    },
    {
      title: "Text",
      html: `<div class="btn-group" role="group" aria-label="Project URL">
  <label class="label" for="demo-button-group-url">https://</label>
  <input class="input" id="demo-button-group-url" type="text" placeholder="example.com">
  <button type="button" class="btn" data-variant="outline">Copy</button>
</div>`
    },
    {
      title: "Separator",
      html: `<div class="btn-group" role="group" aria-label="Clipboard">
  <button type="button" class="btn" data-variant="secondary">Copy</button>
  <hr role="separator" aria-orientation="vertical">
  <button type="button" class="btn" data-variant="secondary">Paste</button>
</div>`
    },
    {
      title: "Split",
      html: `<div class="btn-group" role="group" aria-label="New project">
  <button type="button" class="btn" data-variant="secondary">New project</button>
  <hr role="separator" aria-orientation="vertical">
  <button type="button" class="btn" data-variant="secondary" data-size="icon" aria-label="New project options">${chevronDown}</button>
</div>`
    },
    {
      title: "Input",
      html: `<div class="btn-group" role="group" aria-label="Search">
  <input class="input" type="search" placeholder="Search components..." aria-label="Search components">
  <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Search">${search}</button>
</div>`
    },
    {
      title: "Dropdown menu",
      html: `<div class="btn-group" role="group" aria-label="Conversation actions">
  <button type="button" class="btn" data-variant="outline">Follow</button>
  <div class="dropdown-menu" data-demo="dropdown">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-haspopup="menu" aria-expanded="false" aria-label="More conversation actions">${chevronDown}</button>
    <div data-popover data-side="bottom" data-align="end" aria-hidden="true" style="width: 11rem">
      <div role="menu">
        <button type="button" role="menuitem">Mute conversation</button>
        <button type="button" role="menuitem">Mark as read</button>
        <button type="button" role="menuitem">Report conversation</button>
        <div role="separator"></div>
        <button type="button" role="menuitem" data-variant="destructive">Delete conversation</button>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Popover",
      html: `<div class="btn-group" role="group" aria-label="Copilot">
  <button type="button" class="btn" data-variant="outline">${bot}Copilot</button>
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-button-group-task-panel" aria-label="Start a new task">${chevronDown}</button>
    <div data-popover data-side="bottom" data-align="end" id="demo-button-group-task-panel" role="dialog" tabindex="-1" aria-hidden="true" aria-labelledby="demo-button-group-task-title">
      <header>
        <h3 data-slot="title" id="demo-button-group-task-title">Start a new task</h3>
        <p data-slot="description">Describe your task in natural language.</p>
      </header>
      <div class="field">
        <label class="label" for="demo-button-group-task">Task</label>
        <textarea class="textarea" id="demo-button-group-task" placeholder="I need to..."></textarea>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Select",
      html: `<div class="btn-group" role="group" aria-label="Send amount">
  <div class="btn-group" role="group" aria-label="Amount">
    <div class="select" data-demo="select">
      <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-button-group-currency" aria-label="Currency">
        <span data-slot="value">$</span>
        ${chevronDown}
      </button>
      <div data-popover data-side="bottom" aria-hidden="true" id="demo-button-group-currency">
        <div role="listbox" aria-label="Currency">
          <div role="option" aria-selected="true" aria-label="US Dollar">
            <span data-slot="text">$</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false" aria-label="Euro">
            <span data-slot="text">€</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false" aria-label="British Pound">
            <span data-slot="text">£</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
        </div>
      </div>
    </div>
    <input class="input" type="text" inputmode="decimal" placeholder="10.00" aria-label="Amount">
  </div>
  <div class="btn-group" role="group" aria-label="Send">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Send">${arrowRight}</button>
  </div>
</div>`
    },
    {
      title: "Nested",
      html: `<div class="btn-group" role="group" aria-label="Message composer">
  <div class="btn-group" role="group" aria-label="Attachments">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Add attachment">${plus}</button>
  </div>
  <div class="btn-group" role="group" aria-label="Message">
    <input class="input" type="text" placeholder="Send a message..." aria-label="Message">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Send message">${arrowRight}</button>
  </div>
</div>`
    }
];
