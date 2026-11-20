// @ts-check

import {
  emit,
  focusWhenVisible,
  init,
  on,
  onDocument,
  panelFor,
  setOpen
} from "./core.js";

/**
 * @typedef {object} OpenPopover
 * @property {HTMLElement} trigger
 * @property {HTMLElement} panel
 * @property {Element} root
 */

/** @type {OpenPopover[]} */
const openPopovers = [];

/** Tracks panels that start open in markup, such as a date picker. */
function syncOpenPopovers() {
  if (typeof document === "undefined") return;
  for (const panel of document.querySelectorAll("[data-popover][aria-hidden='false']")) {
    if (!(panel instanceof HTMLElement)) continue;
    if (openPopovers.some((entry) => entry.panel === panel)) continue;
    const root = panel.closest(".popover");
    if (!root) continue;

    const trigger = [...root.querySelectorAll("[aria-haspopup='dialog'][aria-controls]")].find(
      (candidate) =>
        (candidate.getAttribute("aria-controls") ?? "")
          .split(/\s+/)
          .includes(panel.id)
    );
    if (trigger instanceof HTMLElement) {
      openPopovers.push({ trigger, panel, root });
    }
  }
}

/** @param {OpenPopover} entry @param {boolean} focusTrigger */
function closePopover(entry, focusTrigger) {
  const index = openPopovers.indexOf(entry);
  if (index !== -1) openPopovers.splice(index, 1);
  setOpen(entry.trigger, entry.panel, false);
  emit(entry.root, "toggle", { open: false });
  if (focusTrigger) entry.trigger.focus();
}

/** @param {HTMLElement} trigger @param {HTMLElement} panel @param {Element} root */
function openPopover(trigger, panel, root) {
  for (const entry of [...openPopovers]) {
    if (entry.panel.contains(panel)) continue;
    closePopover(entry, false);
  }

  const entry = { trigger, panel, root };
  openPopovers.push(entry);
  setOpen(trigger, panel, true);
  emit(root, "toggle", { open: true });

  if (panel.getAttribute("role") === "dialog") {
    focusWhenVisible(panel);
  }
}

on("click", ".popover [aria-haspopup='dialog'][aria-controls]", (event, target) => {
  const trigger = /** @type {HTMLElement} */ (target);
  const panel = panelFor(trigger);
  const root = trigger.closest(".popover");
  if (!(panel instanceof HTMLElement) || !panel.matches("[data-popover]") || !root) {
    return;
  }

  const existing = openPopovers.find((entry) => entry.trigger === trigger);
  const visible = panel.getAttribute("aria-hidden") === "false";
  if (existing) {
    closePopover(existing, true);
  } else if (visible) {
    // Markup may start open, e.g. a date picker panel.
    closePopover({ trigger, panel, root }, true);
  } else {
    openPopover(trigger, panel, root);
  }

  event.preventDefault();
  return true;
});

onDocument("pointerdown", (event) => {
  if (!(event.target instanceof Node)) return;
  syncOpenPopovers();
  for (const entry of [...openPopovers]) {
    if (entry.root.contains(event.target) || entry.panel.contains(event.target)) {
      continue;
    }
    closePopover(entry, false);
  }
});

onDocument(
  "keydown",
  (event) => {
    if (!(event instanceof KeyboardEvent) || event.key !== "Escape") return;
    syncOpenPopovers();
    const entry = openPopovers[openPopovers.length - 1];
    if (!entry) return;
    closePopover(entry, true);
    event.preventDefault();
    return true;
  },
  20
);

on("focusout", ".popover", (event, root) => {
  if (!(event instanceof FocusEvent)) return;
  const next = event.relatedTarget;
  if (next === null) return;
  if (next instanceof Node && root.contains(next)) return;
  const entry = openPopovers.find((candidate) => candidate.root === root);
  if (entry) closePopover(entry, false);
});

init();
