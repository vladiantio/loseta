// @ts-check

import { labelOf, uniqueId } from "./core.js";

const OPTION_SELECTOR = "[role='option']";

/** @param {Element} panel */
export function listboxIn(panel) {
  if (panel.matches("[role='listbox']")) return /** @type {HTMLElement} */ (panel);
  const listbox = panel.querySelector("[role='listbox']");
  return listbox instanceof HTMLElement ? listbox : null;
}

/** @param {Element} listbox */
export function optionsOf(listbox) {
  return [...listbox.querySelectorAll(OPTION_SELECTOR)].filter(
    (option) => option.closest("[role='listbox']") === listbox
  );
}

/** @param {Element} listbox */
export function visibleOptions(listbox) {
  return optionsOf(listbox).filter(
    (option) =>
      !option.hasAttribute("hidden") && !option.hasAttribute("aria-disabled")
  );
}

/** @param {Element} listbox @param {string} query */
export function filterOptions(listbox, query) {
  const normalized = query.trim().toLowerCase();
  let visible = 0;

  for (const option of optionsOf(listbox)) {
    const match =
      normalized === "" || labelOf(option).toLowerCase().includes(normalized);
    option.toggleAttribute("hidden", !match);
    if (match) visible += 1;
  }

  for (const group of listbox.querySelectorAll("[role='group']")) {
    if (group.closest("[role='listbox']") !== listbox) continue;
    const options = [...group.querySelectorAll(OPTION_SELECTOR)].filter(
      (option) => option.closest("[role='listbox']") === listbox
    );
    const hasVisible = options.some((option) => !option.hasAttribute("hidden"));
    group.toggleAttribute("hidden", !hasVisible);
  }

  for (const separator of listbox.querySelectorAll("[role='separator']")) {
    if (separator.closest("[role='listbox']") !== listbox) continue;
    const previous = separator.previousElementSibling;
    const next = separator.nextElementSibling;
    const surrounded =
      previous !== null &&
      next !== null &&
      !previous.hasAttribute("hidden") &&
      !next.hasAttribute("hidden");
    separator.toggleAttribute("hidden", !surrounded);
  }

  const empty = listbox.querySelector("[data-slot='empty']");
  if (empty instanceof HTMLElement) empty.hidden = visible > 0;

  return visible;
}

/** @param {Element} listbox @param {Element | null} option @param {Element | null} control */
export function highlight(listbox, option, control) {
  for (const candidate of optionsOf(listbox)) {
    candidate.removeAttribute("data-highlighted");
  }

  if (!option) {
    control?.removeAttribute("aria-activedescendant");
    return;
  }

  if (!option.id) option.id = uniqueId("loseta-option");
  if (control) control.setAttribute("aria-activedescendant", option.id);
  option.setAttribute("data-highlighted", "");
  option.scrollIntoView({ block: "nearest" });
}

/** @param {Element} listbox */
export function selectedOptions(listbox) {
  return optionsOf(listbox).filter(
    (option) => option.getAttribute("aria-selected") === "true"
  );
}

/** @param {Element} listbox */
export function selectedValues(listbox) {
  return selectedOptions(listbox).map((option) => labelOf(option));
}

/** @param {Element} listbox @param {Element} option @param {boolean} multiple */
export function selectOption(listbox, option, multiple) {
  if (multiple) {
    const selected = option.getAttribute("aria-selected") === "true";
    option.setAttribute("aria-selected", String(!selected));
  } else {
    for (const candidate of optionsOf(listbox)) {
      candidate.setAttribute("aria-selected", String(candidate === option));
    }
  }
  return selectedValues(listbox);
}

/** @param {Element} listbox @param {number} direction */
export function moveHighlight(listbox, direction) {
  const options = visibleOptions(listbox);
  const current =
    options.find((option) => option.hasAttribute("data-highlighted")) ?? null;
  if (options.length === 0) return null;
  const index = current ? options.indexOf(current) : -1;
  const next = index + direction;
  return options[(next + options.length) % options.length] ?? null;
}

/** @param {Element} listbox */
export function firstOption(listbox) {
  return visibleOptions(listbox)[0] ?? null;
}

/** @param {Element} listbox */
export function lastOption(listbox) {
  const options = visibleOptions(listbox);
  return options[options.length - 1] ?? null;
}

/** @param {Element} listbox */
export function resetFilter(listbox) {
  return filterOptions(listbox, "");
}
