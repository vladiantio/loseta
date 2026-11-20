import type { Example } from "./types";
import { chevronDown, circleAlert, circleCheck, circleDashed } from "./icons";

export const navigationMenuExamples: Example[] = [
    {
      title: "Default",
      html: `<div style="display: flex; width: 100%; align-items: flex-start; justify-content: flex-start; min-height: 20rem; padding-top: 1rem">
  <nav class="navigation-menu" aria-label="Main">
    <ul>
      <li>
        <button type="button" aria-expanded="false" aria-controls="demo-nav-starting">
          Getting started
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="demo-nav-starting" style="width: 22rem">
          <ul>
            <li>
              <a href="#">
                <span data-slot="title">Introduction</span>
                <span data-slot="description">Re-usable native CSS components for any project.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">Installation</span>
                <span data-slot="description">How to install dependencies and structure your app.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">Typography</span>
                <span data-slot="description">Styles for headings, paragraphs and lists.</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li>
        <button type="button" aria-expanded="false" aria-controls="demo-nav-components">
          Components
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="demo-nav-components" style="width: 30rem">
          <ul style="grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem">
            <li>
              <a href="#">
                <span data-slot="title">Alert Dialog</span>
                <span data-slot="description">A modal dialog that interrupts the user with important content.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">Hover Card</span>
                <span data-slot="description">Preview content available behind a link.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">Progress</span>
                <span data-slot="description">Shows the completion progress of a task.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">Tabs</span>
                <span data-slot="description">Layered sections displayed one at a time.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">Tooltip</span>
                <span data-slot="description">A label shown on hover or keyboard focus.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">Scroll Area</span>
                <span data-slot="description">A styled native scroll container.</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li><a href="#">Docs</a></li>
    </ul>
  </nav>
</div>`
    },
    {
      title: "With icons",
      html: `<div style="display: flex; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <nav class="navigation-menu" aria-label="Task views">
    <ul>
      <li>
        <button type="button" aria-expanded="false" aria-controls="demo-nav-status">
          Status
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="demo-nav-status" style="width: 14rem">
          <ul>
            <li>
              <a href="#">
                <span data-slot="icon">${circleAlert}</span>
                <span data-slot="title">Backlog</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="icon">${circleDashed}</span>
                <span data-slot="title">To do</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="icon">${circleCheck}</span>
                <span data-slot="title">Done</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li><a href="#">Docs</a></li>
    </ul>
  </nav>
</div>`
    },
    {
      title: "Links",
      html: `<div style="display: flex; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <nav class="navigation-menu" aria-label="Resources">
    <ul>
      <li>
        <button type="button" aria-expanded="false" aria-controls="demo-nav-resources">
          Resources
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="demo-nav-resources" style="width: 12rem">
          <ul>
            <li><a href="#"><span data-slot="title">Documentation</span></a></li>
            <li><a href="#"><span data-slot="title">GitHub</span></a></li>
            <li><a href="#"><span data-slot="title">Support</span></a></li>
            <li><a href="#"><span data-slot="title">Changelog</span></a></li>
          </ul>
        </div>
      </li>
      <li><a href="#">Docs</a></li>
    </ul>
  </nav>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div style="display: flex; justify-content: center; min-height: 20rem; padding-top: 1rem">
  <nav class="navigation-menu" aria-label="القائمة الرئيسية" dir="rtl" lang="ar">
    <ul>
      <li>
        <button type="button" aria-expanded="false" aria-controls="demo-nav-rtl-start">
          البدء
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="demo-nav-rtl-start" style="width: 22rem">
          <ul>
            <li>
              <a href="#">
                <span data-slot="title">مقدمة</span>
                <span data-slot="description">مكونات أصلية قابلة لإعادة الاستخدام لأي مشروع.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">التثبيت</span>
                <span data-slot="description">كيفية تثبيت التبعيات وتنظيم تطبيقك.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">الطباعة</span>
                <span data-slot="description">أنماط للعناوين والفقرات والقوائم.</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li>
        <button type="button" aria-expanded="false" aria-controls="demo-nav-rtl-components">
          المكونات
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="demo-nav-rtl-components" style="width: 22rem">
          <ul>
            <li>
              <a href="#">
                <span data-slot="title">حوار التنبيه</span>
                <span data-slot="description">حوار نافذة يقطع المستخدم بمحتوى مهم.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">التقدم</span>
                <span data-slot="description">يعرض مؤشرًا يوضح تقدم إتمام المهمة.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">التبويبات</span>
                <span data-slot="description">مجموعة من أقسام المحتوى المعروضة واحدة في كل مرة.</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li><a href="#">الوثائق</a></li>
    </ul>
  </nav>
</div>`
    }
];
