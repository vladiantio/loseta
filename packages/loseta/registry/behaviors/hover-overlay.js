// @ts-check

import { emit, init, on, onDocument } from "./core.js";

const WRAPPER_SELECTOR = ".tooltip, .hover-card";

/**
 * @typedef {object} OverlayState
 * @property {boolean} hovered
 * @property {boolean} focused
 * @property {boolean} dismissed
 */

/** @type {WeakMap<HTMLElement, OverlayState>} */
const states = new WeakMap();
/** @type {WeakSet<HTMLElement>} */
const ignoreFocus = new WeakSet();
/** @type {HTMLElement[]} */
const open = [];

/** @param {HTMLElement} wrapper */
function panelFor(wrapper) {
  const selector = wrapper.matches(".tooltip")
    ? ":scope > [data-slot='content']"
    : ":scope > [data-popover]";
  const panel = wrapper.querySelector(selector);
  return panel instanceof HTMLElement ? panel : null;
}

/** @param {HTMLElement} wrapper @param {HTMLElement} panel */
function triggerFor(wrapper, panel) {
  for (const element of wrapper.querySelectorAll(
    "button, a[href], input, select, textarea, [tabindex]"
  )) {
    if (panel.contains(element)) continue;
    if (element instanceof HTMLElement) return element;
  }
  return null;
}

/** @param {HTMLElement} wrapper */
function stateFor(wrapper) {
  const existing = states.get(wrapper);
  if (existing) return existing;
  const state = { hovered: false, focused: false, dismissed: false };
  states.set(wrapper, state);
  return state;
}

/** @param {HTMLElement} wrapper */
function openOverlay(wrapper) {
  const panel = panelFor(wrapper);
  if (!panel) return;
  if (states.get(wrapper)?.dismissed) return;
  if (wrapper.matches(".tooltip") && (panel.textContent ?? "").trim() === "") {
    return;
  }
  if (open.includes(wrapper)) return;

  for (const other of [...open]) {
    if (other !== wrapper) closeOverlay(other, false);
  }

  panel.setAttribute("aria-hidden", "false");
  open.push(wrapper);
  emit(wrapper, "toggle", { open: true });
}

/**
 * @param {HTMLElement} wrapper
 * @param {boolean} focusTrigger
 */
function closeOverlay(wrapper, focusTrigger) {
  const panel = panelFor(wrapper);
  if (panel) panel.setAttribute("aria-hidden", "true");

  if (focusTrigger) {
    const state = states.get(wrapper);
    if (state) {
      state.dismissed = true;
      state.focused = false;
    }
  }

  const index = open.indexOf(wrapper);
  if (index !== -1) {
    open.splice(index, 1);
    emit(wrapper, "toggle", { open: false });
  }

  if (focusTrigger && panel) {
    const trigger = triggerFor(wrapper, panel);
    if (trigger) {
      if (document.activeElement !== trigger) ignoreFocus.add(wrapper);
      trigger.focus({ preventScroll: true });
      queueMicrotask(() => ignoreFocus.delete(wrapper));
    }
  }
}

/** @param {HTMLElement} wrapper */
function sync(wrapper) {
  const state = stateFor(wrapper);
  if (state.hovered || state.focused) {
    openOverlay(wrapper);
  } else {
    closeOverlay(wrapper, false);
  }
}

on("pointerover", WRAPPER_SELECTOR, (_event, element) => {
  if (!(element instanceof HTMLElement)) return;
  const state = stateFor(element);
  if (!state.hovered) state.dismissed = false;
  state.hovered = true;
  openOverlay(element);
});

on("pointerout", WRAPPER_SELECTOR, (event, element) => {
  if (!(element instanceof HTMLElement)) return;
  const related = event instanceof PointerEvent ? event.relatedTarget : null;
  if (related instanceof Node && element.contains(related)) return;
  const state = states.get(element);
  if (!state) return;
  state.hovered = false;
  state.dismissed = false;
  sync(element);
});

on("focusin", WRAPPER_SELECTOR, (_event, element) => {
  if (!(element instanceof HTMLElement)) return;
  const state = stateFor(element);
  if (ignoreFocus.has(element)) {
    ignoreFocus.delete(element);
    state.focused = false;
    return;
  }
  if (!state.focused) state.dismissed = false;
  state.focused = true;
  openOverlay(element);
});

on("focusout", WRAPPER_SELECTOR, (event, element) => {
  if (!(element instanceof HTMLElement) || !(event instanceof FocusEvent)) {
    return;
  }
  const related = event.relatedTarget;
  if (related instanceof Node && element.contains(related)) return;
  const state = states.get(element);
  if (!state) return;
  state.focused = false;
  sync(element);
});

onDocument(
  "keydown",
  (event) => {
    if (!(event instanceof KeyboardEvent) || event.key !== "Escape") return;

    let wrapper = open[open.length - 1] ?? null;
    if (!wrapper) {
      for (const element of document.querySelectorAll(WRAPPER_SELECTOR)) {
        if (!(element instanceof HTMLElement)) continue;
        if (!(element.matches(":hover") || element.matches(":focus-within"))) {
          continue;
        }
        if (!panelFor(element)) continue;
        wrapper = element;
      }
    }
    if (!wrapper) return;

    closeOverlay(wrapper, true);
    event.preventDefault();
    return true;
  },
  10
);

init();
