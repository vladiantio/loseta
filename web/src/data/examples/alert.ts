import type { Example } from "./types";
import { circleAlert, circleCheck, info, triangleAlert } from "./icons";

export const alertExamples: Example[] = [
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
];
