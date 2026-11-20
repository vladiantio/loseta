// @ts-check

import { emit, init, on, onDocument, panelFor } from "./core.js";
import {
  filterOptions,
  firstOption,
  highlight,
  lastOption,
  listboxIn,
  moveHighlight,
  optionsOf,
  resetFilter,
  selectOption,
  selectedOptions,
  selectedValues
} from "./listbox.js";

/** @type {WeakSet<HTMLInputElement>} */
const suppressFocus = new WeakSet();

/** @param {HTMLInputElement} input */
function rootOf(input) {
  return input.closest(".combobox") ?? input.parentElement ?? input;
}

/** @param {HTMLInputElement} input */
function parts(input) {
  const panel = panelFor(input);
  const listbox = panel ? listboxIn(panel) : null;
  return { panel, listbox };
}

/** @param {HTMLInputElement} input */
function isExpanded(input) {
  return input.getAttribute("aria-expanded") === "true";
}

/** @param {HTMLInputElement} input @param {boolean} open */
function setExpanded(input, open) {
  const { panel } = parts(input);
  input.setAttribute("aria-expanded", String(open));
  if (panel) panel.setAttribute("aria-hidden", String(!open));
}

/** @param {HTMLInputElement} input */
function multiple(input) {
  const { listbox } = parts(input);
  return listbox?.getAttribute("aria-multiselectable") === "true";
}

/** @param {HTMLInputElement} input */
function syncHidden(input) {
  if (multiple(input)) return;
  const { listbox } = parts(input);
  if (!listbox) return;
  const hidden = rootOf(input).querySelector("input[data-slot='input']");
  if (hidden instanceof HTMLInputElement) {
    hidden.value = selectedValues(listbox)[0] ?? "";
  }
}

/** @param {HTMLInputElement} input */
function openCombobox(input) {
  const { listbox } = parts(input);
  if (!listbox) return;

  resetFilter(listbox);
  setExpanded(input, true);
  const selected = selectedOptions(listbox)[0] ?? firstOption(listbox);
  highlight(listbox, selected, input);
}

/** @param {HTMLInputElement} input @param {boolean} restore */
function closeCombobox(input, restore) {
  const { listbox } = parts(input);
  setExpanded(input, false);
  if (listbox) highlight(listbox, null, input);

  if (!restore) return;
  const selected = listbox ? selectedValues(listbox) : [];
  input.value = multiple(input) ? "" : (selected[0] ?? "");
  if (listbox) resetFilter(listbox);
}

/** @param {HTMLInputElement} input */
function filter(input) {
  const { listbox } = parts(input);
  if (!listbox) return;

  if (!isExpanded(input)) setExpanded(input, true);
  if (input.value.trim() === "") {
    resetFilter(listbox);
  } else {
    filterOptions(listbox, input.value);
  }
  highlight(listbox, firstOption(listbox), input);
}

/** @param {HTMLInputElement} input @param {Element} option */
function choose(input, option) {
  const { listbox } = parts(input);
  if (!listbox) return;

  const isMultiple = multiple(input);
  const values = selectOption(listbox, option, isMultiple);
  const root = rootOf(input);

  if (isMultiple) {
    input.value = "";
    resetFilter(listbox);
    highlight(listbox, firstOption(listbox), input);
    emit(root, "change", { values });
    syncHidden(input);
    input.focus();
    return;
  }

  const value = values[0] ?? "";
  input.value = value;
  setExpanded(input, false);
  highlight(listbox, null, input);
  syncHidden(input);
  emit(root, "change", { value });
  if (document.activeElement !== input) {
    suppressFocus.add(input);
    input.focus();
  }
}

/** @param {HTMLInputElement} input */
function clear(input) {
  const { listbox } = parts(input);
  if (!listbox) return;

  for (const option of optionsOf(listbox)) {
    option.setAttribute("aria-selected", "false");
  }
  input.value = "";
  resetFilter(listbox);
  highlight(listbox, firstOption(listbox), input);
  syncHidden(input);
  emit(rootOf(input), "change", { value: "", values: [] });
  input.focus();
}

on("focusin", ".combobox [role='combobox']", (_event, target) => {
  if (!(target instanceof HTMLInputElement)) return;
  if (suppressFocus.has(target)) {
    suppressFocus.delete(target);
    return;
  }
  if (!isExpanded(target)) openCombobox(target);
});

on("click", ".combobox [role='combobox']", (_event, target) => {
  if (!(target instanceof HTMLInputElement)) return;
  if (!isExpanded(target)) openCombobox(target);
});

on("input", ".combobox [role='combobox']", (event, target) => {
  if (!(target instanceof HTMLInputElement)) return;
  if (event instanceof InputEvent && event.isComposing) return;
  filter(target);
});

on("click", ".combobox [role='option']", (event, target) => {
  if (!(target instanceof HTMLElement) || target.getAttribute("aria-disabled") === "true") {
    return;
  }
  const input = target.closest(".combobox")?.querySelector("[role='combobox']");
  if (input instanceof HTMLInputElement) choose(input, target);
  event.preventDefault();
  return true;
});

on("click", ".combobox [data-slot='clear']", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const input = target.closest(".combobox")?.querySelector("[role='combobox']");
  if (input instanceof HTMLInputElement) clear(input);
  event.preventDefault();
  return true;
});

on("keydown", ".combobox [role='combobox']", (event, target) => {
  if (!(event instanceof KeyboardEvent) || !(target instanceof HTMLInputElement)) return;
  const { listbox } = parts(target);
  if (!listbox) return;

  if (event.key === "Escape") {
    if (!isExpanded(target)) return;
    closeCombobox(target, true);
    event.preventDefault();
    return true;
  }

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    if (!isExpanded(target)) openCombobox(target);
    const next = moveHighlight(listbox, event.key === "ArrowDown" ? 1 : -1);
    if (next) highlight(listbox, next, target);
    event.preventDefault();
    return true;
  }

  if (event.key === "Home" || event.key === "End") {
    if (!isExpanded(target)) openCombobox(target);
    highlight(
      listbox,
      event.key === "Home" ? firstOption(listbox) : lastOption(listbox),
      target
    );
    event.preventDefault();
    return true;
  }

  if (event.key === "Enter") {
    const option = listbox.querySelector("[data-highlighted]");
    if (option instanceof HTMLElement) choose(target, option);
    event.preventDefault();
    return true;
  }

  if (event.key === "Tab") {
    closeCombobox(target, true);
  }
}, 25);

onDocument("pointerdown", (event) => {
  if (!(event.target instanceof Node)) return;
  for (const input of document.querySelectorAll(".combobox [role='combobox']")) {
    if (!(input instanceof HTMLInputElement) || !isExpanded(input)) continue;
    const root = rootOf(input);
    if (root.contains(event.target)) continue;
    closeCombobox(input, true);
  }
});

init();
