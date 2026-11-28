// @ts-check

import { emit, init, on, onDocument, uniqueId } from "./core.js";

const DEFAULT_DURATION = 5000;
const DEFAULT_LIMIT = 3;
const SWIPE_SLOP = 6;
const SWIPE_DISTANCE = 0.5;
const SWIPE_VELOCITY = 0.5;
const EXIT_FALLBACK = 700;
const SNAP_BACK_DURATION = 500;
const COLLAPSE_DELAY = 100;
const TOAST_TYPES = new Set(["success", "info", "warning", "error", "loading"]);

/**
 * @typedef {"success" | "info" | "warning" | "error" | "loading" | "default"} ToastType
 * @typedef {"low" | "high"} ToastPriority
 */

/**
 * @typedef {object} ToastActionOptions
 * @property {string | Node} [children]
 * @property {(() => void) | null} [onClick]
 * @property {string} [className]
 * @property {string} [ariaLabel]
 * @property {boolean} [disabled]
 */

/**
 * @typedef {object} ToastOptions
 * @property {string} [id]
 * @property {ToastType} [type]
 * @property {string | Node} [title]
 * @property {string | Node} [description]
 * @property {number} [timeout]
 * @property {ToastPriority} [priority]
 * @property {ToastActionOptions} [actionProps]
 */

/**
 * @typedef {string | Node | ToastOptions} ToastStateValue
 * @typedef {ToastStateValue | ((value: any) => ToastStateValue)} ToastStateOption
 */

/**
 * @typedef {object} ToastPromiseOptions
 * @property {ToastStateOption} loading
 * @property {ToastStateOption} success
 * @property {ToastStateOption} error
 */

/**
 * @typedef {HTMLElement & {
 *   addToast: (options?: ToastOptions) => string,
 *   updateToast: (id: string, options?: ToastOptions) => void,
 *   closeToast: (id?: string) => void,
 *   promiseToast: (promise: Promise<any>, options: ToastPromiseOptions) => Promise<any>
 * }} ToastToaster
 */

/**
 * @typedef {object} ToastState
 * @property {number} duration
 * @property {number} remaining
 * @property {number} startedAt
 * @property {number} timer
 * @property {boolean} paused
 * @property {number} order
 * @property {boolean} dismissing
 * @property {number} exitTimer
 * @property {EventListener | null} exitListener
 * @property {number} swipeTimer
 */

/** @type {WeakMap<HTMLElement, ToastState>} */
const states = new WeakMap();

/**
 * @typedef {object} ToasterState
 * @property {boolean} pointerInside
 * @property {boolean} focusInside
 * @property {boolean} expanded
 * @property {number} collapseTimer
 * @property {number} frame
 */

/** @type {WeakMap<HTMLElement, ToasterState>} */
const toasters = new WeakMap();

/** @type {WeakSet<HTMLElement>} */
const apiToasters = new WeakSet();

/** @type {WeakMap<HTMLElement, Set<string>>} */
const actionBaseClasses = new WeakMap();

/**
 * @typedef {object} DragState
 * @property {HTMLElement} toast
 * @property {number} pointerId
 * @property {number} startX
 * @property {number} startY
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} sampleTime
 * @property {number} sampleX
 * @property {number} sampleY
 * @property {number} velocityX
 * @property {number} velocityY
 * @property {boolean} active
 */

/** @type {DragState | null} */
let drag = null;
let sequence = 0;

/** @param {Element} toast */
function durationOf(toast) {
  const raw = toast.getAttribute("data-duration");
  if (raw === null) return DEFAULT_DURATION;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.max(0, value) : DEFAULT_DURATION;
}

/** @param {HTMLElement} toaster */
function limitOf(toaster) {
  const raw = toaster.getAttribute("data-toast-limit");
  if (raw === null || raw.trim() === "") return DEFAULT_LIMIT;
  if (raw === "0" || raw === "all") return Number.POSITIVE_INFINITY;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : DEFAULT_LIMIT;
}

/** @param {HTMLElement} toast */
function stateOf(toast) {
  let state = states.get(toast);
  if (!state) {
    const duration = durationOf(toast);
    state = {
      duration,
      remaining: duration,
      startedAt: 0,
      timer: 0,
      paused: false,
      order: ++sequence,
      dismissing: false,
      exitTimer: 0,
      exitListener: null,
      swipeTimer: 0
    };
    states.set(toast, state);
  }
  return state;
}

/** @param {HTMLElement} toaster */
function toasterStateOf(toaster) {
  let state = toasters.get(toaster);
  if (!state) {
    state = {
      pointerInside: false,
      focusInside: false,
      expanded: false,
      collapseTimer: 0,
      frame: 0
    };
    toasters.set(toaster, state);
  }
  return state;
}

/** @param {HTMLElement} toast @param {ToastState} state */
function startTimer(toast, state) {
  if (state.duration === 0 || state.dismissing) return;
  state.startedAt = Date.now();
  state.paused = false;
  state.timer = window.setTimeout(
    () => dismiss(toast, "timeout"),
    state.remaining
  );
}

/** @param {HTMLElement} toast */
function arm(toast) {
  if (toast.hidden) return;
  const existing = states.get(toast);
  if (existing?.dismissing) return;
  if (existing?.timer || existing?.paused) return;
  const state = existing ?? stateOf(toast);
  state.duration = durationOf(toast);
  state.remaining = state.duration;
  startTimer(toast, state);
}

/** @param {HTMLElement} toast */
function pause(toast) {
  const state = states.get(toast);
  if (!state || state.paused || state.duration === 0 || state.dismissing) return;
  window.clearTimeout(state.timer);
  state.timer = 0;
  state.remaining = Math.max(0, state.remaining - (Date.now() - state.startedAt));
  state.paused = true;
}

/** @param {HTMLElement} toast */
function resume(toast) {
  const state = states.get(toast);
  if (!state || !state.paused || state.duration === 0 || state.dismissing) return;
  startTimer(toast, state);
}

/** @param {HTMLElement} toaster */
function visibleToasts(toaster) {
  return /** @type {HTMLElement[]} */ (
    [...toaster.querySelectorAll(":scope > .toast")].filter(
      (node) => node instanceof HTMLElement && !node.hidden
    )
  );
}

/** @param {HTMLElement} toaster */
function pauseAll(toaster) {
  for (const toast of visibleToasts(toaster)) pause(toast);
}

/** @param {HTMLElement} toaster */
function resumeAll(toaster) {
  for (const toast of visibleToasts(toaster)) resume(toast);
}

/** @param {HTMLElement} toast */
function contentOf(toast) {
  const content = toast.querySelector(":scope > [data-slot='content']");
  return content instanceof HTMLElement ? content : null;
}

/**
 * @param {ToastToaster} toaster
 * @param {string} id
 * @returns {HTMLElement | null}
 */
function findToast(toaster, id) {
  for (const node of toaster.querySelectorAll(":scope > .toast")) {
    if (node instanceof HTMLElement && node.id === id) return node;
  }
  return null;
}

/**
 * @param {ToastToaster} toaster
 * @returns {HTMLTemplateElement | null}
 */
function toastTemplateFor(toaster) {
  const template = toaster.querySelector(
    ':scope > template[data-slot="toast-template"]'
  );
  return template instanceof HTMLTemplateElement ? template : null;
}

/**
 * @param {ToastToaster} toaster
 * @param {string} type
 * @returns {HTMLTemplateElement | null}
 */
function iconTemplateFor(toaster, type) {
  if (!TOAST_TYPES.has(type)) return null;
  const template = toaster.querySelector(
    `:scope > template[data-toast-icon="${type}"]`
  );
  return template instanceof HTMLTemplateElement ? template : null;
}

/** @param {object} object @param {string} key */
function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * @param {HTMLElement | null} slot
 * @param {string | Node | undefined} value
 */
function setSlot(slot, value) {
  if (!slot) return;
  if (value === undefined || value === null || value === "") {
    slot.replaceChildren();
    slot.hidden = true;
    return;
  }
  if (value instanceof Node) {
    slot.replaceChildren(value);
  } else {
    slot.textContent = String(value);
  }
  slot.hidden = false;
}

/**
 * @param {HTMLElement} toast
 * @param {ToastActionOptions | undefined} actionProps
 */
function applyAction(toast, actionProps) {
  const button = toast.querySelector("[data-slot='action']");
  if (!(button instanceof HTMLButtonElement)) return;

  let base = actionBaseClasses.get(button);
  if (!base) {
    base = new Set(button.classList);
    actionBaseClasses.set(button, base);
  }

  const children = actionProps?.children;
  if (
    !actionProps ||
    children === undefined ||
    children === null ||
    children === ""
  ) {
    button.hidden = true;
    button.onclick = null;
    button.disabled = false;
    button.removeAttribute("aria-label");
    button.className = [...base].join(" ");
    return;
  }

  setSlot(button, children);
  button.onclick =
    typeof actionProps.onClick === "function"
      ? /** @type {any} */ (actionProps.onClick)
      : null;
  const label =
    actionProps.ariaLabel ??
    /** @type {any} */ (actionProps)["aria-label"];
  if (typeof label === "string" && label) {
    button.setAttribute("aria-label", label);
  } else {
    button.removeAttribute("aria-label");
  }
  button.disabled = Boolean(actionProps.disabled);
  const tokens = (actionProps.className ?? "").split(/\s+/).filter(Boolean);
  button.className = [...base, ...tokens].join(" ");
}

/**
 * @param {HTMLElement} toast
 * @param {ToastToaster} toaster
 * @param {ToastType | undefined} type
 */
function applyType(toast, toaster, type) {
  if (type === undefined) return;
  const content = contentOf(toast);
  const iconSlot = toast.querySelector("[data-slot='icon']");

  if (type === "default" || !TOAST_TYPES.has(type)) {
    toast.removeAttribute("data-type");
    if (iconSlot instanceof HTMLElement) {
      iconSlot.replaceChildren();
      iconSlot.hidden = true;
    }
    if (content) content.removeAttribute("aria-busy");
    return;
  }

  toast.setAttribute("data-type", type);
  if (iconSlot instanceof HTMLElement) {
    const template = iconTemplateFor(toaster, type);
    if (template) {
      iconSlot.replaceChildren(template.content.cloneNode(true));
      iconSlot.hidden = false;
    } else {
      iconSlot.replaceChildren();
      iconSlot.hidden = true;
    }
  }
  if (content) {
    if (type === "loading") content.setAttribute("aria-busy", "true");
    else content.removeAttribute("aria-busy");
  }
}

/**
 * @param {HTMLElement} toast
 * @param {ToastPriority | undefined} priority
 */
function applyPriority(toast, priority) {
  if (priority === undefined) return;
  const content = contentOf(toast);
  if (!content) return;
  content.setAttribute("role", priority === "high" ? "alert" : "status");
  content.setAttribute("aria-atomic", "true");
}

/**
 * @param {HTMLElement} toast
 * @param {ToastOptions} options
 */
function applyTimeout(toast, options) {
  const hasTimeout = hasOwn(options, "timeout");
  const hasType = hasOwn(options, "type");
  if (!hasTimeout && !hasType) return;

  const type = options.type ?? toast.getAttribute("data-type");
  if (type === "loading") {
    toast.setAttribute("data-duration", "0");
    return;
  }

  if (hasTimeout && options.timeout !== undefined) {
    const value = Number(options.timeout);
    toast.setAttribute(
      "data-duration",
      Number.isFinite(value) && value > 0 ? String(Math.round(value)) : "0"
    );
    return;
  }

  if (hasType) toast.removeAttribute("data-duration");
}

/**
 * @param {HTMLElement} toast
 * @param {ToastToaster} toaster
 * @param {ToastOptions} options
 */
function applyOptions(toast, toaster, options) {
  if (hasOwn(options, "title")) {
    const title = toast.querySelector("[data-slot='title']");
    if (title instanceof HTMLElement) setSlot(title, options.title);
  }
  if (hasOwn(options, "description")) {
    const description = toast.querySelector("[data-slot='description']");
    if (description instanceof HTMLElement) {
      setSlot(description, options.description);
    }
  }
  if (hasOwn(options, "type")) applyType(toast, toaster, options.type);
  if (hasOwn(options, "priority")) applyPriority(toast, options.priority);
  if (hasOwn(options, "actionProps")) applyAction(toast, options.actionProps);
  applyTimeout(toast, options);
}

/** @param {HTMLElement} toast */
function restartToast(toast) {
  const state = states.get(toast);
  if (!state) {
    arm(toast);
    return;
  }

  window.clearTimeout(state.timer);
  state.timer = 0;
  state.duration = durationOf(toast);
  state.remaining = state.duration;
  state.paused = false;
  state.dismissing = false;
  startTimer(toast, state);

  const toaster = toast.closest(".toaster");
  if (toaster instanceof HTMLElement) {
    if (toasterStateOf(toaster).expanded) pause(toast);
    scheduleLayout(toaster);
  }
}

/**
 * @param {ToastToaster} toaster
 * @param {ToastOptions} [options]
 * @returns {string}
 */
function addToast(toaster, options = {}) {
  const id = options.id || uniqueId("loseta-toast");
  const existing = findToast(toaster, id);
  if (existing) {
    if (existing.hidden && existing.hasAttribute("data-toast-managed")) {
      existing.remove();
    } else {
      const wasHidden = existing.hidden;
      applyOptions(existing, toaster, options);
      if (wasHidden) {
        show(existing);
      } else {
        const state = states.get(existing);
        if (state?.dismissing) cancelDismiss(existing, state);
        restartToast(existing);
      }
      return id;
    }
  }

  const template = toastTemplateFor(toaster);
  if (!template) {
    throw new Error(
      'loseta toast: missing template[data-slot="toast-template"] inside the toaster'
    );
  }

  const fragment = template.content.cloneNode(true);
  const toast =
    fragment instanceof DocumentFragment
      ? fragment.querySelector(".toast")
      : null;
  if (!(toast instanceof HTMLElement)) {
    throw new Error("loseta toast: the toast template must contain a .toast element");
  }

  toast.id = id;
  toast.hidden = true;
  toast.setAttribute("data-toast-managed", "");
  const action = toast.querySelector("[data-slot='action']");
  if (action instanceof HTMLElement) {
    actionBaseClasses.set(action, new Set(action.classList));
  }
  applyOptions(toast, toaster, options);
  toaster.append(toast);
  show(toast);
  return id;
}

/**
 * @param {ToastToaster} toaster
 * @param {string} id
 * @param {ToastOptions} [options]
 */
function updateToast(toaster, id, options = {}) {
  const toast = findToast(toaster, id);
  if (!toast || toast.hidden) return;
  const state = states.get(toast);
  if (state?.dismissing) return;
  applyOptions(toast, toaster, options);
  restartToast(toast);
}

/**
 * @param {ToastToaster} toaster
 * @param {string} [id]
 */
function closeToast(toaster, id) {
  for (const toast of visibleToasts(toaster)) {
    if (id === undefined || toast.id === id) dismiss(toast, "close");
  }
}

/**
 * @param {ToastStateOption} state
 * @param {any} [value]
 * @returns {ToastOptions}
 */
function resolvePromiseState(state, value) {
  const resolved = typeof state === "function" ? state(value) : state;
  if (typeof resolved === "string" || resolved instanceof Node) {
    return { description: resolved };
  }
  return resolved ?? {};
}

/**
 * @param {ToastToaster} toaster
 * @param {Promise<any>} promise
 * @param {ToastPromiseOptions} options
 * @returns {Promise<any>}
 */
function promiseToast(toaster, promise, options) {
  const loading = resolvePromiseState(options.loading);
  const id = addToast(toaster, { ...loading, type: "loading" });

  return promise.then(
    (value) => {
      const success = resolvePromiseState(options.success, value);
      updateToast(toaster, id, { ...success, type: "success" });
      return value;
    },
    (error) => {
      const failure = resolvePromiseState(options.error, error);
      updateToast(toaster, id, { ...failure, type: "error" });
      throw error;
    }
  );
}

/** @param {HTMLElement} toaster */
function ensureApi(toaster) {
  if (apiToasters.has(toaster)) return;
  const api = /** @type {ToastToaster} */ (toaster);
  if (typeof api.addToast === "function") {
    apiToasters.add(toaster);
    return;
  }
  apiToasters.add(toaster);
  Object.defineProperties(toaster, {
    addToast: {
      configurable: true,
      value: (options = {}) =>
        addToast(api, /** @type {ToastOptions} */ (options))
    },
    updateToast: {
      configurable: true,
      value: (
        /** @type {string} */ id,
        /** @type {ToastOptions} */ options = {}
      ) => updateToast(api, String(id), options)
    },
    closeToast: {
      configurable: true,
      value: (/** @type {string | undefined} */ id) =>
        closeToast(api, id === undefined ? undefined : String(id))
    },
    promiseToast: {
      configurable: true,
      value: (
        /** @type {Promise<any>} */ promise,
        /** @type {ToastPromiseOptions} */ options
      ) => promiseToast(api, promise, options)
    }
  });
}

/** @param {HTMLElement} toaster @param {boolean} expanded */
function applyExpansion(toaster, expanded) {
  const sorted = [...visibleToasts(toaster)].sort(
    (left, right) => orderOf(right) - orderOf(left)
  );

  sorted.forEach((toast, index) => {
    const content = contentOf(toast);
    if (!content) return;
    if (expanded || index === 0 || content.contains(document.activeElement)) {
      content.removeAttribute("inert");
    } else {
      content.setAttribute("inert", "");
    }
  });
}

/** @param {HTMLElement} toaster @param {boolean} expanded */
function renderExpansion(toaster, expanded) {
  toaster.style.setProperty("--toast-expanded", expanded ? "1" : "0");
  applyExpansion(toaster, expanded);
}

/** @param {HTMLElement} toaster @param {boolean} expanded */
function setExpanded(toaster, expanded) {
  const state = toasterStateOf(toaster);
  if (state.expanded === expanded) return;
  state.expanded = expanded;
  renderExpansion(toaster, expanded);
  if (expanded) pauseAll(toaster);
  else resumeAll(toaster);
}

/** @param {HTMLElement} toaster */
function scheduleCollapse(toaster) {
  const state = toasterStateOf(toaster);
  if (state.pointerInside || state.focusInside) return;
  window.clearTimeout(state.collapseTimer);
  state.collapseTimer = window.setTimeout(() => {
    state.collapseTimer = 0;
    if (!state.pointerInside && !state.focusInside) setExpanded(toaster, false);
  }, COLLAPSE_DELAY);
}

/** @param {HTMLElement} toaster */
function expand(toaster) {
  const state = toasterStateOf(toaster);
  window.clearTimeout(state.collapseTimer);
  state.collapseTimer = 0;
  setExpanded(toaster, true);
}

/** @param {HTMLElement} toast */
function orderOf(toast) {
  return states.get(toast)?.order ?? 0;
}

/** @param {HTMLElement} toaster */
function layoutToaster(toaster) {
  ensureApi(toaster);
  const state = toasterStateOf(toaster);
  state.frame = 0;

  if (drag && drag.toast.closest(".toaster") === toaster) return;

  const visible = visibleToasts(toaster);
  if (visible.length === 0) {
    toaster.style.setProperty("--toast-height", "0px");
    return;
  }

  for (const toast of visible) {
    const toastState = states.get(toast);
    if (!toastState?.timer && !toastState?.paused && !toastState?.dismissing) {
      arm(toast);
    }
  }

  const sorted = [...visible].sort(
    (left, right) => orderOf(right) - orderOf(left)
  );
  const front =
    sorted.find((toast) => !states.get(toast)?.dismissing) ?? sorted[0];
  if (!front) return;

  const limit = limitOf(toaster);
  let stackIndex = 0;
  for (const toast of sorted) {
    if (states.get(toast)?.dismissing) continue;
    const limited = stackIndex >= limit;
    toast.toggleAttribute("data-limited", limited);
    if (limited) {
      toast.setAttribute("inert", "");
    } else {
      toast.removeAttribute("inert");
    }
    toast.style.setProperty("--toast-index", String(stackIndex));
    toast.style.setProperty("--toast-behind", stackIndex === 0 ? "0" : "1");
    stackIndex += 1;
  }

  toaster.style.setProperty("--toast-height", `${front.offsetHeight}px`);
  toaster.setAttribute("data-toast-initialized", "");
  renderExpansion(toaster, state.expanded);
  if (state.expanded) pauseAll(toaster);
}

/** @param {HTMLElement} toaster */
function scheduleLayout(toaster) {
  const state = toasterStateOf(toaster);
  if (state.frame) return;
  state.frame = window.requestAnimationFrame(() => layoutToaster(toaster));
}

/** @param {HTMLElement} toast */
function cancelSwipeBack(toast) {
  const state = states.get(toast);
  if (!state?.swipeTimer) return;
  window.clearTimeout(state.swipeTimer);
  state.swipeTimer = 0;
}

/** @param {HTMLElement} toast */
function resetSwipe(toast) {
  cancelSwipeBack(toast);
  toast.style.removeProperty("--toast-swipe-x");
  toast.style.removeProperty("--toast-swipe-y");
}

/** @param {HTMLElement} toast @param {ToastState} state */
function cancelDismiss(toast, state) {
  state.dismissing = false;
  state.paused = false;
  if (state.exitListener) {
    toast.removeEventListener("transitionend", state.exitListener);
    state.exitListener = null;
  }
  window.clearTimeout(state.exitTimer);
  state.exitTimer = 0;
  toast.hidden = false;
  toast.style.removeProperty("--toast-swipe-x");
  toast.style.removeProperty("--toast-swipe-y");
  toast.style.removeProperty("opacity");
  toast.style.removeProperty("transition-duration");
}

/** @param {HTMLElement} toast */
function show(toast) {
  const state = stateOf(toast);
  if (state.dismissing) cancelDismiss(toast, state);

  const toaster = toast.closest(".toaster");
  if (toaster instanceof HTMLElement) {
    toaster.setAttribute("data-toast-initialized", "");
  }

  toast.hidden = false;
  state.order = ++sequence;
  state.duration = durationOf(toast);
  state.remaining = state.duration;
  state.paused = false;
  window.clearTimeout(state.timer);
  state.timer = 0;
  startTimer(toast, state);

  if (toaster instanceof HTMLElement) {
    const toasterState = toasterStateOf(toaster);
    scheduleLayout(toaster);
    if (toasterState.expanded) pause(toast);
  }

  emit(toast, "toggle", { open: true });
}

/**
 * @param {HTMLElement} toast
 * @param {"timeout" | "close" | "swipe"} reason
 * @param {{ x: number, y: number, width: number, height: number, directionX: number, directionY: number } | null} [swipe]
 */
function dismiss(toast, reason, swipe = null) {
  if (toast.hidden) return;
  const state = states.get(toast) ?? stateOf(toast);
  if (state.dismissing) return;

  if (drag?.toast === toast) {
    const activeDrag = drag;
    drag = null;
    releaseDrag(activeDrag);
  }

  state.dismissing = true;
  state.paused = true;
  window.clearTimeout(state.timer);
  state.timer = 0;
  cancelSwipeBack(toast);
  toast.style.removeProperty("transition-duration");

  const toaster = toast.closest(".toaster");
  if (toaster instanceof HTMLElement) scheduleLayout(toaster);
  const finish = () => {
    if (states.get(toast) !== state || !state.dismissing) return;
    if (state.exitListener) {
      toast.removeEventListener("transitionend", state.exitListener);
      state.exitListener = null;
    }
    window.clearTimeout(state.exitTimer);
    state.exitTimer = 0;
    states.delete(toast);
    toast.hidden = true;
    resetSwipe(toast);
    toast.style.removeProperty("opacity");
    const content = contentOf(toast);
    if (content) content.removeAttribute("inert");
    if (toaster instanceof HTMLElement) {
      if (visibleToasts(toaster).length === 0) {
        const toasterState = toasterStateOf(toaster);
        toasterState.pointerInside = false;
        toasterState.focusInside = false;
        if (toasterState.expanded) {
          toasterState.expanded = false;
          renderExpansion(toaster, false);
        }
      }
      scheduleLayout(toaster);
    }
    emit(toast, "toggle", { open: false });
    emit(toast, "dismiss", { reason });
  };

  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transitionDuration = getComputedStyle(toast).transitionDuration;
  const animated =
    !reduce &&
    transitionDuration !== "" &&
    transitionDuration !== "0s" &&
    transitionDuration !== "0ms";

  if (!animated) {
    finish();
    return;
  }

  state.exitListener = (event) => {
    if (!(event instanceof TransitionEvent)) return;
    if (event.propertyName !== "translate") return;
    finish();
  };
  toast.addEventListener("transitionend", state.exitListener);
  state.exitTimer = window.setTimeout(finish, EXIT_FALLBACK);

  if (swipe) {
    const nextX = swipe.x + swipe.directionX * swipe.width;
    const nextY = swipe.y + swipe.directionY * swipe.height;
    toast.style.setProperty("--toast-swipe-x", `${nextX}px`);
    toast.style.setProperty("--toast-swipe-y", `${nextY}px`);
  } else {
    toast.style.setProperty("--toast-swipe-x", "0px");
    toast.style.setProperty(
      "--toast-swipe-y",
      `${toast.getBoundingClientRect().height * 1.5}px`
    );
  }
  toast.style.opacity = "0";
}

/**
 * @param {DragState} state
 */
function releaseDrag(state) {
  state.toast.style.removeProperty("transition-duration");
  try {
    if (state.toast.hasPointerCapture(state.pointerId)) {
      state.toast.releasePointerCapture(state.pointerId);
    }
  } catch {
    // The pointer may already be gone.
  }
}

/**
 * @param {DragState} state
 * @param {boolean} animateBack
 */
function stopDrag(state, animateBack) {
  const toast = state.toast;
  if (drag === state) drag = null;
  releaseDrag(state);
  const toaster = toast.closest(".toaster");
  if (toaster instanceof HTMLElement) scheduleLayout(toaster);
  if (!animateBack || !state.active) {
    resetSwipe(toast);
    resume(toast);
    return;
  }

  toast.style.setProperty("--toast-swipe-x", "0px");
  toast.style.setProperty("--toast-swipe-y", "0px");
  resume(toast);
  const toastState = states.get(toast);
  if (toastState) {
    toastState.swipeTimer = window.setTimeout(() => {
      toastState.swipeTimer = 0;
      resetSwipe(toast);
    }, SNAP_BACK_DURATION);
  }
}

/** @param {PointerEvent} event @param {HTMLElement} toast */
function startDrag(event, toast) {
  if (drag || !event.isPrimary || event.button !== 0) return;
  if (toast.hidden || states.get(toast)?.dismissing) return;
  if (
    event.target instanceof Element &&
    event.target.closest(
      "a, button, input, select, textarea, [role='button'], [contenteditable='true']"
    )
  ) {
    return;
  }

  cancelSwipeBack(toast);
  pause(toast);
  const rect = toast.getBoundingClientRect();
  drag = {
    toast,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    x: 0,
    y: 0,
    width: rect.width,
    height: rect.height,
    sampleTime: performance.now(),
    sampleX: 0,
    sampleY: 0,
    velocityX: 0,
    velocityY: 0,
    active: false
  };
}

/** @param {PointerEvent} event */
function moveDrag(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  if (!drag.toast.isConnected) {
    resetSwipe(drag.toast);
    drag = null;
    return;
  }

  const x = event.clientX - drag.startX;
  const y = event.clientY - drag.startY;
  if (!drag.active) {
    if (Math.max(Math.abs(x), Math.abs(y)) < SWIPE_SLOP) return;
    drag.active = true;
    drag.toast.style.setProperty("transition-duration", "0ms");
    try {
      drag.toast.setPointerCapture(drag.pointerId);
    } catch {
      // Pointer capture is best-effort.
    }
  }

  drag.x = x;
  drag.y = y;
  drag.toast.style.setProperty("--toast-swipe-x", `${x}px`);
  drag.toast.style.setProperty("--toast-swipe-y", `${y}px`);

  const now = performance.now();
  const elapsed = now - drag.sampleTime;
  if (elapsed >= 16) {
    drag.velocityX = (x - drag.sampleX) / elapsed;
    drag.velocityY = (y - drag.sampleY) / elapsed;
    drag.sampleTime = now;
    drag.sampleX = x;
    drag.sampleY = y;
  }

  event.preventDefault();
}

/** @param {PointerEvent} event */
function endDrag(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const state = drag;
  const toast = state.toast;
  const active = state.active;
  const elapsed = performance.now() - state.sampleTime;
  const velocityX = elapsed <= 100 ? state.velocityX : 0;
  const velocityY = elapsed <= 100 ? state.velocityY : 0;

  if (!active) {
    stopDrag(state, false);
    return;
  }

  const distance = Math.max(
    Math.abs(state.x) / Math.max(state.width, 1),
    Math.abs(state.y) / Math.max(state.height, 1)
  );
  const velocity = Math.max(Math.abs(velocityX), Math.abs(velocityY));

  if (distance > SWIPE_DISTANCE || velocity > SWIPE_VELOCITY) {
    const horizontal = Math.abs(state.x) >= Math.abs(state.y);
    const directionX = horizontal ? Math.sign(state.x) || 1 : 0;
    const directionY = horizontal ? 0 : Math.sign(state.y) || 1;
    drag = null;
    releaseDrag(state);
    dismiss(toast, "swipe", {
      x: state.x,
      y: state.y,
      width: state.width,
      height: state.height,
      directionX,
      directionY
    });
  } else {
    stopDrag(state, true);
  }

  event.preventDefault();
}

/**
 * @param {string} value
 */
function showByIds(value) {
  let shown = false;
  for (const id of value.split(/\s+/)) {
    if (!id) continue;
    const toast = document.getElementById(id);
    if (!(toast instanceof HTMLElement) || !toast.classList.contains("toast")) {
      continue;
    }
    show(toast);
    shown = true;
  }
  return shown;
}

on("click", "[data-open-toast]", (event, trigger) => {
  if (!(trigger instanceof HTMLElement)) return;
  const value = trigger.getAttribute("data-open-toast");
  if (!value) return;
  if (showByIds(value)) event.preventDefault();
});

on("click", ".toast [data-close-toast]", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const toast = target.closest(".toast");
  if (!(toast instanceof HTMLElement)) return;
  dismiss(toast, "close");
  event.preventDefault();
  return true;
}, 1);

on("click", ".toast [data-slot='close']", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const toast = target.closest(".toast");
  if (!(toast instanceof HTMLElement)) return;
  dismiss(toast, "close");
  event.preventDefault();
  return true;
});

on("pointerover", ".toaster[data-toast-initialized]", (_event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const state = toasterStateOf(target);
  state.pointerInside = true;
  expand(target);
});

on("pointerout", ".toaster[data-toast-initialized]", (event, target) => {
  if (!(target instanceof HTMLElement) || !(event instanceof PointerEvent)) {
    return;
  }
  const next = event.relatedTarget;
  if (next instanceof Node && target.contains(next)) return;
  const state = toasterStateOf(target);
  state.pointerInside = false;
  scheduleCollapse(target);
});

on("focusin", ".toaster[data-toast-initialized]", (_event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const state = toasterStateOf(target);
  state.focusInside = true;
  expand(target);
});

on("focusout", ".toaster[data-toast-initialized]", (event, target) => {
  if (!(target instanceof HTMLElement) || !(event instanceof FocusEvent)) return;
  const next = event.relatedTarget;
  if (next instanceof Node && target.contains(next)) return;
  const state = toasterStateOf(target);
  state.focusInside = false;
  scheduleCollapse(target);
});

on("pointerover", ".toast", (_event, target) => {
  if (!(target instanceof HTMLElement)) return;
  if (target.closest(".toaster[data-toast-initialized]")) return;
  pause(target);
});

on("pointerout", ".toast", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  if (target.closest(".toaster[data-toast-initialized]")) return;
  const next = event instanceof PointerEvent ? event.relatedTarget : null;
  if (next instanceof Node && target.contains(next)) return;
  resume(target);
});

on("focusin", ".toast", (_event, target) => {
  if (!(target instanceof HTMLElement)) return;
  if (target.closest(".toaster[data-toast-initialized]")) return;
  pause(target);
});

on("focusout", ".toast", (event, target) => {
  if (!(target instanceof HTMLElement) || !(event instanceof FocusEvent)) return;
  if (target.closest(".toaster[data-toast-initialized]")) return;
  const next = event.relatedTarget;
  if (next instanceof Node && target.contains(next)) return;
  resume(target);
});

on("pointerdown", ".toaster[data-toast-initialized] .toast", (event, target) => {
  if (!(event instanceof PointerEvent) || !(target instanceof HTMLElement)) {
    return;
  }
  startDrag(event, target);
});

onDocument("pointermove", (event) => {
  if (event instanceof PointerEvent) moveDrag(event);
});

onDocument("pointerup", (event) => {
  if (event instanceof PointerEvent) endDrag(event);
});

onDocument("pointercancel", (event) => {
  if (!(event instanceof PointerEvent) || !drag) return;
  if (event.pointerId !== drag.pointerId) return;
  stopDrag(drag, true);
});

onDocument("lostpointercapture", (event) => {
  if (!(event instanceof PointerEvent) || !drag) return;
  if (event.pointerId !== drag.pointerId) return;
  stopDrag(drag, true);
});

init();

if (typeof document !== "undefined") {
  /** @param {Element} node */
  const scan = (node) => {
    if (node.matches(".toast")) {
      const toast = /** @type {HTMLElement} */ (node);
      if (!toast.hidden) arm(toast);
      const toaster = toast.closest(".toaster");
      if (toaster instanceof HTMLElement) scheduleLayout(toaster);
    }
    if (node.matches(".toaster")) {
      const toaster = /** @type {HTMLElement} */ (node);
      ensureApi(toaster);
      scheduleLayout(toaster);
    }
    for (const toast of node.querySelectorAll(".toast")) {
      if (!(toast instanceof HTMLElement) || toast.hidden) continue;
      arm(toast);
      const toaster = toast.closest(".toaster");
      if (toaster instanceof HTMLElement) scheduleLayout(toaster);
    }
    for (const toaster of node.querySelectorAll(".toaster")) {
      if (!(toaster instanceof HTMLElement)) continue;
      ensureApi(toaster);
      scheduleLayout(toaster);
    }
  };

  const armExisting = () => {
    for (const toast of document.querySelectorAll(".toast")) {
      if (toast instanceof HTMLElement && !toast.hidden) arm(toast);
    }
    for (const toaster of document.querySelectorAll(".toaster")) {
      if (!(toaster instanceof HTMLElement)) continue;
      ensureApi(toaster);
      scheduleLayout(toaster);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", armExisting, { once: true });
  } else {
    armExisting();
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        if (
          record.target instanceof HTMLElement &&
          record.target.matches(".toaster")
        ) {
          scheduleLayout(record.target);
        }
        continue;
      }
      for (const node of record.addedNodes) {
        if (node instanceof Element) scan(node);
      }
      for (const node of record.removedNodes) {
        if (!(node instanceof Element)) continue;
        if (
          !node.matches(".toast, .toaster") &&
          !node.querySelector(".toast, .toaster")
        ) {
          continue;
        }
        for (const toaster of document.querySelectorAll(".toaster")) {
          if (toaster instanceof HTMLElement) scheduleLayout(toaster);
        }
      }
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-toast-limit"]
  });

  window.addEventListener("resize", () => {
    for (const toaster of document.querySelectorAll(".toaster")) {
      if (toaster instanceof HTMLElement) scheduleLayout(toaster);
    }
  });
}
