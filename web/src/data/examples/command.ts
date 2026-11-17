import type { Example } from "./types";
import { search } from "./icons";

export const commandExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="command" data-demo="command">
  <div class="input-group" role="group" aria-label="Search commands">
    <input class="input" type="text" placeholder="Type a command..." aria-label="Search commands" data-demo-command-input>
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
  </div>
  <div role="listbox" aria-label="Commands">
    <div role="option" data-demo-option>
      <span data-slot="text">Go home</span>
      <span data-slot="shortcut">⌘H</span>
    </div>
    <div role="option" data-demo-option>
      <span data-slot="text">Open settings</span>
      <span data-slot="shortcut">⌘,</span>
    </div>
    <div role="option" data-demo-option>
      <span data-slot="text">Copy link</span>
    </div>
    <div data-slot="empty" hidden>No commands found.</div>
  </div>
</div>`
    },
    {
      title: "Dialog",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-command">
  Open command
</button>

<dialog class="dialog" id="demo-command" aria-labelledby="command-title" aria-describedby="command-description">
  <div>
    <header>
      <h2 data-slot="title" id="command-title">Command palette</h2>
      <p data-slot="description" id="command-description">Search for a command to run.</p>
    </header>
    <section>
      <div class="command" data-demo="command">
        <div class="input-group" role="group" aria-label="Search commands">
          <input class="input" type="text" placeholder="Type a command..." aria-label="Search commands" data-demo-command-input autofocus>
          <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
        </div>
        <div role="listbox" aria-label="Commands">
          <div role="group" aria-labelledby="command-group-navigation">
            <div data-slot="label" id="command-group-navigation">Navigation</div>
            <div role="option" data-demo-option>
              <span data-slot="text">Go home</span>
              <span data-slot="shortcut">⌘H</span>
            </div>
            <div role="option" data-demo-option>
              <span data-slot="text">Open settings</span>
              <span data-slot="shortcut">⌘,</span>
            </div>
          </div>
          <div role="group" aria-labelledby="command-group-actions">
            <div data-slot="label" id="command-group-actions">Actions</div>
            <div role="option" data-demo-option>
              <span data-slot="text">Copy link</span>
            </div>
            <div role="option" data-demo-option>
              <span data-slot="text">Download</span>
            </div>
          </div>
          <div data-slot="empty" hidden>No commands found.</div>
        </div>
      </div>
    </section>
  </div>
</dialog>`
    }
];
