import type { Example } from "./types";
import { cardCover, chevronDown, chevronRightSmall } from "./icons";

export const cardExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="card" style="max-width: 24rem">
  <header data-separator="bottom">
    <h3 data-slot="title">Create project</h3>
    <p data-slot="description">Deploy your new project in one click.</p>
    <a data-slot="action" href="#">Docs</a>
  </header>
  <section>
    <div class="field">
      <label class="label" for="demo-card-name">Name</label>
      <input class="input" id="demo-card-name" placeholder="My project">
    </div>
  </section>
  <footer style="justify-content: flex-end; gap: 0.5rem">
    <button class="btn" data-variant="outline">Cancel</button>
    <button class="btn">Create</button>
  </footer>
</div>`
    },
    {
      title: "Login",
      html: `<div class="card" style="max-width: 24rem">
  <header>
    <h3 data-slot="title">Login to your account</h3>
    <p data-slot="description">Enter your email below to login to your account.</p>
    <a data-slot="action" href="#">Sign up</a>
  </header>
  <section>
    <div class="fieldset">
      <div class="field">
        <label class="label" for="demo-card-login-email">Email</label>
        <input class="input" id="demo-card-login-email" type="email" autocomplete="email" placeholder="m@example.com" required>
      </div>
      <div class="field">
        <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem">
          <label class="label" for="demo-card-login-password">Password</label>
          <a href="#">Forgot your password?</a>
        </div>
        <input class="input" id="demo-card-login-password" type="password" autocomplete="current-password" required>
      </div>
    </div>
  </section>
  <footer style="flex-direction: column; align-items: stretch; gap: 0.5rem">
    <button class="btn" type="button">Login</button>
    <button class="btn" data-variant="outline" type="button">Login with Google</button>
  </footer>
</div>`
    },
    {
      title: "Small",
      html: `<div class="card" data-size="sm" style="max-width: 20rem">
  <header>
    <h3 data-slot="title">Scheduled reports</h3>
    <p data-slot="description">Weekly snapshots. No more manual exports.</p>
  </header>
  <section>
    <ul style="display: grid; gap: 0.5rem; margin: 0; padding: 0; list-style: none">
      <li style="display: flex; align-items: flex-start; gap: 0.5rem">
        <span style="flex-shrink: 0; color: var(--muted-foreground); padding-block-start: 0.125rem">${chevronRightSmall}</span>
        <span>Choose a schedule (daily or weekly).</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.5rem">
        <span style="flex-shrink: 0; color: var(--muted-foreground); padding-block-start: 0.125rem">${chevronRightSmall}</span>
        <span>Send to channels or specific teammates.</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.5rem">
        <span style="flex-shrink: 0; color: var(--muted-foreground); padding-block-start: 0.125rem">${chevronRightSmall}</span>
        <span>Include charts, tables, and key metrics.</span>
      </li>
    </ul>
  </section>
  <footer style="flex-direction: column; align-items: stretch; gap: 0.5rem">
    <button class="btn" data-size="sm" type="button">Set up scheduled reports</button>
    <button class="btn" data-variant="outline" data-size="sm" type="button">See what's new</button>
  </footer>
</div>`
    },
    {
      title: "Image",
      html: `<div class="card" style="max-width: 24rem">
  <img src="${cardCover}" alt="Abstract gradient cover with layered shapes" style="aspect-ratio: 16 / 9; object-fit: cover">
  <header>
    <span class="badge" data-variant="secondary" data-slot="action">Featured</span>
    <h3 data-slot="title">Design systems meetup</h3>
    <p data-slot="description">A practical talk on component APIs, accessibility, and shipping faster.</p>
  </header>
  <footer>
    <button class="btn" type="button" style="inline-size: 100%">View event</button>
  </footer>
</div>`
    },
    {
      title: "Edge to edge",
      html: `<div class="card" style="max-width: 24rem">
  <header>
    <h3 data-slot="title" id="demo-card-terms-title">Terms of service</h3>
    <p data-slot="description">Review the terms before accepting the agreement.</p>
  </header>
  <section>
    <div role="region" aria-labelledby="demo-card-terms-title" tabindex="0" style="max-height: 11rem; overflow-y: auto; margin-inline: calc(-1 * var(--card-spacing)); margin-block-end: calc(-1 * var(--card-spacing)); border-block-start: 1px solid var(--border); background-color: color-mix(in oklab, var(--muted) 50%, transparent); padding-block: 1rem; padding-inline: var(--card-spacing); line-height: 1.625">
      <p>These terms govern your use of the workspace, including access to shared documents, project files, and collaboration tools.</p>
      <p>You are responsible for the content you upload and for ensuring that your team has the appropriate permissions to view or edit it.</p>
      <p>We may update features or limits as the service evolves. When those changes materially affect your workflow, we will notify your workspace administrators.</p>
      <p>By continuing, you agree to keep your account credentials secure and to follow your organization's acceptable use policies.</p>
    </div>
  </section>
  <footer style="justify-content: flex-end; gap: 0.5rem">
    <button class="btn" data-variant="outline">Decline</button>
    <button class="btn">Accept</button>
  </footer>
</div>`
    },
    {
      title: "Spacing",
      html: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); align-items: start; gap: 1rem">
  <div class="card" style="--card-spacing: 1rem">
    <header>
      <h3 data-slot="title">16px</h3>
      <p data-slot="description">Compact spacing.</p>
    </header>
  </div>
  <div class="card" style="--card-spacing: 1.5rem">
    <header>
      <h3 data-slot="title">24px</h3>
      <p data-slot="description">Comfortable spacing.</p>
    </header>
  </div>
  <div class="card" style="--card-spacing: 2rem">
    <header>
      <h3 data-slot="title">32px</h3>
      <p data-slot="description">Roomy spacing.</p>
    </header>
  </div>
</div>`
    },
    {
      title: "Accordion",
      html: `<div class="card" style="max-width: 24rem">
  <header>
    <h3 data-slot="title">Subscription &amp; billing</h3>
    <p data-slot="description">Common questions about your account, plans, payments and cancellations.</p>
  </header>
  <section>
    <div class="accordion">
      <details open>
        <summary>
          What subscription plans do you offer?
          ${chevronDown}
        </summary>
        <div>
          <p>We offer three tiers: Starter, Professional and Enterprise. Each plan includes increasing storage limits, API access, priority support and team collaboration features.</p>
        </div>
      </details>
      <details>
        <summary>
          How does billing work?
          ${chevronDown}
        </summary>
        <div>
          <p>Billing occurs automatically at the start of each cycle. You receive an invoice by email after each payment.</p>
        </div>
      </details>
      <details>
        <summary>
          How do I cancel my subscription?
          ${chevronDown}
        </summary>
        <div>
          <p>Cancel any time from your account settings. Access continues until the end of the current billing period.</p>
        </div>
      </details>
    </div>
  </section>
</div>`
    },
    {
      title: "Skeleton",
      html: `<div class="card" aria-busy="true" style="inline-size: 100%; max-width: 20rem">
  <span class="sr-only">Loading project</span>
  <header>
    <div class="skeleton" style="block-size: 1rem; inline-size: 66%"></div>
    <div class="skeleton" style="block-size: 1rem; inline-size: 50%"></div>
  </header>
  <section>
    <div class="skeleton" style="aspect-ratio: 16 / 9; inline-size: 100%"></div>
  </section>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="card" dir="rtl" lang="ar" style="max-width: 24rem">
  <header>
    <h3 data-slot="title">تسجيل الدخول إلى حسابك</h3>
    <p data-slot="description">أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك.</p>
    <a data-slot="action" href="#">إنشاء حساب</a>
  </header>
  <section>
    <div class="fieldset">
      <div class="field">
        <label class="label" for="demo-card-rtl-email">البريد الإلكتروني</label>
        <input class="input" id="demo-card-rtl-email" type="email" dir="ltr" placeholder="m@example.com">
      </div>
      <div class="field">
        <label class="label" for="demo-card-rtl-password">كلمة المرور</label>
        <input class="input" id="demo-card-rtl-password" type="password" dir="ltr">
      </div>
    </div>
  </section>
  <footer>
    <button class="btn" type="button" style="inline-size: 100%">تسجيل الدخول</button>
  </footer>
</div>`
    }
];
