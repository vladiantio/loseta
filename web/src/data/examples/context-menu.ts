import type { Example } from "./types";
import { check, clipboardPaste, copy, pencil, scissors, share, submenuIcon, trash } from "./icons";

export const contextMenuExamples: Example[] = [
    {
      title: "Default",
      html: `<div tabindex="0" aria-haspopup="menu" aria-controls="demo-context-1" style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" id="demo-context-1" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <button type="button" role="menuitem">Profile</button>
    <button type="button" role="menuitem">Billing</button>
    <button type="button" role="menuitem">Team</button>
    <button type="button" role="menuitem">Subscription</button>
  </div>
</div>`
    },
    {
      title: "Submenu",
      html: `<div tabindex="0" aria-haspopup="menu" aria-controls="demo-context-2" style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" id="demo-context-2" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <button type="button" role="menuitem">Copy <span data-slot="shortcut">⌘C</span></button>
    <button type="button" role="menuitem">Cut <span data-slot="shortcut">⌘X</span></button>
    <div role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-context-submenu-more">
        More tools
        ${submenuIcon}
      </button>
      <div data-popover data-side="inline-end" id="demo-context-submenu-more" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">Save page...</button>
          <button type="button" role="menuitem">Create shortcut...</button>
          <button type="button" role="menuitem">Name window...</button>
          <div role="separator"></div>
          <button type="button" role="menuitem">Developer tools</button>
          <div role="separator"></div>
          <button type="button" role="menuitem" data-variant="destructive">Delete</button>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Shortcuts",
      html: `<div tabindex="0" aria-haspopup="menu" aria-controls="demo-context-3" style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" id="demo-context-3" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <button type="button" role="menuitem">Back <span data-slot="shortcut">⌘[</span></button>
    <button type="button" role="menuitem" disabled>Forward <span data-slot="shortcut">⌘]</span></button>
    <button type="button" role="menuitem">Reload <span data-slot="shortcut">⌘R</span></button>
    <div role="separator"></div>
    <button type="button" role="menuitem">Save <span data-slot="shortcut">⌘S</span></button>
    <button type="button" role="menuitem">Save as... <span data-slot="shortcut">⇧⌘S</span></button>
  </div>
</div>`
    },
    {
      title: "Groups",
      html: `<div tabindex="0" aria-haspopup="menu" aria-controls="demo-context-4" style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" id="demo-context-4" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <div role="group" aria-label="File">
      <div role="heading" aria-level="2">File</div>
      <button type="button" role="menuitem">New file <span data-slot="shortcut">⌘N</span></button>
      <button type="button" role="menuitem">Open file <span data-slot="shortcut">⌘O</span></button>
      <button type="button" role="menuitem">Save <span data-slot="shortcut">⌘S</span></button>
    </div>
    <div role="separator"></div>
    <div role="group" aria-label="Edit">
      <div role="heading" aria-level="2">Edit</div>
      <button type="button" role="menuitem">Undo <span data-slot="shortcut">⌘Z</span></button>
      <button type="button" role="menuitem">Redo <span data-slot="shortcut">⇧⌘Z</span></button>
    </div>
    <div role="separator"></div>
    <div role="group" aria-label="Clipboard">
      <button type="button" role="menuitem">Cut <span data-slot="shortcut">⌘X</span></button>
      <button type="button" role="menuitem">Copy <span data-slot="shortcut">⌘C</span></button>
      <button type="button" role="menuitem">Paste <span data-slot="shortcut">⌘V</span></button>
    </div>
    <div role="separator"></div>
    <button type="button" role="menuitem" data-variant="destructive">Delete <span data-slot="shortcut">⌫</span></button>
  </div>
</div>`
    },
    {
      title: "Icons",
      html: `<div tabindex="0" aria-haspopup="menu" aria-controls="demo-context-5" style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" id="demo-context-5" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <button type="button" role="menuitem">${copy} Copy</button>
    <button type="button" role="menuitem">${scissors} Cut</button>
    <button type="button" role="menuitem">${clipboardPaste} Paste</button>
    <div role="separator"></div>
    <button type="button" role="menuitem" data-variant="destructive">${trash} Delete</button>
  </div>
</div>`
    },
    {
      title: "Checkboxes",
      html: `<div tabindex="0" aria-haspopup="menu" aria-controls="demo-context-6" style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" id="demo-context-6" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <button type="button" role="menuitemcheckbox" aria-checked="true">
      Show bookmarks bar
      <span data-slot="indicator" aria-hidden="true">${check}</span>
    </button>
    <button type="button" role="menuitemcheckbox" aria-checked="false">
      Show full URLs
      <span data-slot="indicator" aria-hidden="true">${check}</span>
    </button>
    <button type="button" role="menuitemcheckbox" aria-checked="true">
      Show developer tools
      <span data-slot="indicator" aria-hidden="true">${check}</span>
    </button>
  </div>
</div>`
    },
    {
      title: "Radio",
      html: `<div tabindex="0" aria-haspopup="menu" aria-controls="demo-context-7" style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" id="demo-context-7" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <div role="group" aria-label="People">
      <div role="heading" aria-level="2">People</div>
      <button type="button" role="menuitemradio" aria-checked="true">
        Pedro Duarte
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemradio" aria-checked="false">
        Colm Tuite
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
    </div>
    <div role="separator"></div>
    <div role="group" aria-label="Theme">
      <div role="heading" aria-level="2">Theme</div>
      <button type="button" role="menuitemradio" aria-checked="true">
        Light
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemradio" aria-checked="false">
        Dark
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemradio" aria-checked="false">
        System
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
    </div>
  </div>
</div>`
    },
    {
      title: "Destructive",
      html: `<div tabindex="0" aria-haspopup="menu" aria-controls="demo-context-8" style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" id="demo-context-8" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <button type="button" role="menuitem">${pencil} Edit</button>
    <button type="button" role="menuitem">${share} Share</button>
    <div role="separator"></div>
    <button type="button" role="menuitem" data-variant="destructive">${trash} Delete</button>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div tabindex="0" aria-haspopup="menu" aria-controls="demo-context-9" dir="rtl" lang="ar" style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>انقر بزر الماوس الأيمن هنا.</p>
  <div class="context-menu" id="demo-context-9" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <button type="button" role="menuitem">رجوع <span data-slot="shortcut">⌘[</span></button>
    <button type="button" role="menuitem" disabled>تقدم <span data-slot="shortcut">⌘]</span></button>
    <button type="button" role="menuitem">إعادة تحميل <span data-slot="shortcut">⌘R</span></button>
    <div role="separator"></div>
    <button type="button" role="menuitemcheckbox" aria-checked="true">
      إظهار الإشارات المرجعية
      <span data-slot="indicator" aria-hidden="true">${check}</span>
    </button>
    <div role="separator"></div>
    <div role="group" aria-label="الأشخاص">
      <div role="heading" aria-level="2">الأشخاص</div>
      <button type="button" role="menuitemradio" aria-checked="true">
        بيدرو دوارتي
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemradio" aria-checked="false">
        كولم تويت
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
    </div>
  </div>
</div>`
    }
];
