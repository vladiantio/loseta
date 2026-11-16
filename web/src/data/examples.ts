export interface Example {
  title: string;
  html: string;
}

const arrowRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const search = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
const shield = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1 1 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;
const copy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const wrap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><path d="M3 12h15a3 3 0 1 1 0 6h-4"/><polyline points="16 16 14 18 16 20"/><line x1="3" x2="10" y1="18" y2="18"/></svg>`;
const chevronDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
const chevronLeft = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`;
const chevronRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;
const moreHorizontal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;
const alignLeft = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>`;
const alignCenter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" x2="3" y1="6" y2="6"/><line x1="17" x2="7" y1="12" y2="12"/><line x1="19" x2="5" y1="18" y2="18"/></svg>`;
const alignRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/></svg>`;
const avatarImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23cbd5e1'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23475569'/%3E%3Cpath d='M10 64c0-12 10-22 22-22s22 10 22 22z' fill='%23475569'/%3E%3C/svg%3E`;
const fileText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;
const terminal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`;
const globe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
const info = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
const circleAlert = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
const arrowDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`;
const plus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
const minus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>`;
const bot = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="inline-start"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
const branch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="inline-start"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`;
const fork = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="inline-start"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>`;
const ratioImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 90'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%2394a3b8'/%3E%3Cstop offset='1' stop-color='%23e2e8f0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='160' height='90' fill='url(%23g)'/%3E%3Ctext x='80' y='49' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23334155'%3E16:9%3C/text%3E%3C/svg%3E`;

export const examples: Record<string, Example[]> = {
  alert: [
    {
      title: "Default",
      html: `<div class="alert" role="alert">
  <h3 data-slot="title">Heads up!</h3>
  <section>
    <p>You can add components to your app using the CLI.</p>
  </section>
</div>`
    },
    {
      title: "Destructive",
      html: `<div class="alert" data-variant="destructive" role="alert">
  <h3 data-slot="title">Session expired</h3>
  <section>
    <p>Please log in again to continue.</p>
  </section>
</div>`
    }
  ],
  "alert-dialog": [
    {
      title: "Default",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-alert-dialog-default">
  Open alert dialog
</button>

<dialog class="alert-dialog" id="demo-alert-dialog-default" aria-labelledby="alert-dialog-default-title" aria-describedby="alert-dialog-default-description">
  <div>
    <header>
      <h2 data-slot="title" id="alert-dialog-default-title">Are you sure?</h2>
      <p data-slot="description" id="alert-dialog-default-description">
        This action cannot be undone.
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Continue</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Delete account",
      html: `<button type="button" class="btn" data-variant="destructive" data-open-dialog="demo-alert-dialog">
  Delete account
</button>

<dialog class="alert-dialog" id="demo-alert-dialog" aria-labelledby="alert-title" aria-describedby="alert-description">
  <div>
    <header>
      <figure>${shield}</figure>
      <h2 data-slot="title" id="alert-title">Are you absolutely sure?</h2>
      <p data-slot="description" id="alert-description">
        This action cannot be undone. This will permanently delete your account and remove your data.
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-variant="destructive" data-close-dialog>Delete</button>
    </footer>
  </div>
</dialog>`
    }
  ],
  badge: [
    {
      title: "Default",
      html: `<span class="badge">Badge</span>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <span class="badge">Default</span>
  <span class="badge" data-variant="secondary">Secondary</span>
  <span class="badge" data-variant="outline">Outline</span>
  <span class="badge" data-variant="destructive">Destructive</span>
  <span class="badge" data-variant="ghost">Ghost</span>
  <span class="badge" data-variant="link">Link</span>
</div>`
    }
  ],
  button: [
    {
      title: "Default",
      html: `<button type="button" class="btn">Button</button>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn">Default</button>
  <button type="button" class="btn" data-variant="secondary">Secondary</button>
  <button type="button" class="btn" data-variant="outline">Outline</button>
  <button type="button" class="btn" data-variant="ghost">Ghost</button>
  <button type="button" class="btn" data-variant="link">Link</button>
  <button type="button" class="btn" data-variant="destructive">Destructive</button>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="btn" data-size="xs">Extra small</button>
  <button type="button" class="btn" data-size="sm">Small</button>
  <button type="button" class="btn">Default</button>
  <button type="button" class="btn" data-size="lg">Large</button>
</div>`
    },
    {
      title: "Icon buttons",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="btn" data-size="icon-xs" aria-label="Add">${plus}</button>
  <button type="button" class="btn" data-size="icon-sm" aria-label="Search">${search}</button>
  <button type="button" class="btn" data-size="icon" aria-label="Next">${arrowRight}</button>
  <button type="button" class="btn" data-size="icon-lg" aria-label="More options">${chevronDown}</button>
</div>`
    },
    {
      title: "With icons",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="btn">${branch}New branch</button>
  <button type="button" class="btn" data-variant="outline">${fork}Fork</button>
  <button type="button" class="btn" data-variant="ghost">Continue<svg data-icon="inline-end" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
</div>`
    },
    {
      title: "Rounded",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" style="border-radius: var(--radius-full)">Get started</button>
  <button type="button" class="btn" data-variant="outline" style="border-radius: var(--radius-full)">Documentation</button>
</div>`
    },
    {
      title: "Loading",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" aria-busy="true"><span class="spinner" data-icon="inline-start" aria-hidden="true"></span>Generating</button>
  <button type="button" class="btn" data-variant="outline" aria-busy="true"><span class="spinner" data-icon="inline-start" aria-hidden="true"></span>Downloading</button>
</div>`
    },
    {
      title: "Disabled and invalid",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" disabled>Disabled</button>
  <button type="button" class="btn" data-variant="outline" disabled>Disabled</button>
  <button type="button" class="btn" aria-invalid="true">Invalid</button>
</div>`
    },
    {
      title: "As link",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <a class="btn" href="#">Login</a>
  <a class="btn" data-variant="outline" href="#">Read the docs</a>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn">${branch}New branch</button>
  <button type="button" class="btn" data-variant="outline">${fork}Fork</button>
</div>`
    }
  ],
  "button-group": [
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
    <button type="button" class="btn" data-variant="outline" data-size="icon" data-demo-trigger aria-haspopup="menu" aria-expanded="false" aria-label="More conversation actions">${chevronDown}</button>
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
    <button type="button" class="btn" data-variant="outline" data-size="icon" data-demo-trigger aria-expanded="false" aria-label="Start a new task">${chevronDown}</button>
    <div data-popover data-side="bottom" data-align="end" aria-hidden="true">
      <header>
        <h3 data-slot="title">Start a new task</h3>
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
      <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-button-group-currency" aria-label="Currency" data-demo-select-trigger>
        <span data-slot="value">$</span>
        ${chevronDown}
      </button>
      <div data-popover data-side="bottom" aria-hidden="true" id="demo-button-group-currency">
        <div role="listbox" aria-label="Currency">
          <div role="option" aria-selected="true" aria-label="US Dollar" data-demo-option>
            <span data-slot="text">$</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false" aria-label="Euro" data-demo-option>
            <span data-slot="text">€</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false" aria-label="British Pound" data-demo-option>
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
  ],
  card: [
    {
      title: "Default",
      html: `<div class="card" style="max-width: 24rem">
  <header data-separator="bottom">
    <h3 data-slot="title">Create project</h3>
    <p data-slot="description">Deploy your new project in one click.</p>
    <a class="card-action" href="#">Docs</a>
  </header>
  <section>
    <div class="field">
      <label class="label" for="card-name">Name</label>
      <input class="input" id="card-name" placeholder="My project">
    </div>
  </section>
  <footer style="display: flex; justify-content: flex-end; gap: 0.5rem">
    <button class="btn" data-variant="outline">Cancel</button>
    <button class="btn">Create</button>
  </footer>
</div>`
    }
  ],
  checkbox: [
    {
      title: "Default",
      html: `<div class="field" data-orientation="horizontal">
  <input class="checkbox" type="checkbox" id="demo-checkbox" checked>
  <label class="label" for="demo-checkbox">Accept terms and conditions</label>
</div>`
    },
    {
      title: "With description",
      html: `<div class="field" data-orientation="horizontal">
  <input class="checkbox" type="checkbox" id="demo-checkbox-description" checked>
  <section>
    <label class="label" for="demo-checkbox-description">Accept terms and conditions</label>
    <p>By clicking this checkbox, you agree to the terms and conditions.</p>
  </section>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field">
  <label class="label" for="demo-checkbox-disabled">
    <input class="checkbox" type="checkbox" id="demo-checkbox-disabled" disabled>
    Enable notifications
  </label>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" data-orientation="horizontal" aria-invalid="true">
  <input class="checkbox" type="checkbox" id="demo-checkbox-invalid" aria-invalid="true">
  <section>
    <label class="label" for="demo-checkbox-invalid">Accept terms and conditions</label>
    <p role="alert">You must accept the terms and conditions to continue.</p>
  </section>
</div>`
    },
    {
      title: "Group",
      html: `<fieldset class="fieldset">
  <legend data-variant="label">Show these items on the desktop:</legend>
  <p>Select the items you want to show on the desktop.</p>
  <div role="group" data-slot="checkbox-group" aria-label="Items shown on the desktop">
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-hard-disks" name="desktop-items" value="hard-disks" checked>
      <label class="label" for="demo-checkbox-hard-disks">Hard disks</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-external-disks" name="desktop-items" value="external-disks">
      <label class="label" for="demo-checkbox-external-disks">External disks</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-cds" name="desktop-items" value="cds" checked>
      <label class="label" for="demo-checkbox-cds">CDs, DVDs, and iPods</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-servers" name="desktop-items" value="servers">
      <label class="label" for="demo-checkbox-servers">Connected servers</label>
    </div>
  </div>
</fieldset>`
    },
    {
      title: "With title",
      html: `<div class="field" style="max-width: 28rem">
  <label class="label" for="demo-checkbox-notifications">
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-notifications" checked>
      <section>
        <h3>Enable notifications</h3>
        <p>You can enable or disable notifications at any time.</p>
      </section>
    </div>
  </label>
</div>`
    },
    {
      title: "In table",
      html: `<div class="table-container">
  <table class="table">
    <caption>Team members and their roles.</caption>
    <thead>
      <tr>
        <th>
          <input class="checkbox" type="checkbox" role="checkbox" aria-label="Select all rows" data-demo-indeterminate>
        </th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr aria-selected="true">
        <td><input class="checkbox" type="checkbox" role="checkbox" aria-label="Select Sarah Chen" checked></td>
        <td>Sarah Chen</td>
        <td>sarah.chen@example.com</td>
        <td>Admin</td>
      </tr>
      <tr aria-selected="true">
        <td><input class="checkbox" type="checkbox" role="checkbox" aria-label="Select Marcus Rodriguez" checked></td>
        <td>Marcus Rodriguez</td>
        <td>marcus.rodriguez@example.com</td>
        <td>User</td>
      </tr>
      <tr>
        <td><input class="checkbox" type="checkbox" role="checkbox" aria-label="Select Priya Patel"></td>
        <td>Priya Patel</td>
        <td>priya.patel@example.com</td>
        <td>User</td>
      </tr>
      <tr>
        <td><input class="checkbox" type="checkbox" role="checkbox" aria-label="Select David Kim"></td>
        <td>David Kim</td>
        <td>david.kim@example.com</td>
        <td>Editor</td>
      </tr>
    </tbody>
  </table>
</div>`
    }
  ],
  "code-block": [
    {
      title: "Default",
      html: `<div class="code-block" style="max-width: 32rem">
  <pre dir="ltr" tabindex="0"><code>pnpm add loseta</code></pre>
</div>`
    },
    {
      title: "Header and actions",
      html: `<div class="code-block" data-demo="code-block">
  <header>
    <span data-slot="title">app/api/chat/route.ts</span>
    <div data-slot="actions">
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-demo-copy aria-label="Copy code">${copy}</button>
    </div>
  </header>
  <pre dir="ltr" tabindex="0"><code>import { streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();
  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages
  });

  return result.toUIMessageStreamResponse();
}</code></pre>
</div>`
    },
    {
      title: "Line numbers",
      html: `<div class="code-block" data-demo="code-block">
  <header>
    <span data-slot="title">app/dashboard/page.tsx</span>
  </header>
  <pre data-line-numbers style="--line-start: 12" dir="ltr" tabindex="0"><code><span data-slot="line"><span data-slot="line-content">  if (!session) {</span></span>
<span data-slot="line"><span data-slot="line-content">    redirect("/login");</span></span>
<span data-slot="line"><span data-slot="line-content">  }</span></span>
<span data-slot="line"><span data-slot="line-content"></span></span>
<span data-slot="line"><span data-slot="line-content">  const projects = await db.project.findMany({</span></span>
<span data-slot="line"><span data-slot="line-content">    where: { ownerId: session.user.id },</span></span>
<span data-slot="line"><span data-slot="line-content">    orderBy: { updatedAt: "desc" }</span></span>
<span data-slot="line"><span data-slot="line-content">  });</span></span>
<span data-slot="line"><span data-slot="line-content">  return &lt;ProjectList projects={projects} /&gt;;</span></span>
<span data-slot="line"><span data-slot="line-content">}</span></span></code></pre>
</div>`
    },
    {
      title: "Diff and highlighted lines",
      html: `<div class="code-block" data-demo="code-block">
  <header>
    <span data-slot="title">components/greeting.tsx</span>
  </header>
  <pre dir="ltr" tabindex="0"><code><span data-slot="line"><span data-slot="line-content">export function Greeting({ name }: { name: string }) {</span></span>
<span data-slot="line"><span data-slot="line-content">  return &lt;p&gt;Hello, {name}&lt;/p&gt;;</span></span>
<span data-slot="line" data-variant="removed"><span data-slot="line-content">  return &lt;p className="text-sm text-muted-foreground"&gt;Hello, {name}!&lt;/p&gt;;</span></span>
<span data-slot="line" data-variant="added"><span data-slot="line-content">  return &lt;p&gt;Hello, {name}!&lt;/p&gt;;</span></span>
<span data-slot="line" data-variant="highlighted"><span data-slot="line-content">  const message = "Hello, " + name + "!";</span></span>
<span data-slot="line"><span data-slot="line-content">}</span></span></code></pre>
</div>`
    },
    {
      title: "Small, wrapped and destructive",
      html: `<div class="code-block" data-size="sm" data-variant="destructive" data-demo="code-block">
  <header>
    <span data-slot="title">Error</span>
    <div data-slot="actions">
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-demo-wrap aria-label="Wrap lines" aria-pressed="true">${wrap}</button>
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-demo-copy aria-label="Copy output">${copy}</button>
    </div>
  </header>
  <pre data-wrap dir="ltr" tabindex="0"><code>TypeError: The model "anthropic/claude-sonnet-4.5" returned an error: Request too large. The prompt is 212,431 tokens but the context window is 200,000 tokens.</code></pre>
</div>`
    },
    {
      title: "Floating actions",
      html: `<div class="code-block" data-demo="code-block">
  <div data-slot="actions">
    <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-demo-copy aria-label="Copy output">${copy}</button>
  </div>
  <pre dir="ltr" tabindex="0"><code>$ pnpm add ai @ai-sdk/react zod
Packages: +14
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0</code></pre>
</div>`
    }
  ],
  dialog: [
    {
      title: "Default",
      html: `<button type="button" class="btn" data-open-dialog="demo-dialog-default">Open dialog</button>

<dialog class="dialog" id="demo-dialog-default" aria-labelledby="dialog-default-title" aria-describedby="dialog-default-description">
  <div>
    <header>
      <h2 data-slot="title" id="dialog-default-title">Dialog title</h2>
      <p data-slot="description" id="dialog-default-description">
        This is the dialog content. Add actions or a form to finish the flow.
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Continue</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Edit profile",
      html: `<button type="button" class="btn" data-open-dialog="demo-dialog">Open dialog</button>

<dialog class="dialog" id="demo-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
  <div>
    <header>
      <h2 data-slot="title" id="dialog-title">Edit profile</h2>
      <p data-slot="description" id="dialog-description">
        Make changes to your profile here. Click save when you're done.
      </p>
    </header>
    <section>
      <div class="field">
        <label class="label" for="dialog-name">Name</label>
        <input class="input" id="dialog-name" value="Ada Lovelace">
      </div>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Save changes</button>
    </footer>
    <form method="dialog">
      <button class="btn" data-variant="ghost" data-size="icon-sm" aria-label="Close">×</button>
    </form>
  </div>
</dialog>`
    }
  ],
  "dropdown-menu": [
    {
      title: "Default",
      html: `<div class="dropdown-menu" data-demo="dropdown">
  <button type="button" class="btn" data-variant="outline" data-demo-trigger aria-haspopup="menu" aria-expanded="false">
    Open menu
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <button type="button" role="menuitem">Profile</button>
      <button type="button" role="menuitem">Billing</button>
      <button type="button" role="menuitem">Settings <span class="kbd">⌘S</span></button>
      <div role="separator"></div>
      <button type="button" role="menuitem" data-variant="destructive">Delete account</button>
    </div>
  </div>
</div>`
    }
  ],
  empty: [
    {
      title: "Default",
      html: `<div class="empty">
  <header>
    <figure>${search}</figure>
    <h2>No results found</h2>
    <p>Try adjusting your search or filters.</p>
  </header>
  <section>
    <button class="btn" data-variant="outline">Clear filters</button>
  </section>
</div>`
    }
  ],
  field: [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-field-default">Name</label>
  <input class="input" id="demo-field-default" placeholder="Ada Lovelace">
</div>`
    },
    {
      title: "Vertical",
      html: `<div class="field">
  <label class="label" for="demo-field-email">Email</label>
  <input class="input" id="demo-field-email" type="email" placeholder="you@example.com">
  <p>We'll never share your email with anyone else.</p>
</div>`
    },
    {
      title: "Horizontal",
      html: `<div class="field" data-orientation="horizontal">
  <section>
    <label class="label" for="demo-field-notifications">Notifications</label>
    <p>Receive emails about new features.</p>
  </section>
  <input class="switch" type="checkbox" role="switch" id="demo-field-notifications">
</div>`
    }
  ],
  input: [
    {
      title: "Default",
      html: `<input class="input" type="email" placeholder="you@example.com" aria-label="Email">`
    },
    {
      title: "Field",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-field">Username</label>
  <input class="input" id="demo-input-field" placeholder="Enter your username">
  <p>Choose a unique username for your account.</p>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-disabled">Email</label>
  <input class="input" id="demo-input-disabled" type="email" value="ada@example.com" disabled>
  <p>This field is currently disabled.</p>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-invalid">Username</label>
  <input class="input" id="demo-input-invalid" aria-invalid="true" aria-describedby="demo-input-invalid-error" value="invalid name">
  <p id="demo-input-invalid-error" role="alert">Username may only contain letters and numbers.</p>
</div>`
    },
    {
      title: "File",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-file">Picture</label>
  <input class="input" id="demo-input-file" type="file" accept="image/*">
  <p>Select a picture to upload.</p>
</div>`
    },
    {
      title: "Required",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-required">Required field <span aria-hidden="true" style="color: var(--destructive)">*</span></label>
  <input class="input" id="demo-input-required" placeholder="This field is required" required>
  <p>This field must be filled out.</p>
</div>`
    },
    {
      title: "Grid",
      html: `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; max-width: 30rem">
  <div class="field">
    <label class="label" for="demo-input-first-name">First name</label>
    <input class="input" id="demo-input-first-name" placeholder="Jordan">
  </div>
  <div class="field">
    <label class="label" for="demo-input-last-name">Last name</label>
    <input class="input" id="demo-input-last-name" placeholder="Lee">
  </div>
</div>`
    },
    {
      title: "Inline",
      html: `<div class="field" data-orientation="horizontal" style="max-width: 24rem">
  <input class="input" type="search" placeholder="Search..." aria-label="Search" style="flex: 1">
  <button type="button" class="btn">Search</button>
</div>`
    },
    {
      title: "Badge",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-badge" style="width: 100%">
    Webhook URL
    <span class="badge" data-variant="secondary" style="margin-inline-start: auto">Beta</span>
  </label>
  <input class="input" id="demo-input-badge" type="url" placeholder="https://api.example.com/webhook">
</div>`
    },
    {
      title: "Input group",
      html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 24rem">
  <label class="label" for="demo-input-group-website">Website URL</label>
  <div class="input-group" role="group" aria-label="Website URL">
    <input class="input" id="demo-input-group-website" type="url" placeholder="example.com">
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">https://</span>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="field" dir="rtl" lang="ar" style="max-width: 24rem">
  <label class="label" for="demo-input-rtl-api-key">مفتاح API</label>
  <input class="input" id="demo-input-rtl-api-key" type="password" placeholder="sk-..." dir="rtl">
  <p>مفتاح API الخاص بك مشفر ومخزن بأمان.</p>
</div>`
    }
  ],
  item: [
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
  ],
  kbd: [
    {
      title: "Default",
      html: `<div style="display: flex; align-items: center; gap: 0.5rem">
  <span class="kbd">⌘</span>
  <span class="kbd">K</span>
  <span>Open command menu</span>
</div>`
    }
  ],
  label: [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-label">Your name</label>
  <input class="input" id="demo-label" placeholder="Ada Lovelace">
</div>`
    }
  ],
  "native-select": [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-select">Framework</label>
  <select class="native-select" id="demo-select">
    <option>Next.js</option>
    <option>Astro</option>
    <option>SvelteKit</option>
    <option>Nuxt</option>
  </select>
</div>`
    }
  ],
  popover: [
    {
      title: "Default",
      html: `<div class="popover" data-demo="popover">
  <button type="button" class="btn" data-variant="outline" data-demo-trigger aria-expanded="false">
    Open popover
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <header data-slot="header">
      <h3 data-slot="title">Dimensions</h3>
      <p data-slot="description">Set the dimensions for the layer.</p>
    </header>
    <div class="field">
      <label class="label" for="popover-width">Width</label>
      <input class="input" id="popover-width" value="100%">
    </div>
  </div>
</div>`
    }
  ],
  radio: [
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
  ],
  skeleton: [
    {
      title: "Default",
      html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 20rem">
  <div class="skeleton" style="height: 1rem; width: 60%"></div>
  <div class="skeleton" style="height: 1rem; width: 100%"></div>
  <div class="skeleton" style="height: 1rem; width: 80%"></div>
</div>`
    }
  ],
  switch: [
    {
      title: "Default",
      html: `<label class="label" for="demo-switch">
  <input class="switch" type="checkbox" role="switch" id="demo-switch" checked>
  Airplane mode
</label>`
    },
    {
      title: "With description",
      html: `<div class="field" data-orientation="horizontal" style="max-width: 24rem">
  <input class="switch" type="checkbox" role="switch" id="demo-switch-description" checked>
  <section>
    <label class="label" for="demo-switch-description">Share across devices</label>
    <p>Focus is shared across devices, and turns off when you leave the app.</p>
  </section>
</div>`
    },
    {
      title: "Choice card",
      html: `<label class="label" for="demo-switch-focus" style="max-width: 24rem">
  <div class="field" data-orientation="horizontal">
    <section>
      <h3>Share across devices</h3>
      <p>Focus is shared across devices, and turns off when you leave the app.</p>
    </section>
    <input class="switch" type="checkbox" role="switch" id="demo-switch-focus" checked>
  </div>
</label>`
    },
    {
      title: "Disabled",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem">
  <div class="field">
    <label class="label" for="demo-switch-disabled-unchecked">
      <input class="switch" type="checkbox" role="switch" id="demo-switch-disabled-unchecked" disabled>
      Disabled (unchecked)
    </label>
  </div>
  <div class="field">
    <label class="label" for="demo-switch-disabled-checked">
      <input class="switch" type="checkbox" role="switch" id="demo-switch-disabled-checked" checked disabled>
      Disabled (checked)
    </label>
  </div>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" data-orientation="horizontal" aria-invalid="true" style="max-width: 24rem">
  <input class="switch" type="checkbox" role="switch" id="demo-switch-invalid" aria-invalid="true">
  <section>
    <label class="label" for="demo-switch-invalid">Accept terms and conditions</label>
    <p role="alert">You must accept the terms and conditions to continue.</p>
  </section>
</div>`
    },
    {
      title: "Size",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem">
  <div class="field" data-orientation="horizontal">
    <input class="switch" type="checkbox" role="switch" id="demo-switch-sm" data-size="sm" checked>
    <label class="label" for="demo-switch-sm">Small</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="switch" type="checkbox" role="switch" id="demo-switch-default" data-size="default" checked>
    <label class="label" for="demo-switch-default">Default</label>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="max-width: 24rem">
  <div class="field" data-orientation="horizontal">
    <input class="switch" type="checkbox" role="switch" id="demo-switch-rtl" checked>
    <section>
      <label class="label" for="demo-switch-rtl">المشاركة عبر الأجهزة</label>
      <p>يتم مشاركة التركيز عبر الأجهزة، ويتوقف عند مغادرة التطبيق.</p>
    </section>
  </div>
</div>`
    }
  ],
  table: [
    {
      title: "Default",
      html: `<div class="table-container">
  <table class="table">
    <caption>A list of your recent invoices.</caption>
    <thead>
      <tr>
        <th>Invoice</th>
        <th>Status</th>
        <th>Method</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>INV-001</td>
        <td>Paid</td>
        <td>Credit card</td>
        <td>$250.00</td>
      </tr>
      <tr aria-selected="true">
        <td>INV-002</td>
        <td>Pending</td>
        <td>PayPal</td>
        <td>$150.00</td>
      </tr>
      <tr>
        <td>INV-003</td>
        <td>Unpaid</td>
        <td>Bank transfer</td>
        <td>$350.00</td>
      </tr>
    </tbody>
  </table>
</div>`
    }
  ],
  tabs: [
    {
      title: "Default",
      html: `<div class="tabs" data-demo="tabs">
  <div role="tablist" aria-orientation="horizontal">
    <button type="button" role="tab" id="tab-account" aria-selected="true" aria-controls="panel-account">Account</button>
    <button type="button" role="tab" id="tab-password" aria-selected="false" aria-controls="panel-password" tabindex="-1">Password</button>
  </div>
  <div role="tabpanel" id="panel-account" aria-labelledby="tab-account">
    <p>Make changes to your account here.</p>
  </div>
  <div role="tabpanel" id="panel-password" aria-labelledby="tab-password" hidden>
    <p>Change your password here.</p>
  </div>
</div>`
    },
    {
      title: "Line variant",
      html: `<div class="tabs" data-demo="tabs">
  <div role="tablist" aria-orientation="horizontal" data-variant="line">
    <button type="button" role="tab" id="tab-overview" aria-selected="true" aria-controls="panel-overview">Overview</button>
    <button type="button" role="tab" id="tab-activity" aria-selected="false" aria-controls="panel-activity" tabindex="-1">Activity</button>
  </div>
  <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview">
    <p>An overview of your project.</p>
  </div>
  <div role="tabpanel" id="panel-activity" aria-labelledby="tab-activity" hidden>
    <p>Recent activity in your project.</p>
  </div>
</div>`
    }
  ],
  textarea: [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-textarea">Message</label>
  <textarea class="textarea" id="demo-textarea" placeholder="Type your message here."></textarea>
  <p>Your message will be copied to the support team.</p>
</div>`
    }
  ],
  tooltip: [
    {
      title: "Default",
      html: `<button type="button" class="btn tooltip" data-tooltip="Add to library" data-arrow>
  Add to library
</button>`
    }
  ],
  accordion: [
    {
      title: "Default",
      html: `<div class="accordion">
  <details open>
    <summary>
      Is it accessible?
      ${chevronDown}
    </summary>
    <div>
      <p>Yes. It uses native details and summary elements.</p>
    </div>
  </details>
  <details>
    <summary>
      Can I style it?
      ${chevronDown}
    </summary>
    <div>
      <p>Yes. The base file owns the anatomy and the Nova style owns the surface.</p>
    </div>
  </details>
</div>`
    },
    {
      title: "Exclusive",
      html: `<div class="accordion">
  <details name="demo-accordion" open>
    <summary>
      Shipping
      ${chevronDown}
    </summary>
    <div>
      <p>Orders placed before 14:00 ship the same day.</p>
    </div>
  </details>
  <details name="demo-accordion">
    <summary>
      Returns
      ${chevronDown}
    </summary>
    <div>
      <p>Returns are accepted within 30 days of delivery.</p>
    </div>
  </details>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="accordion">
  <details inert>
    <summary>
      Archived section
      ${chevronDown}
    </summary>
    <div>
      <p>This section cannot be opened.</p>
    </div>
  </details>
</div>`
    }
  ],
  "aspect-ratio": [
    {
      title: "Default",
      html: `<div class="aspect-ratio" style="max-width: 24rem">
  <img src="${ratioImage}" alt="A 16 by 9 media placeholder" />
</div>`
    },
    {
      title: "16 / 9",
      html: `<div class="aspect-ratio" style="--ratio: 16 / 9">
  <img src="${ratioImage}" alt="A 16 by 9 media placeholder" />
</div>`
    },
    {
      title: "Square, contain",
      html: `<div class="aspect-ratio" style="--ratio: 1 / 1; max-width: 16rem" data-fit="contain">
  <img src="${ratioImage}" alt="A wide media placeholder inside a square frame" />
</div>`
    }
  ],
  avatar: [
    {
      title: "Default",
      html: `<span class="avatar"><span data-slot="fallback">CN</span></span>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; align-items: center; gap: 0.75rem">
  <span class="avatar" data-size="sm"><span data-slot="fallback">SM</span></span>
  <span class="avatar"><span data-slot="fallback">AV</span></span>
  <span class="avatar" data-size="lg"><span data-slot="fallback">LG</span></span>
</div>`
    },
    {
      title: "Image and badge",
      html: `<span class="avatar" data-size="lg">
  <img src="${avatarImage}" alt="Ada Lovelace" />
  <span data-slot="fallback" aria-hidden="true">AL</span>
  <span data-slot="badge" aria-hidden="true"></span>
</span>`
    },
    {
      title: "Group",
      html: `<div class="avatar-group">
  <span class="avatar"><span data-slot="fallback">AL</span></span>
  <span class="avatar"><span data-slot="fallback">GR</span></span>
  <span class="avatar"><span data-slot="fallback">TS</span></span>
  <span class="avatar"><span data-slot="fallback">+3</span></span>
</div>`
    }
  ],
  breadcrumb: [
    {
      title: "Default",
      html: `<nav class="breadcrumb" aria-label="breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><a href="#">Components</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><span aria-current="page">Breadcrumb</span></li>
  </ol>
</nav>`
    },
    {
      title: "Collapsed",
      html: `<nav class="breadcrumb" aria-label="breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><span data-slot="ellipsis" aria-hidden="true">${moreHorizontal}</span></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><a href="#">Components</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><span aria-current="page">Breadcrumb</span></li>
  </ol>
</nav>`
    }
  ],
  pagination: [
    {
      title: "Default",
      html: `<nav class="pagination" aria-label="pagination">
  <ul>
    <li>
      <a class="btn" data-variant="ghost" data-size="icon" href="#" aria-label="Go to previous page">${chevronLeft}</a>
    </li>
    <li><a class="btn" data-variant="ghost" href="#" aria-current="page">1</a></li>
    <li><a class="btn" data-variant="ghost" href="#">2</a></li>
    <li><a class="btn" data-variant="ghost" href="#">3</a></li>
    <li>
      <a class="btn" data-variant="ghost" data-size="icon" href="#" aria-label="Go to next page">${chevronRight}</a>
    </li>
  </ul>
</nav>`
    },
    {
      title: "With ellipsis",
      html: `<nav class="pagination" aria-label="pagination">
  <ul>
    <li>
      <a class="btn" data-variant="ghost" href="#" aria-label="Go to previous page">
        ${chevronLeft}
        <span data-slot="label" aria-hidden="true">Previous</span>
      </a>
    </li>
    <li><a class="btn" data-variant="ghost" href="#">1</a></li>
    <li><a class="btn" data-variant="ghost" href="#">2</a></li>
    <li><a class="btn" data-variant="ghost" href="#">3</a></li>
    <li><span data-slot="ellipsis" aria-hidden="true">${moreHorizontal}</span></li>
    <li><a class="btn" data-variant="ghost" href="#">8</a></li>
    <li><a class="btn" data-variant="ghost" href="#">9</a></li>
    <li><a class="btn" data-variant="ghost" href="#" aria-current="page">10</a></li>
    <li>
      <a class="btn" data-variant="ghost" href="#" aria-label="Go to next page">
        <span data-slot="label" aria-hidden="true">Next</span>
        ${chevronRight}
      </a>
    </li>
  </ul>
</nav>`
    }
  ],
  progress: [
    {
      title: "Default",
      html: `<div style="display: grid; gap: 0.5rem; width: 100%; max-width: 20rem">
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem">
    <span>Uploading report.pdf</span>
    <span>60%</span>
  </div>
  <progress class="progress" value="60" max="100" aria-label="Upload progress">60%</progress>
</div>`
    },
    {
      title: "Determinate",
      html: `<progress class="progress" value="60" max="100" aria-label="Upload progress">60%</progress>`
    },
    {
      title: "Indeterminate",
      html: `<progress class="progress" max="100" aria-label="Loading">Loading…</progress>`
    }
  ],
  separator: [
    {
      title: "Default",
      html: `<hr class="separator" />`
    },
    {
      title: "Horizontal",
      html: `<div style="display: grid; gap: 0.75rem">
  <p>loseta components</p>
  <hr class="separator" />
  <p>Native CSS with copy-paste distribution.</p>
</div>`
    },
    {
      title: "Vertical",
      html: `<div style="display: flex; align-items: center; gap: 1rem; height: 1.5rem">
  <span>Blog</span>
  <div class="separator" role="separator" aria-orientation="vertical" data-orientation="vertical"></div>
  <span>Docs</span>
  <div class="separator" role="separator" aria-orientation="vertical" data-orientation="vertical"></div>
  <span>Source</span>
</div>`
    }
  ],
  spinner: [
    {
      title: "Default",
      html: `<span class="spinner" role="status"><span class="sr-only">Loading</span></span>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; align-items: center; gap: 1rem">
  <span class="spinner" data-size="sm" role="status"><span class="sr-only">Loading</span></span>
  <span class="spinner" role="status"><span class="sr-only">Loading</span></span>
  <span class="spinner" data-size="lg" role="status"><span class="sr-only">Loading</span></span>
</div>`
    },
    {
      title: "With a label",
      html: `<div style="display: flex; align-items: center; gap: 0.5rem">
  <span class="spinner" data-size="sm" aria-hidden="true"></span>
  <span>Loading results…</span>
</div>`
    }
  ],
  toggle: [
    {
      title: "Default",
      html: `<button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bold</button>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bold</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="true" data-demo-toggle>Italic</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="false" disabled>Underline</button>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="toggle" data-size="sm" aria-pressed="false" data-demo-toggle>Small</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Default</button>
  <button type="button" class="toggle" data-size="lg" aria-pressed="false" data-demo-toggle>Large</button>
</div>`
    }
  ],
  "toggle-group": [
    {
      title: "Default",
      html: `<div class="toggle-group" role="group" aria-label="Text formatting">
  <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Bold</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Italic</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Underline</button>
</div>`
    },
    {
      title: "Joined",
      html: `<div class="toggle-group" role="group" aria-label="Text alignment" data-spacing="joined">
  <button type="button" class="toggle" aria-pressed="true" data-demo-toggle aria-label="Align left">${alignLeft}</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle aria-label="Align center">${alignCenter}</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle aria-label="Align right">${alignRight}</button>
</div>`
    },
    {
      title: "Vertical outline",
      html: `<div class="toggle-group" role="group" aria-label="View density" data-orientation="vertical" data-variant="outline" data-size="sm">
  <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Compact</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Default</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Comfortable</button>
</div>`
    }
  ],
  "context-menu": [
    {
      title: "Default",
      html: `<div data-demo="context-menu" data-demo-context style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <button type="button" role="menuitem">Profile</button>
    <button type="button" role="menuitem">Billing</button>
    <div role="separator"></div>
    <button type="button" role="menuitem" data-variant="destructive">Delete account</button>
  </div>
</div>`
    }
  ],
  drawer: [
    {
      title: "Default",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer">
  Open drawer
</button>

<dialog class="drawer" id="demo-drawer" data-side="block-end" aria-labelledby="drawer-title">
  <div>
    <span data-slot="handle" aria-hidden="true"></span>
    <header>
      <h2 data-slot="title" id="drawer-title">Edit profile</h2>
      <p data-slot="description">Make changes to your profile here.</p>
    </header>
    <section>
      <div class="field">
        <label class="label" for="drawer-name">Name</label>
        <input class="input" id="drawer-name" value="Ada Lovelace">
      </div>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Save changes</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Large",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-large">
  Open large drawer
</button>

<dialog class="drawer" id="demo-drawer-large" data-side="block-end" data-size="lg" aria-labelledby="drawer-large-title">
  <div>
    <span data-slot="handle" aria-hidden="true"></span>
    <header>
      <h2 data-slot="title" id="drawer-large-title">Filters</h2>
      <p data-slot="description">Narrow the results to the records you need.</p>
    </header>
    <section>
      <p>Use the controls in your application to filter this content.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Apply</button>
    </footer>
  </div>
</dialog>`
    }
  ],
  "hover-card": [
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
  ],
  menubar: [
    {
      title: "Default",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <div class="menubar" role="menubar" aria-label="Main" data-demo="menubar">
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-demo-menu-trigger>File</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">New tab <span class="kbd">⌘T</span></button>
          <button type="button" role="menuitem">New window <span class="kbd">⌘N</span></button>
          <div role="separator"></div>
          <button type="button" role="menuitem">Print <span class="kbd">⌘P</span></button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-demo-menu-trigger>Edit</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">Undo <span class="kbd">⌘Z</span></button>
          <button type="button" role="menuitem">Redo <span class="kbd">⇧⌘Z</span></button>
          <div role="separator"></div>
          <button type="button" role="menuitem">Cut</button>
          <button type="button" role="menuitem">Copy</button>
          <button type="button" role="menuitem">Paste</button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-demo-menu-trigger>View</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">Zoom in</button>
          <button type="button" role="menuitem">Zoom out</button>
          <div role="separator"></div>
          <button type="button" role="menuitemcheckbox" aria-checked="true">
            <span data-slot="indicator">✓</span>
            Show sidebar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`
    }
  ],
  "navigation-menu": [
    {
      title: "Default",
      html: `<div style="display: flex; justify-content: center; min-height: 18rem; padding-top: 1rem">
  <nav class="navigation-menu" aria-label="Main" data-demo="navigation-menu">
    <ul>
      <li>
        <button type="button" aria-expanded="false" aria-controls="nav-products" data-demo-menu-trigger>
          Products
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="nav-products">
          <ul>
            <li>
              <a href="#">
                <span data-slot="title">Components</span>
                <span data-slot="description">Copy-paste CSS components.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">Styles</span>
                <span data-slot="description">Eight visual interpretations.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">CLI</span>
                <span data-slot="description">Install only what you use.</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li>
        <button type="button" aria-expanded="false" aria-controls="nav-resources" data-demo-menu-trigger>
          Resources
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="nav-resources">
          <ul>
            <li>
              <a href="#">
                <span data-slot="title">Docs</span>
                <span data-slot="description">Installation and component contracts.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">GitHub</span>
                <span data-slot="description">Source and issue tracker.</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li><a href="#">Docs</a></li>
    </ul>
  </nav>
</div>`
    }
  ],
  sheet: [
    {
      title: "Default",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-sheet-default">
  Open sheet
</button>

<dialog class="sheet" id="demo-sheet-default" data-side="inline-end" aria-labelledby="sheet-default-title" aria-describedby="sheet-default-description">
  <div>
    <header>
      <h2 data-slot="title" id="sheet-default-title">Sheet title</h2>
      <p data-slot="description" id="sheet-default-description">
        This sheet opens from the inline end edge.
      </p>
    </header>
    <section>
      <p>Use sheets for secondary content, filters or forms.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Close</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Right",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-sheet">
  Open sheet
</button>

<dialog class="sheet" id="demo-sheet" data-side="inline-end" aria-labelledby="sheet-title" aria-describedby="sheet-description">
  <div>
    <header>
      <h2 data-slot="title" id="sheet-title">Edit profile</h2>
      <p data-slot="description" id="sheet-description">Make changes to your profile here.</p>
    </header>
    <section>
      <div class="field">
        <label class="label" for="sheet-name">Name</label>
        <input class="input" id="sheet-name" value="Ada Lovelace">
      </div>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Save changes</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Left, small",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-sheet-left">
  Open left sheet
</button>

<dialog class="sheet" id="demo-sheet-left" data-side="inline-start" data-size="sm" aria-labelledby="sheet-left-title">
  <div>
    <header>
      <h2 data-slot="title" id="sheet-left-title">Navigation</h2>
    </header>
    <section>
      <p>Use the left sheet for navigation or secondary controls.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Close</button>
    </footer>
  </div>
</dialog>`
    }
  ],
  collapsible: [
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
  ],
  "input-group": [
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
  ],
  "input-otp": [
    {
      title: "Default",
      html: `<input class="input-otp" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" aria-label="One-time code" placeholder="000000">`
    },
    {
      title: "Large",
      html: `<input class="input-otp" data-size="lg" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" aria-label="One-time code" placeholder="000000">`
    }
  ],
  "scroll-area": [
    {
      title: "Default",
      html: `<div class="scroll-area" role="region" aria-label="Scrollable content" tabindex="0" style="max-height: 8rem; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 0.75rem">
  <p>loseta copies readable CSS files into your project.</p>
  <p>The registry validates layers, dependencies and generated examples.</p>
  <p>Eight styles share one markup contract.</p>
  <p>The docs site renders the same files consumers install.</p>
  <p>Scrollbars use the reserved scrollbar tokens.</p>
</div>`
    },
    {
      title: "Vertical",
      html: `<div class="scroll-area" role="region" aria-label="Scrollable content" tabindex="0" style="max-height: 10rem; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 0.75rem">
  <p>loseta copies readable CSS files into your project.</p>
  <p>The registry validates layers, dependencies and generated examples.</p>
  <p>Eight styles share one markup contract.</p>
  <p>The docs site renders the same files consumers install.</p>
  <p>Scrollbars use the reserved scrollbar tokens.</p>
  <p>This region is focusable so keyboard users can scroll it.</p>
  <p>No JavaScript is involved in the scrollbar styling.</p>
</div>`
    },
    {
      title: "Horizontal, small",
      html: `<div class="scroll-area" data-size="sm" data-orientation="horizontal" role="region" aria-label="Scrollable row" tabindex="0" style="border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 0.75rem">
  <div style="display: flex; gap: 0.5rem; width: max-content">
    <span class="badge">Accordion</span>
    <span class="badge">Avatar</span>
    <span class="badge">Breadcrumb</span>
    <span class="badge">Context menu</span>
    <span class="badge">Drawer</span>
    <span class="badge">Hover card</span>
    <span class="badge">Menubar</span>
    <span class="badge">Navigation menu</span>
    <span class="badge">Sheet</span>
  </div>
</div>`
    }
  ],
  slider: [
    {
      title: "Default",
      html: `<input class="slider" type="range" min="0" max="100" value="60" aria-label="Volume">`
    },
    {
      title: "Sizes and disabled",
      html: `<div style="display: grid; gap: 0.75rem">
  <input class="slider" data-size="sm" type="range" min="0" max="100" value="30" aria-label="Small volume">
  <input class="slider" data-size="lg" type="range" min="0" max="100" value="70" aria-label="Large volume">
  <input class="slider" type="range" min="0" max="100" value="50" aria-label="Disabled volume" disabled>
</div>`
    }
  ],
  select: [
    {
      title: "Default",
      html: `<div class="select" data-demo="select">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="select-fruit-panel" aria-label="Fruit" data-demo-select-trigger>
    <span data-slot="value" data-placeholder>Select a fruit</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="select-fruit-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Apple</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Banana</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Orange</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-disabled="true">
        <span data-slot="text">Pineapple</span>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Small, selected",
      html: `<div class="select" data-size="sm" data-demo="select">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="select-fruit-small-panel" aria-label="Fruit" data-demo-select-trigger>
    <span data-slot="value">Apple</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="select-fruit-small-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="true" data-demo-option>
        <span data-slot="text">Apple</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Banana</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Orange</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
    </div>
  </div>
</div>`
    }
  ],
  combobox: [
    {
      title: "Default",
      html: `<div class="combobox" data-demo="combobox">
  <input role="combobox" aria-expanded="false" aria-controls="combobox-default-panel" aria-autocomplete="list" placeholder="Select a framework..." aria-label="Select a framework" data-demo-combobox-input>
  <div data-popover data-side="bottom" aria-hidden="true" id="combobox-default-panel">
    <div role="listbox" aria-label="Frameworks">
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">React</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Vue</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Svelte</span></div>
      <div data-slot="empty" hidden>No framework found.</div>
    </div>
  </div>
</div>`
    },
    {
      title: "Single",
      html: `<div class="combobox" data-demo="combobox">
  <input role="combobox" aria-expanded="false" aria-controls="combobox-fruit-panel" aria-autocomplete="list" placeholder="Search fruit..." aria-label="Search fruit" data-demo-combobox-input>
  <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="clear" data-demo-clear aria-label="Clear">×</button>
  <div data-popover data-side="bottom" aria-hidden="true" id="combobox-fruit-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Apple</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Banana</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Orange</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Pineapple</span></div>
      <div data-slot="empty" hidden>No fruit found.</div>
    </div>
  </div>
</div>`
    },
    {
      title: "Multiple",
      html: `<div class="combobox" data-demo="combobox">
  <input role="combobox" aria-expanded="false" aria-controls="combobox-tag-panel" aria-autocomplete="list" placeholder="Search tags..." aria-label="Search tags" data-demo-combobox-input>
  <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="clear" data-demo-clear aria-label="Clear">×</button>
  <div data-popover data-side="bottom" aria-hidden="true" id="combobox-tag-panel">
    <div role="listbox" aria-label="Tags" aria-multiselectable="true">
      <div role="option" aria-selected="true" data-demo-option><span data-slot="text">Design</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Engineering</span></div>
      <div role="option" aria-selected="true" data-demo-option><span data-slot="text">Docs</span></div>
      <div data-slot="empty" hidden>No tags found.</div>
    </div>
  </div>
</div>`
    }
  ],
  command: [
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
  ],
  calendar: [
    {
      title: "Default",
      html: `<div class="calendar">
  <header>
    <button type="button" aria-label="Previous month">${chevronLeft}</button>
    <span data-slot="title" aria-live="polite">February 2026</span>
    <button type="button" aria-label="Next month">${chevronRight}</button>
  </header>
  <table role="grid">
    <caption class="sr-only">February 2026</caption>
    <thead>
      <tr>
        <th scope="col"><abbr title="Sunday">Su</abbr></th>
        <th scope="col"><abbr title="Monday">Mo</abbr></th>
        <th scope="col"><abbr title="Tuesday">Tu</abbr></th>
        <th scope="col"><abbr title="Wednesday">We</abbr></th>
        <th scope="col"><abbr title="Thursday">Th</abbr></th>
        <th scope="col"><abbr title="Friday">Fr</abbr></th>
        <th scope="col"><abbr title="Saturday">Sa</abbr></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 1, 2026">1</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 2, 2026">2</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 3, 2026">3</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 4, 2026">4</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 5, 2026">5</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 6, 2026">6</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 7, 2026">7</button></td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 8, 2026">8</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 9, 2026">9</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 10, 2026">10</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 11, 2026">11</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 12, 2026">12</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 13, 2026">13</button></td>
        <td role="gridcell" aria-selected="true"><button type="button" aria-label="February 14, 2026">14</button></td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 15, 2026">15</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 16, 2026">16</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 17, 2026">17</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 18, 2026">18</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 19, 2026">19</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 20, 2026">20</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 21, 2026">21</button></td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 22, 2026">22</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 23, 2026">23</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 24, 2026">24</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 25, 2026">25</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 26, 2026">26</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 27, 2026">27</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 28, 2026">28</button></td>
      </tr>
    </tbody>
  </table>
</div>`
    }
  ],
  carousel: [
    {
      title: "Default",
      html: `<section class="carousel" data-orientation="horizontal" aria-roledescription="carousel" aria-label="Featured components" data-demo="carousel">
  <div class="carousel-viewport" tabindex="0">
    <div class="carousel-track">
      <div class="carousel-item" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="card">
          <header>
            <h3 data-slot="title">Accordion</h3>
            <p data-slot="description">Disclosure patterns</p>
          </header>
          <section>
            <p>Native details and summary with exclusive groups.</p>
          </section>
        </div>
      </div>
      <div class="carousel-item" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="card">
          <header>
            <h3 data-slot="title">Avatar</h3>
            <p data-slot="description">Identity at a glance</p>
          </header>
          <section>
            <p>Images, fallback initials, badges and overlapping groups.</p>
          </section>
        </div>
      </div>
      <div class="carousel-item" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="card">
          <header>
            <h3 data-slot="title">Breadcrumb</h3>
            <p data-slot="description">Navigation context</p>
          </header>
          <section>
            <p>Ordered links with a current page and collapsed paths.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-button" data-demo-carousel-prev aria-label="Previous slide">${chevronLeft}</button>
    <div class="carousel-indicators" role="group" aria-label="Slides">
      <button type="button" class="carousel-indicator" aria-label="Go to slide 1" aria-current="true" data-demo-carousel-go="0"></button>
      <button type="button" class="carousel-indicator" aria-label="Go to slide 2" data-demo-carousel-go="1"></button>
      <button type="button" class="carousel-indicator" aria-label="Go to slide 3" data-demo-carousel-go="2"></button>
    </div>
    <button type="button" class="carousel-button" data-demo-carousel-next aria-label="Next slide">${chevronRight}</button>
  </div>
</section>`
    }
  ],
  chart: [
    {
      title: "Default",
      html: `<div class="card">
  <header>
    <h3 data-slot="title">Monthly revenue</h3>
    <p data-slot="description">January to June 2026</p>
  </header>
  <section>
    <div class="chart">
      <div data-slot="plot">
        <svg viewBox="0 0 320 160" role="img" aria-label="Revenue and costs by month">
          <g style="fill: var(--chart-1)">
            <rect x="20" y="80" width="16" height="60" rx="4" />
            <rect x="68" y="50" width="16" height="90" rx="4" />
            <rect x="116" y="70" width="16" height="70" rx="4" />
            <rect x="164" y="30" width="16" height="110" rx="4" />
            <rect x="212" y="60" width="16" height="80" rx="4" />
            <rect x="260" y="40" width="16" height="100" rx="4" />
          </g>
          <g style="fill: var(--chart-2)">
            <rect x="40" y="110" width="16" height="30" rx="4" />
            <rect x="88" y="100" width="16" height="40" rx="4" />
            <rect x="136" y="105" width="16" height="35" rx="4" />
            <rect x="184" y="90" width="16" height="50" rx="4" />
            <rect x="232" y="95" width="16" height="45" rx="4" />
            <rect x="280" y="85" width="16" height="55" rx="4" />
          </g>
        </svg>
        <div data-slot="tooltip" style="inset-block-start: 2.5rem; inset-inline-start: 38%">
          <span data-slot="title">March</span>
          <span data-slot="description">$12,400 revenue</span>
        </div>
      </div>
      <div data-slot="legend">
        <span data-slot="legend-item" data-series="1"><span data-slot="swatch"></span>Revenue</span>
        <span data-slot="legend-item" data-series="2"><span data-slot="swatch"></span>Costs</span>
      </div>
    </div>
  </section>
</div>`
    }
  ],
  resizable: [
    {
      title: "Default",
      html: `<div class="resizable" style="height: 10rem">
  <div class="resizable-panel">
    <p><strong>Sidebar</strong></p>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="vertical" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
  <div class="resizable-panel">
    <p><strong>Content</strong></p>
  </div>
</div>`
    },
    {
      title: "Horizontal",
      html: `<div class="resizable" data-orientation="horizontal" style="height: 12rem">
  <div class="resizable-panel">
    <p><strong>Panel one</strong></p>
    <p>Drag the handle or use the arrow keys in your application.</p>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="vertical" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
  <div class="resizable-panel" style="--panel-size: 2">
    <p><strong>Panel two</strong></p>
    <p>Set --panel-size to change the initial flex ratio.</p>
  </div>
</div>`
    },
    {
      title: "Vertical",
      html: `<div class="resizable" data-orientation="vertical" style="height: 14rem">
  <div class="resizable-panel">
    <p><strong>Top panel</strong></p>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="horizontal" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
  <div class="resizable-panel">
    <p><strong>Bottom panel</strong></p>
  </div>
</div>`
    }
  ],
  sidebar: [
    {
      title: "Default",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 22rem">
  <header>
    <span data-slot="brand">loseta</span>
  </header>
  <section>
    <nav aria-label="Documentation">
      <ul>
        <li><a href="#" aria-current="page">Overview</a></li>
        <li><a href="#">Installation</a></li>
        <li>
          <details class="collapsible" open>
            <summary>
              Components
              ${chevronDown}
            </summary>
            <ul>
              <li><a href="#">Button</a></li>
              <li><a href="#">Card</a></li>
              <li><a href="#">Field</a></li>
            </ul>
          </details>
        </li>
        <li><a href="#">Styles</a></li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>v0.15.0</span>
  </footer>
</aside>`
    }
  ],
  toast: [
    {
      title: "Default",
      html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 22rem">
  <div class="toast" role="status">
    <section>
      <p data-slot="title">Saved</p>
      <p data-slot="description">Your changes have been saved.</p>
    </section>
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="close" data-demo-toast-close aria-label="Dismiss">×</button>
  </div>
  <div class="toast" data-variant="destructive" role="alert">
    <section>
      <p data-slot="title">Upload failed</p>
      <p data-slot="description">The file is larger than 10 MB.</p>
    </section>
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="close" data-demo-toast-close aria-label="Dismiss">×</button>
  </div>
</div>`
    }
  ],
  message: [
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
  ],
  bubble: [
    {
      title: "Default",
      html: `<div class="bubble" data-align="start">
  <div data-slot="content">Hello! How can I help you today?</div>
</div>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: flex-start">
  <div class="bubble"><div data-slot="content">Default</div></div>
  <div class="bubble" data-variant="secondary"><div data-slot="content">Secondary</div></div>
  <div class="bubble" data-variant="muted"><div data-slot="content">Muted</div></div>
  <div class="bubble" data-variant="tinted"><div data-slot="content">Tinted</div></div>
  <div class="bubble" data-variant="outline"><div data-slot="content">Outline</div></div>
  <div class="bubble" data-variant="ghost"><div data-slot="content">Ghost content</div></div>
  <div class="bubble" data-variant="destructive"><div data-slot="content">Something went wrong.</div></div>
</div>`
    },
    {
      title: "Reactions",
      html: `<div style="display: flex; flex-direction: column; gap: 2rem; padding-block: 1rem; max-width: 22rem">
  <div class="bubble" data-variant="muted" data-align="start">
    <div data-slot="content">The install failure came from an out-of-date lockfile.</div>
    <div data-slot="reactions">
      <button type="button" data-slot="reaction" aria-pressed="true" aria-label="Helpful, 2 reactions">👍 <span>2</span></button>
      <button type="button" data-slot="reaction" aria-pressed="false" aria-label="Celebrate, 0 reactions">🎉</button>
    </div>
  </div>
</div>`
    }
  ],
  marker: [
    {
      title: "Default",
      html: `<div class="marker">
  <span data-slot="icon">${info}</span>
  <span data-slot="content">Assistant is thinking…</span>
</div>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem">
  <div class="marker">
    <span data-slot="icon">${info}</span>
    <span data-slot="content">Assistant is thinking…</span>
  </div>
  <div class="marker" data-variant="separator">
    <span data-slot="content">Today</span>
  </div>
  <div class="marker" data-variant="border">
    <span data-slot="icon">${globe}</span>
    <span data-slot="content">Searched 3 sources · <a href="#">View sources</a></span>
  </div>
</div>`
    }
  ],
  attachment: [
    {
      title: "Default",
      html: `<div class="attachment">
  <div data-slot="media">${fileText}</div>
  <div data-slot="content">
    <span data-slot="title">report.pdf</span>
    <span data-slot="description">PDF · 2.4 MB</span>
  </div>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Remove report.pdf">×</button>
  </div>
</div>`
    },
    {
      title: "States",
      html: `<div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem">
  <div class="attachment">
    <div data-slot="media">${fileText}</div>
    <div data-slot="content">
      <span data-slot="title">report.pdf</span>
      <span data-slot="description">PDF · 2.4 MB</span>
    </div>
    <div data-slot="actions">
      <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Remove report.pdf">×</button>
    </div>
  </div>
  <div class="attachment" aria-busy="true">
    <div data-slot="media"><span class="spinner" data-size="sm"></span></div>
    <div data-slot="content">
      <span data-slot="title">sales-dashboard.csv</span>
      <span data-slot="description">Uploading · 64%</span>
    </div>
  </div>
  <div class="attachment">
    <div data-slot="media">${circleAlert}</div>
    <div data-slot="content">
      <span data-slot="title">workspace.zip</span>
      <span data-slot="description" role="alert">Upload failed. The file is larger than 10 MB.</span>
    </div>
  </div>
</div>`
    },
    {
      title: "Media",
      html: `<div class="attachment" data-orientation="vertical">
  <div data-slot="media">
    <img src="${ratioImage}" alt="Workspace preview">
  </div>
  <div data-slot="content">
    <span data-slot="title">cover.png</span>
    <span data-slot="description">PNG · 840 KB</span>
  </div>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="secondary" data-size="icon-xs" aria-label="Remove cover.png">×</button>
  </div>
</div>`
    }
  ],
  questionnaire: [
    {
      title: "Default",
      html: `<div class="questionnaire">
  <div data-slot="progress">
    <span data-slot="progress-label" id="questionnaire-default-progress" aria-live="polite">Question 1 of 1</span>
    <progress aria-labelledby="questionnaire-default-progress" value="1" max="1">1 of 1</progress>
  </div>
  <fieldset data-slot="item" aria-current="step">
    <legend>What should the agent build next?</legend>
    <p data-slot="description">Choose a direction or describe another task.</p>
    <div data-slot="choices">
      <label class="questionnaire-choice">
        <input type="radio" name="questionnaire-default" value="timeline" checked>
        <span data-slot="text">
          <span data-slot="label">Tool call timeline</span>
          <span data-slot="description">Show what the agent ran and what came back.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="radio" name="questionnaire-default" value="checkpoints">
        <span data-slot="text">
          <span data-slot="label">Approval checkpoints</span>
          <span data-slot="description">Ask before sensitive or destructive actions.</span>
        </span>
      </label>
      <input type="text" data-slot="input" name="questionnaire-default-other" aria-label="Another answer" placeholder="Type another answer…">
    </div>
  </fieldset>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="outline">Skip</button>
    <button type="button" class="btn">Submit</button>
  </div>
</div>`
    },
    {
      title: "Steps",
      html: `<div class="questionnaire" data-demo="questionnaire">
  <div data-slot="progress">
    <span data-slot="progress-label" id="questionnaire-progress" aria-live="polite">Question 1 of 2</span>
    <progress aria-labelledby="questionnaire-progress" value="1" max="2">1 of 2</progress>
  </div>
  <fieldset data-slot="item" aria-current="step">
    <legend>What should the agent build next?</legend>
    <p data-slot="description">Choose a direction or describe another task.</p>
    <div data-slot="choices">
      <label class="questionnaire-choice">
        <input type="radio" name="direction" value="timeline" checked>
        <span data-slot="text">
          <span data-slot="label">Tool call timeline</span>
          <span data-slot="description">Show what the agent ran and what came back.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="radio" name="direction" value="checkpoints">
        <span data-slot="text">
          <span data-slot="label">Approval checkpoints</span>
          <span data-slot="description">Ask before sensitive or destructive actions.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="radio" name="direction" value="handoffs">
        <span data-slot="text">
          <span data-slot="label">Sub-agent handoffs</span>
          <span data-slot="description">Make delegated work and results easier to follow.</span>
        </span>
      </label>
      <input type="text" data-slot="input" name="other" aria-label="Another answer" placeholder="Type another answer…">
    </div>
  </fieldset>
  <fieldset data-slot="item" hidden>
    <legend>What context should the agent inspect?</legend>
    <p data-slot="description">Select every source that may affect the implementation.</p>
    <div data-slot="choices">
      <label class="questionnaire-choice">
        <input type="checkbox" name="context" value="files">
        <span data-slot="text">
          <span data-slot="label">Relevant source files</span>
          <span data-slot="description">Components, styles and tests touched by the change.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="checkbox" name="context" value="tests" checked>
        <span data-slot="text">
          <span data-slot="label">Existing tests</span>
          <span data-slot="description">Unit and browser coverage for the affected area.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="checkbox" name="context" value="history">
        <span data-slot="text">
          <span data-slot="label">Recent commit history</span>
          <span data-slot="description">Changes that explain the current behavior.</span>
        </span>
      </label>
    </div>
  </fieldset>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="outline" data-demo-questionnaire-prev disabled>Previous</button>
    <button type="button" class="btn" data-demo-questionnaire-next>Next</button>
  </div>
</div>`
    }
  ],
  trace: [
    {
      title: "Default",
      html: `<details class="trace" open>
  <summary>
    <span data-slot="icon">${terminal}</span>
    <span data-slot="title">Ran pnpm install</span>
    <span data-slot="status" data-variant="success">Completed</span>
  </summary>
  <div data-slot="body">
    <p>Dependencies installed in 2.8s.</p>
  </div>
</details>`
    },
    {
      title: "Tool calls",
      html: `<div style="display: flex; flex-direction: column">
  <details class="trace" open>
    <summary>
      <span data-slot="icon">${terminal}</span>
      <span data-slot="title">Ran pnpm install</span>
      <span data-slot="status" data-variant="error">Failed</span>
    </summary>
    <div data-slot="body">
      <p>The frozen install failed because the lockfile is out of date.</p>
      <a data-slot="source" href="#">pnpm install logs</a>
    </div>
  </details>
  <details class="trace" aria-busy="true">
    <summary>
      <span data-slot="icon"><span class="spinner" data-size="sm"></span></span>
      <span data-slot="title">Running pnpm build</span>
      <span data-slot="status">Running</span>
    </summary>
    <div data-slot="body">
      <p>Compiling the registry and the docs site.</p>
    </div>
  </details>
  <details class="trace">
    <summary>
      <span data-slot="icon">${search}</span>
      <span data-slot="title">Searched for minimumReleaseAge</span>
      <span data-slot="status" data-variant="success">8 results</span>
    </summary>
    <div data-slot="body">
      <details class="trace">
        <summary>
          <span data-slot="icon">${globe}</span>
          <span data-slot="title">Read pnpm.io settings</span>
        </summary>
        <div data-slot="body">
          <p>minimumReleaseAge delays newly published versions.</p>
        </div>
      </details>
    </div>
  </details>
</div>`
    }
  ],
  "message-scroller": [
    {
      title: "Default",
      html: `<div class="message-scroller" data-demo="message-scroller" style="height: 22rem">
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
  <button type="button" data-slot="jump" data-demo-scroll-end aria-label="Jump to latest">${arrowDown}</button>
</div>`
    }
  ]
};
