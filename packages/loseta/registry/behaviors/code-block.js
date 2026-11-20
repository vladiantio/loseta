// @ts-check

import { init, on } from "./core.js";

const FEEDBACK_MS = 1500;

/** @type {WeakMap<HTMLElement, number>} */
const feedbackTimers = new WeakMap();
/** @type {WeakMap<HTMLElement, { label: string, text: string | null }>} */
const originals = new WeakMap();

/** @param {Element} block */
function codeText(block) {
  const code = block.querySelector("pre code");
  if (!code) return "";

  const lines = [...code.querySelectorAll("[data-slot='line']")];
  const text =
    lines.length > 0
      ? lines
          .map((line) => {
            const content = line.querySelector("[data-slot='line-content']");
            return content?.textContent ?? line.textContent ?? "";
          })
          .join("\n")
      : (code.textContent ?? "");

  return text.replace(/\n+$/, "");
}

/** @param {HTMLElement} button */
function resetFeedback(button) {
  const timer = feedbackTimers.get(button);
  if (timer !== undefined) {
    window.clearTimeout(timer);
    feedbackTimers.delete(button);
  }
  button.removeAttribute("data-copied");
  const original = originals.get(button);
  if (original) {
    button.setAttribute("aria-label", original.label);
    if (original.text !== null) button.textContent = original.text;
  }
}

/** @param {HTMLElement} button @param {string} label @param {boolean} copied */
function showFeedback(button, label, copied) {
  if (!originals.has(button)) {
    originals.set(button, {
      label: button.getAttribute("aria-label") ?? "Copy",
      text: button.querySelector("svg") ? null : (button.textContent ?? "")
    });
  }

  resetFeedback(button);

  if (copied) {
    button.setAttribute("data-copied", "");
    const original = originals.get(button);
    if (original?.text !== null && original?.text !== undefined) {
      button.textContent = "Copied";
    }
  }
  button.setAttribute("aria-label", label);

  const timer = window.setTimeout(() => resetFeedback(button), FEEDBACK_MS);
  feedbackTimers.set(button, timer);
}

on("click", ".code-block [data-slot='copy']", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const block = target.closest(".code-block");
  if (!block) return;

  event.preventDefault();

  const text = codeText(block);
  if (!text) return true;

  const write = navigator.clipboard?.writeText(text);
  if (!write) {
    showFeedback(target, "Copy failed", false);
    return true;
  }

  write
    .then(() => showFeedback(target, "Copied", true))
    .catch(() => showFeedback(target, "Copy failed", false));

  return true;
});

on("click", ".code-block [data-slot='wrap']", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const block = target.closest(".code-block");
  const pre = block?.querySelector("pre");
  if (!pre) return;

  const next = !pre.hasAttribute("data-wrap");
  pre.toggleAttribute("data-wrap", next);
  target.setAttribute("aria-pressed", String(next));
  event.preventDefault();
  return true;
});

init();
