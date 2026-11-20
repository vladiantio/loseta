// @ts-check

/**
 * Shared behavior primitives. Supports one delegated listener per event type
 * and shared focus, typeahead, overlay and event helpers.
 */

/**
 * @typedef {object} Handler
 * @property {string} event
 * @property {string | null} selector
 * @property {(event: Event, target: Element) => boolean | void} handler
 * @property {number} priority
 */

/** @type {Map<string, Handler[]>} */
const handlers = new Map();
/** @type {Set<Document | Element>} */
const roots = new Set();
/** @type {Set<string>} */
const listening = new Set();
/** @type {WeakMap<Element, { value: string, time: number }>} */
const typeaheadBuffers = new WeakMap();

let installed = false;
let idCounter = 0;

const supportsDom = typeof document !== "undefined";

export const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "[tabindex]:not([tabindex='-1'])"
].join(", ");

/** @param {Element} element */
export function isDisabled(element) {
  return element.matches(":disabled, [aria-disabled='true']");
}

/** @param {Element} element */
export function isVisible(element) {
  return (
    element instanceof HTMLElement &&
    (element.offsetWidth > 0 ||
      element.offsetHeight > 0 ||
      element.getClientRects().length > 0)
  );
}

/** @param {ParentNode} root */
export function focusables(root) {
  return [...root.querySelectorAll(focusableSelector)].filter(
    (element) => !isDisabled(element) && isVisible(element)
  );
}

/** @param {string} prefix */
export function uniqueId(prefix = "loseta") {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/**
 * Focuses an element once it is visible. Panels transition `visibility` on an
 * early frame, so a focus call in the same task can be ignored.
 * @param {Element} element
 * @param {number} attempts
 */
export function focusWhenVisible(element, attempts = 20) {
  /** @param {number} remaining */
  const focus = (remaining) => {
    if (!element.isConnected) return;
    if (element.closest("[aria-hidden='true'], [hidden]")) return;

    if (getComputedStyle(element).visibility === "visible") {
      if (element instanceof HTMLElement) element.focus({ preventScroll: true });
      if (
        document.activeElement === element ||
        element.contains(document.activeElement)
      ) {
        return;
      }
    }

    if (remaining > 0) setTimeout(() => focus(remaining - 1), 16);
  };

  setTimeout(() => focus(attempts), 0);
}

/** @param {Element} element */
export function isRTL(element) {
  return getComputedStyle(element).direction === "rtl";
}

/**
 * @param {Iterable<Element>} items
 * @param {Element | null} current
 * @param {1 | -1} direction
 */
export function nextEnabled(items, current, direction) {
  const enabled = [...items].filter(
    (item) => !isDisabled(item) && !item.hasAttribute("hidden")
  );
  if (enabled.length === 0) return null;
  const index = current ? enabled.indexOf(current) : -1;
  const next = index + direction;
  return enabled[(next + enabled.length) % enabled.length] ?? null;
}

/** @param {Iterable<Element>} items */
export function firstEnabled(items) {
  return nextEnabled(items, null, 1);
}

/** @param {Iterable<Element>} items */
export function lastEnabled(items) {
  const enabled = [...items].filter(
    (item) => !isDisabled(item) && !item.hasAttribute("hidden")
  );
  return enabled[enabled.length - 1] ?? null;
}

/** @param {Element} trigger */
export function panelFor(trigger) {
  const id = trigger.getAttribute("aria-controls");
  if (!id || !supportsDom) return null;
  return document.getElementById(id);
}

/** @param {Element} trigger @param {Element} panel @param {boolean} open */
export function setOpen(trigger, panel, open) {
  trigger.setAttribute("aria-expanded", String(open));
  panel.setAttribute("aria-hidden", String(!open));
}

/** @param {Element} panel */
export function isOpen(panel) {
  return panel.getAttribute("aria-hidden") === "false";
}

/**
 * @param {Element} target
 * @param {string} type
 * @param {unknown} detail
 */
export function emit(target, type, detail) {
  target.dispatchEvent(
    new CustomEvent(type, { bubbles: true, cancelable: false, detail })
  );
}

/** @param {Element} element */
export function labelOf(element) {
  /** @param {string} value */
  const normalize = (value) => value.replace(/\s+/g, " ").trim();
  const text = element.querySelector("[data-slot='text']");
  if (text) return normalize(text.textContent ?? "");

  const shortcut = element.querySelector("[data-slot='shortcut']");
  if (shortcut) {
    const clone = element.cloneNode(true);
    if (clone instanceof Element) {
      for (const node of clone.querySelectorAll("[data-slot='shortcut']")) {
        node.remove();
      }
    }
    return normalize(clone.textContent ?? "");
  }

  return normalize(element.textContent ?? "");
}

/**
 * @param {Element} container
 * @param {string} key
 * @param {Iterable<Element>} items
 * @param {Element | null} current
 * @returns {Element | null}
 */
export function typeaheadTarget(container, key, items, current) {
  if (key.length !== 1 || key.trim() === "" || key === " ") return null;

  const now = Date.now();
  const previous = typeaheadBuffers.get(container);
  const repeat = previous !== undefined && now - previous.time < 500;
  let value = key.toLowerCase();
  let cycle = false;

  if (repeat) {
    if (previous.value === value) {
      cycle = true;
    } else {
      value = `${previous.value}${value}`;
    }
  }

  typeaheadBuffers.set(container, { value, time: now });

  /** @param {string} query */
  const matches = (query) =>
    [...items].filter((item) =>
      labelOf(item).toLowerCase().startsWith(query)
    );

  let found = matches(value);
  if (found.length === 0 && value.length > 1) {
    value = key.toLowerCase();
    typeaheadBuffers.set(container, { value, time: now });
    found = matches(value);
  }
  if (found.length === 0) return null;

  if (cycle && current) {
    const index = found.indexOf(current);
    return found[(index + 1) % found.length] ?? found[0] ?? null;
  }

  return found[0] ?? null;
}

/** @param {string} event @param {string | null} selector @param {Handler["handler"]} handler @param {number} priority */
function addHandler(event, selector, handler, priority) {
  const list = handlers.get(event) ?? [];
  list.push({ event, selector, handler, priority });
  list.sort((left, right) => right.priority - left.priority);
  handlers.set(event, list);
  if (installed) listen(event);
}

/** @param {Event} event */
function dispatch(event) {
  if (!(event.target instanceof Element) || roots.size === 0) return;

  const scoped = roots.has(document)
    ? [document]
    : [...roots].filter((root) => root.isConnected);
  const list = handlers.get(event.type) ?? [];

  for (const root of scoped) {
    if (root !== document && !root.contains(event.target)) continue;

    for (const entry of list) {
      if (entry.selector === null) {
        if (entry.handler(event, event.target) === true) return;
        continue;
      }

      const matched = event.target.closest(entry.selector);
      if (!matched) continue;
      if (root !== document && !root.contains(matched)) continue;
      if (entry.handler(event, matched) === true) return;
    }
  }
}

/** @param {string} event */
function listen(event) {
  if (!supportsDom || listening.has(event)) return;
  listening.add(event);
  document.addEventListener(event, dispatch, true);
}

/**
 * Registers a delegated handler. Use `init` to mount the document listeners.
 * @param {string} event
 * @param {string} selector
 * @param {Handler["handler"]} handler
 * @param {number} priority
 */
export function on(event, selector, handler, priority = 0) {
  addHandler(event, selector, handler, priority);
}

/**
 * Registers a document-level handler that runs for every event of the type.
 * @param {string} event
 * @param {Handler["handler"]} handler
 * @param {number} priority
 */
export function onDocument(event, handler, priority = 0) {
  addHandler(event, null, handler, priority);
}

/**
 * Mounts behavior handling on a root. Importing an entry module mounts the
 * document root automatically; call this for scoped or late-mounting roots.
 * @param {Document | Element} root
 */
export function init(root = document) {
  if (!supportsDom) return;
  roots.add(root);
  installed = true;
  for (const event of handlers.keys()) {
    listen(event);
  }
}
