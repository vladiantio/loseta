import type { Example } from "./types";
import { check, file, folder, helpCircle, save, settings, submenuIcon, trash } from "./icons";

export const menubarExamples: Example[] = [
    {
      title: "Default",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <div class="menubar" role="menubar" aria-label="Main">
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">File</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <div role="group" aria-label="File">
            <button type="button" role="menuitem">New Tab <span data-slot="shortcut">⌘T</span></button>
            <button type="button" role="menuitem">New Window <span data-slot="shortcut">⌘N</span></button>
            <button type="button" role="menuitem" disabled>New Incognito Window</button>
          </div>
          <div role="separator"></div>
          <div role="none">
            <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-menubar-file-share">
              Share
              ${submenuIcon}
            </button>
            <div data-popover data-side="inline-end" id="demo-menubar-file-share" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Email link</button>
                <button type="button" role="menuitem">Messages</button>
                <button type="button" role="menuitem">Notes</button>
              </div>
            </div>
          </div>
          <div role="separator"></div>
          <button type="button" role="menuitem">Print... <span data-slot="shortcut">⌘P</span></button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">Edit</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">Undo <span data-slot="shortcut">⌘Z</span></button>
          <button type="button" role="menuitem">Redo <span data-slot="shortcut">⇧⌘Z</span></button>
          <div role="separator"></div>
          <div role="none">
            <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-menubar-edit-find">
              Find
              ${submenuIcon}
            </button>
            <div data-popover data-side="inline-end" id="demo-menubar-edit-find" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Search the web</button>
                <div role="separator"></div>
                <button type="button" role="menuitem">Find...</button>
                <button type="button" role="menuitem">Find Next</button>
                <button type="button" role="menuitem">Find Previous</button>
              </div>
            </div>
          </div>
          <div role="separator"></div>
          <button type="button" role="menuitem">Cut</button>
          <button type="button" role="menuitem">Copy</button>
          <button type="button" role="menuitem">Paste</button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">View</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitemcheckbox" aria-checked="false">
            Bookmarks Bar
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <button type="button" role="menuitemcheckbox" aria-checked="true">
            Full URLs
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <div role="separator"></div>
          <button type="button" role="menuitem">Reload <span data-slot="shortcut">⌘R</span></button>
          <button type="button" role="menuitem" disabled>Force Reload <span data-slot="shortcut">⇧⌘R</span></button>
          <div role="separator"></div>
          <button type="button" role="menuitem">Toggle Fullscreen</button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">Profiles</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <div role="group" aria-label="Profiles">
            <button type="button" role="menuitemradio" aria-checked="false">
              Andy
              <span data-slot="indicator" aria-hidden="true"></span>
            </button>
            <button type="button" role="menuitemradio" aria-checked="true">
              Benoit
              <span data-slot="indicator" aria-hidden="true"></span>
            </button>
            <button type="button" role="menuitemradio" aria-checked="false">
              Luis
              <span data-slot="indicator" aria-hidden="true"></span>
            </button>
          </div>
          <div role="separator"></div>
          <button type="button" role="menuitem" data-inset>Edit...</button>
          <button type="button" role="menuitem" data-inset>Add Profile...</button>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Checkbox",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <div class="menubar" role="menubar" aria-label="Editor">
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">View</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitemcheckbox" aria-checked="false">
            Always Show Bookmarks Bar
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <button type="button" role="menuitemcheckbox" aria-checked="true">
            Always Show Full URLs
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <div role="separator"></div>
          <button type="button" role="menuitem" data-inset>Reload <span data-slot="shortcut">⌘R</span></button>
          <button type="button" role="menuitem" data-inset disabled>Force Reload <span data-slot="shortcut">⇧⌘R</span></button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">Format</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitemcheckbox" aria-checked="true">
            Strikethrough
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <button type="button" role="menuitemcheckbox" aria-checked="false">
            Code
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <button type="button" role="menuitemcheckbox" aria-checked="false">
            Superscript
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Radio",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <div class="menubar" role="menubar" aria-label="Profile">
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">Profiles</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <div role="group" aria-label="Profiles">
            <button type="button" role="menuitemradio" aria-checked="false">
              Andy
              <span data-slot="indicator" aria-hidden="true"></span>
            </button>
            <button type="button" role="menuitemradio" aria-checked="true">
              Benoit
              <span data-slot="indicator" aria-hidden="true"></span>
            </button>
            <button type="button" role="menuitemradio" aria-checked="false">
              Luis
              <span data-slot="indicator" aria-hidden="true"></span>
            </button>
          </div>
          <div role="separator"></div>
          <button type="button" role="menuitem" data-inset>Edit...</button>
          <button type="button" role="menuitem" data-inset>Add Profile...</button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">Theme</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
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
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Submenu",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <div class="menubar" role="menubar" aria-label="Main">
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">File</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <div role="none">
            <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-menubar-submenu-share">
              Share
              ${submenuIcon}
            </button>
            <div data-popover data-side="inline-end" id="demo-menubar-submenu-share" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Email link</button>
                <button type="button" role="menuitem">Messages</button>
                <button type="button" role="menuitem">Notes</button>
              </div>
            </div>
          </div>
          <div role="separator"></div>
          <button type="button" role="menuitem">Print... <span data-slot="shortcut">⌘P</span></button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">Edit</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">Undo <span data-slot="shortcut">⌘Z</span></button>
          <button type="button" role="menuitem">Redo <span data-slot="shortcut">⇧⌘Z</span></button>
          <div role="separator"></div>
          <div role="none">
            <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-menubar-submenu-find">
              Find
              ${submenuIcon}
            </button>
            <div data-popover data-side="inline-end" id="demo-menubar-submenu-find" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Find...</button>
                <button type="button" role="menuitem">Find Next</button>
                <button type="button" role="menuitem">Find Previous</button>
              </div>
            </div>
          </div>
          <div role="separator"></div>
          <button type="button" role="menuitem">Cut</button>
          <button type="button" role="menuitem">Copy</button>
          <button type="button" role="menuitem">Paste</button>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "With icons",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <div class="menubar" role="menubar" aria-label="Files">
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">File</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">${file} New File <span data-slot="shortcut">⌘N</span></button>
          <button type="button" role="menuitem">${folder} Open Folder</button>
          <div role="separator"></div>
          <button type="button" role="menuitem">${save} Save <span data-slot="shortcut">⌘S</span></button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">More</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">${settings} Settings</button>
          <button type="button" role="menuitem">${helpCircle} Help</button>
          <div role="separator"></div>
          <button type="button" role="menuitem" data-variant="destructive">${trash} Delete</button>
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <div class="menubar" role="menubar" aria-label="القائمة الرئيسية" dir="rtl" lang="ar">
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">ملف</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">علامة تبويب جديدة <span data-slot="shortcut">⌘T</span></button>
          <button type="button" role="menuitem">نافذة جديدة <span data-slot="shortcut">⌘N</span></button>
          <button type="button" role="menuitem" disabled>نافذة التصفح المتخفي الجديدة</button>
          <div role="separator"></div>
          <div role="none">
            <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" aria-controls="demo-menubar-rtl-share">
              مشاركة
              ${submenuIcon}
            </button>
            <div data-popover data-side="inline-end" id="demo-menubar-rtl-share" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">رابط البريد الإلكتروني</button>
                <button type="button" role="menuitem">الرسائل</button>
                <button type="button" role="menuitem">الملاحظات</button>
              </div>
            </div>
          </div>
          <div role="separator"></div>
          <button type="button" role="menuitem">طباعة... <span data-slot="shortcut">⌘P</span></button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">تعديل</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">تراجع <span data-slot="shortcut">⌘Z</span></button>
          <button type="button" role="menuitem">إعادة <span data-slot="shortcut">⇧⌘Z</span></button>
          <div role="separator"></div>
          <button type="button" role="menuitem">قص</button>
          <button type="button" role="menuitem">نسخ</button>
          <button type="button" role="menuitem">لصق</button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">عرض</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitemcheckbox" aria-checked="false">
            شريط الإشارات المرجعية
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <button type="button" role="menuitemcheckbox" aria-checked="true">
            عناوين URL الكاملة
            <span data-slot="indicator" aria-hidden="true">${check}</span>
          </button>
          <div role="separator"></div>
          <button type="button" role="menuitem">إعادة تحميل <span data-slot="shortcut">⌘R</span></button>
          <button type="button" role="menuitem" disabled>إعادة تحميل قسري <span data-slot="shortcut">⇧⌘R</span></button>
          <div role="separator"></div>
          <button type="button" role="menuitem">تبديل وضع ملء الشاشة</button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false">الملفات الشخصية</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <div role="group" aria-label="الملفات الشخصية">
            <button type="button" role="menuitemradio" aria-checked="false">
              Andy
              <span data-slot="indicator" aria-hidden="true"></span>
            </button>
            <button type="button" role="menuitemradio" aria-checked="true">
              Benoit
              <span data-slot="indicator" aria-hidden="true"></span>
            </button>
            <button type="button" role="menuitemradio" aria-checked="false">
              Luis
              <span data-slot="indicator" aria-hidden="true"></span>
            </button>
          </div>
          <div role="separator"></div>
          <button type="button" role="menuitem" data-inset>تعديل...</button>
          <button type="button" role="menuitem" data-inset>إضافة ملف شخصي...</button>
        </div>
      </div>
    </div>
  </div>
</div>`
    }
];
