// @ts-check

import { emit, focusWhenVisible, init, on } from "./core.js";

/** @param {HTMLElement} root */
function readSteps(root) {
  const steps = [...root.querySelectorAll("[data-slot='item']")].filter(
    (step) => step instanceof HTMLElement
  );
  let index = steps.findIndex(
    (step) => step.getAttribute("aria-current") === "step"
  );
  if (index === -1) {
    index = steps.findIndex((step) => !step.hasAttribute("hidden"));
  }
  return { steps, index: index >= 0 ? index : 0 };
}

/**
 * @param {HTMLElement} root
 * @param {HTMLElement[]} steps
 * @param {number} index
 */
function go(root, steps, index) {
  if (steps.length === 0) return;
  const next = Math.max(0, Math.min(index, steps.length - 1));

  steps.forEach((step, cursor) => {
    step.hidden = cursor !== next;
    if (cursor === next) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });

  const progress = root.querySelector("progress");
  if (progress instanceof HTMLProgressElement) {
    progress.max = steps.length;
    progress.value = next + 1;
    progress.textContent = `${next + 1} of ${steps.length}`;
  }

  const label = root.querySelector("[data-slot='progress-label']");
  if (label) {
    label.textContent = `Question ${next + 1} of ${steps.length}`;
  }

  const previous = root.querySelector("[data-slot='previous']");
  if (previous instanceof HTMLButtonElement) {
    previous.disabled = next === 0;
  }

  const forward = root.querySelector("[data-slot='next']");
  if (forward instanceof HTMLButtonElement) {
    forward.disabled = next === steps.length - 1;
  }

  const control = steps[next]?.querySelector(
    "input, button, select, textarea"
  );
  if (control instanceof HTMLElement && !control.matches(":disabled")) {
    focusWhenVisible(control);
  }

  emit(root, "change", { step: next + 1, total: steps.length });
}

on(
  "click",
  ".questionnaire [data-slot='previous'], .questionnaire [data-slot='next']",
  (event, element) => {
    if (!(element instanceof HTMLElement)) return;
    const root = element.closest(".questionnaire");
    if (!(root instanceof HTMLElement)) return;

    const { steps, index } = readSteps(root);
    const direction = element.getAttribute("data-slot") === "next" ? 1 : -1;
    const next = index + direction;
    if (next < 0 || next >= steps.length) {
      event.preventDefault();
      return true;
    }

    go(root, steps, next);
    event.preventDefault();
    return true;
  }
);

init();
