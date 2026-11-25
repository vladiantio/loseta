import packageJson from "../../../../packages/loseta/package.json" with { type: "json" };
import type { Example } from "./types";
import {
  bot,
  building,
  chevronDown,
  close,
  fileText,
  folder,
  helpCircle,
  messageSquare,
  moreHorizontal,
  plus,
  settings,
  terminal
} from "./icons";

const version = packageJson.version;

export const sidebarExamples: Example[] = [
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
    <span>v${version}</span>
  </footer>
</aside>`
    },
    {
      title: "Groups",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 28rem">
  <header>
    <span data-slot="brand">Acme Inc</span>
  </header>
  <section>
    <nav aria-labelledby="demo-sidebar-groups-platform">
      <header>
        <h3 id="demo-sidebar-groups-platform">Platform</h3>
      </header>
      <ul>
        <li><a href="#" aria-current="page">Playground</a></li>
        <li><a href="#">Models</a></li>
        <li><a href="#">Documentation</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </nav>
    <nav aria-labelledby="demo-sidebar-groups-projects">
      <header>
        <h3 id="demo-sidebar-groups-projects">Projects</h3>
      </header>
      <ul>
        <li><a href="#">Design Engineering</a></li>
        <li><a href="#">Sales &amp; Marketing</a></li>
        <li><a href="#">Travel</a></li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>v${version}</span>
  </footer>
</aside>`
    },
    {
      title: "With icons",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 24rem">
  <header>
    <span data-slot="brand">${building} Acme Inc</span>
  </header>
  <section>
    <nav aria-label="Application">
      <ul>
        <li><a href="#" aria-current="page">${terminal}<span>Playground</span></a></li>
        <li><a href="#">${bot}<span>Models</span></a></li>
        <li><a href="#">${fileText}<span>Documentation</span></a></li>
        <li><a href="#">${settings}<span>Settings</span></a></li>
      </ul>
    </nav>
    <nav aria-label="Support">
      <ul>
        <li><a href="#">${helpCircle}<span>Support</span></a></li>
        <li><a href="#">${messageSquare}<span>Feedback</span></a></li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>MIT licensed</span>
  </footer>
</aside>`
    },
    {
      title: "Group action",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 24rem">
  <header>
    <span data-slot="brand">Acme Inc</span>
  </header>
  <section>
    <nav aria-labelledby="demo-sidebar-group-action-projects">
      <header>
        <h3 id="demo-sidebar-group-action-projects">Projects</h3>
        <button type="button" data-slot="group-action" aria-label="Add project">${plus}</button>
      </header>
      <ul>
        <li><a href="#" aria-current="page">${folder}<span>Design Engineering</span></a></li>
        <li><a href="#">${folder}<span>Sales &amp; Marketing</span></a></li>
        <li><a href="#">${folder}<span>Travel</span></a></li>
        <li><a href="#">${folder}<span>Support</span></a></li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>v${version}</span>
  </footer>
</aside>`
    },
    {
      title: "Collapsible groups",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 26rem">
  <header>
    <span data-slot="brand">Acme Inc</span>
  </header>
  <section>
    <details class="collapsible" open>
      <summary data-slot="group-label">
        Platform
        ${chevronDown}
      </summary>
      <nav aria-label="Platform">
        <ul>
          <li><a href="#" aria-current="page">Playground</a></li>
          <li><a href="#">Models</a></li>
          <li><a href="#">Documentation</a></li>
        </ul>
      </nav>
    </details>
    <details class="collapsible">
      <summary data-slot="group-label">
        Projects
        ${chevronDown}
      </summary>
      <nav aria-label="Projects">
        <ul>
          <li><a href="#">Design Engineering</a></li>
          <li><a href="#">Sales &amp; Marketing</a></li>
          <li><a href="#">Travel</a></li>
        </ul>
      </nav>
    </details>
  </section>
  <footer>
    <span>v${version}</span>
  </footer>
</aside>`
    },
    {
      title: "Nested menu",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 26rem">
  <header>
    <span data-slot="brand">Documentation</span>
  </header>
  <section>
    <nav aria-label="Documentation">
      <ul>
        <li><a href="#">Getting started</a></li>
        <li>
          <details class="collapsible" open>
            <summary>
              Build your application
              ${chevronDown}
            </summary>
            <ul>
              <li><a href="#">Routing</a></li>
              <li><a href="#" aria-current="page">Data fetching</a></li>
              <li><a href="#">Rendering</a></li>
              <li><a href="#">Caching</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details class="collapsible">
            <summary>
              API reference
              ${chevronDown}
            </summary>
            <ul>
              <li><a href="#">Components</a></li>
              <li><a href="#">File conventions</a></li>
              <li><a href="#">Functions</a></li>
            </ul>
          </details>
        </li>
        <li><a href="#">Architecture</a></li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>v${version}</span>
  </footer>
</aside>`
    },
    {
      title: "Sub menu",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 24rem">
  <header>
    <span data-slot="brand">Documentation</span>
  </header>
  <section>
    <nav aria-label="Documentation">
      <ul>
        <li>
          <a href="#">Getting started</a>
          <ul>
            <li><a href="#">Installation</a></li>
            <li><a href="#">Project structure</a></li>
          </ul>
        </li>
        <li>
          <a href="#">Build your application</a>
          <ul>
            <li><a href="#">Routing</a></li>
            <li><a href="#" aria-current="page">Data fetching</a></li>
            <li><a href="#">Rendering</a></li>
          </ul>
        </li>
        <li><a href="#">Architecture</a></li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>v${version}</span>
  </footer>
</aside>`
    },
    {
      title: "Badges",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 24rem">
  <header>
    <span data-slot="brand">Acme Inc</span>
  </header>
  <section>
    <nav aria-labelledby="demo-sidebar-badges-projects">
      <header>
        <h3 id="demo-sidebar-badges-projects">Projects</h3>
      </header>
      <ul>
        <li><a href="#" aria-current="page">Design Engineering</a><span data-slot="menu-badge">24</span></li>
        <li><a href="#">Sales &amp; Marketing</a><span data-slot="menu-badge">12</span></li>
        <li><a href="#">Travel</a><span data-slot="menu-badge">3</span></li>
        <li><a href="#">Support</a><span data-slot="menu-badge">21</span></li>
        <li><a href="#">Feedback</a><span data-slot="menu-badge">8</span></li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>v${version}</span>
  </footer>
</aside>`
    },
    {
      title: "Actions",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 24rem">
  <header>
    <span data-slot="brand">Acme Inc</span>
  </header>
  <section>
    <nav aria-labelledby="demo-sidebar-actions-projects">
      <header>
        <h3 id="demo-sidebar-actions-projects">Projects</h3>
      </header>
      <ul>
        <li>
          <a href="#" aria-current="page">Design Engineering</a>
          <button type="button" data-slot="menu-action" aria-label="More actions for Design Engineering">${moreHorizontal}</button>
        </li>
        <li>
          <a href="#">Sales &amp; Marketing</a>
          <button type="button" data-slot="menu-action" aria-label="More actions for Sales &amp; Marketing">${moreHorizontal}</button>
        </li>
        <li>
          <a href="#">Travel</a>
          <button type="button" data-slot="menu-action" aria-label="More actions for Travel">${moreHorizontal}</button>
        </li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>v${version}</span>
  </footer>
</aside>`
    },
    {
      title: "Header and footer",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 22rem">
  <header>
    <a href="#" data-slot="brand">${building}<span>Acme Inc</span></a>
  </header>
  <section>
    <nav aria-label="Account">
      <ul>
        <li><a href="#" aria-current="page">Overview</a></li>
        <li><a href="#">Members</a></li>
        <li><a href="#">Billing</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </nav>
  </section>
  <footer>
    <span data-slot="brand">Ada Lovelace</span>
    <span>ada@example.com</span>
  </footer>
</aside>`
    },
    {
      title: "Scrollable content",
      html: `<aside class="sidebar" aria-label="Sidebar" style="height: 16rem">
  <header>
    <span data-slot="brand">Components</span>
  </header>
  <section tabindex="0" aria-label="Component navigation">
    <nav aria-label="Components">
      <ul>
        <li><a href="#" aria-current="page">Alert</a></li>
        <li><a href="#">Avatar</a></li>
        <li><a href="#">Badge</a></li>
        <li><a href="#">Button</a></li>
        <li><a href="#">Card</a></li>
        <li><a href="#">Checkbox</a></li>
        <li><a href="#">Dialog</a></li>
        <li><a href="#">Field</a></li>
        <li><a href="#">Input</a></li>
        <li><a href="#">Progress</a></li>
        <li><a href="#">Select</a></li>
        <li><a href="#">Sidebar</a></li>
        <li><a href="#">Table</a></li>
        <li><a href="#">Tabs</a></li>
        <li><a href="#">Textarea</a></li>
        <li><a href="#">Toast</a></li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>16 components</span>
  </footer>
</aside>`
    },
    {
      title: "Mobile",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-sidebar-mobile">
  Open navigation
</button>

<dialog class="sheet" id="demo-sidebar-mobile" data-side="inline-start" data-size="sm" aria-labelledby="demo-sidebar-mobile-brand">
  <div style="padding: 0">
    <aside class="sidebar" aria-label="Mobile navigation" style="width: 100%; border-inline-end-width: 0">
      <header>
        <h3 data-slot="brand" id="demo-sidebar-mobile-brand">Acme Inc</h3>
        <form method="dialog" style="margin-inline-start: auto">
          <button class="btn" data-variant="ghost" data-size="icon-sm" aria-label="Close navigation">${close}</button>
        </form>
      </header>
      <section>
        <nav aria-label="Application">
          <ul>
            <li><a href="#" aria-current="page">${terminal}<span>Playground</span></a></li>
            <li><a href="#">${bot}<span>Models</span></a></li>
            <li><a href="#">${fileText}<span>Documentation</span></a></li>
            <li><a href="#">${settings}<span>Settings</span></a></li>
          </ul>
        </nav>
      </section>
      <footer>
        <span>v${version}</span>
      </footer>
    </aside>
  </div>
</dialog>`
    },
    {
      title: "Right-to-left",
      html: `<aside class="sidebar" dir="rtl" lang="ar" aria-label="الشريط الجانبي" style="height: 26rem">
  <header>
    <span data-slot="brand">شركة أكمي</span>
  </header>
  <section>
    <nav aria-labelledby="demo-sidebar-rtl-platform">
      <header>
        <h3 id="demo-sidebar-rtl-platform">المنصة</h3>
        <button type="button" data-slot="group-action" aria-label="إضافة مشروع">${plus}</button>
      </header>
      <ul>
        <li><a href="#" aria-current="page">${terminal}<span>ملعب</span></a></li>
        <li><a href="#">${bot}<span>النماذج</span></a></li>
        <li>
          <details class="collapsible" open>
            <summary>
              التوثيق
              ${chevronDown}
            </summary>
            <ul>
              <li><a href="#">مقدمة</a></li>
              <li><a href="#">ابدأ</a></li>
              <li><a href="#">الدروس</a></li>
            </ul>
          </details>
        </li>
        <li>
          <a href="#">${folder}<span>هندسة التصميم</span></a>
          <span data-slot="menu-badge">٣</span>
        </li>
      </ul>
    </nav>
  </section>
  <footer>
    <span>الإصدار ${version}</span>
  </footer>
</aside>`
    }
];
