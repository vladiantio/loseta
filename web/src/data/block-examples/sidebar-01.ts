import {
  building,
  chevronDown,
  folder,
  grid,
  helpCircle,
  settings,
  terminal,
  user
} from "../examples/icons";

export const sidebar01Html = `<div style="inline-size: 100%; min-inline-size: 0; min-block-size: 40rem; display: grid; place-items: center; padding: 1rem">
  <aside class="sidebar" aria-label="Workspace navigation" style="inline-size: min(100%, 18rem); block-size: 34rem">
    <header>
      <span data-slot="brand">${building} Northstar</span>
    </header>
    <section>
      <nav aria-label="Application">
        <ul>
          <li><a href="#" aria-current="page">${grid}<span>Overview</span></a></li>
          <li><a href="#">${terminal}<span>Analytics</span></a></li>
          <li><a href="#">${user}<span>Customers</span></a></li>
          <li><a href="#">${settings}<span>Settings</span></a></li>
        </ul>
      </nav>

      <details class="collapsible" open>
        <summary data-slot="group-label">
          Projects
          ${chevronDown}
        </summary>
        <nav aria-label="Projects">
          <ul>
            <li><a href="#">${folder}<span>Design engineering</span></a></li>
            <li><a href="#">${folder}<span>Sales &amp; marketing</span></a></li>
            <li><a href="#">${folder}<span>Customer support</span></a></li>
          </ul>
        </nav>
      </details>

      <details class="collapsible">
        <summary data-slot="group-label">
          Support
          ${chevronDown}
        </summary>
        <nav aria-label="Support resources">
          <ul>
            <li><a href="#">${helpCircle}<span>Help center</span></a></li>
            <li><a href="#">${settings}<span>Workspace settings</span></a></li>
          </ul>
        </nav>
      </details>
    </section>

    <footer>
      <span class="avatar" aria-hidden="true"><span data-slot="fallback">AL</span></span>
      <span style="display: grid; gap: 0.1rem; min-inline-size: 0">
        <span data-slot="brand">Ada Lovelace</span>
        <span>ada@example.com</span>
      </span>
    </footer>
  </aside>
</div>`;
