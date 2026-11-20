import type { Example } from "./types";

export const nativeSelectExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="field">
  <label class="label" for="demo-native-select-default">Framework</label>
  <select class="native-select" id="demo-native-select-default">
    <option value="" selected disabled>Select a framework</option>
    <option>Next.js</option>
    <option>Astro</option>
    <option>SvelteKit</option>
    <option>Nuxt</option>
  </select>
</div>`
    },
    {
      title: "Sizes",
      html: `<div style="display: flex; flex-direction: column; gap: 1rem; max-width: 20rem">
  <div class="field">
    <label class="label" for="demo-native-select-size-sm">Small</label>
    <select class="native-select" data-size="sm" id="demo-native-select-size-sm">
      <option>Next.js</option>
      <option>Astro</option>
      <option>SvelteKit</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="demo-native-select-size-default">Default</label>
    <select class="native-select" id="demo-native-select-size-default">
      <option>Next.js</option>
      <option>Astro</option>
      <option>SvelteKit</option>
    </select>
  </div>
</div>`
    },
    {
      title: "Disabled",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-native-select-disabled">Framework</label>
  <select class="native-select" id="demo-native-select-disabled" disabled>
    <option>Next.js</option>
    <option>Astro</option>
    <option>SvelteKit</option>
  </select>
  <p>This field is currently disabled.</p>
</div>`
    },
    {
      title: "Invalid",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-native-select-invalid">Framework</label>
  <select class="native-select" id="demo-native-select-invalid" aria-invalid="true" aria-describedby="demo-native-select-invalid-error">
    <option value="" selected disabled>Select a framework</option>
    <option>Next.js</option>
    <option>Astro</option>
    <option>SvelteKit</option>
  </select>
  <p id="demo-native-select-invalid-error" role="alert">Please select a framework.</p>
</div>`
    },
    {
      title: "Groups",
      html: `<div class="field" style="max-width: 20rem">
  <label class="label" for="demo-native-select-groups">Department</label>
  <select class="native-select" id="demo-native-select-groups">
    <option value="" selected disabled>Select department</option>
    <optgroup label="Engineering">
      <option>Frontend</option>
      <option>Backend</option>
      <option>DevOps</option>
    </optgroup>
    <optgroup label="Sales">
      <option>Sales Rep</option>
      <option>Account Manager</option>
      <option>Sales Director</option>
    </optgroup>
    <optgroup label="Operations">
      <option>Customer Support</option>
      <option>Product Manager</option>
      <option>Operations Manager</option>
    </optgroup>
  </select>
  <p>Departments are grouped by their parent team.</p>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="field" dir="rtl" lang="ar" style="max-width: 20rem">
  <label class="label" for="demo-native-select-rtl">الحالة</label>
  <select class="native-select" id="demo-native-select-rtl" dir="rtl">
    <option value="" selected disabled>اختر الحالة</option>
    <option>قيد الانتظار</option>
    <option>قيد التنفيذ</option>
    <option>منجز</option>
    <option>ملغي</option>
  </select>
  <p>يعرض هذا الحقل حالة المهمة الحالية.</p>
</div>`
    }
];
