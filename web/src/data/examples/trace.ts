import type { Example } from "./types";
import { globe, search, terminal } from "./icons";

export const traceExamples: Example[] = [
    {
      title: "Default",
      html: `<details class="trace" open>
  <summary>
    <span data-slot="icon">${terminal}</span>
    <span data-slot="title">Ran pnpm install</span>
    <span data-slot="status" data-variant="success">Completed</span>
  </summary>
  <div data-slot="body">
    <p>Dependencies installed in 2.8s.</p>
  </div>
</details>`
    },
    {
      title: "Tool calls",
      html: `<div style="display: flex; flex-direction: column">
  <details class="trace" open>
    <summary>
      <span data-slot="icon">${terminal}</span>
      <span data-slot="title">Ran pnpm install</span>
      <span data-slot="status" data-variant="error">Failed</span>
    </summary>
    <div data-slot="body">
      <p>The frozen install failed because the lockfile is out of date.</p>
      <a data-slot="source" href="#">pnpm install logs</a>
    </div>
  </details>
  <details class="trace" aria-busy="true">
    <summary>
      <span data-slot="icon"><span class="spinner" data-size="sm"></span></span>
      <span data-slot="title">Running pnpm build</span>
      <span data-slot="status">Running</span>
    </summary>
    <div data-slot="body">
      <p>Compiling the registry and the docs site.</p>
    </div>
  </details>
  <details class="trace">
    <summary>
      <span data-slot="icon">${search}</span>
      <span data-slot="title">Searched for minimumReleaseAge</span>
      <span data-slot="status" data-variant="success">8 results</span>
    </summary>
    <div data-slot="body">
      <details class="trace">
        <summary>
          <span data-slot="icon">${globe}</span>
          <span data-slot="title">Read pnpm.io settings</span>
        </summary>
        <div data-slot="body">
          <p>minimumReleaseAge delays newly published versions.</p>
        </div>
      </details>
    </div>
  </details>
</div>`
    }
];
