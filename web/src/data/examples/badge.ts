import type { Example } from "./types";
import { arrowUpRight, badgeCheck, bookmark } from "./icons";

const verifiedIcon = badgeCheck.replace(
  'aria-hidden="true"',
  'aria-hidden="true" data-icon="inline-start"'
);

const bookmarkIcon = bookmark.replace(
  'aria-hidden="true"',
  'aria-hidden="true" data-icon="inline-end"'
);

export const badgeExamples: Example[] = [
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
    },
    {
      title: "With icons",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <span class="badge" data-variant="secondary">${verifiedIcon}Verified</span>
  <span class="badge" data-variant="outline">Bookmark${bookmarkIcon}</span>
</div>`
    },
    {
      title: "With spinner",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <span class="badge" data-variant="destructive" aria-busy="true"><span class="spinner" data-size="sm" data-icon="inline-start" aria-hidden="true"></span>Deleting</span>
  <span class="badge" data-variant="secondary" aria-busy="true">Generating<span class="spinner" data-size="sm" data-icon="inline-end" aria-hidden="true"></span></span>
</div>`
    },
    {
      title: "As link",
      html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <a class="badge" href="#">Open link${arrowUpRight}</a>
  <a class="badge" data-variant="outline" href="#">Read the docs${arrowUpRight}</a>
</div>`
    },
    {
      title: "In a field",
      html: `<div class="field" style="max-width: 24rem">
  <label class="label" for="demo-badge-webhook" style="width: 100%">
    Webhook URL
    <span class="badge" data-variant="secondary" style="margin-inline-start: auto">Beta</span>
  </label>
  <input class="input" id="demo-badge-webhook" type="url" placeholder="https://api.example.com/webhook">
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: flex; flex-wrap: wrap; gap: 0.5rem">
  <span class="badge">شارة</span>
  <span class="badge" data-variant="secondary">ثانوي</span>
  <span class="badge" data-variant="outline">مخطط</span>
  <span class="badge" data-variant="destructive">مدمر</span>
  <span class="badge" data-variant="secondary">${verifiedIcon}متحقق</span>
  <span class="badge" data-variant="outline">إشارة مرجعية${bookmarkIcon}</span>
</div>`
    }
];
