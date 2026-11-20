// @ts-check

import {
  emit,
  init,
  on,
  onDocument,
  panelFor,
  typeaheadTarget
} from "./core.js";
import {
  firstOption,
  highlight,
  lastOption,
  listboxIn,
  moveHighlight,
  resetFilter,
  selectOption,
  selectedOptions,
  visibleOptions
} from "./listbox.js";

/** @param {HTMLElement} control */
function rootOf(control) {
  return control.closest(".select") ?? control.parentElement ?? control;
}

/** @param {HTMLElement} control */
function parts(control) {
  const panel = panelFor(control);
  const listbox = panel ? listboxIn(panel) : null;
  return { panel, listbox };
}

/** @param {HTMLElement} control */
function isExpanded(control) {
  return control.getAttribute("aria-expanded") === "true";
}

/** @param {HTMLElement} control @param {boolean} open */
function setExpanded(control, open) {
  const { panel } = parts(control);
  control.setAttribute("aria-expanded", String(open));
  if (panel) panel.setAttribute("aria-hidden", String(!open));
}

/** @param {HTMLElement} control */
function openSelect(control) {
  const { panel, listbox } = parts(control);
  if (!panel || !listbox) return;

  resetFilter(listbox);
  setExpanded(control, true);

  const selected = selectedOptions(listbox)[0] ?? firstOption(listbox);
  highlight(listbox, selected, control);
}

/** @param {HTMLElement} control @param {boolean} focusTrigger */
function closeSelect(control, focusTrigger) {
  const { listbox } = parts(control);
  setExpanded(control, false);
  if (listbox) highlight(listbox, null, control);
  if (focusTrigger) control.focus();
}

/** @param {HTMLElement} control @param {Element} option */
function choose(control, option) {
  const { listbox } = parts(control);
  if (!listbox) return;

  const values = selectOption(listbox, option, false);
  const value = values[0] ?? "";
  const root = rootOf(control);
  const valueSlot = root.querySelector("[data-slot='value']");
  if (valueSlot instanceof HTMLElement) {
    valueSlot.textContent = value;
    valueSlot.removeAttribute("data-placeholder");
  }

  const hidden = root.querySelector("input[data-slot='input']");
  if (hidden instanceof HTMLInputElement) hidden.value = value;

  emit(root, "change", { value });
  closeSelect(control, true);
}

on("click", ".select [role='combobox']", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  if (isExpanded(target)) {
    closeSelect(target, true);
  } else {
    openSelect(target);
  }
  event.preventDefault();
  return true;
});

on("click", ".select [role='option']", (event, target) => {
  if (!(target instanceof HTMLElement) || target.getAttribute("aria-disabled") === "true") {
    return;
  }
  const control = target.closest(".select")?.querySelector("[role='combobox']");
  if (control instanceof HTMLElement) choose(control, target);
  event.preventDefault();
  return true;
});

on("keydown", ".select [role='combobox']", (event, target) => {
  if (!(event instanceof KeyboardEvent) || !(target instanceof HTMLElement)) return;
  const { listbox } = parts(target);
  if (!listbox) return;
  const expanded = isExpanded(target);

  if (event.key === "Escape") {
    if (!expanded) return;
    closeSelect(target, true);
    event.preventDefault();
    return true;
  }

  if (!expanded) {
    const opens =
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === " ";
    if (opens) {
      openSelect(target);
      if (event.key === "ArrowUp") {
        highlight(listbox, lastOption(listbox), target);
      }
      event.preventDefault();
      return true;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      openSelect(target);
      const match = typeaheadTarget(listbox, event.key, visibleOptions(listbox), null);
      if (match) highlight(listbox, match, target);
      event.preventDefault();
      return true;
    }
    return;
  }

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    const next = moveHighlight(listbox, event.key === "ArrowDown" ? 1 : -1);
    if (next) highlight(listbox, next, target);
    event.preventDefault();
    return true;
  }

  if (event.key === "Home" || event.key === "End") {
    highlight(listbox, event.key === "Home" ? firstOption(listbox) : lastOption(listbox), target);
    event.preventDefault();
    return true;
  }

  if (event.key === "Enter" || event.key === " ") {
    const option = listbox.querySelector("[data-highlighted]");
    if (option instanceof HTMLElement) choose(target, option);
    event.preventDefault();
    return true;
  }

  if (event.key === "Tab") {
    closeSelect(target, false);
    return;
  }

  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const current = listbox.querySelector("[data-highlighted]");
    const match = typeaheadTarget(
      listbox,
      event.key,
      visibleOptions(listbox),
      current instanceof Element ? current : null
    );
    if (match) highlight(listbox, match, target);
    event.preventDefault();
    return true;
  }
}, 25);

onDocument("pointerdown", (event) => {
  if (!(event.target instanceof Node)) return;
  for (const control of document.querySelectorAll(".select [role='combobox']")) {
    if (!(control instanceof HTMLElement) || !isExpanded(control)) continue;
    const root = rootOf(control);
    if (root.contains(event.target)) continue;
    closeSelect(control, false);
  }
});

init();
