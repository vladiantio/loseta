import type { Example } from "./types";
import { bell, building, check, creditCard, logOut, mail, messageSquare, monitor, moon, pencil, settings, share, submenuIcon, sun, trash, user, wallet } from "./icons";

export const dropdownMenuExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Open menu
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <div role="heading" aria-level="2">My account</div>
      <button type="button" role="menuitem">Profile</button>
      <button type="button" role="menuitem">Billing</button>
      <button type="button" role="menuitem">Settings</button>
      <div role="separator"></div>
      <button type="button" role="menuitem">GitHub</button>
      <button type="button" role="menuitem">Support</button>
      <button type="button" role="menuitem" disabled>API</button>
    </div>
  </div>
</div>`
    },
    {
      title: "Submenu",
      html: `<div style="display: flex; width: 100%; align-items: flex-start; justify-content: flex-start; min-height: 24rem; padding-top: 1rem">
  <div class="dropdown-menu">
    <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
      Open team menu
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" style="min-width: 10rem">
      <div role="menu">
        <button type="button" role="menuitem">Team</button>
        <div role="none">
          <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-dropdown-submenu-invite">
            Invite users
            ${submenuIcon}
          </button>
          <div data-popover data-side="inline-end" id="demo-dropdown-submenu-invite" aria-hidden="true">
            <div role="menu">
              <button type="button" role="menuitem">Email</button>
              <button type="button" role="menuitem">Message</button>
              <div role="none">
                <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-dropdown-submenu-more">
                  More options
                  ${submenuIcon}
                </button>
                <div data-popover data-side="inline-end" id="demo-dropdown-submenu-more" aria-hidden="true">
                  <div role="menu">
                    <button type="button" role="menuitem">Calendly</button>
                    <button type="button" role="menuitem">Slack</button>
                    <div role="separator"></div>
                    <button type="button" role="menuitem">Webhook</button>
                  </div>
                </div>
              </div>
              <div role="separator"></div>
              <button type="button" role="menuitem">Advanced...</button>
            </div>
          </div>
        </div>
        <button type="button" role="menuitem">New Team <span data-slot="shortcut">⌘T</span></button>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Shortcuts",
      html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Open shortcuts
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <div role="heading" aria-level="2">My account</div>
      <button type="button" role="menuitem">Profile <span data-slot="shortcut">⇧⌘P</span></button>
      <button type="button" role="menuitem">Billing <span data-slot="shortcut">⌘B</span></button>
      <button type="button" role="menuitem">Settings <span data-slot="shortcut">⌘S</span></button>
      <div role="separator"></div>
      <button type="button" role="menuitem">Log out <span data-slot="shortcut">⇧⌘Q</span></button>
    </div>
  </div>
</div>`
    },
    {
      title: "Icons",
      html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Open account actions
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <button type="button" role="menuitem">${user} Profile</button>
      <button type="button" role="menuitem">${creditCard} Billing</button>
      <button type="button" role="menuitem">${settings} Settings</button>
      <div role="separator"></div>
      <button type="button" role="menuitem" data-variant="destructive">${logOut} Log out</button>
    </div>
  </div>
</div>`
    },
    {
      title: "Checkboxes",
      html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Open appearance
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <div role="heading" aria-level="2">Appearance</div>
      <button type="button" role="menuitemcheckbox" aria-checked="true">
        Status Bar
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemcheckbox" aria-checked="true" disabled>
        Activity Bar
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemcheckbox" aria-checked="false">
        Panel
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
    </div>
  </div>
</div>`
    },
    {
      title: "Checkboxes icons",
      html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Notifications
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" style="min-width: 12rem">
    <div role="menu">
      <div role="heading" aria-level="2">Notification preferences</div>
      <button type="button" role="menuitemcheckbox" aria-checked="true">
        ${mail} Email notifications
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemcheckbox" aria-checked="false">
        ${messageSquare} SMS notifications
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemcheckbox" aria-checked="true">
        ${bell} Push notifications
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
    </div>
  </div>
</div>`
    },
    {
      title: "Radio group",
      html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Open panel position
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <div role="group" aria-label="Panel position">
        <div role="heading" aria-level="2">Panel position</div>
        <button type="button" role="menuitemradio" aria-checked="false">
          Top
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="true">
          Bottom
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="false">
          Right
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </button>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Radio icons",
      html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Payment method
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" style="min-width: 11rem">
    <div role="menu">
      <div role="group" aria-label="Select payment method">
        <div role="heading" aria-level="2">Select payment method</div>
        <button type="button" role="menuitemradio" aria-checked="true">
          ${creditCard} Credit Card
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="false">
          ${wallet} PayPal
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="false">
          ${building} Bank Transfer
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </button>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Destructive",
      html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Actions
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <button type="button" role="menuitem">${pencil} Edit</button>
      <button type="button" role="menuitem">${share} Share</button>
      <div role="separator"></div>
      <button type="button" role="menuitem" data-variant="destructive">${trash} Delete</button>
    </div>
  </div>
</div>`
    },
    {
      title: "Avatar",
      html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="ghost" data-size="icon" aria-haspopup="menu" aria-expanded="false" aria-label="Open account menu for LR" style="border-radius: var(--radius-full)">
    <span class="avatar" aria-hidden="true"><span data-slot="fallback">LR</span></span>
  </button>
  <div data-popover data-side="bottom" data-align="end" aria-hidden="true">
    <div role="menu">
      <div role="heading" aria-level="2">Ada Lovelace</div>
      <button type="button" role="menuitem">${user} Account</button>
      <button type="button" role="menuitem">${creditCard} Billing</button>
      <button type="button" role="menuitem">${bell} Notifications</button>
      <div role="separator"></div>
      <button type="button" role="menuitem">${logOut} Sign out</button>
    </div>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div style="display: flex; width: 100%; align-items: flex-start; justify-content: flex-start; min-height: 24rem; padding-top: 1rem" dir="rtl">
  <div class="dropdown-menu" dir="rtl" lang="ar">
    <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
      افتح القائمة
    </button>
    <div data-popover data-side="bottom" aria-hidden="true" style="min-width: 12rem">
      <div role="menu">
        <div role="heading" aria-level="2">الحساب</div>
        <div role="none">
          <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-dropdown-rtl-settings">
            ${settings} الإعدادات
            ${submenuIcon}
          </button>
          <div data-popover data-side="inline-end" aria-hidden="true" id="demo-dropdown-rtl-settings">
            <div role="menu">
              <button type="button" role="menuitem">${user} الملف الشخصي</button>
              <button type="button" role="menuitem">${creditCard} الفوترة</button>
              <button type="button" role="menuitem">${bell} الإشعارات</button>
            </div>
          </div>
        </div>
        <button type="button" role="menuitem">الفريق <span data-slot="shortcut">⌘T</span></button>
        <div role="separator"></div>
        <div role="group" aria-label="السمة">
          <div role="heading" aria-level="2">السمة</div>
          <button type="button" role="menuitemradio" aria-checked="true">
            ${sun} فاتح
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <button type="button" role="menuitemradio" aria-checked="false">
            ${moon} غامق
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <button type="button" role="menuitemradio" aria-checked="false">
            ${monitor} النظام
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
        </div>
        <div role="separator"></div>
        <button type="button" role="menuitem" data-variant="destructive">${logOut} تسجيل الخروج</button>
      </div>
    </div>
  </div>
</div>`
    }
];
