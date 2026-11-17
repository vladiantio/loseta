export interface Example {
  title: string;
  html: string;
}

const arrowRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const search = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
const shield = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1 1 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`;
const copy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const wrap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><path d="M3 12h15a3 3 0 1 1 0 6h-4"/><polyline points="16 16 14 18 16 20"/><line x1="3" x2="10" y1="18" y2="18"/></svg>`;
const chevronDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
const chevronLeft = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`;
const chevronRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;
const moreHorizontal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;
const bold = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>`;
const italic = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>`;
const underline = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>`;
const bookmark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"/></svg>`;
const list = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>`;
const grid = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`;
const cards = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`;
const avatarImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23cbd5e1'/%3E%3Ccircle cx='32' cy='24' r='11' fill='%23475569'/%3E%3Cpath d='M10 64c0-12 10-22 22-22s22 10 22 22z' fill='%23475569'/%3E%3C/svg%3E`;
const fileText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;
const terminal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`;
const globe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
const info = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
const circleAlert = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;
const circleCheck = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>`;
const triangleAlert = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
const arrowDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`;
const close = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
const trash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
const bluetooth = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 7 10 10-5 5V2l5 5L7 17"/></svg>`;
const circlePlus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`;
const dialogParagraphs = Array.from(
  { length: 8 },
  () =>
    "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>"
).join("\n      ");
const plus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
const plusInline = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="inline-start"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
const arrowUpRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="inline-end"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`;
const folderCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 10.5 8 13l2 2.5"/><path d="m14 10.5 2 2.5-2 2.5"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`;
const bell = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>`;
const refresh = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="inline-start"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`;
const minus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>`;
const volumeLow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="inline-size: 1rem; block-size: 1rem"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const volumeHigh = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="inline-size: 1rem; block-size: 1rem"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
const bot = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="inline-start"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;
const branch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="inline-start"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`;
const fork = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-icon="inline-start"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>`;
const ratioImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 90'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%2394a3b8'/%3E%3Cstop offset='1' stop-color='%23e2e8f0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='160' height='90' fill='url(%23g)'/%3E%3Ctext x='80' y='49' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%23334155'%3E16:9%3C/text%3E%3C/svg%3E`;
const emptyIllustration = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'%3E%3Cdefs%3E%3ClinearGradient id='s' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%23c7d2fe'/%3E%3Cstop offset='1' stop-color='%23fbcfe8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='320' height='180' fill='url(%23s)'/%3E%3Ccircle cx='250' cy='45' r='22' fill='%23ffffff' opacity='.7'/%3E%3Cpath d='M0 180 100 80l55 55 40-40 125 85z' fill='%2394a3b8'/%3E%3Cpath d='M0 180 80 110l65 45 60-30 115 55z' fill='%2364758b'/%3E%3C/svg%3E`;

export const examples: Record<string, Example[]> = {
  alert: [
    {
      title: "Default",
      html: `<div class="alert" role="alert">
  ${circleCheck}
  <h3 data-slot="title">Heads up!</h3>
  <section>
    <p>You can add components and dependencies to your app using the CLI.</p>
  </section>
</div>`
    },
    {
      title: "Destructive",
      html: `<div class="alert" data-variant="destructive" role="alert">
  ${circleAlert}
  <h3 data-slot="title">Payment failed</h3>
  <section>
    <p>Your payment could not be processed. Please check your payment method and try again.</p>
  </section>
</div>`
    },
    {
      title: "Action",
      html: `<div class="alert" role="alert">
  <h3 data-slot="title">Dark mode is now available</h3>
  <p data-slot="description">Enable it under your profile settings to get started.</p>
  <footer>
    <button type="button" class="btn" data-size="xs">Enable</button>
  </footer>
</div>`
    },
    {
      title: "Description container",
      html: `<div class="alert" role="alert">
  <h3 data-slot="title">Using the CLI</h3>
  <div data-slot="description">
    <p>Add components and dependencies with the CLI.</p>
    <p>Then customize the alert with your own tokens.</p>
  </div>
</div>`
    },
    {
      title: "Custom colors",
      html: `<div class="alert" role="alert" style="--card: color-mix(in oklab, var(--chart-4) 10%, var(--background)); --border: color-mix(in oklab, var(--chart-4) 40%, var(--background)); --muted-foreground: color-mix(in oklab, var(--chart-4) 35%, var(--foreground))">
  ${triangleAlert}
  <h3 data-slot="title">Your subscription will expire in 3 days.</h3>
  <section>
    <p>Renew now to avoid service interruption or upgrade to a paid plan to continue using the service.</p>
  </section>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: grid; gap: 1rem">
  <div class="alert" role="alert">
    ${circleCheck}
    <h3 data-slot="title">تم الدفع بنجاح</h3>
    <section>
      <p>تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.</p>
    </section>
  </div>
  <div class="alert" role="alert">
    ${info}
    <h3 data-slot="title">ميزة جديدة متاحة</h3>
    <section>
      <p>لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.</p>
    </section>
  </div>
</div>`
    }
  ],
  "alert-dialog": [
    {
      title: "Default",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-alert-dialog-default">
  Open alert dialog
</button>

<dialog class="alert-dialog" id="demo-alert-dialog-default" aria-labelledby="alert-dialog-default-title" aria-describedby="alert-dialog-default-description">
  <div>
    <header>
      <h2 data-slot="title" id="alert-dialog-default-title">Are you sure?</h2>
      <p data-slot="description" id="alert-dialog-default-description">
        This action cannot be undone.
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Continue</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Destructive",
      html: `<button type="button" class="btn" data-variant="destructive" data-open-dialog="demo-alert-dialog-destructive">
  Delete chat
</button>

<dialog class="alert-dialog" id="demo-alert-dialog-destructive" data-size="sm" aria-labelledby="alert-dialog-destructive-title" aria-describedby="alert-dialog-destructive-description">
  <div>
    <header>
      <figure data-variant="destructive">${trash}</figure>
      <h2 data-slot="title" id="alert-dialog-destructive-title">Delete chat?</h2>
      <p data-slot="description" id="alert-dialog-destructive-description">
        This will permanently delete this chat conversation. View <a href="#">Settings</a> to delete any memories saved during this chat.
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-variant="destructive" data-close-dialog>Delete</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Small",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-alert-dialog-small">
  Show small alert dialog
</button>

<dialog class="alert-dialog" id="demo-alert-dialog-small" data-size="sm" aria-labelledby="alert-dialog-small-title" aria-describedby="alert-dialog-small-description">
  <div>
    <header>
      <h2 data-slot="title" id="alert-dialog-small-title">Allow accessory to connect?</h2>
      <p data-slot="description" id="alert-dialog-small-description">
        Do you want to allow the USB accessory to connect to this device?
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Don't allow</button>
      <button type="button" class="btn" data-close-dialog>Allow</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Media",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-alert-dialog-media">
  Share project
</button>

<dialog class="alert-dialog" id="demo-alert-dialog-media" aria-labelledby="alert-dialog-media-title" aria-describedby="alert-dialog-media-description">
  <div>
    <header>
      <figure>${circlePlus}</figure>
      <h2 data-slot="title" id="alert-dialog-media-title">Share this project?</h2>
      <p data-slot="description" id="alert-dialog-media-description">
        Anyone with the link will be able to view and edit this project.
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Share</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Small with media",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-alert-dialog-small-media">
  Show small media alert
</button>

<dialog class="alert-dialog" id="demo-alert-dialog-small-media" data-size="sm" aria-labelledby="alert-dialog-small-media-title" aria-describedby="alert-dialog-small-media-description">
  <div>
    <header>
      <figure>${bluetooth}</figure>
      <h2 data-slot="title" id="alert-dialog-small-media-title">Allow accessory to connect?</h2>
      <p data-slot="description" id="alert-dialog-small-media-description">
        Do you want to allow the USB accessory to connect to this device?
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Don't allow</button>
      <button type="button" class="btn" data-close-dialog>Allow</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "With image",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-alert-dialog-image">
  Remove teammate
</button>

<dialog class="alert-dialog" id="demo-alert-dialog-image" aria-labelledby="alert-dialog-image-title" aria-describedby="alert-dialog-image-description">
  <div>
    <header>
      <figure><img src="${avatarImage}" alt="" width="40" height="40"></figure>
      <h2 data-slot="title" id="alert-dialog-image-title">Remove teammate?</h2>
      <p data-slot="description" id="alert-dialog-image-description">
        They will lose access to this workspace and its documents.
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-variant="destructive" data-close-dialog>Remove</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" data-variant="outline" data-open-dialog="demo-alert-dialog-rtl">
    إظهار الحوار
  </button>

  <dialog class="alert-dialog" id="demo-alert-dialog-rtl" data-size="sm" aria-labelledby="alert-dialog-rtl-title" aria-describedby="alert-dialog-rtl-description">
    <div>
      <header>
        <figure>${bluetooth}</figure>
        <h2 data-slot="title" id="alert-dialog-rtl-title">السماح للملحق بالاتصال؟</h2>
        <p data-slot="description" id="alert-dialog-rtl-description">
          هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟
        </p>
      </header>
      <footer>
        <button type="button" class="btn" data-variant="outline" data-close-dialog>عدم السماح</button>
        <button type="button" class="btn" data-close-dialog>السماح</button>
      </footer>
    </div>
  </dialog>
</div>`
    }
  ],
  badge: [
    {
      title: "Default",
      html: `<span class="badge">Badge</span>`
    },
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
      title: "Default",
      html: `<button type="button" class="btn">Button</button>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn">Default</button>
  <button type="button" class="btn" data-variant="secondary">Secondary</button>
  <button type="button" class="btn" data-variant="outline">Outline</button>
  <button type="button" class="btn" data-variant="ghost">Ghost</button>
  <button type="button" class="btn" data-variant="link">Link</button>
  <button type="button" class="btn" data-variant="destructive">Destructive</button>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="btn" data-size="xs">Extra small</button>
  <button type="button" class="btn" data-size="sm">Small</button>
  <button type="button" class="btn">Default</button>
  <button type="button" class="btn" data-size="lg">Large</button>
</div>`
    },
    {
      title: "Icon buttons",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="btn" data-size="icon-xs" aria-label="Add">${plus}</button>
  <button type="button" class="btn" data-size="icon-sm" aria-label="Search">${search}</button>
  <button type="button" class="btn" data-size="icon" aria-label="Next">${arrowRight}</button>
  <button type="button" class="btn" data-size="icon-lg" aria-label="More options">${chevronDown}</button>
</div>`
    },
    {
      title: "With icons",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="btn">${branch}New branch</button>
  <button type="button" class="btn" data-variant="outline">${fork}Fork</button>
  <button type="button" class="btn" data-variant="ghost">Continue<svg data-icon="inline-end" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
</div>`
    },
    {
      title: "Rounded",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" style="border-radius: var(--radius-full)">Get started</button>
  <button type="button" class="btn" data-variant="outline" style="border-radius: var(--radius-full)">Documentation</button>
</div>`
    },
    {
      title: "Loading",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" aria-busy="true"><span class="spinner" data-icon="inline-start" aria-hidden="true"></span>Generating</button>
  <button type="button" class="btn" data-variant="outline" aria-busy="true"><span class="spinner" data-icon="inline-start" aria-hidden="true"></span>Downloading</button>
</div>`
    },
    {
      title: "Disabled and invalid",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" disabled>Disabled</button>
  <button type="button" class="btn" data-variant="outline" disabled>Disabled</button>
  <button type="button" class="btn" aria-invalid="true">Invalid</button>
</div>`
    },
    {
      title: "As link",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <a class="btn" href="#">Login</a>
  <a class="btn" data-variant="outline" href="#">Read the docs</a>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn">${branch}New branch</button>
  <button type="button" class="btn" data-variant="outline">${fork}Fork</button>
</div>`
    }
  ],
  "button-group": [
    {
      title: "Default",
      html: `<div class="btn-group" role="group" aria-label="History">
  <button type="button" class="btn" data-variant="outline">Undo</button>
  <button type="button" class="btn" data-variant="outline">Redo</button>
</div>`
    },
    {
      title: "Orientation",
      html: `<div style="display: flex; align-items: flex-start; gap: 1rem">
  <div class="btn-group" role="group" aria-label="Zoom">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Zoom out">${minus}</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Zoom in">${plus}</button>
  </div>
  <div class="btn-group" role="group" aria-label="Volume" data-orientation="vertical">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Volume up">${plus}</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Volume down">${minus}</button>
  </div>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem">
  <div class="btn-group" role="group" aria-label="Small actions">
    <button type="button" class="btn" data-variant="outline" data-size="sm">Small</button>
    <button type="button" class="btn" data-variant="outline" data-size="sm">Button</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon-sm" aria-label="Add">${plus}</button>
  </div>
  <div class="btn-group" role="group" aria-label="Default actions">
    <button type="button" class="btn" data-variant="outline">Default</button>
    <button type="button" class="btn" data-variant="outline">Button</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Add">${plus}</button>
  </div>
  <div class="btn-group" role="group" aria-label="Large actions">
    <button type="button" class="btn" data-variant="outline" data-size="lg">Large</button>
    <button type="button" class="btn" data-variant="outline" data-size="lg">Button</button>
    <button type="button" class="btn" data-variant="outline" data-size="icon-lg" aria-label="Add">${plus}</button>
  </div>
</div>`
    },
    {
      title: "Text",
      html: `<div class="btn-group" role="group" aria-label="Project URL">
  <label class="label" for="demo-button-group-url">https://</label>
  <input class="input" id="demo-button-group-url" type="text" placeholder="example.com">
  <button type="button" class="btn" data-variant="outline">Copy</button>
</div>`
    },
    {
      title: "Separator",
      html: `<div class="btn-group" role="group" aria-label="Clipboard">
  <button type="button" class="btn" data-variant="secondary">Copy</button>
  <hr role="separator" aria-orientation="vertical">
  <button type="button" class="btn" data-variant="secondary">Paste</button>
</div>`
    },
    {
      title: "Split",
      html: `<div class="btn-group" role="group" aria-label="New project">
  <button type="button" class="btn" data-variant="secondary">New project</button>
  <hr role="separator" aria-orientation="vertical">
  <button type="button" class="btn" data-variant="secondary" data-size="icon" aria-label="New project options">${chevronDown}</button>
</div>`
    },
    {
      title: "Input",
      html: `<div class="btn-group" role="group" aria-label="Search">
  <input class="input" type="search" placeholder="Search components..." aria-label="Search components">
  <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Search">${search}</button>
</div>`
    },
    {
      title: "Dropdown menu",
      html: `<div class="btn-group" role="group" aria-label="Conversation actions">
  <button type="button" class="btn" data-variant="outline">Follow</button>
  <div class="dropdown-menu" data-demo="dropdown">
    <button type="button" class="btn" data-variant="outline" data-size="icon" data-demo-trigger aria-haspopup="menu" aria-expanded="false" aria-label="More conversation actions">${chevronDown}</button>
    <div data-popover data-side="bottom" data-align="end" aria-hidden="true" style="width: 11rem">
      <div role="menu">
        <button type="button" role="menuitem">Mute conversation</button>
        <button type="button" role="menuitem">Mark as read</button>
        <button type="button" role="menuitem">Report conversation</button>
        <div role="separator"></div>
        <button type="button" role="menuitem" data-variant="destructive">Delete conversation</button>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Popover",
      html: `<div class="btn-group" role="group" aria-label="Copilot">
  <button type="button" class="btn" data-variant="outline">${bot}Copilot</button>
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="icon" data-demo-trigger aria-expanded="false" aria-label="Start a new task">${chevronDown}</button>
    <div data-popover data-side="bottom" data-align="end" aria-hidden="true">
      <header>
        <h3 data-slot="title">Start a new task</h3>
        <p data-slot="description">Describe your task in natural language.</p>
      </header>
      <div class="field">
        <label class="label" for="demo-button-group-task">Task</label>
        <textarea class="textarea" id="demo-button-group-task" placeholder="I need to..."></textarea>
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Select",
      html: `<div class="btn-group" role="group" aria-label="Send amount">
  <div class="btn-group" role="group" aria-label="Amount">
    <div class="select" data-demo="select">
      <button type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="demo-button-group-currency" aria-label="Currency" data-demo-select-trigger>
        <span data-slot="value">$</span>
        ${chevronDown}
      </button>
      <div data-popover data-side="bottom" aria-hidden="true" id="demo-button-group-currency">
        <div role="listbox" aria-label="Currency">
          <div role="option" aria-selected="true" aria-label="US Dollar" data-demo-option>
            <span data-slot="text">$</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false" aria-label="Euro" data-demo-option>
            <span data-slot="text">€</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
          <div role="option" aria-selected="false" aria-label="British Pound" data-demo-option>
            <span data-slot="text">£</span>
            <span data-slot="indicator" aria-hidden="true">✓</span>
          </div>
        </div>
      </div>
    </div>
    <input class="input" type="text" inputmode="decimal" placeholder="10.00" aria-label="Amount">
  </div>
  <div class="btn-group" role="group" aria-label="Send">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Send">${arrowRight}</button>
  </div>
</div>`
    },
    {
      title: "Nested",
      html: `<div class="btn-group" role="group" aria-label="Message composer">
  <div class="btn-group" role="group" aria-label="Attachments">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Add attachment">${plus}</button>
  </div>
  <div class="btn-group" role="group" aria-label="Message">
    <input class="input" type="text" placeholder="Send a message..." aria-label="Message">
    <button type="button" class="btn" data-variant="outline" data-size="icon" aria-label="Send message">${arrowRight}</button>
  </div>
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
      html: `<div class="field" data-orientation="horizontal">
  <input class="checkbox" type="checkbox" id="demo-checkbox" checked>
  <label class="label" for="demo-checkbox">Accept terms and conditions</label>
</div>`
    },
    {
      title: "With description",
      html: `<div class="field" data-orientation="horizontal">
  <input class="checkbox" type="checkbox" id="demo-checkbox-description" checked>
  <section>
    <label class="label" for="demo-checkbox-description">Accept terms and conditions</label>
    <p>By clicking this checkbox, you agree to the terms and conditions.</p>
  </section>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field">
  <label class="label" for="demo-checkbox-disabled">
    <input class="checkbox" type="checkbox" id="demo-checkbox-disabled" disabled>
    Enable notifications
  </label>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" data-orientation="horizontal" aria-invalid="true">
  <input class="checkbox" type="checkbox" id="demo-checkbox-invalid" aria-invalid="true">
  <section>
    <label class="label" for="demo-checkbox-invalid">Accept terms and conditions</label>
    <p role="alert">You must accept the terms and conditions to continue.</p>
  </section>
</div>`
    },
    {
      title: "Group",
      html: `<fieldset class="fieldset" style="max-width: 20rem">
  <legend data-variant="label">Show these items on the desktop:</legend>
  <p>Select the items you want to show on the desktop.</p>
  <div role="group" data-slot="checkbox-group" aria-label="Items shown on the desktop">
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-hard-disks" name="desktop-items" value="hard-disks" checked>
      <label class="label" for="demo-checkbox-hard-disks">Hard disks</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-external-disks" name="desktop-items" value="external-disks">
      <label class="label" for="demo-checkbox-external-disks">External disks</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-cds" name="desktop-items" value="cds" checked>
      <label class="label" for="demo-checkbox-cds">CDs, DVDs, and iPods</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-servers" name="desktop-items" value="servers">
      <label class="label" for="demo-checkbox-servers">Connected servers</label>
    </div>
  </div>
</fieldset>`
    },
    {
      title: "With title",
      html: `<div class="field" style="max-width: 28rem">
  <label class="label" for="demo-checkbox-notifications">
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-checkbox-notifications" checked>
      <section>
        <h3>Enable notifications</h3>
        <p>You can enable or disable notifications at any time.</p>
      </section>
    </div>
  </label>
</div>`
    },
    {
      title: "In table",
      html: `<div class="table-container">
  <table class="table">
    <caption>Team members and their roles.</caption>
    <thead>
      <tr>
        <th>
          <input class="checkbox" type="checkbox" role="checkbox" aria-label="Select all rows" data-demo-indeterminate>
        </th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr aria-selected="true">
        <td><input class="checkbox" type="checkbox" role="checkbox" aria-label="Select Sarah Chen" checked></td>
        <td>Sarah Chen</td>
        <td>sarah.chen@example.com</td>
        <td>Admin</td>
      </tr>
      <tr aria-selected="true">
        <td><input class="checkbox" type="checkbox" role="checkbox" aria-label="Select Marcus Rodriguez" checked></td>
        <td>Marcus Rodriguez</td>
        <td>marcus.rodriguez@example.com</td>
        <td>User</td>
      </tr>
      <tr>
        <td><input class="checkbox" type="checkbox" role="checkbox" aria-label="Select Priya Patel"></td>
        <td>Priya Patel</td>
        <td>priya.patel@example.com</td>
        <td>User</td>
      </tr>
      <tr>
        <td><input class="checkbox" type="checkbox" role="checkbox" aria-label="Select David Kim"></td>
        <td>David Kim</td>
        <td>david.kim@example.com</td>
        <td>Editor</td>
      </tr>
    </tbody>
  </table>
</div>`
    }
  ],
  "code-block": [
    {
      title: "Default",
      html: `<div class="code-block" style="max-width: 32rem">
  <pre dir="ltr" tabindex="0"><code>pnpm add loseta</code></pre>
</div>`
    },
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
      title: "Default",
      html: `<button type="button" class="btn" data-open-dialog="demo-dialog-default">Open dialog</button>

<dialog class="dialog" id="demo-dialog-default" aria-labelledby="dialog-default-title" aria-describedby="dialog-default-description">
  <div>
    <header>
      <h2 data-slot="title" id="dialog-default-title">Dialog title</h2>
      <p data-slot="description" id="dialog-default-description">
        This is the dialog content. Add actions or a form to finish the flow.
      </p>
    </header>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Continue</button>
    </footer>
    <form method="dialog">
      <button class="btn" data-variant="ghost" data-size="icon-sm" aria-label="Close">${close}</button>
    </form>
  </div>
</dialog>`
    },
    {
      title: "Edit profile",
      html: `<button type="button" class="btn" data-open-dialog="demo-dialog">Open profile dialog</button>

<dialog class="dialog" id="demo-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
  <div>
    <header>
      <h2 data-slot="title" id="dialog-title">Edit profile</h2>
      <p data-slot="description" id="dialog-description">
        Make changes to your profile here. Click save when you're done.
      </p>
    </header>
    <section>
      <div class="fieldset">
        <div class="field">
          <label class="label" for="dialog-name">Name</label>
          <input class="input" id="dialog-name" value="Ada Lovelace">
        </div>
        <div class="field">
          <label class="label" for="dialog-username">Username</label>
          <input class="input" id="dialog-username" value="@ada">
        </div>
      </div>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Save changes</button>
    </footer>
    <form method="dialog">
      <button class="btn" data-variant="ghost" data-size="icon-sm" aria-label="Close">${close}</button>
    </form>
  </div>
</dialog>`
    },
    {
      title: "Custom close button",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-dialog-close-button">
  Open share dialog
</button>

<dialog class="dialog" id="demo-dialog-close-button" aria-labelledby="dialog-close-title" aria-describedby="dialog-close-description">
  <div>
    <header>
      <h2 data-slot="title" id="dialog-close-title">Share link</h2>
      <p data-slot="description" id="dialog-close-description">
        Anyone who has this link will be able to view this.
      </p>
    </header>
    <section>
      <div class="field">
        <label class="sr-only" for="dialog-share-link">Link</label>
        <input class="input" id="dialog-share-link" value="https://loseta.dev/docs/components/dialog" readonly>
      </div>
    </section>
    <footer data-align="start">
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Close</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "No close button",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-dialog-no-close">
  Open dialog without close
</button>

<dialog class="dialog" id="demo-dialog-no-close" aria-labelledby="dialog-no-close-title" aria-describedby="dialog-no-close-description">
  <div>
    <header>
      <h2 data-slot="title" id="dialog-no-close-title">No close button</h2>
      <p data-slot="description" id="dialog-no-close-description">
        This dialog has no close control. Dismiss it with Escape or your own action.
      </p>
    </header>
  </div>
</dialog>`
    },
    {
      title: "Scrollable content",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-dialog-scrollable">
  Open scrollable dialog
</button>

<dialog class="dialog" id="demo-dialog-scrollable" aria-labelledby="dialog-scrollable-title" aria-describedby="dialog-scrollable-description">
  <div>
    <header>
      <h2 data-slot="title" id="dialog-scrollable-title">Scrollable content</h2>
      <p data-slot="description" id="dialog-scrollable-description">
        The header stays in view while the section scrolls.
      </p>
    </header>
    <section role="region" aria-label="Scrollable content" tabindex="0">
      ${dialogParagraphs}
    </section>
    <form method="dialog">
      <button class="btn" data-variant="ghost" data-size="icon-sm" aria-label="Close">${close}</button>
    </form>
  </div>
</dialog>`
    },
    {
      title: "Sticky footer",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-dialog-sticky-footer">
  Open sticky footer dialog
</button>

<dialog class="dialog" id="demo-dialog-sticky-footer" aria-labelledby="dialog-sticky-footer-title" aria-describedby="dialog-sticky-footer-description">
  <div>
    <header>
      <h2 data-slot="title" id="dialog-sticky-footer-title">Sticky footer</h2>
      <p data-slot="description" id="dialog-sticky-footer-description">
        The footer stays visible while the section scrolls.
      </p>
    </header>
    <section role="region" aria-label="Sticky footer content" tabindex="0">
      ${dialogParagraphs}
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Close</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="btn" data-open-dialog="demo-dialog-rtl">فتح الحوار</button>

  <dialog class="dialog" id="demo-dialog-rtl" aria-labelledby="dialog-rtl-title" aria-describedby="dialog-rtl-description">
    <div>
      <header>
        <h2 data-slot="title" id="dialog-rtl-title">تعديل الملف الشخصي</h2>
        <p data-slot="description" id="dialog-rtl-description">
          قم بإجراء تغييرات على ملفك الشخصي هنا. انقر على حفظ عند الانتهاء.
        </p>
      </header>
      <section>
        <div class="fieldset">
          <div class="field">
            <label class="label" for="dialog-rtl-name">الاسم</label>
            <input class="input" id="dialog-rtl-name" value="آدا لوفليس">
          </div>
          <div class="field">
            <label class="label" for="dialog-rtl-username">اسم المستخدم</label>
            <input class="input" id="dialog-rtl-username" value="@ada">
          </div>
        </div>
      </section>
      <footer>
        <button type="button" class="btn" data-variant="outline" data-close-dialog>إلغاء</button>
        <button type="button" class="btn" data-close-dialog>حفظ التغييرات</button>
      </footer>
      <form method="dialog">
        <button class="btn" data-variant="ghost" data-size="icon-sm" aria-label="إغلاق">${close}</button>
      </form>
    </div>
  </dialog>
</div>`
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
    },
    {
      title: "Actions",
      html: `<div class="empty">
  <header>
    <figure>${folderCode}</figure>
    <h2>No projects yet</h2>
    <p>You haven't created any projects yet. Get started by creating your first project.</p>
  </header>
  <section style="flex-direction: row; justify-content: center">
    <button class="btn">Create project</button>
    <button class="btn" data-variant="outline">Import project</button>
  </section>
  <footer>
    <a class="btn" data-variant="link" data-size="sm" href="#">Learn more ${arrowUpRight}</a>
  </footer>
</div>`
    },
    {
      title: "Background",
      html: `<div class="empty" style="background-color: color-mix(in oklab, var(--muted) 50%, transparent)">
  <header>
    <figure>${bell}</figure>
    <h2>No notifications</h2>
    <p>You're all caught up. New notifications will appear here.</p>
  </header>
  <section>
    <button class="btn" data-variant="outline">${refresh} Refresh</button>
  </section>
</div>`
    },
    {
      title: "Avatar",
      html: `<div class="empty">
  <header>
    <figure>
      <span class="avatar" data-size="lg"><span data-slot="fallback">LR</span></span>
    </figure>
    <h2>User offline</h2>
    <p>This user is currently offline. You can leave a message to notify them or try again later.</p>
  </header>
  <section>
    <button class="btn" data-size="sm">Leave message</button>
  </section>
</div>`
    },
    {
      title: "Avatar group",
      html: `<div class="empty">
  <header>
    <figure>
      <div class="avatar-group">
        <span class="avatar" data-size="lg"><span data-slot="fallback">CN</span></span>
        <span class="avatar" data-size="lg"><span data-slot="fallback">LR</span></span>
        <span class="avatar" data-size="lg"><span data-slot="fallback">ER</span></span>
      </div>
    </figure>
    <h2>No team members</h2>
    <p>Invite your team to collaborate on this project.</p>
  </header>
  <section>
    <button class="btn" data-size="sm">${plusInline} Invite members</button>
  </section>
</div>`
    },
    {
      title: "Image",
      html: `<div class="empty">
  <header>
    <figure><img src="${emptyIllustration}" alt=""></figure>
    <h2>No previews yet</h2>
    <p>Upload an image to see a preview here.</p>
  </header>
  <section>
    <button class="btn" data-variant="outline">Upload image</button>
  </section>
</div>`
    },
    {
      title: "Search",
      html: `<div class="empty">
  <header>
    <h2>404 - Not found</h2>
    <p>The page you're looking for doesn't exist. Try searching for what you need below.</p>
  </header>
  <section>
    <div class="input-group" role="group" aria-label="Search pages">
      <input class="input" type="search" placeholder="Try searching for pages..." aria-label="Search pages">
      <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
      <span data-slot="addon" data-align="inline-end" aria-hidden="true"><span class="kbd">/</span></span>
    </div>
  </section>
  <footer>
    <a class="btn" data-variant="link" data-size="sm" href="#">Contact support</a>
  </footer>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="empty" dir="rtl" lang="ar">
  <header>
    <figure>${folderCode}</figure>
    <h2>لا توجد مشاريع بعد</h2>
    <p>لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.</p>
  </header>
  <section style="flex-direction: row; justify-content: center">
    <button class="btn">إنشاء مشروع</button>
    <button class="btn" data-variant="outline">استيراد مشروع</button>
  </section>
  <footer>
    <a class="btn" data-variant="link" data-size="sm" href="#">تعرف على المزيد</a>
  </footer>
</div>`
    }
  ],
  field: [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-field-default">Name</label>
  <input class="input" id="demo-field-default" placeholder="Ada Lovelace">
</div>`
    },
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
    },
    {
      title: "Input",
      html: `<div class="fieldset" style="max-width: 20rem">
  <div class="field">
    <label class="label" for="demo-field-username">Username</label>
    <input class="input" id="demo-field-username" type="text" placeholder="Max Leiter">
    <p>Choose a unique username for your account.</p>
  </div>
  <div class="field">
    <label class="label" for="demo-field-password">Password</label>
    <p>Must be at least 8 characters long.</p>
    <input class="input" id="demo-field-password" type="password" placeholder="••••••••">
  </div>
</div>`
    },
    {
      title: "Textarea",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-field-feedback">Feedback</label>
  <textarea class="textarea" id="demo-field-feedback" placeholder="Your feedback helps us improve..." rows="4"></textarea>
  <p>Share your thoughts about our service.</p>
</div>`
    },
    {
      title: "Select",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-field-department">Department</label>
  <select class="native-select" id="demo-field-department">
    <option value="" disabled selected>Choose department</option>
    <option value="engineering">Engineering</option>
    <option value="design">Design</option>
    <option value="marketing">Marketing</option>
    <option value="support">Customer Support</option>
  </select>
  <p>Select your department or area of work.</p>
</div>`
    },
    {
      title: "Slider",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-field-budget">Monthly budget</label>
  <p>Set the amount you want to spend each month.</p>
  <input class="slider" type="range" id="demo-field-budget" min="0" max="1000" step="10" value="500">
</div>`
    },
    {
      title: "Fieldset",
      html: `<fieldset class="fieldset" style="max-width: 24rem">
  <legend>Address Information</legend>
  <p>We need your address to deliver your order.</p>
  <div class="field">
    <label class="label" for="demo-field-street">Street Address</label>
    <input class="input" id="demo-field-street" type="text" placeholder="123 Main St">
  </div>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem">
    <div class="field">
      <label class="label" for="demo-field-city">City</label>
      <input class="input" id="demo-field-city" type="text" placeholder="New York">
    </div>
    <div class="field">
      <label class="label" for="demo-field-zip">Postal Code</label>
      <input class="input" id="demo-field-zip" type="text" placeholder="90502">
    </div>
  </div>
</fieldset>`
    },
    {
      title: "Checkbox",
      html: `<fieldset class="fieldset" style="max-width: 20rem">
  <legend data-variant="label">Show these items on the desktop</legend>
  <p>Select the items you want to show on the desktop.</p>
  <div role="group" data-slot="checkbox-group" aria-label="Items shown on the desktop">
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-field-hard-disks" checked>
      <label class="label" for="demo-field-hard-disks">Hard disks</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-field-external-disks">
      <label class="label" for="demo-field-external-disks">External disks</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-field-cds" checked>
      <label class="label" for="demo-field-cds">CDs, DVDs, and iPods</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="checkbox" type="checkbox" id="demo-field-servers">
      <label class="label" for="demo-field-servers">Connected servers</label>
    </div>
  </div>
  <div class="field-separator"><hr class="separator"></div>
  <div class="field" data-orientation="horizontal">
    <input class="checkbox" type="checkbox" id="demo-field-sync-folders" checked>
    <section>
      <label class="label" for="demo-field-sync-folders">Sync Desktop &amp; Documents folders</label>
      <p>Your Desktop &amp; Documents folders are being synced with iCloud Drive. You can access them from other devices.</p>
    </section>
  </div>
</fieldset>`
    },
    {
      title: "Radio",
      html: `<fieldset class="fieldset" style="max-width: 20rem">
  <legend data-variant="label">Subscription Plan</legend>
  <p>Yearly and lifetime plans offer significant savings.</p>
  <div role="radiogroup" data-slot="radio-group" aria-label="Subscription Plan">
    <div class="field" data-orientation="horizontal">
      <input class="radio" type="radio" name="demo-field-plan" id="demo-field-monthly" value="monthly" checked>
      <label class="label" for="demo-field-monthly">Monthly ($9.99/month)</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="radio" type="radio" name="demo-field-plan" id="demo-field-yearly" value="yearly">
      <label class="label" for="demo-field-yearly">Yearly ($99.99/year)</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="radio" type="radio" name="demo-field-plan" id="demo-field-lifetime" value="lifetime">
      <label class="label" for="demo-field-lifetime">Lifetime ($299.99)</label>
    </div>
  </div>
</fieldset>`
    },
    {
      title: "Switch",
      html: `<div class="field" data-orientation="horizontal" style="max-width: 20rem">
  <label class="label" for="demo-field-2fa">Multi-factor authentication</label>
  <input class="switch" type="checkbox" role="switch" id="demo-field-2fa" checked>
</div>`
    },
    {
      title: "Choice card",
      html: `<fieldset class="fieldset" style="max-width: 20rem">
  <legend data-variant="label">Compute Environment</legend>
  <p>Select the compute environment for your cluster.</p>
  <div role="radiogroup" data-slot="radio-group" aria-label="Compute environment">
    <label class="label" for="demo-field-kubernetes">
      <div class="field" data-orientation="horizontal">
        <section>
          <h3>Kubernetes</h3>
          <p>Run GPU workloads on a K8s cluster.</p>
        </section>
        <input class="radio" type="radio" name="demo-field-environment" id="demo-field-kubernetes" value="kubernetes" checked>
      </div>
    </label>
    <label class="label" for="demo-field-virtual-machine">
      <div class="field" data-orientation="horizontal">
        <section>
          <h3>Virtual Machine</h3>
          <p>Access a cluster to run GPU workloads.</p>
        </section>
        <input class="radio" type="radio" name="demo-field-environment" id="demo-field-virtual-machine" value="virtual-machine">
      </div>
    </label>
  </div>
</fieldset>`
    },
    {
      title: "Field group",
      html: `<div class="fieldset" style="max-width: 20rem">
  <fieldset class="fieldset">
    <legend data-variant="label">Responses</legend>
    <p>Get notified when ChatGPT responds to requests that take time, like research or image generation.</p>
    <div role="group" data-slot="checkbox-group" aria-label="Responses">
      <div class="field" data-orientation="horizontal">
        <input class="checkbox" type="checkbox" id="demo-field-responses-push" checked disabled>
        <label class="label" for="demo-field-responses-push">Push notifications</label>
      </div>
    </div>
  </fieldset>
  <div class="field-separator"><hr class="separator"><span>Or</span></div>
  <fieldset class="fieldset">
    <legend data-variant="label">Tasks</legend>
    <p>Get notified when tasks you've created have updates. <a href="#">Manage tasks</a></p>
    <div role="group" data-slot="checkbox-group" aria-label="Tasks">
      <div class="field" data-orientation="horizontal">
        <input class="checkbox" type="checkbox" id="demo-field-tasks-push">
        <label class="label" for="demo-field-tasks-push">Push notifications</label>
      </div>
      <div class="field" data-orientation="horizontal">
        <input class="checkbox" type="checkbox" id="demo-field-tasks-email">
        <label class="label" for="demo-field-tasks-email">Email notifications</label>
      </div>
    </div>
  </fieldset>
</div>`
    },
    {
      title: "Responsive layout",
      html: `<fieldset class="fieldset" style="max-width: 40rem">
  <legend>Profile</legend>
  <p>Fill in your profile information.</p>
  <div role="group" aria-label="Profile fields">
    <div class="field" data-orientation="responsive">
      <section>
        <label class="label" for="demo-field-profile-name">Name</label>
        <p>Provide your full name for identification.</p>
      </section>
      <input class="input" id="demo-field-profile-name" placeholder="Ada Lovelace" required>
    </div>
    <div class="field" data-orientation="responsive">
      <button type="button" class="btn">Submit</button>
      <button type="button" class="btn" data-variant="outline">Cancel</button>
    </div>
  </div>
</fieldset>`
    },
    {
      title: "Validation and errors",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-field-invalid-email">Email</label>
  <input class="input" id="demo-field-invalid-email" type="email" value="ada@example" aria-invalid="true" aria-describedby="demo-field-invalid-error">
  <div id="demo-field-invalid-error" role="alert">
    <ul>
      <li>Enter a valid email address.</li>
      <li>Use the format name@example.com.</li>
    </ul>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="fieldset" dir="rtl" lang="ar" style="max-width: 20rem">
  <div class="field">
    <label class="label" for="demo-field-rtl-name">الاسم على البطاقة</label>
    <input class="input" id="demo-field-rtl-name" placeholder="Ada Lovelace">
  </div>
  <div class="field">
    <label class="label" for="demo-field-rtl-number">رقم البطاقة</label>
    <input class="input" id="demo-field-rtl-number" inputmode="numeric" placeholder="1234 5678 9012 3456">
    <p>أدخل رقم البطاقة المكون من 16 رقمًا.</p>
  </div>
  <div class="field-separator"><hr class="separator"><span>أو</span></div>
  <div class="field" data-orientation="horizontal">
    <section>
      <label class="label" for="demo-field-rtl-shipping">نفس عنوان الشحن</label>
      <p>استخدم عنوان الشحن نفسه لعنوان الفوترة.</p>
    </section>
    <input class="checkbox" type="checkbox" id="demo-field-rtl-shipping" checked>
  </div>
</div>`
    }
  ],
  input: [
    {
      title: "Default",
      html: `<input class="input" type="email" placeholder="you@example.com" aria-label="Email">`
    },
    {
      title: "Field",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-field">Username</label>
  <input class="input" id="demo-input-field" placeholder="Enter your username">
  <p>Choose a unique username for your account.</p>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-disabled">Email</label>
  <input class="input" id="demo-input-disabled" type="email" value="ada@example.com" disabled>
  <p>This field is currently disabled.</p>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-invalid">Username</label>
  <input class="input" id="demo-input-invalid" aria-invalid="true" aria-describedby="demo-input-invalid-error" value="invalid name">
  <p id="demo-input-invalid-error" role="alert">Username may only contain letters and numbers.</p>
</div>`
    },
    {
      title: "File",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-file">Picture</label>
  <input class="input" id="demo-input-file" type="file" accept="image/*">
  <p>Select a picture to upload.</p>
</div>`
    },
    {
      title: "Required",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-required">Required field <span aria-hidden="true" style="color: var(--destructive)">*</span></label>
  <input class="input" id="demo-input-required" placeholder="This field is required" required>
  <p>This field must be filled out.</p>
</div>`
    },
    {
      title: "Grid",
      html: `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; max-width: 30rem">
  <div class="field">
    <label class="label" for="demo-input-first-name">First name</label>
    <input class="input" id="demo-input-first-name" placeholder="Jordan">
  </div>
  <div class="field">
    <label class="label" for="demo-input-last-name">Last name</label>
    <input class="input" id="demo-input-last-name" placeholder="Lee">
  </div>
</div>`
    },
    {
      title: "Inline",
      html: `<div class="field" data-orientation="horizontal" style="max-width: 24rem">
  <input class="input" type="search" placeholder="Search..." aria-label="Search" style="flex: 1">
  <button type="button" class="btn">Search</button>
</div>`
    },
    {
      title: "Badge",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-badge" style="width: 100%">
    Webhook URL
    <span class="badge" data-variant="secondary" style="margin-inline-start: auto">Beta</span>
  </label>
  <input class="input" id="demo-input-badge" type="url" placeholder="https://api.example.com/webhook">
</div>`
    },
    {
      title: "Input group",
      html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 24rem">
  <label class="label" for="demo-input-group-website">Website URL</label>
  <div class="input-group" role="group" aria-label="Website URL">
    <input class="input" id="demo-input-group-website" type="url" placeholder="example.com">
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">https://</span>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="field" dir="rtl" lang="ar" style="max-width: 24rem">
  <label class="label" for="demo-input-rtl-api-key">مفتاح API</label>
  <input class="input" id="demo-input-rtl-api-key" type="password" placeholder="sk-..." dir="rtl">
  <p>مفتاح API الخاص بك مشفر ومخزن بأمان.</p>
</div>`
    }
  ],
  item: [
    {
      title: "Default",
      html: `<div class="item" style="max-width: 24rem">
  <figure>${shield}</figure>
  <section>
    <h3>Security</h3>
    <p>Manage your account security settings.</p>
  </section>
  <aside>
    <button class="btn" data-size="sm" data-variant="outline">Manage</button>
  </aside>
</div>`
    },
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
  <button type="button" class="btn" data-variant="outline" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-default-panel">
    Open popover
  </button>
  <div data-popover data-side="bottom" data-align="start" id="demo-popover-default-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-default-title" aria-describedby="demo-popover-default-description" aria-hidden="true">
    <header data-slot="header">
      <h3 data-slot="title" id="demo-popover-default-title">Dimensions</h3>
      <p data-slot="description" id="demo-popover-default-description">Set the dimensions for the layer.</p>
    </header>
    <div class="field">
      <label class="label" for="demo-popover-default-width">Width</label>
      <input class="input" id="demo-popover-default-width" value="100%">
    </div>
  </div>
</div>`
    },
    {
      title: "Basic",
      html: `<div class="popover" data-demo="popover">
  <button type="button" class="btn" data-variant="outline" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-basic-panel">
    Open popover
  </button>
  <div data-popover data-side="bottom" data-align="start" id="demo-popover-basic-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-basic-title" aria-describedby="demo-popover-basic-description" aria-hidden="true">
    <header data-slot="header">
      <h3 data-slot="title" id="demo-popover-basic-title">Dimensions</h3>
      <p data-slot="description" id="demo-popover-basic-description">Set the dimensions for the layer.</p>
    </header>
  </div>
</div>`
    },
    {
      title: "Alignments",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 1.5rem; min-height: 8rem">
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="sm" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-align-start-panel" id="demo-popover-align-start-trigger">
      Start
    </button>
    <div data-popover data-side="bottom" data-align="start" id="demo-popover-align-start-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-align-start-title" aria-describedby="demo-popover-align-start-description" aria-hidden="true" style="width: 9rem">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-align-start-title">Start</h3>
        <p data-slot="description" id="demo-popover-align-start-description">Aligned to start</p>
      </header>
    </div>
  </div>
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="sm" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-align-center-panel" id="demo-popover-align-center-trigger">
      Center
    </button>
    <div data-popover data-side="bottom" data-align="center" id="demo-popover-align-center-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-align-center-title" aria-describedby="demo-popover-align-center-description" aria-hidden="true" style="width: 9rem">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-align-center-title">Center</h3>
        <p data-slot="description" id="demo-popover-align-center-description">Aligned to center</p>
      </header>
    </div>
  </div>
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="sm" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-align-end-panel" id="demo-popover-align-end-trigger">
      End
    </button>
    <div data-popover data-side="bottom" data-align="end" id="demo-popover-align-end-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-align-end-title" aria-describedby="demo-popover-align-end-description" aria-hidden="true" style="width: 9rem">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-align-end-title">End</h3>
        <p data-slot="description" id="demo-popover-align-end-description">Aligned to end</p>
      </header>
    </div>
  </div>
</div>`
    },
    {
      title: "With form",
      html: `<div style="display: flex; align-items: center; justify-content: center; min-height: 10rem">
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-form-panel">
      Edit dimensions
    </button>
    <div data-popover data-side="bottom" data-align="start" id="demo-popover-form-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-form-title" aria-describedby="demo-popover-form-description" aria-hidden="true">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-form-title">Dimensions</h3>
        <p data-slot="description" id="demo-popover-form-description">Set the dimensions for the layer.</p>
      </header>
      <div class="field" data-orientation="horizontal">
        <label class="label" for="demo-popover-form-width">Width</label>
        <input class="input" id="demo-popover-form-width" value="100%" style="flex: 1">
      </div>
      <div class="field" data-orientation="horizontal">
        <label class="label" for="demo-popover-form-height">Height</label>
        <input class="input" id="demo-popover-form-height" value="25px" style="flex: 1">
      </div>
    </div>
  </div>
</div>`
    },
    {
      title: "Sides",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.5rem; max-width: 18rem; min-height: 12rem; margin-inline: auto">
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="sm" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-side-top-panel" id="demo-popover-side-top-trigger">
      Top
    </button>
    <div data-popover data-side="top" data-align="start" id="demo-popover-side-top-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-side-top-title" aria-describedby="demo-popover-side-top-description" aria-hidden="true" style="width: 8rem">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-side-top-title">Top</h3>
        <p data-slot="description" id="demo-popover-side-top-description">Opens above</p>
      </header>
    </div>
  </div>
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="sm" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-side-right-panel" id="demo-popover-side-right-trigger">
      Right
    </button>
    <div data-popover data-side="right" data-align="start" id="demo-popover-side-right-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-side-right-title" aria-describedby="demo-popover-side-right-description" aria-hidden="true" style="width: 8rem">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-side-right-title">Right</h3>
        <p data-slot="description" id="demo-popover-side-right-description">Opens to the right</p>
      </header>
    </div>
  </div>
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="sm" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-side-bottom-panel" id="demo-popover-side-bottom-trigger">
      Bottom
    </button>
    <div data-popover data-side="bottom" data-align="start" id="demo-popover-side-bottom-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-side-bottom-title" aria-describedby="demo-popover-side-bottom-description" aria-hidden="true" style="width: 8rem">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-side-bottom-title">Bottom</h3>
        <p data-slot="description" id="demo-popover-side-bottom-description">Opens below</p>
      </header>
    </div>
  </div>
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="sm" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-side-left-panel" id="demo-popover-side-left-trigger">
      Left
    </button>
    <div data-popover data-side="left" data-align="start" id="demo-popover-side-left-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-side-left-title" aria-describedby="demo-popover-side-left-description" aria-hidden="true" style="width: 8rem">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-side-left-title">Left</h3>
        <p data-slot="description" id="demo-popover-side-left-description">Opens to the left</p>
      </header>
    </div>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: flex; align-items: center; justify-content: center; gap: 0.75rem">
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="sm" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-rtl-inline-start-panel" id="demo-popover-rtl-inline-start-trigger">
      بداية السطر
    </button>
    <div data-popover data-side="inline-start" data-align="start" id="demo-popover-rtl-inline-start-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-rtl-inline-start-title" aria-describedby="demo-popover-rtl-inline-start-description" aria-hidden="true" style="width: 9rem">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-rtl-inline-start-title">بداية السطر</h3>
        <p data-slot="description" id="demo-popover-rtl-inline-start-description">تفتح في بداية السطر.</p>
      </header>
    </div>
  </div>
  <div class="popover" data-demo="popover">
    <button type="button" class="btn" data-variant="outline" data-size="sm" data-demo-trigger aria-haspopup="dialog" aria-expanded="false" aria-controls="demo-popover-rtl-inline-end-panel" id="demo-popover-rtl-inline-end-trigger">
      نهاية السطر
    </button>
    <div data-popover data-side="inline-end" data-align="start" id="demo-popover-rtl-inline-end-panel" role="dialog" tabindex="-1" aria-labelledby="demo-popover-rtl-inline-end-title" aria-describedby="demo-popover-rtl-inline-end-description" aria-hidden="true" style="width: 9rem">
      <header data-slot="header">
        <h3 data-slot="title" id="demo-popover-rtl-inline-end-title">نهاية السطر</h3>
        <p data-slot="description" id="demo-popover-rtl-inline-end-description">تفتح في نهاية السطر.</p>
      </header>
    </div>
  </div>
</div>`
    }
  ],
  radio: [
    {
      title: "Default",
      html: `<div class="field" role="radiogroup" aria-label="Plan">
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-plan" id="demo-radio-plan-starter" value="starter" checked>
    <label class="label" for="demo-radio-plan-starter">Starter</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-plan" id="demo-radio-plan-pro" value="pro">
    <label class="label" for="demo-radio-plan-pro">Pro</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-plan" id="demo-radio-plan-enterprise" value="enterprise">
    <label class="label" for="demo-radio-plan-enterprise">Enterprise</label>
  </div>
</div>`
    },
    {
      title: "With description",
      html: `<div class="field" role="radiogroup" aria-label="Spacing">
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-spacing" id="demo-radio-spacing-default" value="default">
    <section>
      <label class="label" for="demo-radio-spacing-default">Default</label>
      <p>Standard spacing for most use cases.</p>
    </section>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-spacing" id="demo-radio-spacing-comfortable" value="comfortable" checked>
    <section>
      <label class="label" for="demo-radio-spacing-comfortable">Comfortable</label>
      <p>More space between elements.</p>
    </section>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-spacing" id="demo-radio-spacing-compact" value="compact">
    <section>
      <label class="label" for="demo-radio-spacing-compact">Compact</label>
      <p>Minimal spacing for dense layouts.</p>
    </section>
  </div>
</div>`
    },
    {
      title: "Choice card",
      html: `<div class="field" role="radiogroup" aria-label="Plan" style="max-width: 24rem">
  <label class="label" for="demo-radio-card-plus">
    <div class="field" data-orientation="horizontal">
      <section>
        <h3>Plus</h3>
        <p>For individuals and small teams.</p>
      </section>
      <input class="radio" type="radio" name="demo-radio-card-plan" id="demo-radio-card-plus" value="plus" checked>
    </div>
  </label>
  <label class="label" for="demo-radio-card-pro">
    <div class="field" data-orientation="horizontal">
      <section>
        <h3>Pro</h3>
        <p>For growing businesses.</p>
      </section>
      <input class="radio" type="radio" name="demo-radio-card-plan" id="demo-radio-card-pro" value="pro">
    </div>
  </label>
  <label class="label" for="demo-radio-card-enterprise">
    <div class="field" data-orientation="horizontal">
      <section>
        <h3>Enterprise</h3>
        <p>For large teams and enterprises.</p>
      </section>
      <input class="radio" type="radio" name="demo-radio-card-plan" id="demo-radio-card-enterprise" value="enterprise">
    </div>
  </label>
</div>`
    },
    {
      title: "Fieldset",
      html: `<fieldset class="fieldset" style="max-width: 20rem">
  <legend data-variant="label">Subscription Plan</legend>
  <p>Yearly and lifetime plans offer significant savings.</p>
  <div role="radiogroup" data-slot="radio-group" aria-label="Subscription plan">
    <div class="field" data-orientation="horizontal">
      <input class="radio" type="radio" name="demo-radio-subscription" id="demo-radio-monthly" value="monthly" checked>
      <label class="label" for="demo-radio-monthly">Monthly ($9.99/month)</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="radio" type="radio" name="demo-radio-subscription" id="demo-radio-yearly" value="yearly">
      <label class="label" for="demo-radio-yearly">Yearly ($99.99/year)</label>
    </div>
    <div class="field" data-orientation="horizontal">
      <input class="radio" type="radio" name="demo-radio-subscription" id="demo-radio-lifetime" value="lifetime">
      <label class="label" for="demo-radio-lifetime">Lifetime ($299.99)</label>
    </div>
  </div>
</fieldset>`
    },
    {
      title: "Disabled",
      html: `<div class="field" role="radiogroup" aria-label="Options">
  <div class="field" data-orientation="horizontal" aria-disabled="true">
    <input class="radio" type="radio" name="demo-radio-disabled" id="demo-radio-disabled-1" value="option-1" disabled>
    <label class="label" for="demo-radio-disabled-1">Disabled</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-disabled" id="demo-radio-disabled-2" value="option-2" checked>
    <label class="label" for="demo-radio-disabled-2">Option 2</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="radio" type="radio" name="demo-radio-disabled" id="demo-radio-disabled-3" value="option-3">
    <label class="label" for="demo-radio-disabled-3">Option 3</label>
  </div>
</div>`
    },
    {
      title: "Invalid",
      html: `<fieldset class="fieldset" style="max-width: 20rem">
  <legend data-variant="label">Notification Preferences</legend>
  <p>Choose how you want to receive notifications.</p>
  <div role="radiogroup" data-slot="radio-group" aria-label="Notification preferences">
    <div class="field" data-orientation="horizontal" aria-invalid="true">
      <input class="radio" type="radio" name="demo-radio-notifications" id="demo-radio-email" value="email" checked aria-invalid="true">
      <label class="label" for="demo-radio-email">Email only</label>
    </div>
    <div class="field" data-orientation="horizontal" aria-invalid="true">
      <input class="radio" type="radio" name="demo-radio-notifications" id="demo-radio-sms" value="sms" aria-invalid="true">
      <label class="label" for="demo-radio-sms">SMS only</label>
    </div>
    <div class="field" data-orientation="horizontal" aria-invalid="true">
      <input class="radio" type="radio" name="demo-radio-notifications" id="demo-radio-both" value="both" aria-invalid="true">
      <label class="label" for="demo-radio-both">Both Email &amp; SMS</label>
    </div>
  </div>
</fieldset>`
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
    },
    {
      title: "With description",
      html: `<div class="field" data-orientation="horizontal" style="max-width: 24rem">
  <input class="switch" type="checkbox" role="switch" id="demo-switch-description" checked>
  <section>
    <label class="label" for="demo-switch-description">Share across devices</label>
    <p>Focus is shared across devices, and turns off when you leave the app.</p>
  </section>
</div>`
    },
    {
      title: "Choice card",
      html: `<label class="label" for="demo-switch-focus" style="max-width: 24rem">
  <div class="field" data-orientation="horizontal">
    <section>
      <h3>Share across devices</h3>
      <p>Focus is shared across devices, and turns off when you leave the app.</p>
    </section>
    <input class="switch" type="checkbox" role="switch" id="demo-switch-focus" checked>
  </div>
</label>`
    },
    {
      title: "Disabled",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem">
  <div class="field">
    <label class="label" for="demo-switch-disabled-unchecked">
      <input class="switch" type="checkbox" role="switch" id="demo-switch-disabled-unchecked" disabled>
      Disabled (unchecked)
    </label>
  </div>
  <div class="field">
    <label class="label" for="demo-switch-disabled-checked">
      <input class="switch" type="checkbox" role="switch" id="demo-switch-disabled-checked" checked disabled>
      Disabled (checked)
    </label>
  </div>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" data-orientation="horizontal" aria-invalid="true" style="max-width: 24rem">
  <input class="switch" type="checkbox" role="switch" id="demo-switch-invalid" aria-invalid="true">
  <section>
    <label class="label" for="demo-switch-invalid">Accept terms and conditions</label>
    <p role="alert">You must accept the terms and conditions to continue.</p>
  </section>
</div>`
    },
    {
      title: "Size",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem">
  <div class="field" data-orientation="horizontal">
    <input class="switch" type="checkbox" role="switch" id="demo-switch-sm" data-size="sm" checked>
    <label class="label" for="demo-switch-sm">Small</label>
  </div>
  <div class="field" data-orientation="horizontal">
    <input class="switch" type="checkbox" role="switch" id="demo-switch-default" data-size="default" checked>
    <label class="label" for="demo-switch-default">Default</label>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="max-width: 24rem">
  <div class="field" data-orientation="horizontal">
    <input class="switch" type="checkbox" role="switch" id="demo-switch-rtl" checked>
    <section>
      <label class="label" for="demo-switch-rtl">المشاركة عبر الأجهزة</label>
      <p>يتم مشاركة التركيز عبر الأجهزة، ويتوقف عند مغادرة التطبيق.</p>
    </section>
  </div>
</div>`
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
        <th scope="col">Invoice</th>
        <th scope="col">Status</th>
        <th scope="col">Method</th>
        <th scope="col" style="text-align: end">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>INV-001</td>
        <td>Paid</td>
        <td>Credit card</td>
        <td style="text-align: end">$250.00</td>
      </tr>
      <tr>
        <td>INV-002</td>
        <td>Pending</td>
        <td>PayPal</td>
        <td style="text-align: end">$150.00</td>
      </tr>
      <tr>
        <td>INV-003</td>
        <td>Unpaid</td>
        <td>Bank transfer</td>
        <td style="text-align: end">$350.00</td>
      </tr>
    </tbody>
  </table>
</div>`
    },
    {
      title: "Footer",
      html: `<div class="table-container">
  <table class="table">
    <caption>A list of your recent invoices.</caption>
    <thead>
      <tr>
        <th scope="col">Invoice</th>
        <th scope="col">Status</th>
        <th scope="col">Method</th>
        <th scope="col" style="text-align: end">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>INV-001</td>
        <td>Paid</td>
        <td>Credit card</td>
        <td style="text-align: end">$250.00</td>
      </tr>
      <tr>
        <td>INV-002</td>
        <td>Pending</td>
        <td>PayPal</td>
        <td style="text-align: end">$150.00</td>
      </tr>
      <tr>
        <td>INV-003</td>
        <td>Unpaid</td>
        <td>Bank transfer</td>
        <td style="text-align: end">$350.00</td>
      </tr>
      <tr>
        <td>INV-004</td>
        <td>Paid</td>
        <td>Credit card</td>
        <td style="text-align: end">$450.00</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="row" colspan="3">Total</th>
        <td style="text-align: end">$1,200.00</td>
      </tr>
    </tfoot>
  </table>
</div>`
    },
    {
      title: "Actions",
      html: `<div class="table-container">
  <table class="table">
    <caption>Products and their current prices.</caption>
    <thead>
      <tr>
        <th scope="col">Product</th>
        <th scope="col" style="text-align: end">Price</th>
        <th scope="col"><span class="sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Wireless Mouse</td>
        <td style="text-align: end">$29.99</td>
        <td>
          <div class="dropdown-menu" data-demo="dropdown">
            <button type="button" class="btn" data-variant="ghost" data-size="icon-sm" data-demo-trigger aria-haspopup="menu" aria-expanded="false" aria-label="Open menu for Wireless Mouse">${moreHorizontal}</button>
            <div data-popover data-side="top" data-align="end" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Edit</button>
                <button type="button" role="menuitem">Duplicate</button>
                <div role="separator"></div>
                <button type="button" role="menuitem" data-variant="destructive">Delete</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>Mechanical Keyboard</td>
        <td style="text-align: end">$129.99</td>
        <td>
          <div class="dropdown-menu" data-demo="dropdown">
            <button type="button" class="btn" data-variant="ghost" data-size="icon-sm" data-demo-trigger aria-haspopup="menu" aria-expanded="false" aria-label="Open menu for Mechanical Keyboard">${moreHorizontal}</button>
            <div data-popover data-side="top" data-align="end" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Edit</button>
                <button type="button" role="menuitem">Duplicate</button>
                <div role="separator"></div>
                <button type="button" role="menuitem" data-variant="destructive">Delete</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>USB-C Hub</td>
        <td style="text-align: end">$49.99</td>
        <td>
          <div class="dropdown-menu" data-demo="dropdown">
            <button type="button" class="btn" data-variant="ghost" data-size="icon-sm" data-demo-trigger aria-haspopup="menu" aria-expanded="false" aria-label="Open menu for USB-C Hub">${moreHorizontal}</button>
            <div data-popover data-side="top" data-align="end" aria-hidden="true">
              <div role="menu">
                <button type="button" role="menuitem">Edit</button>
                <button type="button" role="menuitem">Duplicate</button>
                <div role="separator"></div>
                <button type="button" role="menuitem" data-variant="destructive">Delete</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>`
    },
    {
      title: "Selection",
      html: `<div class="table-container">
  <table class="table">
    <caption>Select invoices to export.</caption>
    <thead>
      <tr>
        <th scope="col"><input class="checkbox" type="checkbox" aria-label="Select all invoices" data-demo-indeterminate></th>
        <th scope="col">Invoice</th>
        <th scope="col">Status</th>
        <th scope="col" style="text-align: end">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr aria-selected="true">
        <td><input class="checkbox" type="checkbox" aria-label="Select INV-001" checked></td>
        <td>INV-001</td>
        <td><span class="badge" data-variant="outline">Paid</span></td>
        <td style="text-align: end">$250.00</td>
      </tr>
      <tr>
        <td><input class="checkbox" type="checkbox" aria-label="Select INV-002"></td>
        <td>INV-002</td>
        <td><span class="badge" data-variant="secondary">Pending</span></td>
        <td style="text-align: end">$150.00</td>
      </tr>
      <tr>
        <td><input class="checkbox" type="checkbox" aria-label="Select INV-003"></td>
        <td>INV-003</td>
        <td><span class="badge" data-variant="destructive">Unpaid</span></td>
        <td style="text-align: end">$350.00</td>
      </tr>
    </tbody>
  </table>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="table-container" dir="rtl" lang="ar">
  <table class="table">
    <caption>قائمة بفواتيرك الأخيرة.</caption>
    <thead>
      <tr>
        <th scope="col">الفاتورة</th>
        <th scope="col">الحالة</th>
        <th scope="col">الطريقة</th>
        <th scope="col" style="text-align: end">المبلغ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>INV-001</td>
        <td>مدفوع</td>
        <td>بطاقة ائتمانية</td>
        <td style="text-align: end">$250.00</td>
      </tr>
      <tr>
        <td>INV-002</td>
        <td>قيد الانتظار</td>
        <td>PayPal</td>
        <td style="text-align: end">$150.00</td>
      </tr>
      <tr>
        <td>INV-003</td>
        <td>غير مدفوع</td>
        <td>تحويل بنكي</td>
        <td style="text-align: end">$350.00</td>
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
      html: `<textarea class="textarea" placeholder="Type your message here." aria-label="Message"></textarea>`
    },
    {
      title: "Field",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-textarea-field">Message</label>
  <textarea class="textarea" id="demo-textarea-field" placeholder="Type your message here."></textarea>
  <p>Your message will be copied to the support team.</p>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-textarea-disabled">Message</label>
  <textarea class="textarea" id="demo-textarea-disabled" placeholder="Type your message here." disabled></textarea>
  <p>This field is currently disabled.</p>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-textarea-invalid">Message</label>
  <textarea class="textarea" id="demo-textarea-invalid" placeholder="Type your message here." aria-invalid="true" aria-describedby="demo-textarea-invalid-error"></textarea>
  <p id="demo-textarea-invalid-error" role="alert">Please enter a valid message.</p>
</div>`
    },
    {
      title: "Button",
      html: `<div class="field" style="max-width: 24rem">
  <textarea class="textarea" placeholder="Type your message here." aria-label="Message"></textarea>
  <button type="button" class="btn">Send message</button>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="field" dir="rtl" lang="ar" style="max-width: 24rem">
  <label class="label" for="demo-textarea-rtl">التعليقات</label>
  <textarea class="textarea" id="demo-textarea-rtl" placeholder="تعليقاتك تساعدنا على التحسين..." dir="rtl"></textarea>
  <p>شاركنا أفكارك حول خدمتنا.</p>
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
      title: "Default",
      html: `<div class="aspect-ratio" style="max-width: 24rem">
  <img src="${ratioImage}" alt="A 16 by 9 media placeholder" />
</div>`
    },
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
      title: "Default",
      html: `<span class="avatar"><span data-slot="fallback">CN</span></span>`
    },
    {
      title: "Basic",
      html: `<span class="avatar">
  <img src="${avatarImage}" alt="Ada Lovelace" />
  <span data-slot="fallback" aria-hidden="true">AL</span>
</span>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; align-items: center; gap: 0.75rem">
  <span class="avatar" data-size="sm"><span data-slot="fallback">SM</span></span>
  <span class="avatar"><span data-slot="fallback">AV</span></span>
  <span class="avatar" data-size="lg"><span data-slot="fallback">LG</span></span>
</div>`
    },
    {
      title: "Badge",
      html: `<span class="avatar">
  <img src="${avatarImage}" alt="Ada Lovelace" />
  <span data-slot="fallback" aria-hidden="true">AL</span>
  <span data-slot="badge" aria-hidden="true"></span>
</span>`
    },
    {
      title: "Badge with icon",
      html: `<span class="avatar" data-size="lg">
  <img src="${avatarImage}" alt="Ada Lovelace" />
  <span data-slot="fallback" aria-hidden="true">AL</span>
  <span data-slot="badge" aria-hidden="true">${plus}</span>
</span>`
    },
    {
      title: "Group",
      html: `<div class="avatar-group" role="group" aria-label="Project contributors">
  <span class="avatar"><span data-slot="fallback">AL</span></span>
  <span class="avatar"><span data-slot="fallback">GR</span></span>
  <span class="avatar"><span data-slot="fallback">TS</span></span>
</div>`
    },
    {
      title: "Group count",
      html: `<div class="avatar-group" role="group" aria-label="Project contributors">
  <span class="avatar"><span data-slot="fallback">AL</span></span>
  <span class="avatar"><span data-slot="fallback">GR</span></span>
  <span class="avatar"><span data-slot="fallback">TS</span></span>
  <span data-slot="count"><span aria-hidden="true">+3</span><span class="sr-only">3 more contributors</span></span>
</div>`
    },
    {
      title: "Group with icon",
      html: `<div class="avatar-group" role="group" aria-label="Project contributors">
  <span class="avatar"><span data-slot="fallback">AL</span></span>
  <span class="avatar"><span data-slot="fallback">GR</span></span>
  <span class="avatar"><span data-slot="fallback">TS</span></span>
  <span data-slot="count">${plus}<span class="sr-only">3 more contributors</span></span>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem" dir="rtl" lang="ar">
  <span class="avatar" data-size="lg">
    <span data-slot="fallback">ع</span>
    <span data-slot="badge" aria-hidden="true"></span>
  </span>
  <div class="avatar-group" role="group" aria-label="أعضاء الفريق">
    <span class="avatar" data-size="lg"><span data-slot="fallback">أح</span></span>
    <span class="avatar" data-size="lg"><span data-slot="fallback">سم</span></span>
    <span class="avatar" data-size="lg"><span data-slot="fallback">لي</span></span>
    <span data-slot="count"><span aria-hidden="true">+٣</span><span class="sr-only">٣ أعضاء آخرون</span></span>
  </div>
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
      title: "Default",
      html: `<div class="field" style="max-width: 20rem">
  <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
    <label class="label" for="demo-progress-upload">Uploading report.pdf</label>
    <output for="demo-progress-upload" style="color: var(--muted-foreground); font-size: 0.875rem; font-variant-numeric: tabular-nums">60%</output>
  </div>
  <progress class="progress" id="demo-progress-upload" value="60" max="100">60%</progress>
</div>`
    },
    {
      title: "Values",
      html: `<div style="display: grid; gap: 0.75rem; width: 100%; max-width: 20rem">
  <progress class="progress" value="0" max="100" aria-label="0% complete">0%</progress>
  <progress class="progress" value="25" max="100" aria-label="25% complete">25%</progress>
  <progress class="progress" value="50" max="100" aria-label="50% complete">50%</progress>
  <progress class="progress" value="75" max="100" aria-label="75% complete">75%</progress>
  <progress class="progress" value="100" max="100" aria-label="100% complete">100%</progress>
</div>`
    },
    {
      title: "Indeterminate",
      html: `<div class="field" style="max-width: 20rem">
  <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
    <label class="label" for="demo-progress-loading">Saving changes</label>
    <span style="color: var(--muted-foreground); font-size: 0.875rem">Please wait…</span>
  </div>
  <progress class="progress" id="demo-progress-loading">Saving changes…</progress>
</div>`
    },
    {
      title: "File uploads",
      html: `<ul style="display: grid; gap: 1rem; width: 100%; max-width: 22rem; margin: 0; padding: 0; list-style: none">
  <li class="field">
    <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
      <label class="label" for="demo-progress-document">document.pdf</label>
      <span aria-hidden="true" style="color: var(--muted-foreground); font-size: 0.875rem; font-variant-numeric: tabular-nums">45%</span>
    </div>
    <progress class="progress" id="demo-progress-document" value="45" max="100">45%</progress>
  </li>
  <li class="field">
    <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
      <label class="label" for="demo-progress-presentation">presentation.pptx</label>
      <span aria-hidden="true" style="color: var(--muted-foreground); font-size: 0.875rem; font-variant-numeric: tabular-nums">78%</span>
    </div>
    <progress class="progress" id="demo-progress-presentation" value="78" max="100">78%</progress>
  </li>
  <li class="field">
    <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
      <label class="label" for="demo-progress-spreadsheet">spreadsheet.xlsx</label>
      <span aria-hidden="true" style="color: var(--muted-foreground); font-size: 0.875rem; font-variant-numeric: tabular-nums">12%</span>
    </div>
    <progress class="progress" id="demo-progress-spreadsheet" value="12" max="100">12%</progress>
  </li>
  <li class="field">
    <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
      <label class="label" for="demo-progress-image">image.jpg</label>
      <span aria-hidden="true" style="color: var(--muted-foreground); font-size: 0.875rem; font-variant-numeric: tabular-nums">100%</span>
    </div>
    <progress class="progress" id="demo-progress-image" value="100" max="100">100%</progress>
  </li>
</ul>`
    },
    {
      title: "Right-to-left",
      html: `<div class="field" dir="rtl" lang="ar" style="max-width: 20rem">
  <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
    <label class="label" for="demo-progress-rtl">جارٍ رفع التقرير</label>
    <output for="demo-progress-rtl" style="color: var(--muted-foreground); font-size: 0.875rem; font-variant-numeric: tabular-nums">٦٠٪</output>
  </div>
  <progress class="progress" id="demo-progress-rtl" value="60" max="100">٦٠٪</progress>
  <progress class="progress" aria-label="جارٍ فحص الملفات">جارٍ فحص الملفات…</progress>
</div>`
    }
  ],
  separator: [
    {
      title: "Default",
      html: `<hr class="separator" />`
    },
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
      title: "Default",
      html: `<span class="spinner" role="status"><span class="sr-only">Loading</span></span>`
    },
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
      title: "Default",
      html: `<button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bold</button>`
    },
    {
      title: "Outline",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" data-variant="outline" aria-pressed="true" data-demo-toggle>${italic}Italic</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="false" data-demo-toggle>${bold}Bold</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="false" data-demo-toggle>${underline}Underline</button>
</div>`
    },
    {
      title: "With text",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>${bookmark}Bookmark</button>
  <button type="button" class="toggle" data-variant="outline" data-size="sm" aria-pressed="true" data-demo-toggle>${bookmark}Saved</button>
</div>`
    },
    {
      title: "Icon only",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" data-size="sm" aria-pressed="false" aria-label="Toggle bold" data-demo-toggle>${bold}</button>
  <button type="button" class="toggle" aria-pressed="true" aria-label="Toggle italic" data-demo-toggle>${italic}</button>
  <button type="button" class="toggle" data-variant="outline" data-size="lg" aria-pressed="false" aria-label="Toggle underline" data-demo-toggle>${underline}</button>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem">
  <button type="button" class="toggle" data-variant="outline" data-size="sm" aria-pressed="false" data-demo-toggle>Small</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="false" data-demo-toggle>Default</button>
  <button type="button" class="toggle" data-variant="outline" data-size="lg" aria-pressed="false" data-demo-toggle>Large</button>
</div>`
    },
    {
      title: "Disabled",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" aria-pressed="false" disabled>Disabled</button>
  <button type="button" class="toggle" data-variant="outline" aria-pressed="true" disabled>Disabled</button>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <button type="button" class="toggle" data-variant="outline" data-size="sm" aria-pressed="false" data-demo-toggle>${bookmark}إشارة مرجعية</button>
</div>`
    }
  ],
  "toggle-group": [
    {
      title: "Default",
      html: `<div class="toggle-group" role="group" aria-label="Text formatting">
  <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Bold</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Italic</button>
  <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Underline</button>
</div>`
    },
    {
      title: "Outline",
      html: `<div class="toggle-group" role="group" aria-label="Text styles" data-variant="outline">
  <button type="button" class="toggle" aria-pressed="true" aria-label="Toggle bold" data-demo-toggle>${bold}</button>
  <button type="button" class="toggle" aria-pressed="false" aria-label="Toggle italic" data-demo-toggle>${italic}</button>
  <button type="button" class="toggle" aria-pressed="false" aria-label="Toggle underline" data-demo-toggle>${underline}</button>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: grid; gap: 0.75rem; justify-items: start">
  <div class="toggle-group" role="group" aria-label="Small alignment" data-variant="outline" data-size="sm">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Top</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bottom</button>
  </div>
  <div class="toggle-group" role="group" aria-label="Default alignment" data-variant="outline">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Top</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bottom</button>
  </div>
  <div class="toggle-group" role="group" aria-label="Large alignment" data-variant="outline" data-size="lg">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Top</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Bottom</button>
  </div>
</div>`
    },
    {
      title: "Spacing",
      html: `<div style="display: grid; gap: 0.75rem; justify-items: start">
  <div class="toggle-group" role="group" aria-label="Default spacing" data-variant="outline" data-spacing="default">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Bold</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Italic</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Underline</button>
  </div>
  <div class="toggle-group" role="group" aria-label="Joined spacing" data-variant="outline" data-spacing="joined">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Bold</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Italic</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Underline</button>
  </div>
</div>`
    },
    {
      title: "Vertical",
      html: `<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: 1rem">
  <div class="toggle-group" role="group" aria-label="Text formatting vertical" data-variant="outline" data-orientation="vertical">
    <button type="button" class="toggle" aria-pressed="true" aria-label="Toggle bold" data-demo-toggle>${bold}</button>
    <button type="button" class="toggle" aria-pressed="true" aria-label="Toggle italic" data-demo-toggle>${italic}</button>
    <button type="button" class="toggle" aria-pressed="false" aria-label="Toggle underline" data-demo-toggle>${underline}</button>
  </div>
  <div class="toggle-group" role="group" aria-label="View density" data-orientation="vertical" data-spacing="joined" data-variant="outline" data-size="sm">
    <button type="button" class="toggle" aria-pressed="true" data-demo-toggle>Compact</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Default</button>
    <button type="button" class="toggle" aria-pressed="false" data-demo-toggle>Comfortable</button>
  </div>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="toggle-group" role="group" aria-label="Disabled formatting" data-variant="outline">
  <button type="button" class="toggle" aria-pressed="false" disabled>Bold</button>
  <button type="button" class="toggle" aria-pressed="true" disabled>Italic</button>
  <button type="button" class="toggle" aria-pressed="false" disabled>Underline</button>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar">
  <div class="toggle-group" role="group" aria-label="عرض المحتوى" data-variant="outline">
    <button type="button" class="toggle" aria-pressed="true" aria-label="قائمة" data-demo-toggle>${list}</button>
    <button type="button" class="toggle" aria-pressed="false" aria-label="شبكة" data-demo-toggle>${grid}</button>
    <button type="button" class="toggle" aria-pressed="false" aria-label="بطاقات" data-demo-toggle>${cards}</button>
  </div>
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
      title: "Default",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-sheet-default">
  Open sheet
</button>

<dialog class="sheet" id="demo-sheet-default" data-side="inline-end" aria-labelledby="sheet-default-title" aria-describedby="sheet-default-description">
  <div>
    <header>
      <h2 data-slot="title" id="sheet-default-title">Sheet title</h2>
      <p data-slot="description" id="sheet-default-description">
        This sheet opens from the inline end edge.
      </p>
    </header>
    <section>
      <p>Use sheets for secondary content, filters or forms.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Close</button>
    </footer>
  </div>
</dialog>`
    },
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
      title: "Default",
      html: `<div class="input-group" role="group" aria-label="Search">
  <input class="input" type="search" placeholder="Search components..." aria-label="Search components">
  <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
</div>`
    },
    {
      title: "Inline addons",
      html: `<div class="input-group" role="group" aria-label="Email">
  <input class="input" id="demo-input-group-email" type="email" placeholder="you@example.com" aria-label="Email">
  <span data-slot="addon" data-align="inline-start" aria-hidden="true">@</span>
  <span data-slot="addon" data-align="inline-end">
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Copy email">${copy}</button>
  </span>
</div>`
    },
    {
      title: "Block addons",
      html: `<div style="width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="Username">
    <input class="input" id="demo-input-group-username" value="loseta" aria-label="Username">
    <span data-slot="addon" data-align="block-start">Username</span>
    <span data-slot="addon" data-align="block-end">6/20 characters</span>
  </div>
</div>`
    },
    {
      title: "Textarea",
      html: `<div style="width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="Message">
    <textarea class="textarea" id="demo-input-group-message" placeholder="Type your message here." aria-label="Message"></textarea>
    <span data-slot="addon" data-align="block-start">Message</span>
    <span data-slot="addon" data-align="block-end">
      <span>0/280 characters</span>
      <button type="button" class="btn" data-size="icon-xs" aria-label="Send message" style="margin-inline-start: auto">${arrowRight}</button>
    </span>
  </div>
</div>`
    },
    {
      title: "Buttons",
      html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="Search">
    <input class="input" type="search" placeholder="Search..." aria-label="Search">
    <span data-slot="addon" data-align="inline-start">
      <button type="button" class="btn" data-variant="secondary" data-size="xs">Search</button>
    </span>
  </div>
  <div class="input-group" role="group" aria-label="Email">
    <input class="input" id="demo-input-group-subscribe" type="email" placeholder="you@example.com" aria-label="Email">
    <span data-slot="addon" data-align="inline-end">
      <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Copy email">${copy}</button>
      <button type="button" class="btn" data-variant="secondary" data-size="xs">Subscribe</button>
    </span>
  </div>
</div>`
    },
    {
      title: "Keyboard shortcut",
      html: `<div class="input-group" role="group" aria-label="Search documentation">
  <input class="input" id="demo-input-group-docs" type="search" placeholder="Search documentation..." aria-label="Search documentation">
  <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
  <span data-slot="addon" data-align="inline-end">12 results</span>
  <span data-slot="addon" data-align="inline-end"><span class="kbd">⌘K</span></span>
</div>`
    },
    {
      title: "Loading",
      html: `<div class="input-group" role="group" aria-label="Workspace name">
  <input class="input" id="demo-input-group-loading" value="acme" aria-label="Workspace name">
  <span data-slot="addon" data-align="inline-start" aria-hidden="true">${globe}</span>
  <span data-slot="addon" data-align="inline-end" role="status">
    <span class="spinner" data-size="sm" aria-hidden="true"></span>
    Saving...
  </span>
</div>`
    },
    {
      title: "States",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 28rem">
  <div class="field">
    <label class="label" for="demo-input-group-disabled">Email</label>
    <div class="input-group" role="group" aria-label="Email">
      <input class="input" id="demo-input-group-disabled" type="email" value="ada@example.com" disabled>
      <span data-slot="addon" data-align="inline-start" aria-hidden="true">@</span>
    </div>
    <p>This field is currently disabled.</p>
  </div>
  <div class="field">
    <label class="label" for="demo-input-group-invalid">Username</label>
    <div class="input-group" role="group" aria-label="Username">
      <input class="input" id="demo-input-group-invalid" value="invalid name" aria-invalid="true" aria-describedby="demo-input-group-invalid-error">
      <span data-slot="addon" data-align="inline-end" aria-hidden="true">${circleAlert}</span>
    </div>
    <p id="demo-input-group-invalid-error" role="alert">Username may only contain letters and numbers.</p>
  </div>
</div>`
    },
    {
      title: "Custom control",
      html: `<div style="width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="Message">
    <div role="textbox" contenteditable="true" aria-label="Message" aria-multiline="true" data-slot="input-group-control" spellcheck="false">Build me a landing page for a CSS registry.</div>
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">${globe}</span>
    <span data-slot="addon" data-align="inline-end">
      <button type="button" class="btn" data-size="icon-xs" aria-label="Send message">${arrowRight}</button>
    </span>
  </div>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="width: 100%; max-width: 28rem">
  <div class="input-group" role="group" aria-label="البحث في المكوّنات">
    <input class="input" type="search" placeholder="ابحث في المكوّنات..." aria-label="ابحث في المكوّنات">
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
    <span data-slot="addon" data-align="inline-end">١٢ نتيجة</span>
  </div>
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
      title: "Default",
      html: `<div class="scroll-area" role="region" aria-label="Scrollable content" tabindex="0" style="max-height: 8rem; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 0.75rem">
  <p>loseta copies readable CSS files into your project.</p>
  <p>The registry validates layers, dependencies and generated examples.</p>
  <p>Eight styles share one markup contract.</p>
  <p>The docs site renders the same files consumers install.</p>
  <p>Scrollbars use the reserved scrollbar tokens.</p>
</div>`
    },
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
      title: "With label and value",
      html: `<div class="field" style="max-width: 24rem">
  <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem">
    <label class="label" for="demo-slider-temperature">Temperature</label>
    <output for="demo-slider-temperature" style="color: var(--muted-foreground); font-variant-numeric: tabular-nums">21°C</output>
  </div>
  <input class="slider" type="range" id="demo-slider-temperature" min="0" max="40" value="21">
  <p>Set the target temperature for this room.</p>
</div>`
    },
    {
      title: "Step interval",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-slider-step">Opacity</label>
  <input class="slider" type="range" id="demo-slider-step" min="0" max="100" step="10" value="40">
  <p>Changes in increments of 10.</p>
</div>`
    },
    {
      title: "With icons",
      html: `<div style="display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.75rem; inline-size: 100%; max-width: 24rem; color: var(--muted-foreground)">
  ${volumeLow}
  <input class="slider" type="range" min="0" max="100" value="60" aria-label="Volume">
  ${volumeHigh}
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: grid; gap: 0.75rem; inline-size: 100%; max-width: 24rem">
  <div class="field">
    <label class="label" for="demo-slider-sm">Small</label>
    <input class="slider" data-size="sm" type="range" id="demo-slider-sm" min="0" max="100" value="30">
  </div>
  <div class="field">
    <label class="label" for="demo-slider-default">Default</label>
    <input class="slider" type="range" id="demo-slider-default" min="0" max="100" value="60">
  </div>
  <div class="field">
    <label class="label" for="demo-slider-lg">Large</label>
    <input class="slider" data-size="lg" type="range" id="demo-slider-lg" min="0" max="100" value="70">
  </div>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-slider-disabled">Volume</label>
  <input class="slider" type="range" id="demo-slider-disabled" min="0" max="100" value="50" disabled>
  <p>Disabled sliders keep their value but cannot be changed.</p>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="field" dir="rtl" lang="ar" style="max-width: 24rem">
  <label class="label" for="demo-slider-rtl">مستوى الصوت</label>
  <input class="slider" type="range" id="demo-slider-rtl" min="0" max="100" value="60">
  <p>يمتلئ المسار من اليمين إلى اليسار.</p>
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
      title: "Default",
      html: `<div class="combobox" data-demo="combobox">
  <input role="combobox" aria-expanded="false" aria-controls="combobox-default-panel" aria-autocomplete="list" placeholder="Select a framework..." aria-label="Select a framework" data-demo-combobox-input>
  <div data-popover data-side="bottom" aria-hidden="true" id="combobox-default-panel">
    <div role="listbox" aria-label="Frameworks">
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">React</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Vue</span></div>
      <div role="option" aria-selected="false" data-demo-option><span data-slot="text">Svelte</span></div>
      <div data-slot="empty" hidden>No framework found.</div>
    </div>
  </div>
</div>`
    },
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
      title: "Default",
      html: `<div class="command" data-demo="command">
  <div class="input-group" role="group" aria-label="Search commands">
    <input class="input" type="text" placeholder="Type a command..." aria-label="Search commands" data-demo-command-input>
    <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
  </div>
  <div role="listbox" aria-label="Commands">
    <div role="option" data-demo-option>
      <span data-slot="text">Go home</span>
      <span data-slot="shortcut">⌘H</span>
    </div>
    <div role="option" data-demo-option>
      <span data-slot="text">Open settings</span>
      <span data-slot="shortcut">⌘,</span>
    </div>
    <div role="option" data-demo-option>
      <span data-slot="text">Copy link</span>
    </div>
    <div data-slot="empty" hidden>No commands found.</div>
  </div>
</div>`
    },
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
          <input class="input" type="text" placeholder="Type a command..." aria-label="Search commands" data-demo-command-input autofocus>
          <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
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
  ],
  calendar: [
    {
      title: "Default",
      html: `<div class="calendar">
  <header>
    <button type="button" aria-label="Previous month">${chevronLeft}</button>
    <span data-slot="title" aria-live="polite">February 2026</span>
    <button type="button" aria-label="Next month">${chevronRight}</button>
  </header>
  <table role="grid">
    <caption class="sr-only">February 2026</caption>
    <thead>
      <tr>
        <th scope="col"><abbr title="Sunday">Su</abbr></th>
        <th scope="col"><abbr title="Monday">Mo</abbr></th>
        <th scope="col"><abbr title="Tuesday">Tu</abbr></th>
        <th scope="col"><abbr title="Wednesday">We</abbr></th>
        <th scope="col"><abbr title="Thursday">Th</abbr></th>
        <th scope="col"><abbr title="Friday">Fr</abbr></th>
        <th scope="col"><abbr title="Saturday">Sa</abbr></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 1, 2026">1</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 2, 2026">2</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 3, 2026">3</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 4, 2026">4</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 5, 2026">5</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 6, 2026">6</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 7, 2026">7</button></td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 8, 2026">8</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 9, 2026">9</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 10, 2026">10</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 11, 2026">11</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 12, 2026">12</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 13, 2026">13</button></td>
        <td role="gridcell" aria-selected="true"><button type="button" aria-label="February 14, 2026">14</button></td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 15, 2026">15</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 16, 2026">16</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 17, 2026">17</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 18, 2026">18</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 19, 2026">19</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 20, 2026">20</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 21, 2026">21</button></td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 22, 2026">22</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 23, 2026">23</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 24, 2026">24</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 25, 2026">25</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 26, 2026">26</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 27, 2026">27</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 28, 2026">28</button></td>
      </tr>
    </tbody>
  </table>
</div>`
    }
  ],
  carousel: [
    {
      title: "Default",
      html: `<section class="carousel" data-orientation="horizontal" aria-roledescription="carousel" aria-label="Featured components" data-demo="carousel">
  <div class="carousel-viewport" tabindex="0">
    <div class="carousel-track">
      <div class="carousel-item" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="card">
          <header>
            <h3 data-slot="title">Accordion</h3>
            <p data-slot="description">Disclosure patterns</p>
          </header>
          <section>
            <p>Native details and summary with exclusive groups.</p>
          </section>
        </div>
      </div>
      <div class="carousel-item" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="card">
          <header>
            <h3 data-slot="title">Avatar</h3>
            <p data-slot="description">Identity at a glance</p>
          </header>
          <section>
            <p>Images, fallback initials, badges and overlapping groups.</p>
          </section>
        </div>
      </div>
      <div class="carousel-item" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="card">
          <header>
            <h3 data-slot="title">Breadcrumb</h3>
            <p data-slot="description">Navigation context</p>
          </header>
          <section>
            <p>Ordered links with a current page and collapsed paths.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-button" data-demo-carousel-prev aria-label="Previous slide">${chevronLeft}</button>
    <div class="carousel-indicators" role="group" aria-label="Slides">
      <button type="button" class="carousel-indicator" aria-label="Go to slide 1" aria-current="true" data-demo-carousel-go="0"></button>
      <button type="button" class="carousel-indicator" aria-label="Go to slide 2" data-demo-carousel-go="1"></button>
      <button type="button" class="carousel-indicator" aria-label="Go to slide 3" data-demo-carousel-go="2"></button>
    </div>
    <button type="button" class="carousel-button" data-demo-carousel-next aria-label="Next slide">${chevronRight}</button>
  </div>
</section>`
    }
  ],
  chart: [
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
  ],
  resizable: [
    {
      title: "Default",
      html: `<div class="resizable" style="height: 10rem">
  <div class="resizable-panel">
    <p><strong>Sidebar</strong></p>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="vertical" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
  <div class="resizable-panel">
    <p><strong>Content</strong></p>
  </div>
</div>`
    },
    {
      title: "Horizontal",
      html: `<div class="resizable" data-orientation="horizontal" style="height: 12rem">
  <div class="resizable-panel">
    <p><strong>Panel one</strong></p>
    <p>Drag the handle or use the arrow keys in your application.</p>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="vertical" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
  <div class="resizable-panel" style="--panel-size: 2">
    <p><strong>Panel two</strong></p>
    <p>Set --panel-size to change the initial flex ratio.</p>
  </div>
</div>`
    },
    {
      title: "Vertical",
      html: `<div class="resizable" data-orientation="vertical" style="height: 14rem">
  <div class="resizable-panel">
    <p><strong>Top panel</strong></p>
  </div>
  <div data-slot="handle" role="separator" aria-orientation="horizontal" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
  <div class="resizable-panel">
    <p><strong>Bottom panel</strong></p>
  </div>
</div>`
    }
  ],
  sidebar: [
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
  ],
  toast: [
    {
      title: "Default",
      html: `<div style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 22rem">
  <div class="toast" role="status">
    <section>
      <p data-slot="title">Saved</p>
      <p data-slot="description">Your changes have been saved.</p>
    </section>
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="close" data-demo-toast-close aria-label="Dismiss">×</button>
  </div>
  <div class="toast" data-variant="destructive" role="alert">
    <section>
      <p data-slot="title">Upload failed</p>
      <p data-slot="description">The file is larger than 10 MB.</p>
    </section>
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" data-slot="close" data-demo-toast-close aria-label="Dismiss">×</button>
  </div>
</div>`
    }
  ],
  message: [
    {
      title: "Default",
      html: `<article class="message" data-align="start">
  <div data-slot="avatar">
    <span class="avatar" data-size="sm">
      <span data-slot="fallback">CN</span>
    </span>
  </div>
  <div data-slot="content">
    <div data-slot="header">shadcn</div>
    <div class="bubble" data-variant="muted">
      <div data-slot="content">How can I help you today?</div>
    </div>
    <div data-slot="footer">10:42 AM</div>
  </div>
</article>`
    },
    {
      title: "Conversation",
      html: `<div class="message-group" role="log" aria-label="Conversation">
  <article class="message" data-align="start">
    <div data-slot="avatar">
      <span class="avatar" data-size="sm">
        <span data-slot="fallback">CN</span>
      </span>
    </div>
    <div data-slot="content">
      <div data-slot="header">shadcn</div>
      <div class="bubble" data-variant="muted">
        <div data-slot="content">How can I help you today?</div>
      </div>
      <div data-slot="footer">10:42 AM</div>
    </div>
  </article>
  <article class="message" data-align="end">
    <div data-slot="avatar">
      <span class="avatar" data-size="sm">
        <span data-slot="fallback">YO</span>
      </span>
    </div>
    <div data-slot="content">
      <div data-slot="header">You</div>
      <div class="bubble">
        <div data-slot="content">Add a calendar and a date picker to the docs.</div>
      </div>
      <div data-slot="footer">Delivered</div>
    </div>
  </article>
</div>`
    }
  ],
  bubble: [
    {
      title: "Default",
      html: `<div class="bubble" data-align="start">
  <div data-slot="content">Hello! How can I help you today?</div>
</div>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: flex-start">
  <div class="bubble"><div data-slot="content">Default</div></div>
  <div class="bubble" data-variant="secondary"><div data-slot="content">Secondary</div></div>
  <div class="bubble" data-variant="muted"><div data-slot="content">Muted</div></div>
  <div class="bubble" data-variant="tinted"><div data-slot="content">Tinted</div></div>
  <div class="bubble" data-variant="outline"><div data-slot="content">Outline</div></div>
  <div class="bubble" data-variant="ghost"><div data-slot="content">Ghost content</div></div>
  <div class="bubble" data-variant="destructive"><div data-slot="content">Something went wrong.</div></div>
</div>`
    },
    {
      title: "Reactions",
      html: `<div style="display: flex; flex-direction: column; gap: 2rem; padding-block: 1rem; max-width: 22rem">
  <div class="bubble" data-variant="muted" data-align="start">
    <div data-slot="content">The install failure came from an out-of-date lockfile.</div>
    <div data-slot="reactions">
      <button type="button" data-slot="reaction" aria-pressed="true" aria-label="Helpful, 2 reactions">👍 <span>2</span></button>
      <button type="button" data-slot="reaction" aria-pressed="false" aria-label="Celebrate, 0 reactions">🎉</button>
    </div>
  </div>
</div>`
    }
  ],
  marker: [
    {
      title: "Default",
      html: `<div class="marker">
  <span data-slot="icon">${info}</span>
  <span data-slot="content">Assistant is thinking…</span>
</div>`
    },
    {
      title: "Variants",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem">
  <div class="marker">
    <span data-slot="icon">${info}</span>
    <span data-slot="content">Assistant is thinking…</span>
  </div>
  <div class="marker" data-variant="separator">
    <span data-slot="content">Today</span>
  </div>
  <div class="marker" data-variant="border">
    <span data-slot="icon">${globe}</span>
    <span data-slot="content">Searched 3 sources · <a href="#">View sources</a></span>
  </div>
</div>`
    }
  ],
  attachment: [
    {
      title: "Default",
      html: `<div class="attachment">
  <div data-slot="media">${fileText}</div>
  <div data-slot="content">
    <span data-slot="title">report.pdf</span>
    <span data-slot="description">PDF · 2.4 MB</span>
  </div>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Remove report.pdf">×</button>
  </div>
</div>`
    },
    {
      title: "States",
      html: `<div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem">
  <div class="attachment">
    <div data-slot="media">${fileText}</div>
    <div data-slot="content">
      <span data-slot="title">report.pdf</span>
      <span data-slot="description">PDF · 2.4 MB</span>
    </div>
    <div data-slot="actions">
      <button type="button" class="btn" data-variant="ghost" data-size="icon-xs" aria-label="Remove report.pdf">×</button>
    </div>
  </div>
  <div class="attachment" aria-busy="true">
    <div data-slot="media"><span class="spinner" data-size="sm"></span></div>
    <div data-slot="content">
      <span data-slot="title">sales-dashboard.csv</span>
      <span data-slot="description">Uploading · 64%</span>
    </div>
  </div>
  <div class="attachment">
    <div data-slot="media">${circleAlert}</div>
    <div data-slot="content">
      <span data-slot="title">workspace.zip</span>
      <span data-slot="description" role="alert">Upload failed. The file is larger than 10 MB.</span>
    </div>
  </div>
</div>`
    },
    {
      title: "Media",
      html: `<div class="attachment" data-orientation="vertical">
  <div data-slot="media">
    <img src="${ratioImage}" alt="Workspace preview">
  </div>
  <div data-slot="content">
    <span data-slot="title">cover.png</span>
    <span data-slot="description">PNG · 840 KB</span>
  </div>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="secondary" data-size="icon-xs" aria-label="Remove cover.png">×</button>
  </div>
</div>`
    }
  ],
  questionnaire: [
    {
      title: "Default",
      html: `<div class="questionnaire">
  <div data-slot="progress">
    <span data-slot="progress-label" id="questionnaire-default-progress" aria-live="polite">Question 1 of 1</span>
    <progress aria-labelledby="questionnaire-default-progress" value="1" max="1">1 of 1</progress>
  </div>
  <fieldset data-slot="item" aria-current="step">
    <legend>What should the agent build next?</legend>
    <p data-slot="description">Choose a direction or describe another task.</p>
    <div data-slot="choices">
      <label class="questionnaire-choice">
        <input type="radio" name="questionnaire-default" value="timeline" checked>
        <span data-slot="text">
          <span data-slot="label">Tool call timeline</span>
          <span data-slot="description">Show what the agent ran and what came back.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="radio" name="questionnaire-default" value="checkpoints">
        <span data-slot="text">
          <span data-slot="label">Approval checkpoints</span>
          <span data-slot="description">Ask before sensitive or destructive actions.</span>
        </span>
      </label>
      <input type="text" data-slot="input" name="questionnaire-default-other" aria-label="Another answer" placeholder="Type another answer…">
    </div>
  </fieldset>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="outline">Skip</button>
    <button type="button" class="btn">Submit</button>
  </div>
</div>`
    },
    {
      title: "Steps",
      html: `<div class="questionnaire" data-demo="questionnaire">
  <div data-slot="progress">
    <span data-slot="progress-label" id="questionnaire-progress" aria-live="polite">Question 1 of 2</span>
    <progress aria-labelledby="questionnaire-progress" value="1" max="2">1 of 2</progress>
  </div>
  <fieldset data-slot="item" aria-current="step">
    <legend>What should the agent build next?</legend>
    <p data-slot="description">Choose a direction or describe another task.</p>
    <div data-slot="choices">
      <label class="questionnaire-choice">
        <input type="radio" name="direction" value="timeline" checked>
        <span data-slot="text">
          <span data-slot="label">Tool call timeline</span>
          <span data-slot="description">Show what the agent ran and what came back.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="radio" name="direction" value="checkpoints">
        <span data-slot="text">
          <span data-slot="label">Approval checkpoints</span>
          <span data-slot="description">Ask before sensitive or destructive actions.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="radio" name="direction" value="handoffs">
        <span data-slot="text">
          <span data-slot="label">Sub-agent handoffs</span>
          <span data-slot="description">Make delegated work and results easier to follow.</span>
        </span>
      </label>
      <input type="text" data-slot="input" name="other" aria-label="Another answer" placeholder="Type another answer…">
    </div>
  </fieldset>
  <fieldset data-slot="item" hidden>
    <legend>What context should the agent inspect?</legend>
    <p data-slot="description">Select every source that may affect the implementation.</p>
    <div data-slot="choices">
      <label class="questionnaire-choice">
        <input type="checkbox" name="context" value="files">
        <span data-slot="text">
          <span data-slot="label">Relevant source files</span>
          <span data-slot="description">Components, styles and tests touched by the change.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="checkbox" name="context" value="tests" checked>
        <span data-slot="text">
          <span data-slot="label">Existing tests</span>
          <span data-slot="description">Unit and browser coverage for the affected area.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="checkbox" name="context" value="history">
        <span data-slot="text">
          <span data-slot="label">Recent commit history</span>
          <span data-slot="description">Changes that explain the current behavior.</span>
        </span>
      </label>
    </div>
  </fieldset>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="outline" data-demo-questionnaire-prev disabled>Previous</button>
    <button type="button" class="btn" data-demo-questionnaire-next>Next</button>
  </div>
</div>`
    }
  ],
  trace: [
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
  ],
  "message-scroller": [
    {
      title: "Default",
      html: `<div class="message-scroller" data-demo="message-scroller" style="height: 22rem">
  <div class="message-scroller-viewport" tabindex="0" role="log" aria-label="Conversation">
    <div data-slot="content">
      <div class="marker" data-variant="separator">
        <span data-slot="content">Today</span>
      </div>
      <div class="message" data-align="start">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">CN</span></span></div>
        <div data-slot="content">
          <div data-slot="header">shadcn</div>
          <div class="bubble" data-variant="muted"><div data-slot="content">I checked the registry build.</div></div>
        </div>
      </div>
      <div class="message" data-align="end">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">YO</span></span></div>
        <div data-slot="content">
          <div class="bubble"><div data-slot="content">Did the docs bundle pick up the new files?</div></div>
        </div>
      </div>
      <div class="message" data-align="start">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">CN</span></span></div>
        <div data-slot="content">
          <div class="bubble" data-variant="muted"><div data-slot="content">Yes. The main stylesheet includes the base and Nova files.</div></div>
        </div>
      </div>
      <div class="message" data-align="end">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">YO</span></span></div>
        <div data-slot="content">
          <div class="bubble"><div data-slot="content">Great. Run the registry validator before the browser suite.</div></div>
        </div>
      </div>
      <div class="message" data-align="start">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">CN</span></span></div>
        <div data-slot="content">
          <div class="bubble" data-variant="muted"><div data-slot="content">Both are green. The chat components are ready for review.</div></div>
        </div>
      </div>
      <div class="message" data-align="end">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">YO</span></span></div>
        <div data-slot="content">
          <div class="bubble"><div data-slot="content">Then this scroller needs enough history to prove the jump button.</div></div>
        </div>
      </div>
      <div class="message" data-align="start">
        <div data-slot="avatar"><span class="avatar" data-size="sm"><span data-slot="fallback">CN</span></span></div>
        <div data-slot="content">
          <div class="bubble" data-variant="muted"><div data-slot="content">Scroll up and the jump button appears; it returns you here.</div></div>
        </div>
      </div>
    </div>
  </div>
  <button type="button" data-slot="jump" data-demo-scroll-end aria-label="Jump to latest">${arrowDown}</button>
</div>`
    }
  ]
};
