import type { Example } from "./types";
import {
  creditCard,
  fileText,
  folder,
  messageSquare,
  search,
  settings,
  user
} from "./icons";

export const commandExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="command" data-demo="command" style="width: 100%; max-width: 24rem">
  <div class="input-group" role="group" aria-label="Search commands">
    <input class="input" type="text" placeholder="Type a command..." aria-label="Search commands" data-demo-command-input>
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
  </div>
  <div role="listbox" aria-label="Commands">
    <div role="group" aria-labelledby="demo-command-default-suggestions">
      <div data-slot="label" id="demo-command-default-suggestions">Suggestions</div>
      <div role="option" data-demo-option>
        ${fileText}
        <span data-slot="text">Documents</span>
        <span data-slot="shortcut">⌘D</span>
      </div>
      <div role="option" data-demo-option>
        ${folder}
        <span data-slot="text">Folders</span>
      </div>
      <div role="option" data-demo-option>
        ${messageSquare}
        <span data-slot="text">Messages</span>
      </div>
    </div>
    <div role="separator" aria-hidden="true"></div>
    <div role="group" aria-labelledby="demo-command-default-account">
      <div data-slot="label" id="demo-command-default-account">Account</div>
      <div role="option" data-demo-option>
        ${user}
        <span data-slot="text">Profile</span>
        <span data-slot="shortcut">⌘P</span>
      </div>
      <div role="option" data-demo-option>
        ${creditCard}
        <span data-slot="text">Billing</span>
        <span data-slot="shortcut">⌘B</span>
      </div>
      <div role="option" data-demo-option>
        ${settings}
        <span data-slot="text">Settings</span>
        <span data-slot="shortcut">⌘S</span>
      </div>
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
              ${fileText}
              <span data-slot="text">Go home</span>
              <span data-slot="shortcut">⌘H</span>
            </div>
            <div role="option" data-demo-option>
              ${messageSquare}
              <span data-slot="text">Open inbox</span>
              <span data-slot="shortcut">⌘I</span>
            </div>
            <div role="option" data-demo-option>
              ${folder}
              <span data-slot="text">Open settings</span>
              <span data-slot="shortcut">⌘,</span>
            </div>
          </div>
          <div role="separator" aria-hidden="true"></div>
          <div role="group" aria-labelledby="command-group-actions">
            <div data-slot="label" id="command-group-actions">Actions</div>
            <div role="option" data-demo-option>
              ${fileText}
              <span data-slot="text">Copy link</span>
            </div>
            <div role="option" data-demo-option>
              ${folder}
              <span data-slot="text">Download</span>
            </div>
          </div>
          <div role="separator" aria-hidden="true"></div>
          <div role="group" aria-labelledby="command-group-account">
            <div data-slot="label" id="command-group-account">Account</div>
            <div role="option" data-demo-option>
              ${user}
              <span data-slot="text">Profile</span>
              <span data-slot="shortcut">⌘P</span>
            </div>
            <div role="option" data-demo-option>
              ${creditCard}
              <span data-slot="text">Billing</span>
              <span data-slot="shortcut">⌘B</span>
            </div>
            <div role="option" data-demo-option>
              ${settings}
              <span data-slot="text">Settings</span>
              <span data-slot="shortcut">⌘S</span>
            </div>
          </div>
          <div data-slot="empty" hidden>No commands found.</div>
        </div>
      </div>
    </section>
  </div>
</dialog>`
    },
    {
      title: "Shortcuts",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-command-shortcuts">
  Open shortcuts
</button>

<dialog class="dialog" id="demo-command-shortcuts" aria-labelledby="command-shortcuts-title" aria-describedby="command-shortcuts-description">
  <div>
    <header>
      <h2 data-slot="title" id="command-shortcuts-title">Keyboard shortcuts</h2>
      <p data-slot="description" id="command-shortcuts-description">Jump to a command without leaving the keyboard.</p>
    </header>
    <section>
      <div class="command" data-demo="command">
        <div class="input-group" role="group" aria-label="Search shortcuts">
          <input class="input" type="text" placeholder="Search shortcuts..." aria-label="Search shortcuts" data-demo-command-input autofocus>
          <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
        </div>
        <div role="listbox" aria-label="Shortcuts">
          <div role="group" aria-labelledby="command-shortcuts-navigation">
            <div data-slot="label" id="command-shortcuts-navigation">Navigation</div>
            <div role="option" data-demo-option>
              <span data-slot="text">Go home</span>
              <span data-slot="shortcut">⌘H</span>
            </div>
            <div role="option" data-demo-option>
              <span data-slot="text">Open inbox</span>
              <span data-slot="shortcut">⌘I</span>
            </div>
            <div role="option" data-demo-option>
              <span data-slot="text">Open documents</span>
              <span data-slot="shortcut">⌘D</span>
            </div>
          </div>
          <div role="separator" aria-hidden="true"></div>
          <div role="group" aria-labelledby="command-shortcuts-editing">
            <div data-slot="label" id="command-shortcuts-editing">Editing</div>
            <div role="option" data-demo-option>
              <span data-slot="text">New file</span>
              <span data-slot="shortcut">⌘N</span>
            </div>
            <div role="option" data-demo-option>
              <span data-slot="text">Copy</span>
              <span data-slot="shortcut">⌘C</span>
            </div>
            <div role="option" data-demo-option>
              <span data-slot="text">Paste</span>
              <span data-slot="shortcut">⌘V</span>
            </div>
            <div role="option" data-demo-option>
              <span data-slot="text">Select all</span>
              <span data-slot="shortcut">⌘A</span>
            </div>
          </div>
          <div data-slot="empty" hidden>No shortcuts found.</div>
        </div>
      </div>
    </section>
  </div>
</dialog>`
    },
    {
      title: "Scrollable",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-command-scrollable">
  Open all commands
</button>

<dialog class="dialog" id="demo-command-scrollable" aria-labelledby="command-scrollable-title" aria-describedby="command-scrollable-description">
  <div>
    <header>
      <h2 data-slot="title" id="command-scrollable-title">All commands</h2>
      <p data-slot="description" id="command-scrollable-description">The list scrolls when the commands exceed its height.</p>
    </header>
    <section>
      <div class="command" data-demo="command">
        <div class="input-group" role="group" aria-label="Search commands">
          <input class="input" type="text" placeholder="Type a command..." aria-label="Search commands" data-demo-command-input autofocus>
          <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
        </div>
        <div role="listbox" aria-label="Commands">
          <div role="group" aria-labelledby="command-scrollable-navigation">
            <div data-slot="label" id="command-scrollable-navigation">Navigation</div>
            <div role="option" data-demo-option><span data-slot="text">Go home</span><span data-slot="shortcut">⌘H</span></div>
            <div role="option" data-demo-option><span data-slot="text">Open inbox</span><span data-slot="shortcut">⌘I</span></div>
            <div role="option" data-demo-option><span data-slot="text">Open documents</span><span data-slot="shortcut">⌘D</span></div>
            <div role="option" data-demo-option><span data-slot="text">Open folders</span><span data-slot="shortcut">⌘F</span></div>
            <div role="option" data-demo-option><span data-slot="text">Open messages</span><span data-slot="shortcut">⌘M</span></div>
          </div>
          <div role="separator" aria-hidden="true"></div>
          <div role="group" aria-labelledby="command-scrollable-actions">
            <div data-slot="label" id="command-scrollable-actions">Actions</div>
            <div role="option" data-demo-option><span data-slot="text">New file</span><span data-slot="shortcut">⌘N</span></div>
            <div role="option" data-demo-option><span data-slot="text">New folder</span><span data-slot="shortcut">⇧⌘N</span></div>
            <div role="option" data-demo-option><span data-slot="text">Copy</span><span data-slot="shortcut">⌘C</span></div>
            <div role="option" data-demo-option><span data-slot="text">Cut</span><span data-slot="shortcut">⌘X</span></div>
            <div role="option" data-demo-option><span data-slot="text">Paste</span><span data-slot="shortcut">⌘V</span></div>
            <div role="option" data-demo-option><span data-slot="text">Delete</span><span data-slot="shortcut">⌫</span></div>
          </div>
          <div role="separator" aria-hidden="true"></div>
          <div role="group" aria-labelledby="command-scrollable-view">
            <div data-slot="label" id="command-scrollable-view">View</div>
            <div role="option" data-demo-option><span data-slot="text">Grid view</span></div>
            <div role="option" data-demo-option><span data-slot="text">List view</span></div>
            <div role="option" data-demo-option><span data-slot="text">Zoom in</span><span data-slot="shortcut">⌘+</span></div>
            <div role="option" data-demo-option><span data-slot="text">Zoom out</span><span data-slot="shortcut">⌘-</span></div>
          </div>
          <div role="separator" aria-hidden="true"></div>
          <div role="group" aria-labelledby="command-scrollable-account">
            <div data-slot="label" id="command-scrollable-account">Account</div>
            <div role="option" data-demo-option><span data-slot="text">Profile</span><span data-slot="shortcut">⌘P</span></div>
            <div role="option" data-demo-option><span data-slot="text">Billing</span><span data-slot="shortcut">⌘B</span></div>
            <div role="option" data-demo-option><span data-slot="text">Notifications</span></div>
            <div role="option" data-demo-option><span data-slot="text">Help and support</span></div>
          </div>
          <div data-slot="empty" hidden>No commands found.</div>
        </div>
      </div>
    </section>
  </div>
</dialog>`
    },
    {
      title: "Card",
      html: `<div class="card" data-size="sm" style="width: 100%; max-width: 24rem">
  <header>
    <h2 data-slot="title">Quick actions</h2>
    <p data-slot="description">Search the workspace from this card.</p>
  </header>
  <section>
    <div class="command" data-demo="command">
      <div class="input-group" role="group" aria-label="Search commands">
        <input class="input" type="text" placeholder="Type a command..." aria-label="Search commands" data-demo-command-input>
        <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
      </div>
      <div role="listbox" aria-label="Commands">
        <div role="group" aria-labelledby="command-card-files">
          <div data-slot="label" id="command-card-files">Files</div>
          <div role="option" data-demo-option>
            ${fileText}
            <span data-slot="text">Documents</span>
            <span data-slot="shortcut">⌘D</span>
          </div>
          <div role="option" data-demo-option>
            ${folder}
            <span data-slot="text">Folders</span>
          </div>
        </div>
        <div role="separator" aria-hidden="true"></div>
        <div role="group" aria-labelledby="command-card-account">
          <div data-slot="label" id="command-card-account">Account</div>
          <div role="option" data-demo-option>
            ${user}
            <span data-slot="text">Profile</span>
            <span data-slot="shortcut">⌘P</span>
          </div>
          <div role="option" data-demo-option>
            ${settings}
            <span data-slot="text">Settings</span>
            <span data-slot="shortcut">⌘S</span>
          </div>
        </div>
        <div data-slot="empty" hidden>No commands found.</div>
      </div>
    </div>
  </section>
</div>`
    },
    {
      title: "Popover",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 20rem">
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-command-popover-panel">
      Open command menu
    </button>
    <div data-popover data-side="bottom" data-align="start" id="demo-command-popover-panel" role="dialog" tabindex="-1" aria-labelledby="demo-command-popover-title" aria-hidden="true">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-command-popover-title">Commands</h3>
      </header>
      <div class="command" data-demo="command">
        <div class="input-group" role="group" aria-label="Search commands">
          <input class="input" type="text" placeholder="Type a command..." aria-label="Search commands" data-demo-command-input>
          <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
        </div>
        <div role="listbox" aria-label="Commands">
          <div role="group" aria-labelledby="command-popover-files">
            <div data-slot="label" id="command-popover-files">Files</div>
            <div role="option" data-demo-option>
              ${fileText}
              <span data-slot="text">Documents</span>
            </div>
            <div role="option" data-demo-option>
              ${folder}
              <span data-slot="text">Folders</span>
            </div>
          </div>
          <div role="separator" aria-hidden="true"></div>
          <div role="group" aria-labelledby="command-popover-account">
            <div data-slot="label" id="command-popover-account">Account</div>
            <div role="option" data-demo-option>
              ${settings}
              <span data-slot="text">Settings</span>
              <span data-slot="shortcut">⌘S</span>
            </div>
          </div>
          <div data-slot="empty" hidden>No commands found.</div>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="width: 100%; max-width: 24rem">
  <div class="command" data-demo="command">
    <div class="input-group" role="group" aria-label="ابحث عن الأوامر">
      <input class="input" type="text" placeholder="اكتب أمرًا..." aria-label="ابحث عن الأوامر" data-demo-command-input>
      <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
    </div>
    <div role="listbox" aria-label="الأوامر">
      <div role="group" aria-labelledby="command-rtl-suggestions">
        <div data-slot="label" id="command-rtl-suggestions">اقتراحات</div>
        <div role="option" data-demo-option>
          ${fileText}
          <span data-slot="text">المستندات</span>
          <span data-slot="shortcut">⌘D</span>
        </div>
        <div role="option" data-demo-option>
          ${folder}
          <span data-slot="text">المجلدات</span>
        </div>
      </div>
      <div role="separator" aria-hidden="true"></div>
      <div role="group" aria-labelledby="command-rtl-account">
        <div data-slot="label" id="command-rtl-account">الحساب</div>
        <div role="option" data-demo-option>
          ${user}
          <span data-slot="text">الملف الشخصي</span>
          <span data-slot="shortcut">⌘P</span>
        </div>
        <div role="option" data-demo-option>
          ${settings}
          <span data-slot="text">الإعدادات</span>
          <span data-slot="shortcut">⌘S</span>
        </div>
      </div>
      <div data-slot="empty" hidden>لا توجد نتائج.</div>
    </div>
  </div>
</div>`
    }
];
