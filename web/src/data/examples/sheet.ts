import type { Example } from "./types";

export const sheetExamples: Example[] = [
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
];
