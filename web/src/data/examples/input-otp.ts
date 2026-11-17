import type { Example } from "./types";

export const inputOtpExamples: Example[] = [
    {
      title: "Default",
      html: `<input class="input-otp" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" aria-label="One-time code" placeholder="000000">`
    },
    {
      title: "Large",
      html: `<input class="input-otp" data-size="lg" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]*" aria-label="One-time code" placeholder="000000">`
    }
];
