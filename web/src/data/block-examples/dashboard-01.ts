import {
  avatarImage,
  bell,
  building,
  chevronDown,
  creditCard,
  folder,
  grid,
  helpCircle,
  logOut,
  search,
  settings,
  terminal,
  user
} from "../examples/icons";

export const dashboard01Html = `<div style="inline-size: 100%; min-inline-size: 0; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 1rem">
  <aside class="sidebar" aria-label="Dashboard navigation" style="flex: 0 1 15rem; inline-size: 15rem; block-size: 38rem">
    <header>
      <span data-slot="brand">${building} Northstar</span>
    </header>
    <section>
      <nav aria-label="Primary">
        <ul>
          <li><a href="#" aria-current="page">${grid}<span>Overview</span></a></li>
          <li><a href="#">${terminal}<span>Analytics</span></a></li>
          <li><a href="#">${user}<span>Customers</span></a></li>
          <li><a href="#">${settings}<span>Settings</span></a></li>
        </ul>
      </nav>
      <details class="collapsible" open>
        <summary data-slot="group-label">
          Workspace
          ${chevronDown}
        </summary>
        <nav aria-label="Workspace">
          <ul>
            <li><a href="#">${folder}<span>Projects</span></a></li>
            <li><a href="#">${folder}<span>Reports</span></a></li>
          </ul>
        </nav>
      </details>
      <nav aria-label="Support">
        <ul>
          <li><a href="#">${helpCircle}<span>Help center</span></a></li>
        </ul>
      </nav>
    </section>
    <footer>
      <span class="avatar" aria-hidden="true"><span data-slot="fallback">AL</span></span>
      <span data-slot="brand">Ada Lovelace</span>
    </footer>
  </aside>

  <div style="flex: 1 1 30rem; min-inline-size: 0; display: grid; gap: 1rem">
    <header style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem">
      <div>
        <h2 style="margin: 0; font-size: 1.25rem; line-height: 1.2">Overview</h2>
        <p style="margin: 0.25rem 0 0; color: var(--muted-foreground)">Welcome back, Ada. Here is what is happening today.</p>
      </div>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
        <div class="input-group" role="group" aria-label="Search dashboard" style="max-inline-size: 16rem">
          <input class="input" type="search" placeholder="Search..." aria-label="Search dashboard">
          <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
        </div>
        <div class="dropdown-menu">
          <button type="button" class="btn" data-variant="ghost" data-size="icon" aria-haspopup="menu" aria-expanded="false" aria-controls="block-dashboard-01-account-menu" aria-label="Account menu for Ada Lovelace (AL)" style="border-radius: var(--radius-full)">
            <span class="avatar" aria-hidden="true"><img src="${avatarImage}" alt=""></span>
          </button>
          <div data-popover data-side="bottom" data-align="end" id="block-dashboard-01-account-menu" aria-hidden="true">
            <div role="menu">
              <div role="none" style="padding: 0.5rem; font-size: var(--text-xs); font-weight: 500; color: var(--muted-foreground)">Ada Lovelace</div>
              <button type="button" role="menuitem">${user} Account</button>
              <button type="button" role="menuitem">${creditCard} Billing</button>
              <button type="button" role="menuitem">${bell} Notifications</button>
              <div role="separator"></div>
              <button type="button" role="menuitem">${logOut} Sign out</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr)); align-items: start; gap: 1rem">
      <div class="card">
        <header><h3 data-slot="title">Total revenue</h3></header>
        <section>
          <strong style="font-size: 1.5rem; line-height: 1">$48,250</strong>
          <p style="margin: 0.5rem 0 0; color: var(--muted-foreground)">+12.5% from last month</p>
        </section>
      </div>
      <div class="card">
        <header><h3 data-slot="title">Active customers</h3></header>
        <section>
          <strong style="font-size: 1.5rem; line-height: 1">2,420</strong>
          <p style="margin: 0.5rem 0 0; color: var(--muted-foreground)">+8.2% from last month</p>
        </section>
      </div>
      <div class="card">
        <header><h3 data-slot="title">Conversion rate</h3></header>
        <section>
          <strong style="font-size: 1.5rem; line-height: 1">4.8%</strong>
          <p style="margin: 0.5rem 0 0; color: var(--muted-foreground)">+0.6% from last month</p>
        </section>
      </div>
      <div class="card">
        <header><h3 data-slot="title">Open tickets</h3></header>
        <section>
          <strong style="font-size: 1.5rem; line-height: 1">18</strong>
          <p style="margin: 0.5rem 0 0; color: var(--muted-foreground)">6 due this week</p>
        </section>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); align-items: start; gap: 1rem">
      <div class="card" style="min-inline-size: 0">
        <header>
          <h3 data-slot="title">Revenue</h3>
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
            </div>
            <div data-slot="legend">
              <span data-slot="legend-item" data-series="1"><span data-slot="swatch"></span>Revenue</span>
              <span data-slot="legend-item" data-series="2"><span data-slot="swatch"></span>Costs</span>
            </div>
          </div>
        </section>
      </div>

      <div class="card">
        <header>
          <h3 data-slot="title">Recent activity</h3>
          <p data-slot="description">Latest workspace updates</p>
        </header>
        <section>
          <ul style="display: grid; gap: 0.75rem; margin: 0; padding: 0; list-style: none">
            <li style="display: grid; gap: 0.15rem">
              <strong>New customer</strong>
              <span style="color: var(--muted-foreground)">Globex joined the Pro plan · 12m</span>
            </li>
            <li style="display: grid; gap: 0.15rem">
              <strong>Report exported</strong>
              <span style="color: var(--muted-foreground)">June revenue report · 1h</span>
            </li>
            <li style="display: grid; gap: 0.15rem">
              <strong>Ticket resolved</strong>
              <span style="color: var(--muted-foreground)">Billing question from Initech · 3h</span>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <div class="card" style="min-inline-size: 0">
      <header>
        <h3 data-slot="title">Recent transactions</h3>
        <button type="button" class="btn" data-variant="ghost" data-size="sm" data-slot="action">View all</button>
      </header>
      <section style="min-inline-size: 0; padding-inline: 0">
        <div class="table-container">
          <table class="table">
            <caption class="sr-only">Recent customer transactions</caption>
            <thead>
              <tr>
                <th scope="col">Customer</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Globex Corporation</td>
                <td><span class="badge" data-variant="secondary">Paid</span></td>
                <td>Jun 24, 2026</td>
                <td>$1,250.00</td>
              </tr>
              <tr>
                <td>Initech</td>
                <td><span class="badge" data-variant="outline">Pending</span></td>
                <td>Jun 23, 2026</td>
                <td>$850.00</td>
              </tr>
              <tr>
                <td>Umbrella Labs</td>
                <td><span class="badge" data-variant="secondary">Paid</span></td>
                <td>Jun 22, 2026</td>
                <td>$2,400.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</div>`;
