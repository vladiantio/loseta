import type { Example } from "./types";
import { avatarImage, bluetooth, circlePlus, trash } from "./icons";

export const alertDialogExamples: Example[] = [
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
];
