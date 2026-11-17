import type { Example } from "./types";
import { avatarImage, plus } from "./icons";

export const avatarExamples: Example[] = [
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
];
