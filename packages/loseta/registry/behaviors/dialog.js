// @ts-check

import { emit, focusables, init, on } from "./core.js";

/** @param {Element} trigger @param {HTMLDialogElement} dialog @param {boolean} open */
function syncEdgeDialogTrigger(trigger, dialog, open) {
  if (!dialog.matches(".drawer, .sheet")) return;
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-controls", dialog.id);
  trigger.setAttribute("aria-expanded", String(open));
}

/**
 * @param {HTMLDialogElement} dialog
 * @param {HTMLElement} opener
 */
function trackClose(dialog, opener) {
  dialog.addEventListener(
    "close",
    () => {
      syncEdgeDialogTrigger(opener, dialog, false);
      emit(dialog, "toggle", { open: false });
      if (opener.isConnected) opener.focus();
    },
    { once: true }
  );
}

/** @param {Element} trigger */
function openDialog(trigger) {
  const id = trigger.getAttribute("data-open-dialog");
  if (!id) return;
  const dialog = document.getElementById(id);
  if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;

  syncEdgeDialogTrigger(trigger, dialog, true);
  dialog.showModal();
  emit(dialog, "toggle", { open: true });
  trackClose(dialog, /** @type {HTMLElement} */ (trigger));

  queueMicrotask(() => {
    const autofocus = dialog.querySelector("[autofocus]");
    if (autofocus instanceof HTMLElement) {
      autofocus.focus();
    } else if (!dialog.contains(document.activeElement)) {
      dialog.focus();
    }
  });
}

on("click", "[data-open-dialog]", (event, trigger) => {
  openDialog(trigger);
  event.preventDefault();
  return true;
});

on("click", "[data-close-dialog]", (event, target) => {
  const dialog = target.closest("dialog");
  if (!(dialog instanceof HTMLDialogElement)) return;
  dialog.close();
  event.preventDefault();
  return true;
});

// Native `<dialog>` reports backdrop clicks with the dialog itself as target.
on("click", "dialog", (event, dialog) => {
  if (event.target !== dialog) return;
  if (dialog.matches(".alert-dialog")) return true;
  if (dialog instanceof HTMLDialogElement) dialog.close();
  return true;
});

// Native focus containment differs across engines; keep Tab inside the modal.
on("keydown", "dialog", (event, dialog) => {
  if (!(event instanceof KeyboardEvent) || event.key !== "Tab") return;
  if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return;

  const items = focusables(dialog);
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;

  if (items.length === 0) {
    dialog.focus();
    event.preventDefault();
    return true;
  }

  if (event.shiftKey && (active === first || !dialog.contains(active))) {
    if (last instanceof HTMLElement) last.focus();
    event.preventDefault();
    return true;
  }

  if (!event.shiftKey && (active === last || !dialog.contains(active))) {
    if (first instanceof HTMLElement) first.focus();
    event.preventDefault();
    return true;
  }
});

init();
