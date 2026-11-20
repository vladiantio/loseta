// @ts-check

import { emit, init, isRTL, on } from "./core.js";

/**
 * @typedef {object} CarouselState
 * @property {number} index
 * @property {number} target
 * @property {boolean} settling
 * @property {number} timer
 */

/** @type {WeakMap<HTMLElement, CarouselState>} */
const states = new WeakMap();
/** @type {WeakSet<HTMLElement>} */
const scheduled = new WeakSet();

/** @param {HTMLElement} carousel */
function parts(carousel) {
  const viewport = carousel.querySelector(".carousel-viewport");
  const items = [...carousel.querySelectorAll(".carousel-item")].filter(
    (item) => item instanceof HTMLElement
  );
  const indicators = [...carousel.querySelectorAll(".carousel-indicator")].filter(
    (indicator) => indicator instanceof HTMLElement
  );
  return {
    viewport: viewport instanceof HTMLElement ? viewport : null,
    items,
    indicators
  };
}

/** @param {HTMLElement} carousel */
function horizontal(carousel) {
  return carousel.getAttribute("data-orientation") !== "vertical";
}

function reducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * @param {HTMLElement} carousel
 * @param {HTMLElement} viewport
 * @param {HTMLElement[]} items
 */
function indexFromScroll(carousel, viewport, items) {
  if (items.length === 0) return 0;
  const viewportRect = viewport.getBoundingClientRect();
  const horizontalScroll = horizontal(carousel);
  let best = 0;
  let distance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item) continue;
    const rect = item.getBoundingClientRect();
    const value = horizontalScroll
      ? Math.abs(rect.left - viewportRect.left) +
        Math.abs(rect.right - viewportRect.right)
      : Math.abs(rect.top - viewportRect.top) +
        Math.abs(rect.bottom - viewportRect.bottom);
    if (value < distance) {
      distance = value;
      best = index;
    }
  }

  return best;
}

/**
 * @param {HTMLElement} carousel
 * @param {number} index
 */
function updateIndicators(carousel, index) {
  const { indicators } = parts(carousel);
  for (let cursor = 0; cursor < indicators.length; cursor += 1) {
    const indicator = indicators[cursor];
    if (!indicator) continue;
    indicator.setAttribute("aria-current", String(cursor === index));
  }
}

/**
 * @param {HTMLElement} carousel
 * @param {HTMLElement} viewport
 * @param {HTMLElement[]} items
 */
function updateOffscreen(carousel, viewport, items) {
  const viewportRect = viewport.getBoundingClientRect();
  const horizontalScroll = horizontal(carousel);

  for (const item of items) {
    const rect = item.getBoundingClientRect();
    const visible = horizontalScroll
      ? rect.right > viewportRect.left + 1 && rect.left < viewportRect.right - 1
      : rect.bottom > viewportRect.top + 1 && rect.top < viewportRect.bottom - 1;
    item.setAttribute("aria-hidden", String(!visible));
    item.toggleAttribute("inert", !visible);
  }
}

/** @param {HTMLElement} carousel */
function ensure(carousel) {
  const existing = states.get(carousel);
  if (existing) return existing;

  const { viewport, items, indicators } = parts(carousel);
  const current = indicators.findIndex(
    (indicator) => indicator.getAttribute("aria-current") === "true"
  );
  const index =
    current >= 0
      ? current
      : viewport
        ? indexFromScroll(carousel, viewport, items)
        : 0;
  const state = { index, target: index, settling: false, timer: 0 };
  states.set(carousel, state);

  if (viewport) updateOffscreen(carousel, viewport, items);
  updateIndicators(carousel, index);
  return state;
}

/**
 * @param {HTMLElement} carousel
 * @param {CarouselState} state
 */
function update(carousel, state) {
  const { viewport, items } = parts(carousel);
  if (!viewport) return;
  const index = indexFromScroll(carousel, viewport, items);
  updateOffscreen(carousel, viewport, items);

  if (state.settling) {
    if (index !== state.target) return;
    state.settling = false;
    if (state.timer !== 0) {
      window.clearTimeout(state.timer);
      state.timer = 0;
    }
  }

  const changed = index !== state.index;
  state.index = index;
  updateIndicators(carousel, index);
  if (changed) emit(carousel, "change", { index });
}

/**
 * @param {HTMLElement} carousel
 * @param {CarouselState} state
 * @param {number} index
 */
function go(carousel, state, index) {
  const { items } = parts(carousel);
  if (items.length === 0) return;

  const clamped = Math.max(0, Math.min(index, items.length - 1));
  const item = items[clamped];
  if (!item) return;

  const changed = clamped !== state.index;
  state.index = clamped;
  state.target = clamped;
  state.settling = true;
  updateIndicators(carousel, clamped);

  if (state.timer !== 0) window.clearTimeout(state.timer);
  state.timer = window.setTimeout(() => {
    state.settling = false;
    state.target = state.index;
    state.timer = 0;
  }, 600);

  const horizontalScroll = horizontal(carousel);
  item.scrollIntoView({
    behavior: reducedMotion() ? "auto" : "smooth",
    block: horizontalScroll ? "nearest" : "start",
    inline: horizontalScroll ? "start" : "nearest"
  });

  if (changed) emit(carousel, "change", { index: clamped });
}

on(
  "click",
  ".carousel [data-slot='previous'], .carousel [data-slot='next']",
  (event, element) => {
    if (!(element instanceof HTMLElement)) return;
    const carousel = element.closest(".carousel");
    if (!(carousel instanceof HTMLElement)) return;
    const state = ensure(carousel);
    go(
      carousel,
      state,
      state.index + (element.getAttribute("data-slot") === "next" ? 1 : -1)
    );
    event.preventDefault();
    return true;
  }
);

on("click", ".carousel .carousel-indicator", (event, element) => {
  if (!(element instanceof HTMLElement)) return;
  const carousel = element.closest(".carousel");
  if (!(carousel instanceof HTMLElement)) return;
  const { indicators } = parts(carousel);
  const index = indicators.indexOf(element);
  if (index === -1) return;
  const state = ensure(carousel);
  go(carousel, state, index);
  event.preventDefault();
  return true;
});

on("keydown", ".carousel-viewport", (event, element) => {
  if (!(event instanceof KeyboardEvent)) return;
  if (!(element instanceof HTMLElement)) return;
  if (event.target !== element) return;

  const carousel = element.closest(".carousel");
  if (!(carousel instanceof HTMLElement)) return;
  const state = ensure(carousel);
  const { items } = parts(carousel);
  if (items.length === 0) return;

  const horizontalScroll = horizontal(carousel);
  const rtl = horizontalScroll && isRTL(carousel);
  const nextKey = horizontalScroll
    ? rtl
      ? "ArrowLeft"
      : "ArrowRight"
    : "ArrowDown";
  const previousKey = horizontalScroll
    ? rtl
      ? "ArrowRight"
      : "ArrowLeft"
    : "ArrowUp";

  if (event.key === nextKey) {
    go(carousel, state, state.index + 1);
    event.preventDefault();
    return true;
  }

  if (event.key === previousKey) {
    go(carousel, state, state.index - 1);
    event.preventDefault();
    return true;
  }

  if (event.key === "Home" || event.key === "End") {
    go(carousel, state, event.key === "Home" ? 0 : items.length - 1);
    event.preventDefault();
    return true;
  }
});

on("scroll", ".carousel-viewport", (_event, element) => {
  if (!(element instanceof HTMLElement)) return;
  const carousel = element.closest(".carousel");
  if (!(carousel instanceof HTMLElement)) return;
  if (scheduled.has(carousel)) return;

  scheduled.add(carousel);
  requestAnimationFrame(() => {
    scheduled.delete(carousel);
    if (!carousel.isConnected) return;
    update(carousel, ensure(carousel));
  });
});

init();
