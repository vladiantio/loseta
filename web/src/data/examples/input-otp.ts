import type { Example } from "./types";
import { refresh } from "./icons";

const cells = (count: number, indent: number): string => {
  const pad = " ".repeat(indent);
  return Array.from(
    { length: count },
    () => `${pad}<span data-slot="cell" aria-hidden="true"></span>`
  ).join("\n");
};

export const inputOtpExamples: Example[] = [
    {
      title: "Default",
      html: `<label class="input-otp">
${cells(6, 2)}
  <span data-slot="entry">
    <input id="demo-input-otp" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required aria-label="One-time code">
  </span>
</label>`
    },
    {
      title: "Joined",
      html: `<label class="input-otp" data-spacing="joined">
${cells(6, 2)}
  <span data-slot="entry">
    <input id="demo-input-otp-joined" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" value="123456" required aria-label="One-time code">
  </span>
</label>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem">
  <div class="field">
    <label class="label" for="demo-input-otp-sm">Small</label>
    <label class="input-otp" data-size="sm">
${cells(4, 6)}
      <span data-slot="entry">
        <input id="demo-input-otp-sm" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="4" pattern="[0-9]{4}" required>
      </span>
    </label>
  </div>
  <div class="field">
    <label class="label" for="demo-input-otp-default">Default</label>
    <label class="input-otp">
${cells(4, 6)}
      <span data-slot="entry">
        <input id="demo-input-otp-default" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="4" pattern="[0-9]{4}" required>
      </span>
    </label>
  </div>
  <div class="field">
    <label class="label" for="demo-input-otp-lg">Large</label>
    <label class="input-otp" data-size="lg">
${cells(4, 6)}
      <span data-slot="entry">
        <input id="demo-input-otp-lg" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="4" pattern="[0-9]{4}" required>
      </span>
    </label>
  </div>
</div>`
    },
    {
      title: "Four digits",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-input-otp-four-digits">Four-digit code</label>
  <label class="input-otp">
${cells(4, 4)}
    <span data-slot="entry">
      <input id="demo-input-otp-four-digits" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="4" pattern="[0-9]{4}" required aria-describedby="demo-input-otp-four-digits-hint">
    </span>
  </label>
  <p id="demo-input-otp-four-digits-hint">Enter the 4-digit code we sent to your email.</p>
</div>`
    },
    {
      title: "Alphanumeric",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-otp-alphanumeric">Backup code</label>
  <label class="input-otp">
${cells(6, 4)}
    <span data-slot="entry">
      <input id="demo-input-otp-alphanumeric" type="text" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" maxlength="6" pattern="[A-Za-z0-9]{6}" required aria-describedby="demo-input-otp-alphanumeric-hint">
    </span>
  </label>
  <p id="demo-input-otp-alphanumeric-hint">Use letters and numbers without spaces.</p>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-otp-disabled">One-time code</label>
  <label class="input-otp">
${cells(6, 4)}
    <span data-slot="entry">
      <input id="demo-input-otp-disabled" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" value="123456" required disabled>
    </span>
  </label>
  <p>Code entry is unavailable right now.</p>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-input-otp-invalid">One-time code</label>
  <label class="input-otp">
${cells(6, 4)}
    <span data-slot="entry">
      <input id="demo-input-otp-invalid" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" value="000000" required aria-invalid="true" aria-describedby="demo-input-otp-invalid-error">
    </span>
  </label>
  <p id="demo-input-otp-invalid-error" role="alert">That code is incorrect. Check your email and try again.</p>
</div>`
    },
    {
      title: "Verification",
      html: `<div class="card" style="max-width: 24rem">
  <header>
    <h3 data-slot="title">Verify your login</h3>
    <p data-slot="description">Enter the verification code we sent to <strong style="font-weight: 500; color: var(--foreground)">ada@example.com</strong>.</p>
  </header>
  <section>
    <div class="field">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem">
        <label class="label" for="demo-input-otp-verification">Verification code</label>
        <button type="button" class="btn" data-variant="outline" data-size="xs">${refresh}Resend code</button>
      </div>
      <label class="input-otp">
${cells(6, 8)}
        <span data-slot="entry">
          <input id="demo-input-otp-verification" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required aria-describedby="demo-input-otp-verification-hint">
        </span>
      </label>
      <p id="demo-input-otp-verification-hint">The code expires 10 minutes after it is sent.</p>
    </div>
  </section>
  <footer>
    <div class="field">
      <button type="button" class="btn" style="width: 100%">Verify</button>
      <p style="text-align: center; color: var(--muted-foreground)">Having trouble signing in? <a href="#">Contact support</a></p>
    </div>
  </footer>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="field" dir="rtl" lang="ar" style="max-width: 24rem">
  <label class="label" for="demo-input-otp-rtl">رمز التحقق</label>
  <label class="input-otp">
${cells(6, 4)}
    <span data-slot="entry">
      <input id="demo-input-otp-rtl" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" value="123456" required aria-describedby="demo-input-otp-rtl-hint">
    </span>
  </label>
  <p id="demo-input-otp-rtl-hint">أدخل الرمز المكوّن من ستة أرقام الذي أرسلناه إلى بريدك الإلكتروني.</p>
</div>`
    }
];
