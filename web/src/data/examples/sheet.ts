import type { Example } from "./types";
import { close, dialogParagraphs } from "./icons";

type SheetSide = "inline-start" | "inline-end" | "block-start" | "block-end";

interface SheetDialogOptions {
  id: string;
  side?: SheetSide;
  size?: "sm" | "lg";
  title: string;
  description?: string;
  body: string;
  footer: string;
  closeLabel?: string;
  sectionAttributes?: string;
  attributes?: string;
}

function sheetTrigger(id: string, label: string, small = false): string {
  const size = small ? ' data-size="sm"' : "";
  return `<button type="button" class="btn" data-variant="outline"${size} data-open-dialog="${id}" aria-haspopup="dialog" aria-controls="${id}" aria-expanded="false">
  ${label}
</button>`;
}

function sheetClose(label: string): string {
  return `<form method="dialog">
  <button type="submit" class="btn" data-variant="ghost" data-size="icon-sm" data-slot="close" aria-label="${label}">${close}</button>
</form>`;
}

function sheetDialog({
  id,
  side,
  size,
  title,
  description,
  body,
  footer,
  closeLabel,
  sectionAttributes = "",
  attributes = ""
}: SheetDialogOptions): string {
  const sideAttribute = side ? ` data-side="${side}"` : "";
  const sizeAttribute = size ? ` data-size="${size}"` : "";
  const descriptionMarkup = description
    ? `\n      <p data-slot="description" id="${id}-description">${description}</p>`
    : "";
  const describedBy = description ? ` aria-describedby="${id}-description"` : "";
  const closeMarkup = closeLabel ? `\n    ${sheetClose(closeLabel)}` : "";

  return `<dialog class="sheet" id="${id}"${sideAttribute}${sizeAttribute}${attributes} aria-labelledby="${id}-title"${describedBy}>
  <div data-slot="sheet-content">
    <header>
      <h2 data-slot="title" id="${id}-title">${title}</h2>${descriptionMarkup}
    </header>
    <section${sectionAttributes}>
      ${body}
    </section>
    <footer>
      ${footer}
    </footer>${closeMarkup}
  </div>
</dialog>`;
}

const sides = [
  {
    key: "top",
    side: "block-start" as const,
    label: "Block start",
    title: "Block start sheet",
    description: "Anchored to the block start edge.",
    body: "Use a top sheet for a short announcement or a wide filter bar.",
    closeLabel: "Close block start sheet",
    attributes: ' style="--sheet-height: 50vh"'
  },
  {
    key: "right",
    side: "inline-end" as const,
    label: "Inline end",
    title: "Inline end sheet",
    description: "Anchored to the inline end edge.",
    body: "Use a side sheet for details that complement the page.",
    closeLabel: "Close inline end sheet"
  },
  {
    key: "bottom",
    side: "block-end" as const,
    label: "Block end",
    title: "Block end sheet",
    description: "Anchored to the block end edge.",
    body: "Use a bottom sheet for actions that relate to the current view.",
    closeLabel: "Close block end sheet",
    attributes: ' style="--sheet-height: 50vh"'
  },
  {
    key: "left",
    side: "inline-start" as const,
    label: "Inline start",
    title: "Inline start sheet",
    description: "Anchored to the inline start edge.",
    body: "Use a side sheet for navigation or secondary controls.",
    closeLabel: "Close inline start sheet"
  }
];

export const sheetExamples: Example[] = [
  {
    title: "Default",
    html: `${sheetTrigger("demo-sheet-default", "Open sheet")}

${sheetDialog({
  id: "demo-sheet-default",
  title: "Edit profile",
  description: "Make changes to your profile here. Click save when you're done.",
  body: `<div class="fieldset">
  <div class="field">
    <label class="label" for="sheet-default-name">Name</label>
    <input class="input" id="sheet-default-name" value="Ada Lovelace">
  </div>
  <div class="field">
    <label class="label" for="sheet-default-username">Username</label>
    <input class="input" id="sheet-default-username" value="@ada">
  </div>
</div>`,
  footer: `<button type="button" class="btn" data-close-dialog>Save changes</button>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Cancel</button>`,
  closeLabel: "Close"
})}`
  },
  {
    title: "Sides",
    html: `${sides
      .map((side) =>
        sheetTrigger(`demo-sheet-side-${side.key}`, side.label, true)
      )
      .join("\n")}

${sides
      .map((side) =>
        sheetDialog({
          id: `demo-sheet-side-${side.key}`,
          side: side.side,
          title: side.title,
          description: side.description,
          body: `<p>${side.body}</p>`,
          footer: `<button type="button" class="btn" data-close-dialog>Close</button>`,
          closeLabel: side.closeLabel,
          attributes: side.attributes
        })
      )
      .join("\n\n")}`
  },
  {
    title: "No close button",
    html: `${sheetTrigger("demo-sheet-no-close", "Open sheet without close")}

${sheetDialog({
  id: "demo-sheet-no-close",
  side: "inline-end",
  title: "No close button",
  description:
    "This sheet has no close control in the corner. Dismiss it with Escape, a backdrop click or the footer action.",
  body: "<p>Omit the close form when the footer already provides a clear exit.</p>",
  footer: `<button type="button" class="btn" data-close-dialog>Close</button>`
})}`
  },
  {
    title: "Scrollable content",
    html: `${sheetTrigger("demo-sheet-scrollable", "Open scrollable sheet")}

${sheetDialog({
  id: "demo-sheet-scrollable",
  side: "inline-end",
  title: "Scrollable content",
  description: "The header and footer stay in place while the section scrolls.",
  body: dialogParagraphs,
  footer: `<button type="button" class="btn" data-close-dialog>Close</button>`,
  closeLabel: "Close scrollable sheet",
  sectionAttributes:
    ' role="region" aria-label="Scrollable sheet content" tabindex="0"'
})}`
  },
  {
    title: "Inline start, small",
    html: `${sheetTrigger("demo-sheet-left", "Open small inline start sheet")}

${sheetDialog({
  id: "demo-sheet-left",
  side: "inline-start",
  size: "sm",
  title: "Navigation",
  body: "<p>Use an inline-start sheet for navigation or secondary controls.</p>",
  footer: `<button type="button" class="btn" data-close-dialog>Close</button>`,
  closeLabel: "Close inline start sheet"
})}`
  },
  {
    title: "Large",
    html: `${sheetTrigger("demo-sheet-large", "Open large sheet")}

${sheetDialog({
  id: "demo-sheet-large",
  side: "inline-end",
  size: "lg",
  title: "Filters",
  description: "Narrow the results to the records you need.",
  body: `<div class="field">
  <label class="label" for="sheet-large-query">Search</label>
  <input class="input" id="sheet-large-query" placeholder="Name, owner or status">
</div>`,
  footer: `<button type="button" class="btn" data-close-dialog>Apply</button>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>Reset</button>`,
  closeLabel: "Close large sheet"
})}`
  },
  {
    title: "Right-to-left",
    html: `<div dir="rtl" lang="ar">
  ${sheetTrigger("demo-sheet-rtl", "فتح اللوحة")}

  ${sheetDialog({
    id: "demo-sheet-rtl",
    side: "inline-end",
    title: "تعديل الملف الشخصي",
    description: "أجرِ تغييرات على ملفك الشخصي هنا.",
    body: `<div class="field">
  <label class="label" for="sheet-rtl-name">الاسم</label>
  <input class="input" id="sheet-rtl-name" value="ليلى حسن">
</div>`,
    footer: `<button type="button" class="btn" data-close-dialog>حفظ التغييرات</button>
      <button type="button" class="btn" data-variant="outline" data-close-dialog>إلغاء</button>`,
    closeLabel: "إغلاق"
  })}
</div>`
  }
];
