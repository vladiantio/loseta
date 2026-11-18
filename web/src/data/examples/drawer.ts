import type { Example } from "./types";
import { dialogParagraphs } from "./icons";

const drawerParagraphs = Array.from(
  { length: 4 },
  () => dialogParagraphs
).join("\n      ");

export const drawerExamples: Example[] = [
    {
      title: "Default",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-default">
  Open drawer
</button>

<dialog class="drawer" id="demo-drawer-default" data-side="block-end" aria-labelledby="drawer-default-title" aria-describedby="drawer-default-description">
  <div>
    <span data-slot="handle" aria-hidden="true"></span>
    <header>
      <h2 data-slot="title" id="drawer-default-title">Edit profile</h2>
      <p data-slot="description" id="drawer-default-description">Make changes to your profile here.</p>
    </header>
    <section>
      <div class="fieldset">
        <div class="field">
          <label class="label" for="drawer-default-name">Name</label>
          <input class="input" id="drawer-default-name" value="Ada Lovelace">
        </div>
        <div class="field">
          <label class="label" for="drawer-default-username">Username</label>
          <input class="input" id="drawer-default-username" value="@ada">
        </div>
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

<dialog class="drawer" id="demo-drawer-large" data-side="block-end" data-size="lg" aria-labelledby="drawer-large-title" aria-describedby="drawer-large-description">
  <div>
    <span data-slot="handle" aria-hidden="true"></span>
    <header>
      <h2 data-slot="title" id="drawer-large-title">Filters</h2>
      <p data-slot="description" id="drawer-large-description">Narrow the results to the records you need.</p>
    </header>
    <section>
      <div class="field">
        <label class="label" for="drawer-large-query">Search</label>
        <input class="input" id="drawer-large-query" placeholder="Name, owner or status">
      </div>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Reset</button>
      <button type="button" class="btn" data-close-dialog>Apply</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Small",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-small">
  Open small drawer
</button>

<dialog class="drawer" id="demo-drawer-small" data-side="block-end" data-size="sm" aria-labelledby="drawer-small-title" aria-describedby="drawer-small-description">
  <div>
    <span data-slot="handle" aria-hidden="true"></span>
    <header>
      <h2 data-slot="title" id="drawer-small-title">Quick action</h2>
      <p data-slot="description" id="drawer-small-description">Confirm the action without leaving the page.</p>
    </header>
    <section>
      <p>The small size keeps a short confirmation within reach.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>
      <button type="button" class="btn" data-close-dialog>Confirm</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Top",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-top">
  Open top drawer
</button>

<dialog class="drawer" id="demo-drawer-top" data-side="block-start" aria-labelledby="drawer-top-title" aria-describedby="drawer-top-description">
  <div>
    <header>
      <h2 data-slot="title" id="drawer-top-title">Notifications</h2>
      <p data-slot="description" id="drawer-top-description">Anchored to the block start edge, with the handle at the bottom.</p>
    </header>
    <section>
      <p>Use a top drawer for a short announcement or a wide filter bar.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Close</button>
    </footer>
    <span data-slot="handle" aria-hidden="true"></span>
  </div>
</dialog>`
    },
    {
      title: "Scrollable content",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-scrollable">
  Open scrollable drawer
</button>

<dialog class="drawer" id="demo-drawer-scrollable" data-side="block-end" aria-labelledby="drawer-scrollable-title" aria-describedby="drawer-scrollable-description">
  <div>
    <span data-slot="handle" aria-hidden="true"></span>
    <header>
      <h2 data-slot="title" id="drawer-scrollable-title">Scrollable content</h2>
      <p data-slot="description" id="drawer-scrollable-description">The header and footer stay in place while the section scrolls.</p>
    </header>
    <section role="region" aria-label="Scrollable drawer content" tabindex="0">
      ${drawerParagraphs}
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Close</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Nested",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-nested">
  Open drawer
</button>

<dialog class="drawer" id="demo-drawer-nested" data-side="block-end" aria-labelledby="drawer-nested-title" aria-describedby="drawer-nested-description">
  <div>
    <span data-slot="handle" aria-hidden="true"></span>
    <header>
      <h2 data-slot="title" id="drawer-nested-title">Drawer</h2>
      <p data-slot="description" id="drawer-nested-description">Open another drawer from inside this one.</p>
    </header>
    <section>
      <p>The parent drawer stays mounted behind the nested drawer.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-nested-child">Open nested drawer</button>
      <button type="button" class="btn" data-close-dialog>Close</button>
    </footer>
    <dialog class="drawer" id="demo-drawer-nested-child" data-side="block-end" aria-labelledby="drawer-nested-child-title" aria-describedby="drawer-nested-child-description">
      <div>
        <span data-slot="handle" aria-hidden="true"></span>
        <header>
          <h2 data-slot="title" id="drawer-nested-child-title">Nested drawer</h2>
          <p data-slot="description" id="drawer-nested-child-description">This drawer stacks above the parent.</p>
        </header>
        <section>
          <p>Close this drawer to return to the parent.</p>
        </section>
        <footer>
          <button type="button" class="btn" data-close-dialog>Close</button>
        </footer>
      </div>
    </dialog>
  </div>
</dialog>`
    },
    {
      title: "Without handle",
      html: `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-no-handle">
  Open drawer without handle
</button>

<dialog class="drawer" id="demo-drawer-no-handle" data-side="block-end" aria-labelledby="drawer-no-handle-title" aria-describedby="drawer-no-handle-description">
  <div>
    <header>
      <h2 data-slot="title" id="drawer-no-handle-title">No handle</h2>
      <p data-slot="description" id="drawer-no-handle-description">The handle is optional. Leave it out when drag gestures are not part of the flow.</p>
    </header>
    <section>
      <p>Use the footer actions or Escape to dismiss the drawer.</p>
    </section>
    <footer>
      <button type="button" class="btn" data-close-dialog>Close</button>
    </footer>
  </div>
</dialog>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar">
  <button type="button" class="btn" data-variant="outline" data-open-dialog="demo-drawer-rtl">
    فتح الدرج
  </button>

  <dialog class="drawer" id="demo-drawer-rtl" data-side="block-end" aria-labelledby="drawer-rtl-title" aria-describedby="drawer-rtl-description">
    <div>
      <span data-slot="handle" aria-hidden="true"></span>
      <header>
        <h2 data-slot="title" id="drawer-rtl-title">تعديل الملف الشخصي</h2>
        <p data-slot="description" id="drawer-rtl-description">أجرِ تغييرات على ملفك الشخصي هنا.</p>
      </header>
      <section>
        <div class="field">
          <label class="label" for="drawer-rtl-name">الاسم</label>
          <input class="input" id="drawer-rtl-name" value="ليلى حسن">
        </div>
      </section>
      <footer>
        <button type="button" class="btn" data-variant="outline" data-close-dialog>إلغاء</button>
        <button type="button" class="btn" data-close-dialog>حفظ التغييرات</button>
      </footer>
    </div>
  </dialog>
</div>`
    }
];
