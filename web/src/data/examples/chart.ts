import type { Example } from "./types";

export const chartExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="card">
  <header>
    <h3 data-slot="title">Monthly revenue</h3>
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
        <div data-slot="tooltip" style="inset-block-start: 2.5rem; inset-inline-start: 38%">
          <span data-slot="title">March</span>
          <span data-slot="description">$12,400 revenue</span>
        </div>
      </div>
      <div data-slot="legend">
        <span data-slot="legend-item" data-series="1"><span data-slot="swatch"></span>Revenue</span>
        <span data-slot="legend-item" data-series="2"><span data-slot="swatch"></span>Costs</span>
      </div>
    </div>
  </section>
</div>`
    }
];
