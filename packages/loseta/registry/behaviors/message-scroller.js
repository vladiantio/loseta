// @ts-check

import { emit, init, on } from "./core.js";

const FOLLOW_THRESHOLD = 24;

/**
 * @typedef {object} ScrollerState
 * @property {boolean} following
 * @property {MutationObserver} observer
 */

/** @type {WeakMap<HTMLElement, ScrollerState>} */
const states = new WeakMap();

/** @param {HTMLElement} viewport */
function distance(viewport) {
  return viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
}

/** @param {HTMLElement} viewport */
function atBottom(viewport) {
  return distance(viewport) <= FOLLOW_THRESHOLD;
}

/** @param {HTMLElement} scroller */
function parts(scroller) {
  const viewport = scroller.querySelector(".message-scroller-viewport");
  const content = scroller.querySelector("[data-slot='content']");
  const jump = scroller.querySelector("[data-slot='jump']");
  return {
    viewport: viewport instanceof HTMLElement ? viewport : null,
    content: content instanceof HTMLElement ? content : null,
    jump: jump instanceof HTMLElement ? jump : null
  };
}

/**
 * @param {HTMLElement} scroller
 * @param {ScrollerState} state
 * @param {HTMLElement} viewport
 */
function update(scroller, state, viewport) {
  const following = atBottom(viewport);
  const { jump } = parts(scroller);
  if (jump) jump.hidden = following;
  if (following === state.following) return;

  state.following = following;
  emit(scroller, "change", { following });
}

/**
 * @param {HTMLElement} scroller
 * @param {ScrollerState} state
 * @param {HTMLElement} viewport
 */
function handleMutation(scroller, state, viewport) {
  // Appended messages do not move scrollTop, so the reading position is kept
  // when the user is not following. Native scroll anchoring handles prepends.
  if (!state.following) return;

  // Pin before the scroll event caused by the new content can flip `following`
  // off (WebKit fires it before the next frame). The frame repeats the pin for
  // content whose final layout arrives after this mutation.
  viewport.scrollTop = viewport.scrollHeight;
  requestAnimationFrame(() => {
    if (scroller.isConnected && state.following) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  });
}

/** @param {HTMLElement} scroller */
function ensure(scroller) {
  const existing = states.get(scroller);
  if (existing) return existing;

  const { viewport, content, jump } = parts(scroller);
  if (!viewport || !content) return null;

  /** @type {ScrollerState} */
  const state = {
    following: atBottom(viewport),
    observer: new MutationObserver(() => {
      if (!scroller.isConnected) {
        state.observer.disconnect();
        states.delete(scroller);
        return;
      }
      handleMutation(scroller, state, viewport);
    })
  };

  state.observer.observe(content, { childList: true, subtree: true });
  states.set(scroller, state);
  if (jump) jump.hidden = state.following;
  return state;
}

/**
 * Mounts every message scroller under a root. The entry module calls this for
 * the initial document; consumers can call it for a late-mounted subtree.
 * @param {Document | Element} root
 */
export function mount(root = document) {
  for (const scroller of root.querySelectorAll(".message-scroller")) {
    if (scroller instanceof HTMLElement) ensure(scroller);
  }
}

on("scroll", ".message-scroller-viewport", (_event, element) => {
  if (!(element instanceof HTMLElement)) return;
  const scroller = element.closest(".message-scroller");
  if (!(scroller instanceof HTMLElement)) return;
  const state = ensure(scroller);
  if (state) update(scroller, state, element);
});

on("click", ".message-scroller [data-slot='jump']", (event, element) => {
  if (!(element instanceof HTMLElement)) return;
  const scroller = element.closest(".message-scroller");
  if (!(scroller instanceof HTMLElement)) return;
  const { viewport } = parts(scroller);
  if (!viewport) return;

  const state = ensure(scroller);
  if (!state) return;

  element.hidden = true;
  viewport.scrollTo({ top: viewport.scrollHeight, behavior: "auto" });
  if (!state.following) {
    state.following = true;
    emit(scroller, "change", { following: true });
  }

  event.preventDefault();
  return true;
});

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mount(document), {
      once: true
    });
  } else {
    mount(document);
  }
}

init();
