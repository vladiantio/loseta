export interface Example {
  title: string;
  html: string;
}

const arrowRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const search = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
const shield = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1 1 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;
const copy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const wrap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><path d="M3 12h15a3 3 0 1 1 0 6h-4"/><polyline points="16 16 14 18 16 20"/><line x1="3" x2="10" y1="18" y2="18"/></svg>`;
const chevronDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
const chevronLeft = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`;
const chevronRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;
const moreHorizontal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;
const alignLeft = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>`;
const alignCenter = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" x2="3" y1="6" y2="6"/><line x1="17" x2="7" y1="12" y2="12"/><line x1="19" x2="5" y1="18" y2="18"/></svg>`;
const alignRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/></svg>`;
const avatarImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23cbd5e1'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23475569'/%3E%3Cpath d='M10 64c0-12 10-22 22-22s22 10 22 22z' fill='%23475569'/%3E%3C/svg%3E`;
const ratioImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 90'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%2394a3b8'/%3E%3Cstop offset='1' stop-color='%23e2e8f0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='160' height='90' fill='url(%23g)'/%3E%3Ctext x='80' y='49' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23334155'%3E16:9%3C/text%3E%3C/svg%3E`;

export const examples: Record<string, Example[]> = {
  alert: [
    {
      title: "Default",
      html: `<div class="alert" role="alert">
  <h3 data-slot="title">Heads up!</h3>
  <section>
    <p>You can add components to your app using the CLI.</p>
  </section>
</div>`
    },
    {
      title: "Destructive",
      html: `<div class="alert" data-variant="destructive" role="alert">
  <h3 data-slot="title">Session expired</h3>
  <section>
    <p>Please log in again to continue.</p>
  </section>
</div>`
    }
  ],
  "alert-dialog": [
    {
      title: "Delete account",
      html: `<button type="button" class="btn" data-variant="destructive" data-open-dialog="demo-alert-dialog">
  Delete account
</button>

<dialog class="alert-dialog" id="demo-alert-dialog" aria-labelledby="alert-title" aria-describedby="alert-description">
  <div>
    <header>
      <figure>${shield}</figure>
      <h2 data-slot="title" id="alert-title">Are you absolutely sure?</h2>
      <p data-slot="description" id="alert-description">
        This action cannot be undone. This will permanently delete your account and remove your data.
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-variant="destructive" data-close-dialog>Delete</button>
    </footer>
  </div>
</dialog>`
    }
  ],
  badge: [
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <span class="badge">Default</span>
  <span class="badge" data-variant="secondary">Secondary</span>
  <span class="badge" data-variant="outline">Outline</span>
  <span class="badge" data-variant="destructive">Destructive</span>
  <span class="badge" data-variant="ghost">Ghost</span>
  <span class="badge" data-variant="link">Link</span>
</div>`
    }
  ],
  button: [
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button class="btn">Default</button>
  <button class="btn" data-variant="secondary">Secondary</button>
  <button class="btn" data-variant="outline">Outline</button>
  <button class="btn" data-variant="ghost">Ghost</button>
  <button class="btn" data-variant="link">Link</button>
  <button class="btn" data-variant="destructive">Destructive</button>
</div>`
    },
    {
      title: "Sizes and icons",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button class="btn" data-size="xs">Extra small</button>
  <button class="btn" data-size="sm">Small</button>
  <button class="btn">Default</button>
  <button class="btn" data-size="lg">Large</button>
  <button class="btn" data-size="icon" aria-label="Next">${arrowRight}</button>
  <button class="btn" data-size="icon-sm" aria-label="Next">${arrowRight}</button>
  <button class="btn" data-size="icon-lg" aria-label="Next">${arrowRight}</button>
  <button class="btn"><svg data-icon="inline-start" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>Icon and text</button>
</div>`
    }
  ],
  "button-group": [
    {
      title: "Horizontal",
      html: `<div class="btn-group" role="group" aria-label="Button group" data-orientation="horizontal">
  <button class="btn" data-variant="outline">Left</button>
  <button class="btn" data-variant="outline">Center</button>
  <button class="btn" data-variant="outline">Right</button>
</div>`
    },
    {
      title: "Vertical",
      html: `<div class="btn-group" role="group" aria-label="Vertical button group" data-orientation="vertical">
  <button class="btn" data-variant="outline">Top</button>
  <button class="btn" data-variant="outline">Middle</button>
  <button class="btn" data-variant="outline">Bottom</button>
</div>`
    }
  ],
  card: [
    {
      title: "Default",
      html: `<div class="card" style="max-width: 24rem">
  <header data-separator="bottom">
    <h3 data-slot="title">Create project</h3>
    <p data-slot="description">Deploy your new project in one click.</p>
    <a class="card-action" href="#">Docs</a>
  </header>
  <section>
    <div class="field">
      <label class="label" for="card-name">Name</label>
      <input class="input" id="card-name" placeholder="My project">
    </div>
  </section>
  <footer style="display: flex; justify-content: flex-end; gap: 0.5rem">
    <button class="btn" data-variant="outline">Cancel</button>
    <button class="btn">Create</button>
  </footer>
</div>`
    }
  ],
  checkbox: [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-checkbox">
    <input class="checkbox" type="checkbox" id="demo-checkbox" checked>
    Accept terms and conditions
  </label>
  <p>You agree to our Terms of Service and Privacy Policy.</p>
</div>`
    }
  ],
  "code-block": [
    {
      title: "Header and actions",
      html: `<div class="code-block" data-demo="code-block">
  <header>
    <span data-slot="title">app/api/chat/route.ts</span>
    <div data-slot="actions">
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-demo-copy aria-label="Copy code">${copy}</button>
    </div>
  </header>
  <pre dir="ltr" tabindex="0"><code>import { streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();
  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages
  });

  return result.toUIMessageStreamResponse();
}</code></pre>
</div>`
    },
    {
      title: "Line numbers",
      html: `<div class="code-block" data-demo="code-block">
  <header>
    <span data-slot="title">app/dashboard/page.tsx</span>
  </header>
  <pre data-line-numbers style="--line-start: 12" dir="ltr" tabindex="0"><code><span data-slot="line"><span data-slot="line-content">  if (!session) {</span></span>
<span data-slot="line"><span data-slot="line-content">    redirect("/login");</span></span>
<span data-slot="line"><span data-slot="line-content">  }</span></span>
<span data-slot="line"><span data-slot="line-content"></span></span>
<span data-slot="line"><span data-slot="line-content">  const projects = await db.project.findMany({</span></span>
<span data-slot="line"><span data-slot="line-content">    where: { ownerId: session.user.id },</span></span>
<span data-slot="line"><span data-slot="line-content">    orderBy: { updatedAt: "desc" }</span></span>
<span data-slot="line"><span data-slot="line-content">  });</span></span>
<span data-slot="line"><span data-slot="line-content">  return &lt;ProjectList projects={projects} /&gt;;</span></span>
<span data-slot="line"><span data-slot="line-content">}</span></span></code></pre>
</div>`
    },
    {
      title: "Diff and highlighted lines",
      html: `<div class="code-block" data-demo="code-block">
  <header>
    <span data-slot="title">components/greeting.tsx</span>
  </header>
  <pre dir="ltr" tabindex="0"><code><span data-slot="line"><span data-slot="line-content">export function Greeting({ name }: { name: string }) {</span></span>
<span data-slot="line"><span data-slot="line-content">  return &lt;p&gt;Hello, {name}&lt;/p&gt;;</span></span>
<span data-slot="line" data-variant="removed"><span data-slot="line-content">  return &lt;p className="text-sm text-muted-foreground"&gt;Hello, {name}!&lt;/p&gt;;</span></span>
<span data-slot="line" data-variant="added"><span data-slot="line-content">  return &lt;p&gt;Hello, {name}!&lt;/p&gt;;</span></span>
<span data-slot="line" data-variant="highlighted"><span data-slot="line-content">  const message = "Hello, " + name + "!";</span></span>
<span data-slot="line"><span data-slot="line-content">}</span></span></code></pre>
</div>`
    },
    {
      title: "Small, wrapped and destructive",
      html: `<div class="code-block" data-size="sm" data-variant="destructive" data-demo="code-block">
  <header>
    <span data-slot="title">Error</span>
    <div data-slot="actions">
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-demo-wrap aria-label="Wrap lines" aria-pressed="true">${wrap}</button>
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-demo-copy aria-label="Copy output">${copy}</button>
    </div>
  </header>
  <pre data-wrap dir="ltr" tabindex="0"><code>TypeError: The model "anthropic/claude-sonnet-4.5" returned an error: Request too large. The prompt is 212,431 tokens but the context window is 200,000 tokens.</code></pre>
</div>`
    },
    {
      title: "Floating actions",
      html: `<div class="code-block" data-demo="code-block">
  <div data-slot="actions">
    <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-demo-copy aria-label="Copy output">${copy}</button>
  </div>
  <pre dir="ltr" tabindex="0"><code>$ pnpm add ai @ai-sdk/react zod
Packages: +14
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0</code></pre>
</div>`
    }
  ],
  dialog: [
    {
      title: "Edit profile",
      html: `<button type="button" class="btn" data-open-dialog="demo-dialog">Open dialog</button>

<dialog class="dialog" id="demo-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
  <div>
    <header>
      <h2 data-slot="title" id="dialog-title">Edit profile</h2>
      <p data-slot="description" id="dialog-description">
        Make changes to your profile here. Click save when you're done.
      </p>
    </header>
    <section>
      <div class="field">
        <label class="label" for="dialog-name">Name</label>
        <input class="input" id="dialog-name" value="Ada Lovelace">
      </div>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Save changes</button>
    </footer>
    <form method="dialog">
      <button class="btn" data-variant="ghost" data-size="icon-sm" aria-label="Close">×</button>
    </form>
  </div>
</dialog>`
    }
  ],
  "dropdown-menu": [
    {
      title: "Default",
      html: `<div class="dropdown-menu" data-demo="dropdown">
  <button type="button" class="btn" data-variant="outline" data-demo-trigger aria-haspopup="menu" aria-expanded="false">
    Open menu
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <div role="menu">
      <button type="button" role="menuitem">Profile</button>
      <button type="button" role="menuitem">Billing</button>
      <button type="button" role="menuitem">Settings <span class="kbd">⌘S</span></button>
      <div role="separator"></div>
      <button type="button" role="menuitem" data-variant="destructive">Delete account</button>
    </div>
  </div>
</div>`
    }
  ],
  empty: [
    {
      title: "Default",
      html: `<div class="empty">
  <header>
    <figure>${search}</figure>
    <h2>No results found</h2>
    <p>Try adjusting your search or filters.</p>
  </header>
  <section>
    <button class="btn" data-variant="outline">Clear filters</button>
  </section>
</div>`
    }
  ],
  field: [
    {
      title: "Vertical",
      html: `<div class="field">
  <label class="label" for="demo-field-email">Email</label>
  <input class="input" id="demo-field-email" type="email" placeholder="you@example.com">
  <p>We'll never share your email with anyone else.</p>
</div>`
    },
    {
      title: "Horizontal",
      html: `<div class="field" data-orientation="horizontal">
  <section>
    <label class="label" for="demo-field-notifications">Notifications</label>
    <p>Receive emails about new features.</p>
  </section>
  <input class="switch" type="checkbox" role="switch" id="demo-field-notifications">
</div>`
    }
  ],
  input: [
    {
      title: "Default",
      html: `<input class="input" type="email" placeholder="you@example.com">`
    },
    {
      title: "Invalid",
      html: `<div class="field">
  <label class="label" for="demo-input-invalid">Username</label>
  <input class="input" id="demo-input-invalid" aria-invalid="true" value="invalid name">
  <p role="alert">Username may only contain letters and numbers.</p>
</div>`
    }
  ],
  item: [
    {
      title: "Item group",
      html: `<div class="item-group">
  <div class="item" data-variant="outline">
    <figure>${shield}</figure>
    <section>
      <h3>Security</h3>
      <p>Manage your account security settings.</p>
    </section>
    <aside>
      <button class="btn" data-size="sm" data-variant="outline">Manage</button>
    </aside>
  </div>
  <hr>
  <div class="item" data-variant="muted">
    <section>
      <h3>Notifications</h3>
      <p>Choose what you want to be notified about.</p>
    </section>
  </div>
</div>`
    }
  ],
  kbd: [
    {
      title: "Default",
      html: `<div style="display: flex; align-items: center; gap: 0.5rem">
  <span class="kbd">⌘</span>
  <span class="kbd">K</span>
  <span>Open command menu</span>
</div>`
    }
  ],
  label: [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-label">Your name</label>
  <input class="input" id="demo-label" placeholder="Ada Lovelace">
</div>`
    }
  ],
  "native-select": [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-select">Framework</label>
  <select class="native-select" id="demo-select">
    <option>Next.js</option>
    <option>Astro</option>
    <option>SvelteKit</option>
    <option>Nuxt</option>
  </select>
</div>`
    }
  ],
  popover: [
    {
      title: "Default",
      html: `<div class="popover" data-demo="popover">
  <button type="button" class="btn" data-variant="outline" data-demo-trigger aria-expanded="false">
    Open popover
  </button>
  <div data-popover data-side="bottom" aria-hidden="true">
    <header data-slot="header">
      <h3 data-slot="title">Dimensions</h3>
      <p data-slot="description">Set the dimensions for the layer.</p>
    </header>
    <div class="field">
      <label class="label" for="popover-width">Width</label>
      <input class="input" id="popover-width" value="100%">
    </div>
  </div>
</div>`
    }
  ],
  radio: [
    {
      title: "Default",
      html: `<div class="field" role="radiogroup" aria-label="Plan">
  <label class="label">
    <input class="radio" type="radio" name="plan" checked>
    Starter
  </label>
  <label class="label">
    <input class="radio" type="radio" name="plan">
    Pro
  </label>
  <label class="label">
    <input class="radio" type="radio" name="plan">
    Enterprise
  </label>
</div>`
    }
  ],
  skeleton: [
    {
      title: "Default",
      html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 20rem">
  <div class="skeleton" style="height: 1rem; width: 60%"></div>
  <div class="skeleton" style="height: 1rem; width: 100%"></div>
  <div class="skeleton" style="height: 1rem; width: 80%"></div>
</div>`
    }
  ],
  switch: [
    {
      title: "Default",
      html: `<label class="label" for="demo-switch">
  <input class="switch" type="checkbox" role="switch" id="demo-switch" checked>
  Airplane mode
</label>`
    }
  ],
  table: [
    {
      title: "Default",
      html: `<div class="table-container">
  <table class="table">
    <caption>A list of your recent invoices.</caption>
    <thead>
      <tr>
        <th>Invoice</th>
        <th>Status</th>
        <th>Method</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>INV-001</td>
        <td>Paid</td>
        <td>Credit card</td>
        <td>$250.00</td>
      </tr>
      <tr aria-selected="true">
        <td>INV-002</td>
        <td>Pending</td>
        <td>PayPal</td>
        <td>$150.00</td>
      </tr>
      <tr>
        <td>INV-003</td>
        <td>Unpaid</td>
        <td>Bank transfer</td>
        <td>$350.00</td>
      </tr>
    </tbody>
  </table>
</div>`
    }
  ],
  tabs: [
    {
      title: "Default",
      html: `<div class="tabs" data-demo="tabs">
  <div role="tablist" aria-orientation="horizontal">
    <button type="button" role="tab" id="tab-account" aria-selected="true" aria-controls="panel-account">Account</button>
    <button type="button" role="tab" id="tab-password" aria-selected="false" aria-controls="panel-password" tabindex="-1">Password</button>
  </div>
  <div role="tabpanel" id="panel-account" aria-labelledby="tab-account">
    <p>Make changes to your account here.</p>
  </div>
  <div role="tabpanel" id="panel-password" aria-labelledby="tab-password" hidden>
    <p>Change your password here.</p>
  </div>
</div>`
    },
    {
      title: "Line variant",
      html: `<div class="tabs" data-demo="tabs">
  <div role="tablist" aria-orientation="horizontal" data-variant="line">
    <button type="button" role="tab" id="tab-overview" aria-selected="true" aria-controls="panel-overview">Overview</button>
    <button type="button" role="tab" id="tab-activity" aria-selected="false" aria-controls="panel-activity" tabindex="-1">Activity</button>
  </div>
  <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview">
    <p>An overview of your project.</p>
  </div>
  <div role="tabpanel" id="panel-activity" aria-labelledby="tab-activity" hidden>
    <p>Recent activity in your project.</p>
  </div>
</div>`
    }
  ],
  textarea: [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-textarea">Message</label>
  <textarea class="textarea" id="demo-textarea" placeholder="Type your message here."></textarea>
  <p>Your message will be copied to the support team.</p>
</div>`
    }
  ],
  tooltip: [
    {
      title: "Default",
      html: `<button type="button" class="btn tooltip" data-tooltip="Add to library" data-arrow>
  Add to library
</button>`
    }
  ],
  accordion: [
    {
      title: "Default",
      html: `<div class="accordion">
  <details open>
    <summary>
      Is it accessible?
      ${chevronDown}
    </summary>
    <div>
      <p>Yes. It uses native details and summary elements.</p>
    </div>
  </details>
  <details>
    <summary>
      Can I style it?
      ${chevronDown}
    </summary>
    <div>
      <p>Yes. The base file owns the anatomy and the Nova style owns the surface.</p>
    </div>
  </details>
</div>`
    },
    {
      title: "Exclusive",
      html: `<div class="accordion">
  <details name="demo-accordion" open>
    <summary>
      Shipping
      ${chevronDown}
    </summary>
    <div>
      <p>Orders placed before 14:00 ship the same day.</p>
    </div>
  </details>
  <details name="demo-accordion">
    <summary>
      Returns
      ${chevronDown}
    </summary>
    <div>
      <p>Returns are accepted within 30 days of delivery.</p>
    </div>
  </details>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="accordion">
  <details inert>
    <summary>
      Archived section
      ${chevronDown}
    </summary>
    <div>
      <p>This section cannot be opened.</p>
    </div>
  </details>
</div>`
    }
  ],
  "aspect-ratio": [
    {
      title: "16 / 9",
      html: `<div class="aspect-ratio" style="--ratio: 16 / 9">
  <img src="${ratioImage}" alt="A 16 by 9 media placeholder" />
</div>`
    },
    {
      title: "Square, contain",
      html: `<div class="aspect-ratio" style="--ratio: 1 / 1; max-width: 16rem" data-fit="contain">
  <img src="${ratioImage}" alt="A wide media placeholder inside a square frame" />
</div>`
    }
  ],
  avatar: [
    {
      title: "Sizes",
      html: `<div style="display: flex; align-items: center; gap: 0.75rem">
  <span class="avatar" data-size="sm"><span data-slot="fallback">SM</span></span>
  <span class="avatar"><span data-slot="fallback">AV</span></span>
  <span class="avatar" data-size="lg"><span data-slot="fallback">LG</span></span>
</div>`
    },
    {
      title: "Image and badge",
      html: `<span class="avatar" data-size="lg">
  <img src="${avatarImage}" alt="Ada Lovelace" />
  <span data-slot="fallback" aria-hidden="true">AL</span>
  <span data-slot="badge" aria-hidden="true"></span>
</span>`
    },
    {
      title: "Group",
      html: `<div class="avatar-group">
  <span class="avatar"><span data-slot="fallback">AL</span></span>
  <span class="avatar"><span data-slot="fallback">GR</span></span>
  <span class="avatar"><span data-slot="fallback">TS</span></span>
  <span class="avatar"><span data-slot="fallback">+3</span></span>
</div>`
    }
  ],
  breadcrumb: [
    {
      title: "Default",
      html: `<nav class="breadcrumb" aria-label="breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><a href="#">Components</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><span aria-current="page">Breadcrumb</span></li>
  </ol>
</nav>`
    },
    {
      title: "Collapsed",
      html: `<nav class="breadcrumb" aria-label="breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><span data-slot="ellipsis" aria-hidden="true">${moreHorizontal}</span></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><a href="#">Components</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><span aria-current="page">Breadcrumb</span></li>
  </ol>
</nav>`
    }
  ],
  pagination: [
    {
      title: "Default",
      html: `<nav class="pagination" aria-label="pagination">
  <ul>
    <li>
      <a class="btn" data-variant="ghost" data-size="icon" href="#" aria-label="Go to previous page">${chevronLeft}</a>
    </li>
    <li><a class="btn" data-variant="ghost" href="#" aria-current="page">1</a></li>
    <li><a class="btn" data-variant="ghost" href="#">2</a></li>
    <li><a class="btn" data-variant="ghost" href="#">3</a></li>
    <li>
      <a class="btn" data-variant="ghost" data-size="icon" href="#" aria-label="Go to next page">${chevronRight}</a>
    </li>
  </ul>
</nav>`
    },
    {
      title: "With ellipsis",
      html: `<nav class="pagination" aria-label="pagination">
  <ul>
    <li>
      <a class="btn" data-variant="ghost" href="#" aria-label="Go to previous page">
        ${chevronLeft}
        <span data-slot="label" aria-hidden="true">Previous</span>
      </a>
    </li>
    <li><a class="btn" data-variant="ghost" href="#">1</a></li>
    <li><a class="btn" data-variant="ghost" href="#">2</a></li>
    <li><a class="btn" data-variant="ghost" href="#">3</a></li>
    <li><span data-slot="ellipsis" aria-hidden="true">${moreHorizontal}</span></li>
    <li><a class="btn" data-variant="ghost" href="#">8</a></li>
    <li><a class="btn" data-variant="ghost" href="#">9</a></li>
    <li><a class="btn" data-variant="ghost" href="#" aria-current="page">10</a></li>
    <li>
      <a class="btn" data-variant="ghost" href="#" aria-label="Go to next page">
        <span data-slot="label" aria-hidden="true">Next</span>
        ${chevronRight}
      </a>
    </li>
  </ul>
</nav>`
    }
  ],
  progress: [
    {
      title: "Determinate",
      html: `<progress class="progress" value="60" max="100" aria-label="Upload progress">60%</progress>`
    },
    {
      title: "Indeterminate",
      html: `<progress class="progress" max="100" aria-label="Loading">Loading…</progress>`
    }
  ],
  separator: [
    {
      title: "Horizontal",
      html: `<div style="display: grid; gap: 0.75rem">
  <p>loseta components</p>
  <hr class="separator" />
  <p>Native CSS with copy-paste distribution.</p>
</div>`
    },
    {
      title: "Vertical",
      html: `<div style="display: flex; align-items: center; gap: 1rem; height: 1.5rem">
  <span>Blog</span>
  <div class="separator" role="separator" aria-orientation="vertical" data-orientation="vertical"></div>
  <span>Docs</span>
  <div class="separator" role="separator" aria-orientation="vertical" data-orientation="vertical"></div>
  <span>Source</span>
</div>`
    }
  ],
  spinner: [
    {
      title: "Sizes",
      html: `<div style="display: flex; align-items: center; gap: 1rem">
  <span class="spinner" data-size="sm" role="status"><span class="sr-only">Loading</span></span>
  <span class="spinner" role="status"><span class="sr-only">Loading</span></span>
  <span class="spinner" data-size="lg" role="status"><span class="sr-only">Loading</span></span>
</div>`
    },
    {
      title: "With a label",
      html: `<div style="display: flex; align-items: center; gap: 0.5rem">
  <span class="spinner" data-size="sm" aria-hidden="true"></span>
  <span>Loading results…</span>
</div>`
    }
  ],
  toggle: [
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bold</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="true" data-demo-toggle>Italic</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="false" disabled>Underline</button>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="toggle" data-size="sm" aria-pressed="false" data-demo-toggle>Small</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Default</button>
  <button type="button" class="toggle" data-size="lg" aria-pressed="false" data-demo-toggle>Large</button>
</div>`
    }
  ],
  "toggle-group": [
    {
      title: "Joined",
      html: `<div class="toggle-group" role="group" aria-label="Text alignment" data-spacing="joined">
  <button type="button" class="toggle" aria-pressed="true" data-demo-toggle aria-label="Align left">${alignLeft}</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle aria-label="Align center">${alignCenter}</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle aria-label="Align right">${alignRight}</button>
</div>`
    },
    {
      title: "Vertical outline",
      html: `<div class="toggle-group" role="group" aria-label="View density" data-orientation="vertical" data-variant="outline" data-size="sm">
  <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Compact</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Default</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Comfortable</button>
</div>`
    }
  ],
  "context-menu": [
    {
      title: "Default",
      html: `<div data-demo="context-menu" data-demo-context style="display: grid; place-items: center; min-height: 10rem; border: 1px dashed var(--border); border-radius: var(--radius-lg)">
  <p>Right-click anywhere in this area.</p>
  <div class="context-menu" role="menu" aria-hidden="true" style="--context-x: 0px; --context-y: 0px">
    <button type="button" role="menuitem">Profile</button>
    <button type="button" role="menuitem">Billing</button>
    <div role="separator"></div>
    <button type="button" role="menuitem" data-variant="destructive">Delete account</button>
  </div>
</div>`
    }
  ],
  drawer: [
    {
      title: "Default",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer">
  Open drawer
</button>

<dialog class="drawer" id="demo-drawer" data-side="block-end" aria-labelledby="drawer-title">
  <div>
    <span data-slot="handle" aria-hidden="true"></span>
    <header>
      <h2 data-slot="title" id="drawer-title">Edit profile</h2>
      <p data-slot="description">Make changes to your profile here.</p>
    </header>
    <section>
      <div class="field">
        <label class="label" for="drawer-name">Name</label>
        <input class="input" id="drawer-name" value="Ada Lovelace">
      </div>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Save changes</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Large",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-large">
  Open large drawer
</button>

<dialog class="drawer" id="demo-drawer-large" data-side="block-end" data-size="lg" aria-labelledby="drawer-large-title">
  <div>
    <span data-slot="handle" aria-hidden="true"></span>
    <header>
      <h2 data-slot="title" id="drawer-large-title">Filters</h2>
      <p data-slot="description">Narrow the results to the records you need.</p>
    </header>
    <section>
      <p>Use the controls in your application to filter this content.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Apply</button>
    </footer>
  </div>
</dialog>`
    }
  ],
  "hover-card": [
    {
      title: "Default",
      html: `<div style="display: flex; align-items: center; justify-content: center; min-height: 14rem">
  <span class="hover-card">
    <a href="#" aria-describedby="hover-card-profile">@loseta</a>
    <div data-popover data-side="bottom" data-align="start" id="hover-card-profile">
      <div>
        <h3>loseta</h3>
        <p>Native CSS component scaffolds with the shadcn feel.</p>
      </div>
      <p>Joined November 2026</p>
    </div>
  </span>
</div>`
    }
  ],
  menubar: [
    {
      title: "Default",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 16rem; padding-top: 1rem">
  <div class="menubar" role="menubar" aria-label="Main" data-demo="menubar">
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-demo-menu-trigger>File</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">New tab <span class="kbd">⌘T</span></button>
          <button type="button" role="menuitem">New window <span class="kbd">⌘N</span></button>
          <div role="separator"></div>
          <button type="button" role="menuitem">Print <span class="kbd">⌘P</span></button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-demo-menu-trigger>Edit</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">Undo <span class="kbd">⌘Z</span></button>
          <button type="button" role="menuitem">Redo <span class="kbd">⇧⌘Z</span></button>
          <div role="separator"></div>
          <button type="button" role="menuitem">Cut</button>
          <button type="button" role="menuitem">Copy</button>
          <button type="button" role="menuitem">Paste</button>
        </div>
      </div>
    </div>
    <div class="menubar-item" role="none">
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-demo-menu-trigger>View</button>
      <div data-popover data-side="bottom" aria-hidden="true">
        <div role="menu">
          <button type="button" role="menuitem">Zoom in</button>
          <button type="button" role="menuitem">Zoom out</button>
          <div role="separator"></div>
          <button type="button" role="menuitemcheckbox" aria-checked="true">
            <span data-slot="indicator">✓</span>
            Show sidebar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`
    }
  ],
  "navigation-menu": [
    {
      title: "Default",
      html: `<div style="display: flex; justify-content: center; min-height: 18rem; padding-top: 1rem">
  <nav class="navigation-menu" aria-label="Main" data-demo="navigation-menu">
    <ul>
      <li>
        <button type="button" aria-expanded="false" aria-controls="nav-products" data-demo-menu-trigger>
          Products
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="nav-products">
          <ul>
            <li>
              <a href="#">
                <span data-slot="title">Components</span>
                <span data-slot="description">Copy-paste CSS components.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">Styles</span>
                <span data-slot="description">Eight visual interpretations.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">CLI</span>
                <span data-slot="description">Install only what you use.</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li>
        <button type="button" aria-expanded="false" aria-controls="nav-resources" data-demo-menu-trigger>
          Resources
          ${chevronDown}
        </button>
        <div data-popover data-side="bottom" aria-hidden="true" id="nav-resources">
          <ul>
            <li>
              <a href="#">
                <span data-slot="title">Docs</span>
                <span data-slot="description">Installation and component contracts.</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-slot="title">GitHub</span>
                <span data-slot="description">Source and issue tracker.</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
      <li><a href="#">Docs</a></li>
    </ul>
  </nav>
</div>`
    }
  ],
  sheet: [
    {
      title: "Right",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-sheet">
  Open sheet
</button>

<dialog class="sheet" id="demo-sheet" data-side="inline-end" aria-labelledby="sheet-title" aria-describedby="sheet-description">
  <div>
    <header>
      <h2 data-slot="title" id="sheet-title">Edit profile</h2>
      <p data-slot="description" id="sheet-description">Make changes to your profile here.</p>
    </header>
    <section>
      <div class="field">
        <label class="label" for="sheet-name">Name</label>
        <input class="input" id="sheet-name" value="Ada Lovelace">
      </div>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Save changes</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Left, small",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-sheet-left">
  Open left sheet
</button>

<dialog class="sheet" id="demo-sheet-left" data-side="inline-start" data-size="sm" aria-labelledby="sheet-left-title">
  <div>
    <header>
      <h2 data-slot="title" id="sheet-left-title">Navigation</h2>
    </header>
    <section>
      <p>Use the left sheet for navigation or secondary controls.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Close</button>
    </footer>
  </div>
</dialog>`
    }
  ],
  collapsible: [
    {
      title: "Default",
      html: `<details class="collapsible">
  <summary>
    Show details
    ${chevronDown}
  </summary>
  <div>
    <p>This content is revealed with the native details element.</p>
  </div>
</details>`
    },
    {
      title: "Open",
      html: `<details class="collapsible" open>
  <summary>
    Shipping information
    ${chevronDown}
  </summary>
  <div>
    <p>Orders placed before 14:00 ship the same day.</p>
    <p>Tracking details arrive by email.</p>
  </div>
</details>`
    }
  ],
  "input-group": [
    {
      title: "Inline addons",
      html: `<div class="input-group" role="group" aria-label="Email">
  <span data-slot="addon" data-align="inline-start" aria-hidden="true">@</span>
  <input class="input" type="email" placeholder="you@example.com" aria-label="Email">
  <span data-slot="addon" data-align="inline-end">
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Copy email">${copy}</button>
  </span>
</div>`
    },
    {
      title: "Block addon",
      html: `<div class="input-group" role="group" aria-label="Message">
  <span data-slot="addon" data-align="block-start">Message</span>
  <textarea class="textarea" placeholder="Type your message here." aria-label="Message"></textarea>
</div>`
    }
  ],
  "input-otp": [
    {
      title: "Default",
      html: `<input class="input-otp" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" aria-label="One-time code" placeholder="000000">`
    },
    {
      title: "Large",
      html: `<input class="input-otp" data-size="lg" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" aria-label="One-time code" placeholder="000000">`
    }
  ],
  "scroll-area": [
    {
      title: "Vertical",
      html: `<div class="scroll-area" role="region" aria-label="Scrollable content" tabindex="0" style="max-height: 10rem; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 0.75rem">
  <p>loseta copies readable CSS files into your project.</p>
  <p>The registry validates layers, dependencies and generated examples.</p>
  <p>Eight styles share one markup contract.</p>
  <p>The docs site renders the same files consumers install.</p>
  <p>Scrollbars use the reserved scrollbar tokens.</p>
  <p>This region is focusable so keyboard users can scroll it.</p>
  <p>No JavaScript is involved in the scrollbar styling.</p>
</div>`
    },
    {
      title: "Horizontal, small",
      html: `<div class="scroll-area" data-size="sm" data-orientation="horizontal" role="region" aria-label="Scrollable row" tabindex="0" style="border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 0.75rem">
  <div style="display: flex; gap: 0.5rem; width: max-content">
    <span class="badge">Accordion</span>
    <span class="badge">Avatar</span>
    <span class="badge">Breadcrumb</span>
    <span class="badge">Context menu</span>
    <span class="badge">Drawer</span>
    <span class="badge">Hover card</span>
    <span class="badge">Menubar</span>
    <span class="badge">Navigation menu</span>
    <span class="badge">Sheet</span>
  </div>
</div>`
    }
  ],
  slider: [
    {
      title: "Default",
      html: `<input class="slider" type="range" min="0" max="100" value="60" aria-label="Volume">`
    },
    {
      title: "Sizes and disabled",
      html: `<div style="display: grid; gap: 0.75rem">
  <input class="slider" data-size="sm" type="range" min="0" max="100" value="30" aria-label="Small volume">
  <input class="slider" data-size="lg" type="range" min="0" max="100" value="70" aria-label="Large volume">
  <input class="slider" type="range" min="0" max="100" value="50" aria-label="Disabled volume" disabled>
</div>`
    }
  ],
  select: [
    {
      title: "Default",
      html: `<div class="select" data-demo="select">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="select-fruit-panel" aria-label="Fruit" data-demo-select-trigger>
    <span data-slot="value" data-placeholder>Select a fruit</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="select-fruit-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Apple</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Banana</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Orange</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-disabled="true">
        <span data-slot="text">Pineapple</span>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Small, selected",
      html: `<div class="select" data-size="sm" data-demo="select">
  <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="select-fruit-small-panel" aria-label="Fruit" data-demo-select-trigger>
    <span data-slot="value">Apple</span>
    ${chevronDown}
  </button>
  <div data-popover data-side="bottom" aria-hidden="true" id="select-fruit-small-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="true" data-demo-option>
        <span data-slot="text">Apple</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Banana</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
      <div role="option" aria-selected="false" data-demo-option>
        <span data-slot="text">Orange</span>
        <span data-slot="indicator" aria-hidden="true">✓</span>
      </div>
    </div>
  </div>
</div>`
    }
  ],
  combobox: [
    {
      title: "Single",
      html: `<div class="combobox" data-demo="combobox">
  <input role="combobox" aria-expanded="false" aria-controls="combobox-fruit-panel" aria-autocomplete="list" placeholder="Search fruit..." aria-label="Search fruit" data-demo-combobox-input>
  <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="clear" data-demo-clear aria-label="Clear">×</button>
  <div data-popover data-side="bottom" aria-hidden="true" id="combobox-fruit-panel">
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Apple</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Banana</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Orange</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Pineapple</span></div>
      <div data-slot="empty" hidden>No fruit found.</div>
    </div>
  </div>
</div>`
    },
    {
      title: "Multiple",
      html: `<div class="combobox" data-demo="combobox">
  <input role="combobox" aria-expanded="false" aria-controls="combobox-tag-panel" aria-autocomplete="list" placeholder="Search tags..." aria-label="Search tags" data-demo-combobox-input>
  <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="clear" data-demo-clear aria-label="Clear">×</button>
  <div data-popover data-side="bottom" aria-hidden="true" id="combobox-tag-panel">
    <div role="listbox" aria-label="Tags" aria-multiselectable="true">
      <div role="option" aria-selected="true" data-demo-option><span data-slot="text">Design</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Engineering</span></div>
      <div role="option" aria-selected="true" data-demo-option><span data-slot="text">Docs</span></div>
      <div data-slot="empty" hidden>No tags found.</div>
    </div>
  </div>
</div>`
    }
  ],
  command: [
    {
      title: "Dialog",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-command">
  Open command
</button>

<dialog class="dialog" id="demo-command" aria-labelledby="command-title" aria-describedby="command-description">
  <div>
    <header>
      <h2 data-slot="title" id="command-title">Command palette</h2>
      <p data-slot="description" id="command-description">Search for a command to run.</p>
    </header>
    <section>
      <div class="command" data-demo="command">
        <div class="input-group" role="group" aria-label="Search commands">
          <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
          <input class="input" type="text" placeholder="Type a command..." aria-label="Search commands" data-demo-command-input autofocus>
        </div>
        <div role="listbox" aria-label="Commands">
          <div role="group" aria-labelledby="command-group-navigation">
            <div data-slot="label" id="command-group-navigation">Navigation</div>
            <div role="option" data-demo-option>
              <span data-slot="text">Go home</span>
              <span data-slot="shortcut">⌘H</span>
            </div>
            <div role="option" data-demo-option>
              <span data-slot="text">Open settings</span>
              <span data-slot="shortcut">⌘,</span>
            </div>
          </div>
          <div role="group" aria-labelledby="command-group-actions">
            <div data-slot="label" id="command-group-actions">Actions</div>
            <div role="option" data-demo-option>
              <span data-slot="text">Copy link</span>
            </div>
            <div role="option" data-demo-option>
              <span data-slot="text">Download</span>
            </div>
          </div>
          <div data-slot="empty" hidden>No commands found.</div>
        </div>
      </div>
    </section>
  </div>
</dialog>`
    }
  ]
};
