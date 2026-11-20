// @ts-check

import { emit, init, isRTL, on } from "./core.js";

const HANDLE_SELECTOR = "[data-slot='handle'][role='separator']";

/**
 * @typedef {object} ResizeParts
 * @property {HTMLElement} root
 * @property {HTMLElement} first
 * @property {HTMLElement} second
 * @property {"x" | "y"} axis
 * @property {boolean} rtl
 */

/**
 * @typedef {object} ResizeState
 * @property {number} percent
 * @property {number} min
 * @property {number} max
 * @property {boolean} active
 * @property {number} pointerId
 * @property {number} startX
 * @property {number} startY
 * @property {number} startPercent
 */

/** @type {WeakMap<HTMLElement, ResizeState>} */
const states = new WeakMap();

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** @param {number} value */
function round(value) {
  return Math.round(value * 100) / 100;
}

/**
 * @param {HTMLElement} handle
 * @returns {ResizeParts | null}
 */
function partsFor(handle) {
  const root = handle.closest(".resizable");
  const first = handle.previousElementSibling;
  const second = handle.nextElementSibling;
  if (
    !(root instanceof HTMLElement) ||
    !(first instanceof HTMLElement) ||
    !(second instanceof HTMLElement) ||
    !first.matches(".resizable-panel") ||
    !second.matches(".resizable-panel")
  ) {
    return null;
  }

  const axis =
    handle.getAttribute("aria-orientation") === "horizontal" ? "y" : "x";
  return {
    root,
    first,
    second,
    axis,
    rtl: axis === "x" && isRTL(handle)
  };
}

/**
 * @param {HTMLElement} handle
 * @param {ResizeParts} parts
 */
function readPercent(handle, parts) {
  const first = Number.parseFloat(
    getComputedStyle(parts.first).getPropertyValue("--panel-size")
  );
  const second = Number.parseFloat(
    getComputedStyle(parts.second).getPropertyValue("--panel-size")
  );
  const firstSize = Number.isFinite(first) ? first : 1;
  const secondSize = Number.isFinite(second) ? second : 1;
  const total = firstSize + secondSize;
  const percent = total > 0 ? (firstSize / total) * 100 : 50;

  const min = Number(handle.getAttribute("aria-valuemin") ?? 0);
  const max = Number(handle.getAttribute("aria-valuemax") ?? 100);
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) && max > safeMin ? max : 100;

  return {
    percent: clamp(percent, safeMin, safeMax),
    min: safeMin,
    max: safeMax
  };
}

/**
 * @param {HTMLElement} handle
 * @param {ResizeParts} parts
 * @param {number} percent
 * @param {boolean} notify
 */
function setPercent(handle, parts, percent, notify) {
  const first = clamp(percent, 0, 100);
  const second = 100 - first;
  parts.first.style.setProperty("--panel-size", String(round(first)));
  parts.second.style.setProperty("--panel-size", String(round(second)));
  handle.setAttribute("aria-valuenow", String(Math.round(first)));

  if (notify) {
    emit(parts.root, "change", {
      sizes: [round(first), round(second)]
    });
  }
}

/**
 * @param {HTMLElement} handle
 * @returns {ResizeState | null}
 */
function ensure(handle) {
  const existing = states.get(handle);
  if (existing) return existing;

  const parts = partsFor(handle);
  if (!parts) return null;
  const measured = readPercent(handle, parts);
  const state = {
    percent: measured.percent,
    min: measured.min,
    max: measured.max,
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startPercent: measured.percent
  };
  states.set(handle, state);
  handle.setAttribute("aria-valuenow", String(Math.round(state.percent)));
  return state;
}

on("pointerdown", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof PointerEvent) || !(element instanceof HTMLElement)) {
    return;
  }
  if (event.button !== 0) return;

  const state = ensure(element);
  if (!state) return;

  state.active = true;
  state.pointerId = event.pointerId;
  state.startX = event.clientX;
  state.startY = event.clientY;
  state.startPercent = state.percent;

  element.setPointerCapture(event.pointerId);
  event.preventDefault();
  return true;
});

on("pointermove", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof PointerEvent) || !(element instanceof HTMLElement)) {
    return;
  }

  const state = states.get(element);
  if (!state || !state.active || state.pointerId !== event.pointerId) return;

  const parts = partsFor(element);
  if (!parts) return;

  const delta =
    parts.axis === "x"
      ? (event.clientX - state.startX) * (parts.rtl ? -1 : 1)
      : event.clientY - state.startY;
  const size =
    parts.axis === "x"
      ? parts.root.clientWidth - element.offsetWidth
      : parts.root.clientHeight - element.offsetHeight;
  if (size <= 0) return;

  state.percent = clamp(
    state.startPercent + (delta / size) * 100,
    state.min,
    state.max
  );
  setPercent(element, parts, state.percent, false);
  event.preventDefault();
  return true;
});

/**
 * @param {HTMLElement} handle
 * @param {PointerEvent} event
 */
function finish(handle, event) {
  const state = states.get(handle);
  if (!state || !state.active || state.pointerId !== event.pointerId) return false;

  state.active = false;
  if (handle.hasPointerCapture(event.pointerId)) {
    handle.releasePointerCapture(event.pointerId);
  }

  const parts = partsFor(handle);
  if (!parts) return true;
  setPercent(handle, parts, state.percent, true);
  event.preventDefault();
  return true;
}

on("pointerup", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof PointerEvent) || !(element instanceof HTMLElement)) {
    return;
  }
  if (finish(element, event)) return true;
});

on("pointercancel", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof PointerEvent) || !(element instanceof HTMLElement)) {
    return;
  }
  if (finish(element, event)) return true;
});

on("keydown", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof KeyboardEvent) || !(element instanceof HTMLElement)) {
    return;
  }
  if (event.target !== element) return;

  const state = ensure(element);
  if (!state) return;
  const parts = partsFor(element);
  if (!parts) return;

  const step = event.shiftKey ? 10 : 1;
  let percent = state.percent;

  if (event.key === "Home") {
    percent = state.min;
  } else if (event.key === "End") {
    percent = state.max;
  } else {
    const horizontal = parts.axis === "x";
    const positive = horizontal
      ? event.key === (parts.rtl ? "ArrowLeft" : "ArrowRight")
      : event.key === "ArrowDown";
    const negative = horizontal
      ? event.key === (parts.rtl ? "ArrowRight" : "ArrowLeft")
      : event.key === "ArrowUp";
    if (!positive && !negative) return;
    percent = clamp(
      state.percent + (positive ? step : -step),
      state.min,
      state.max
    );
  }

  state.percent = percent;
  setPercent(element, parts, percent, true);
  event.preventDefault();
  return true;
});

on("focusin", HANDLE_SELECTOR, (_event, element) => {
  if (element instanceof HTMLElement) ensure(element);
});

init();
