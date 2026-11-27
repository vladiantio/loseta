import type { Example } from "./types";
import {
  badgeCheck,
  bell,
  building,
  calendarIcon,
  check,
  copy,
  creditCard,
  logOut,
  mail,
  messageSquare,
  pencil,
  scissors,
  settings,
  share,
  submenuIcon,
  trash,
  user,
  wallet
} from "./icons";

export const dropdownMenuExamples: Example[] = [
  {
    title: "Default",
    html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Open
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <div role="heading" aria-level="2">My Account</div>
      <button type="button" role="menuitem">Profile</button>
      <button type="button" role="menuitem">Billing</button>
      <button type="button" role="menuitem">Settings</button>
      <div role="separator"></div>
      <button type="button" role="menuitem">GitHub</button>
      <button type="button" role="menuitem" disabled>API</button>
      <button type="button" role="menuitem">Support</button>
    </div>
  </div>
</div>`
  },
  {
    title: "Submenu",
    html: `<div style="display: flex; width: 100%; align-items: flex-start; justify-content: flex-start; min-height: 24rem; padding-top: 1rem">
  <div class="dropdown-menu">
    <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
      Open
    </button>
    <div data-popover data-side="bottom" aria-hidden="true">
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
              <div role="separator"></div>
              <button type="button" role="menuitem">More...</button>
            </div>
          </div>
        </div>
        <button type="button" role="menuitem">New Team <span data-slot="shortcut">⌘+T</span></button>
      </div>
    </div>
  </div>
</div>`
  },
  {
    title: "Shortcuts",
    html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Open
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <div role="heading" aria-level="2">My Account</div>
      <button type="button" role="menuitem">Profile <span data-slot="shortcut">⇧⌘P</span></button>
      <button type="button" role="menuitem">Billing <span data-slot="shortcut">⌘B</span></button>
      <button type="button" role="menuitem">Settings <span data-slot="shortcut">⌘S</span></button>
      <button type="button" role="menuitem">Shortcuts <span data-slot="shortcut">⌘K</span></button>
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
    Open
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
    Open
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <div role="heading" aria-level="2">Appearance</div>
      <button type="button" role="menuitemcheckbox" aria-checked="true">
        Status Bar
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemcheckbox" aria-checked="false" disabled>
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
  <div data-popover data-side="bottom" aria-hidden="true" style="min-width: 14rem">
    <div role="menu">
      <div role="heading" aria-level="2">Notification Preferences</div>
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
    Open
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <div role="heading" aria-level="2">Panel Position</div>
      <div role="group" aria-label="Panel Position">
        <button type="button" role="menuitemradio" aria-checked="false">
          Top
          <span data-slot="indicator" aria-hidden="true"></span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="true">
          Bottom
          <span data-slot="indicator" aria-hidden="true"></span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="false">
          Right
          <span data-slot="indicator" aria-hidden="true"></span>
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
    Payment Method
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" style="min-width: 14rem">
    <div role="menu">
      <div role="heading" aria-level="2">Select Payment Method</div>
      <div role="group" aria-label="Select Payment Method">
        <button type="button" role="menuitemradio" aria-checked="true">
          ${creditCard} Credit Card
          <span data-slot="indicator" aria-hidden="true"></span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="false">
          ${wallet} PayPal
          <span data-slot="indicator" aria-hidden="true"></span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="false">
          ${building} Bank Transfer
          <span data-slot="indicator" aria-hidden="true"></span>
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
      <button type="button" role="menuitem">${badgeCheck} Account</button>
      <button type="button" role="menuitem">${creditCard} Billing</button>
      <button type="button" role="menuitem">${bell} Notifications</button>
      <div role="separator"></div>
      <button type="button" role="menuitem">${logOut} Sign Out</button>
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
    <div data-popover data-side="bottom" aria-hidden="true" style="min-width: 9rem">
      <div role="menu">
        <div role="none">
          <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-dropdown-rtl-account">
            الحساب
            ${submenuIcon}
          </button>
          <div data-popover data-side="inline-end" id="demo-dropdown-rtl-account" aria-hidden="true">
            <div role="menu">
              <button type="button" role="menuitem">${user} الملف الشخصي</button>
              <button type="button" role="menuitem">${creditCard} الفوترة</button>
              <button type="button" role="menuitem">${settings} الإعدادات</button>
            </div>
          </div>
        </div>
        <div role="separator"></div>
        <div role="heading" aria-level="2">الفريق</div>
        <button type="button" role="menuitem">الفريق</button>
        <div role="none">
          <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-dropdown-rtl-invite">
            دعوة المستخدمين
            ${submenuIcon}
          </button>
          <div data-popover data-side="inline-end" id="demo-dropdown-rtl-invite" aria-hidden="true">
            <div role="menu">
              <button type="button" role="menuitem">${mail} البريد الإلكتروني</button>
              <button type="button" role="menuitem">${messageSquare} رسالة</button>
              <div role="none">
                <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-dropdown-rtl-more">
                  المزيد
                  ${submenuIcon}
                </button>
                <div data-popover data-side="inline-end" id="demo-dropdown-rtl-more" aria-hidden="true">
                  <div role="menu">
                    <button type="button" role="menuitem">${calendarIcon} تقويم</button>
                    <button type="button" role="menuitem">${messageSquare} دردشة</button>
                    <div role="separator"></div>
                    <button type="button" role="menuitem">خطاف ويب</button>
                  </div>
                </div>
              </div>
              <div role="separator"></div>
              <button type="button" role="menuitem">متقدم...</button>
            </div>
          </div>
        </div>
        <button type="button" role="menuitem">فريق جديد <span data-slot="shortcut">⌘+T</span></button>
        <div role="separator"></div>
        <div role="heading" aria-level="2">عرض</div>
        <button type="button" role="menuitemcheckbox" aria-checked="true">
          شريط الحالة
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </button>
        <button type="button" role="menuitemcheckbox" aria-checked="false">
          شريط النشاط
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </button>
        <button type="button" role="menuitemcheckbox" aria-checked="false">
          اللوحة
          <span data-slot="indicator" aria-hidden="true">${check}</span>
        </button>
        <div role="separator"></div>
        <div role="heading" aria-level="2">الموضع</div>
        <div role="group" aria-label="الموضع">
          <button type="button" role="menuitemradio" aria-checked="false">
            أعلى
            <span data-slot="indicator" aria-hidden="true"></span>
          </button>
          <button type="button" role="menuitemradio" aria-checked="true">
            أسفل
            <span data-slot="indicator" aria-hidden="true"></span>
          </button>
          <button type="button" role="menuitemradio" aria-checked="false">
            يمين
            <span data-slot="indicator" aria-hidden="true"></span>
          </button>
          <button type="button" role="menuitemradio" aria-checked="false">
            يسار
            <span data-slot="indicator" aria-hidden="true"></span>
          </button>
        </div>
        <div role="separator"></div>
        <button type="button" role="menuitem" data-variant="destructive">${logOut} تسجيل الخروج</button>
      </div>
    </div>
  </div>
</div>`
  },
  {
    title: "Inset",
    html: `<div class="dropdown-menu">
  <button type="button" class="btn" data-variant="outline" aria-haspopup="menu" aria-expanded="false">
    Open
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" style="min-width: 11rem">
    <div role="menu">
      <div role="heading" aria-level="2" data-inset>Actions</div>
      <button type="button" role="menuitem">${copy} Copy</button>
      <button type="button" role="menuitem">${scissors} Cut</button>
      <button type="button" role="menuitem" data-inset>Paste</button>
      <div role="separator"></div>
      <div role="heading" aria-level="2" data-inset>Appearance</div>
      <button type="button" role="menuitemcheckbox" aria-checked="true">
        Bookmarks
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <button type="button" role="menuitemcheckbox" aria-checked="false">
        Full URLs
        <span data-slot="indicator" aria-hidden="true">${check}</span>
      </button>
      <div role="separator"></div>
      <div role="heading" aria-level="2" data-inset>Theme</div>
      <div role="group" aria-label="Theme">
        <button type="button" role="menuitemradio" aria-checked="false">
          Light
          <span data-slot="indicator" aria-hidden="true"></span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="false">
          Dark
          <span data-slot="indicator" aria-hidden="true"></span>
        </button>
        <button type="button" role="menuitemradio" aria-checked="true">
          System
          <span data-slot="indicator" aria-hidden="true"></span>
        </button>
      </div>
      <div role="separator"></div>
      <div role="none">
        <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-dropdown-inset-more" data-inset>
          More Options
          ${submenuIcon}
        </button>
        <div data-popover data-side="inline-end" id="demo-dropdown-inset-more" aria-hidden="true">
          <div role="menu">
            <button type="button" role="menuitem">Save Page...</button>
            <button type="button" role="menuitem">Create Shortcut...</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
  }
];
