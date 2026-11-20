// @ts-check

import { emit, init, on } from "./core.js";

const DEFAULT_DURATION = 5000;

/**
 * @typedef {object} ToastState
 * @property {number} duration
 * @property {number} remaining
 * @property {number} startedAt
 * @property {number} timer
 * @property {boolean} paused
 */

/** @type {WeakMap<HTMLElement, ToastState>} */
const states = new WeakMap();

/** @param {Element} toast */
function durationOf(toast) {
  const raw = toast.getAttribute("data-duration");
  if (raw === null) return DEFAULT_DURATION;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.max(0, value) : DEFAULT_DURATION;
}

/** @param {HTMLElement} toast */
function startTimer(toast) {
  const state = states.get(toast);
  if (!state || state.duration === 0) return;
  state.startedAt = Date.now();
  state.paused = false;
  state.timer = window.setTimeout(() => dismiss(toast, "timeout"), state.remaining);
}

/** @param {HTMLElement} toast */
function arm(toast) {
  if (states.has(toast) || toast.hasAttribute("hidden")) return;
  const duration = durationOf(toast);
  states.set(toast, {
    duration,
    remaining: duration,
    startedAt: 0,
    timer: 0,
    paused: false
  });
  startTimer(toast);
}

/** @param {HTMLElement} toast */
function pause(toast) {
  const state = states.get(toast);
  if (!state || state.paused || state.duration === 0) return;
  window.clearTimeout(state.timer);
  state.remaining = Math.max(0, state.remaining - (Date.now() - state.startedAt));
  state.paused = true;
}

/** @param {HTMLElement} toast */
function resume(toast) {
  const state = states.get(toast);
  if (!state || !state.paused || state.duration === 0) return;
  startTimer(toast);
}

/** @param {HTMLElement} toast @param {"timeout" | "close"} reason */
function dismiss(toast, reason) {
  const state = states.get(toast);
  if (state) {
    window.clearTimeout(state.timer);
    states.delete(toast);
  }
  toast.hidden = true;
  emit(toast, "dismiss", { reason });
}

/** @param {ParentNode} root */
function armAll(root) {
  for (const toast of root.querySelectorAll(".toast")) {
    if (toast instanceof HTMLElement) arm(toast);
  }
}

on("click", ".toast [data-slot='close']", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const toast = target.closest(".toast");
  if (!(toast instanceof HTMLElement)) return;
  dismiss(toast, "close");
  event.preventDefault();
  return true;
});

on("pointerover", ".toast", (_event, target) => {
  if (!(target instanceof HTMLElement)) return;
  pause(target);
});

on("pointerout", ".toast", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const next = event instanceof PointerEvent ? event.relatedTarget : null;
  if (next instanceof Node && target.contains(next)) return;
  resume(target);
});

on("focusin", ".toast", (_event, target) => {
  if (!(target instanceof HTMLElement)) return;
  pause(target);
});

on("focusout", ".toast", (event, target) => {
  if (!(target instanceof HTMLElement) || !(event instanceof FocusEvent)) return;
  const next = event.relatedTarget;
  if (next instanceof Node && target.contains(next)) return;
  resume(target);
});

init();

if (typeof document !== "undefined") {
  const armExisting = () => armAll(document);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", armExisting, { once: true });
  } else {
    armExisting();
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(".toast")) arm(/** @type {HTMLElement} */ (node));
        armAll(node);
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
