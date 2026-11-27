// @ts-check

import { emit, init, isRTL, on, onDocument } from "./core.js";

const HANDLE_SELECTOR =
  ".drawer > [data-slot='drawer-content'] > [data-slot='handle']";
const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  "[contenteditable]:not([contenteditable='false'])",
  "[role='button']",
  "[role='link']",
  "[tabindex]"
].join(", ");
const CLICK_GUARD_PRIORITY = 100;
const AXIS_LOCK_SLOP = 6;
const CROSS_AXIS_BIAS = 2;
const MIN_ATTRIBUTED_MOVEMENT = 10;
const REVERSE_CANCELLATION = 10;
const VELOCITY_WINDOW = 80;
const FAST_FLICK_VELOCITY = 0.5;
const MIN_SETTLE_DURATION = 80;
const MAX_SETTLE_DURATION = 360;

/** @typedef {"block-start" | "block-end" | "inline-start" | "inline-end"} DrawerSide */
/** @typedef {"idle" | "pending" | "dragging" | "settling-open" | "closing"} DrawerPhase */
/** @typedef {"mouse" | "pen" | "touch"} PointerType */

/**
 * @typedef {object} DrawerParts
 * @property {HTMLDialogElement} dialog
 * @property {HTMLElement} panel
 * @property {HTMLElement} handle
 * @property {DrawerSide} side
 * @property {"x" | "y"} axis
 * @property {1 | -1} direction
 * @property {number} size
 * @property {number} maxDistance
 */

/**
 * @typedef {object} SavedProperty
 * @property {string} value
 * @property {string} priority
 */

/**
 * @typedef {object} SavedRuntime
 * @property {SavedProperty} duration
 * @property {SavedProperty} progress
 * @property {SavedProperty} transform
 */

/**
 * @typedef {object} DrawerState
 * @property {DrawerPhase} phase
 * @property {DrawerParts | null} parts
 * @property {number} pointerId
 * @property {PointerType | ""} pointerType
 * @property {number} startX
 * @property {number} startY
 * @property {number} startDistance
 * @property {number} distance
 * @property {number} maxAttributed
 * @property {number} sampleTime
 * @property {number} sampleDistance
 * @property {number} velocity
 * @property {number} generation
 * @property {number | null} frame
 * @property {ReturnType<typeof setTimeout> | null} timer
 * @property {((event: TransitionEvent) => void) | null} transitionListener
 * @property {SavedRuntime | null} saved
 * @property {boolean} closeCalled
 * @property {number} guardUntil
 */

/** @type {WeakMap<HTMLDialogElement, DrawerState>} */
const states = new WeakMap();

/** @type {HTMLDialogElement | null} */
let activeDialog = null;

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** @param {number} value */
function round(value) {
  return Math.round(value * 100) / 100;
}

/** @param {Event} event */
function timeOf(event) {
  return Number.isFinite(event.timeStamp) && event.timeStamp > 0
    ? event.timeStamp
    : performance.now();
}

/**
 * @param {HTMLElement} handle
 * @returns {DrawerParts | null}
 */
function partsFor(handle) {
  const dialog = handle.closest("dialog.drawer");
  const panel = handle.parentElement;
  if (
    !(dialog instanceof HTMLDialogElement) ||
    !dialog.open ||
    !dialog.isConnected ||
    !(panel instanceof HTMLElement) ||
    !panel.matches("[data-slot='drawer-content']") ||
    panel.parentElement !== dialog ||
    !handle.isConnected
  ) {
    return null;
  }

  const sideValue = dialog.getAttribute("data-side");
  /** @type {DrawerSide | null} */
  let side = null;
  if (
    sideValue === "block-start" ||
    sideValue === "block-end" ||
    sideValue === "inline-start" ||
    sideValue === "inline-end"
  ) {
    side = sideValue;
  }
  if (!side) return null;

  const horizontal = side === "inline-start" || side === "inline-end";
  const size = horizontal ? panel.offsetWidth : panel.offsetHeight;
  if (size <= 0) return null;

  const rtl = horizontal && isRTL(handle);
  /** @type {1 | -1} */
  let direction = 1;
  if (side === "block-start") direction = -1;
  if (side === "inline-start") direction = rtl ? 1 : -1;
  if (side === "inline-end") direction = rtl ? -1 : 1;

  const inset = Number.parseFloat(
    getComputedStyle(dialog).getPropertyValue("--drawer-inset")
  );
  const maxDistance = Math.max(size + Math.abs(Number.isFinite(inset) ? inset : 0) + 2, 1);

  return {
    dialog,
    panel,
    handle,
    side,
    axis: horizontal ? "x" : "y",
    direction,
    size,
    maxDistance
  };
}

/** @param {DrawerParts} parts */
function currentDistance(parts) {
  const transform = getComputedStyle(parts.panel).transform;
  if (!transform || transform === "none") return 0;

  try {
    const matrix = new DOMMatrixReadOnly(transform);
    const translation = parts.axis === "x" ? matrix.m41 : matrix.m42;
    return clamp(translation * parts.direction, 0, parts.maxDistance);
  } catch {
    return 0;
  }
}

/** @param {CSSStyleDeclaration} style @param {string} property */
function saveProperty(style, property) {
  return {
    value: style.getPropertyValue(property),
    priority: style.getPropertyPriority(property)
  };
}

/** @param {CSSStyleDeclaration} style @param {string} property @param {SavedProperty} saved */
function restoreProperty(style, property, saved) {
  if (saved.value) {
    style.setProperty(property, saved.value, saved.priority);
  } else {
    style.removeProperty(property);
  }
}

/** @param {DrawerState} state */
function rememberRuntime(state) {
  if (state.saved || !state.parts) return;
  const { dialog, panel } = state.parts;
  state.saved = {
    duration: saveProperty(dialog.style, "--drawer-gesture-duration"),
    progress: saveProperty(dialog.style, "--drawer-swipe-progress"),
    transform: saveProperty(panel.style, "--drawer-swipe-transform")
  };
}

/** @param {DrawerState} state */
function restoreRuntime(state) {
  if (!state.saved || !state.parts) return;
  const { dialog, panel } = state.parts;
  restoreProperty(dialog.style, "--drawer-gesture-duration", state.saved.duration);
  restoreProperty(dialog.style, "--drawer-swipe-progress", state.saved.progress);
  restoreProperty(panel.style, "--drawer-swipe-transform", state.saved.transform);
  state.saved = null;
}

/** @param {DrawerState} state */
function clearSettlement(state) {
  if (state.timer !== null) clearTimeout(state.timer);
  if (state.frame !== null) cancelAnimationFrame(state.frame);
  if (state.transitionListener && state.parts) {
    state.parts.panel.removeEventListener("transitionend", state.transitionListener);
  }
  state.timer = null;
  state.frame = null;
  state.transitionListener = null;
  state.generation += 1;
}

/** @param {DrawerState} state */
function releasePointer(state) {
  if (!state.parts || state.pointerId < 0) return;
  try {
    if (state.parts.handle.hasPointerCapture(state.pointerId)) {
      state.parts.handle.releasePointerCapture(state.pointerId);
    }
  } catch {
    // Capture may already have been released by the browser.
  }
}

/**
 * Detect a drawer removed mid-drag without adding a MutationObserver. The
 * check only runs while a pointer session is active and is cancelled by the
 * same generation cleanup used for settling.
 * @param {DrawerState} state
 */
function watchDrag(state) {
  if (!state.parts || state.frame !== null) return;
  const { dialog, panel, handle } = state.parts;
  const generation = state.generation;
  /** @param {number} _time */
  const check = (_time) => {
    state.frame = null;
    if (
      state.generation !== generation ||
      state.phase !== "dragging" ||
      activeDialog !== dialog
    ) {
      return;
    }
    if (
      !dialog.isConnected ||
      !dialog.open ||
      !panel.isConnected ||
      !handle.isConnected ||
      panel.parentElement !== dialog ||
      handle.parentElement !== panel
    ) {
      resetState(state, true);
      return;
    }
    state.frame = requestAnimationFrame(check);
  };
  state.frame = requestAnimationFrame(check);
}

/** @param {DrawerState} state @param {boolean} clearGuard */
function resetState(state, clearGuard) {
  const dialog = state.parts?.dialog;
  clearSettlement(state);
  state.phase = "idle";
  if (dialog && activeDialog === dialog) activeDialog = null;
  releasePointer(state);
  restoreRuntime(state);
  state.parts = null;
  state.pointerId = -1;
  state.pointerType = "";
  state.closeCalled = false;
  if (clearGuard) state.guardUntil = 0;
}

/** @returns {DrawerState} */
function createState() {
  return {
    phase: "idle",
    parts: null,
    pointerId: -1,
    pointerType: "",
    startX: 0,
    startY: 0,
    startDistance: 0,
    distance: 0,
    maxAttributed: 0,
    sampleTime: 0,
    sampleDistance: 0,
    velocity: 0,
    generation: 0,
    frame: null,
    timer: null,
    transitionListener: null,
    saved: null,
    closeCalled: false,
    guardUntil: 0
  };
}

/** @param {DrawerState} state */
function applyDrag(state) {
  if (!state.parts) return;
  const { dialog, panel, axis, direction, maxDistance } = state.parts;
  const distance = clamp(state.distance, 0, maxDistance);
  const x = axis === "x" ? distance * direction : 0;
  const y = axis === "y" ? distance * direction : 0;
  dialog.style.setProperty("--drawer-gesture-duration", "0s");
  dialog.style.setProperty(
    "--drawer-swipe-progress",
    String(round(clamp(1 - distance / maxDistance, 0, 1)))
  );
  panel.style.setProperty(
    "--drawer-swipe-transform",
    `translate3d(${round(x)}px, ${round(y)}px, 0)`
  );
}

/** @param {DrawerState} state @param {number} time @param {number} distance */
function sampleMovement(state, time, distance) {
  const elapsed = time - state.sampleTime;
  if (elapsed <= 0) return;
  if (elapsed <= VELOCITY_WINDOW) {
    state.velocity = (distance - state.sampleDistance) / elapsed;
    state.sampleTime = time;
    state.sampleDistance = distance;
  } else {
    state.velocity = 0;
    state.sampleTime = time;
    state.sampleDistance = distance;
  }
}

/** @param {DrawerState} state @param {number} time */
function releaseVelocity(state, time) {
  const elapsed = time - state.sampleTime;
  return elapsed >= 0 && elapsed <= VELOCITY_WINDOW ? state.velocity : 0;
}

/** @param {DrawerState} state @param {"release" | "interrupt"} reason @param {number} time */
function settle(state, reason, time) {
  if (state.phase !== "dragging" || !state.parts) return;
  const { dialog, panel, axis, direction, size, maxDistance } = state.parts;
  const velocity = Math.max(0, releaseVelocity(state, time));
  const closing =
    reason === "release" &&
    (state.distance > Math.max(size * 0.5, MIN_ATTRIBUTED_MOVEMENT) ||
      velocity >= FAST_FLICK_VELOCITY);
  const remaining = closing ? maxDistance - state.distance : state.distance;
  const scalar = clamp(remaining / maxDistance, 0.1, 1);
  const speed = velocity > 0.2 ? clamp(velocity, 0.2, 4) : 0;
  const duration = Math.round(
    clamp(
      speed > 0 ? remaining / speed : MAX_SETTLE_DURATION * scalar,
      MIN_SETTLE_DURATION,
      MAX_SETTLE_DURATION
    )
  );

  state.phase = closing ? "closing" : "settling-open";
  if (activeDialog === dialog) activeDialog = null;
  releasePointer(state);
  clearSettlement(state);
  const generation = state.generation;

  dialog.style.setProperty("--drawer-gesture-duration", `${duration}ms`);
  // Commit the duration while the current drag transform is still present.
  void panel.offsetWidth;

  if (closing) {
    const x = axis === "x" ? maxDistance * direction : 0;
    const y = axis === "y" ? maxDistance * direction : 0;
    panel.style.setProperty(
      "--drawer-swipe-transform",
      `translate3d(${round(x)}px, ${round(y)}px, 0)`
    );
    dialog.style.setProperty("--drawer-swipe-progress", "0");
  } else {
    panel.style.removeProperty("--drawer-swipe-transform");
    dialog.style.setProperty("--drawer-swipe-progress", "1");
  }

  state.guardUntil = time + duration + 100;

  /** @param {TransitionEvent} event */
  const transitionListener = (event) => {
    if (
      event.target !== panel ||
      event.propertyName !== "transform" ||
      state.generation !== generation ||
      (state.phase !== "closing" && state.phase !== "settling-open")
    ) {
      return;
    }
    completeSettlement(state);
  };
  panel.addEventListener("transitionend", transitionListener);
  state.transitionListener = transitionListener;
  state.timer = setTimeout(() => {
    if (
      state.generation === generation &&
      (state.phase === "closing" || state.phase === "settling-open")
    ) {
      completeSettlement(state);
    }
  }, duration + 32);
}

/** @param {DrawerState} state */
function completeSettlement(state) {
  const closing = state.phase === "closing";
  if (!closing && state.phase !== "settling-open") return;
  if (!state.parts) {
    resetState(state, true);
    return;
  }

  const { dialog } = state.parts;
  if (closing && (!dialog.isConnected || !dialog.open)) {
    resetState(state, true);
    return;
  }

  clearSettlement(state);
  restoreRuntime(state);
  releasePointer(state);
  state.parts = null;
  if (activeDialog === dialog) activeDialog = null;

  if (closing) {
    state.guardUntil = 0;
    emit(dialog, "dismiss", { reason: "swipe" });
    if (dialog.open && !state.closeCalled) {
      state.closeCalled = true;
      dialog.close();
    }
    state.phase = "idle";
    state.closeCalled = false;
  } else {
    state.phase = "idle";
  }
}

/**
 * @param {DrawerState} state
 * @param {PointerEvent} event
 * @param {number} time
 * @returns {boolean}
 */
function updatePointer(state, event, time) {
  if (!state.parts) return false;
  const { axis, direction, maxDistance } = state.parts;
  const primary = axis === "x" ? event.clientX - state.startX : event.clientY - state.startY;
  const cross = axis === "x" ? event.clientY - state.startY : event.clientX - state.startX;

  if (state.phase === "pending") {
    if (
      Math.abs(primary) < AXIS_LOCK_SLOP ||
      Math.abs(primary) < Math.abs(cross) + CROSS_AXIS_BIAS
    ) {
      return false;
    }
    const outward = primary * direction;
    if (outward < MIN_ATTRIBUTED_MOVEMENT) return false;

    state.phase = "dragging";
    state.maxAttributed = clamp(outward, 0, maxDistance - state.startDistance);
    state.distance = clamp(state.startDistance + state.maxAttributed, 0, maxDistance);
    sampleMovement(state, time, state.distance);
    rememberRuntime(state);
    applyDrag(state);
    try {
      state.parts.handle.setPointerCapture(state.pointerId);
    } catch {
      // Synthetic pointers and a pointer that ended before this move have no capture.
    }
    watchDrag(state);
    return true;
  }

  if (state.phase !== "dragging") return false;
  const outward = primary * direction;
  const attributed = clamp(outward, 0, maxDistance - state.startDistance);
  if (state.maxAttributed - attributed >= REVERSE_CANCELLATION) {
    settle(state, "interrupt", time);
    return true;
  }
  if (attributed <= state.maxAttributed) return true;

  state.maxAttributed = attributed;
  state.distance = clamp(state.startDistance + attributed, 0, maxDistance);
  sampleMovement(state, time, state.distance);
  applyDrag(state);
  return true;
}

/** @param {DrawerState} state @param {PointerEvent} event */
function samePointer(state, event) {
  if (!event.isPrimary) return false;
  return (
    event.pointerId === state.pointerId ||
    (event.pointerType === "pen" &&
      state.pointerType === "pen" &&
      event.isPrimary)
  );
}

/** @param {PointerEvent} event @returns {DrawerState | null} */
function activeState(event) {
  if (!activeDialog) return null;
  const state = states.get(activeDialog);
  if (!state || !samePointer(state, event)) return null;
  if (state.phase !== "pending" && state.phase !== "dragging") return null;
  const { dialog, panel, handle } = state.parts ?? {};
  if (
    !dialog ||
    !panel ||
    !handle ||
    !dialog.isConnected ||
    !dialog.open ||
    !panel.isConnected ||
    !handle.isConnected ||
    panel.parentElement !== dialog ||
    handle.parentElement !== panel
  ) {
    resetState(state, true);
    return null;
  }
  return state;
}

/** @param {PointerEvent} event @param {HTMLElement} handle */
function startGesture(event, handle) {
  if (activeDialog || event.defaultPrevented || !event.isPrimary || event.button !== 0) {
    return;
  }
  if (event.pointerType !== "mouse" && event.pointerType !== "pen" && event.pointerType !== "touch") {
    return;
  }
  if (event.target !== handle) {
    if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) {
      return;
    }
  }

  const parts = partsFor(handle);
  if (!parts) return;
  const existing = states.get(parts.dialog);
  if (existing && existing.phase !== "idle" && existing.phase !== "settling-open") {
    return;
  }

  const resuming = existing?.phase === "settling-open" && existing.saved !== null;
  const state = existing ?? createState();
  if (resuming) {
    clearSettlement(state);
  } else {
    restoreRuntime(state);
  }

  state.parts = parts;
  state.phase = "pending";
  state.pointerId = event.pointerId;
  state.pointerType = event.pointerType;
  state.startX = event.clientX;
  state.startY = event.clientY;
  state.startDistance = resuming ? currentDistance(parts) : 0;
  state.distance = state.startDistance;
  state.maxAttributed = 0;
  state.sampleTime = timeOf(event);
  state.sampleDistance = state.distance;
  state.velocity = 0;
  state.closeCalled = false;
  state.guardUntil = 0;
  states.set(parts.dialog, state);
  activeDialog = parts.dialog;
  return true;
}

on("pointerdown", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof PointerEvent) || !(element instanceof HTMLElement)) return;
  startGesture(event, element);
});

onDocument("pointerdown", (event) => {
  if (!(event instanceof PointerEvent) || event.defaultPrevented || !activeDialog) return;
  const state = states.get(activeDialog);
  if (!state || (state.phase !== "pending" && state.phase !== "dragging")) return;
  if (event.pointerType !== "mouse" || event.button <= 0) return;

  const time = timeOf(event);
  if (state.phase === "dragging") settle(state, "interrupt", time);
  else resetState(state, true);
  return true;
});

onDocument("pointermove", (event) => {
  if (!(event instanceof PointerEvent) || event.defaultPrevented) return;
  const state = activeState(event);
  if (!state) return;
  const time = timeOf(event);

  if (state.pointerType === "mouse" && (event.buttons & 2) !== 0) {
    settle(state, "interrupt", time);
    event.preventDefault();
    return true;
  }

  // A release outside the document can be followed by a hover. Settle from the
  // last valid movement instead of attributing the hover coordinates.
  if (event.buttons === 0) {
    if (state.phase === "dragging") settle(state, "release", time);
    else if (state.saved) settle(state, "interrupt", time);
    else resetState(state, true);
    event.preventDefault();
    return true;
  }

  if (!updatePointer(state, event, time)) return;
  event.preventDefault();
  return true;
});

onDocument("pointerup", (event) => {
  if (!(event instanceof PointerEvent) || event.defaultPrevented || !activeDialog) return;
  if (event.pointerType === "mouse" && event.button > 0) {
    const active = states.get(activeDialog);
    if (active?.phase === "dragging") settle(active, "interrupt", timeOf(event));
    else if (active) resetState(active, true);
    event.preventDefault();
    return true;
  }

  const state = activeState(event);
  if (!state) return;
  const time = timeOf(event);
  const attributed = updatePointer(state, event, time);

  if (state.phase === "pending") {
    if (state.saved) settle(state, "interrupt", time);
    else resetState(state, true);
  } else if (state.phase === "dragging") {
    settle(state, "release", time);
  }

  if (!attributed) return;
  event.preventDefault();
  return true;
});

onDocument("pointercancel", (event) => {
  if (!(event instanceof PointerEvent)) return;
  const state = activeState(event);
  if (!state) return;
  if (state.phase === "dragging") settle(state, "interrupt", timeOf(event));
  else resetState(state, true);
  return true;
});

onDocument("lostpointercapture", (event) => {
  if (!(event instanceof PointerEvent) || !activeDialog) return;
  const state = states.get(activeDialog);
  if (!state?.parts || event.target !== state.parts.handle) return;
  if (!samePointer(state, event)) return;
  if (state.phase === "dragging") settle(state, "interrupt", timeOf(event));
  else if (state.phase === "pending") resetState(state, true);
  return true;
});

onDocument("contextmenu", (event) => {
  if (!(event instanceof MouseEvent) || !activeDialog) return;
  const state = states.get(activeDialog);
  if (!state || (state.phase !== "pending" && state.phase !== "dragging")) return;
  if (state.phase === "dragging") settle(state, "interrupt", timeOf(event));
  else resetState(state, true);
  event.preventDefault();
  return true;
});

// This runs before dialog.js's backdrop handler. A drag release can otherwise
// synthesize a backdrop click and immediately undo the snap-back animation.
onDocument("click", (event) => {
  if (!(event instanceof MouseEvent) || event.detail === 0) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const dialog = target.closest("dialog.drawer");
  if (!(dialog instanceof HTMLDialogElement)) return;
  const state = states.get(dialog);
  if (!state) return;
  if (state.guardUntil <= performance.now()) {
    state.guardUntil = 0;
    return;
  }

  state.guardUntil = 0;
  event.preventDefault();
  return true;
}, CLICK_GUARD_PRIORITY);

/** @param {Event} _event @param {Element} element */
function cleanClosedDrawer(_event, element) {
  if (!(element instanceof HTMLDialogElement)) return;
  const state = states.get(element);
  if (state) resetState(state, true);
}

on("close", "dialog.drawer", cleanClosedDrawer);
on("cancel", "dialog.drawer", cleanClosedDrawer);

init();
