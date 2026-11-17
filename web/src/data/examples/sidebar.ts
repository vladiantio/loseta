import type { Example } from "./types";
import { chevronDown } from "./icons";

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
    <span>v0.15.0</span>
  </footer>
</aside>`
    }
];
