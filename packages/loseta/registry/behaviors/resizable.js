// @ts-check

import { emit, init, isRTL, on, onDocument } from "./core.js";

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
 * @property {boolean} moved
 * @property {number} pointerId
 * @property {string} pointerType
 * @property {number} startX
 * @property {number} startY
 * @property {number} startPercent
 */

/** @type {WeakMap<HTMLElement, ResizeState>} */
const states = new WeakMap();

/** @type {HTMLElement | null} */
let activeHandle = null;

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
  const safeMin = clamp(Number.isFinite(min) ? min : 0, 0, 100);
  const safeMax = clamp(Number.isFinite(max) ? max : 100, safeMin, 100);

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
  const parts = partsFor(handle);
  if (!parts) return null;

  const measured = readPercent(handle, parts);
  const state = states.get(handle) ?? {
    percent: measured.percent,
    min: measured.min,
    max: measured.max,
    active: false,
    moved: false,
    pointerId: -1,
    pointerType: "",
    startX: 0,
    startY: 0,
    startPercent: measured.percent
  };

  state.percent = clamp(measured.percent, measured.min, measured.max);
  state.min = measured.min;
  state.max = measured.max;
  if (!state.active) state.startPercent = state.percent;

  handle.setAttribute("aria-valuemin", String(measured.min));
  handle.setAttribute("aria-valuemax", String(measured.max));

  states.set(handle, state);
  setPercent(handle, parts, state.percent, false);
  return state;
}

/**
 * @param {ResizeState} state
 * @param {PointerEvent} event
 */
function samePointer(state, event) {
  return (
    event.pointerId === state.pointerId ||
    // There is only one pen, but it may receive a new pointerId each time it
    // comes back into range.
    (event.pointerType === "pen" && state.pointerType === "pen")
  );
}

/**
 * @param {HTMLElement} handle
 * @param {ResizeState} state
 * @param {ResizeParts} parts
 * @param {number} clientX
 * @param {number} clientY
 */
function moveTo(handle, state, parts, clientX, clientY) {
  const delta =
    parts.axis === "x"
      ? (clientX - state.startX) * (parts.rtl ? -1 : 1)
      : clientY - state.startY;
  const size =
    parts.axis === "x"
      ? parts.root.clientWidth - handle.offsetWidth
      : parts.root.clientHeight - handle.offsetHeight;
  if (size <= 0) return;

  if (clientX !== state.startX || clientY !== state.startY) {
    state.moved = true;
  }

  state.percent = clamp(
    state.startPercent + (delta / size) * 100,
    state.min,
    state.max
  );
  setPercent(handle, parts, state.percent, false);
}

/**
 * @param {HTMLElement} handle
 * @param {boolean} notify
 */
function finish(handle, notify) {
  const state = states.get(handle);
  if (!state || !state.active) return false;

  state.active = false;
  if (activeHandle === handle) activeHandle = null;

  const changed = Math.abs(state.percent - state.startPercent) >= 0.005;
  if (state.moved && document.activeElement === handle) {
    handle.blur();
  }

  if (handle.hasPointerCapture(state.pointerId)) {
    try {
      handle.releasePointerCapture(state.pointerId);
    } catch {
      // The browser already released capture for this pointer.
    }
  }

  state.startPercent = state.percent;
  if (notify && changed) {
    const parts = partsFor(handle);
    if (parts) {
      emit(parts.root, "change", {
        sizes: [round(state.percent), round(100 - state.percent)]
      });
    }
  }
  return true;
}

on("pointerdown", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof PointerEvent) || !(element instanceof HTMLElement)) {
    return;
  }
  if (event.defaultPrevented) return;
  if (event.pointerType === "mouse" && event.button > 0) return;

  if (activeHandle) {
    const activeState = states.get(activeHandle);
    if (activeState?.active) {
      // A second press from the same pointer means its release was missed;
      // commit that drag instead of starting a new one. Other pointers are
      // ignored so the active drag is never orphaned.
      if (samePointer(activeState, event)) finish(activeHandle, true);
      event.preventDefault();
      return true;
    }
    activeHandle = null;
  }

  const state = ensure(element);
  if (!state) return;

  state.active = true;
  state.moved = false;
  state.pointerId = event.pointerId;
  state.pointerType = event.pointerType;
  state.startX = event.clientX;
  state.startY = event.clientY;
  state.startPercent = state.percent;
  activeHandle = element;

  const focusOptions = /** @type {FocusOptions & { focusVisible?: boolean }} */ ({
    focusVisible: false,
    preventScroll: true
  });
  element.focus(focusOptions);

  event.preventDefault();
  return true;
});

onDocument("pointermove", (event) => {
  if (!(event instanceof PointerEvent)) return;
  if (event.defaultPrevented) return;
  if (!activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }
  if (!samePointer(state, event)) return;

  // A release outside this document (for example over a cross-origin iframe)
  // may produce a later hover instead of "pointerup". Commit what was last
  // previewed rather than treat the hover position as movement.
  if (event.buttons === 0) {
    finish(handle, true);
    return true;
  }

  const parts = partsFor(handle);
  if (!parts) {
    finish(handle, true);
    return true;
  }

  // Delay capture until the pointer actually moves. Capturing on press would
  // prevent a plain click from reaching the handle.
  if (!handle.hasPointerCapture(event.pointerId)) {
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      // The pointer may already be gone; the next end event still finishes.
    }
  }

  moveTo(handle, state, parts, event.clientX, event.clientY);
  return true;
});

onDocument("pointerup", (event) => {
  if (!(event instanceof PointerEvent)) return;
  if (event.defaultPrevented) return;
  if (event.pointerType === "mouse" && event.button > 0) return;
  if (!activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }
  if (!samePointer(state, event)) return;

  const parts = partsFor(handle);
  if (parts) moveTo(handle, state, parts, event.clientX, event.clientY);
  finish(handle, true);
  event.preventDefault();
  return true;
});

onDocument("pointercancel", (event) => {
  if (!(event instanceof PointerEvent)) return;
  if (!activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }
  if (!samePointer(state, event)) return;

  finish(handle, true);
  return true;
});

onDocument("lostpointercapture", (event) => {
  // When another element takes the pointer, the browser releases capture from
  // the handle. Finish the drag so the layout cannot get stuck mid-gesture.
  if (!(event instanceof PointerEvent) || !activeHandle) return;
  if (event.target !== activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }
  if (!samePointer(state, event)) return;

  finish(handle, true);
  return true;
});

onDocument("contextmenu", (event) => {
  if (!(event instanceof MouseEvent) || !activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }

  const parts = partsFor(handle);
  if (parts) moveTo(handle, state, parts, event.clientX, event.clientY);
  finish(handle, true);
  event.preventDefault();
  return true;
});

on("keydown", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof KeyboardEvent) || !(element instanceof HTMLElement)) {
    return;
  }
  if (event.defaultPrevented || event.target !== element) return;

  const state = ensure(element);
  if (!state || state.active) return;
  const parts = partsFor(element);
  if (!parts) return;

  const step = event.shiftKey ? 10 : 5;
  const previous = state.percent;
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

  event.preventDefault();
  if (percent === previous) return true;

  state.percent = percent;
  setPercent(element, parts, percent, true);
  return true;
});

on("focusin", HANDLE_SELECTOR, (_event, element) => {
  if (element instanceof HTMLElement) ensure(element);
});

/**
 * Syncs every handle under a root with its panel sizes and constraints. The
 * entry module calls this for the initial document; consumers can call it for
 * a late-mounted subtree.
 * @param {Document | Element} [root]
 */
export function mount(root) {
  if (typeof document === "undefined") return;
  const scope = root ?? document;
  for (const handle of scope.querySelectorAll(HANDLE_SELECTOR)) {
    if (handle instanceof HTMLElement) ensure(handle);
  }
}

init();

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mount(document), {
      once: true
    });
  } else {
    mount(document);
  }
}
