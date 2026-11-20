// @ts-check

import { init, on, uniqueId } from "./core.js";
import {
  filterOptions,
  firstOption,
  highlight,
  lastOption,
  listboxIn,
  moveHighlight,
  resetFilter
} from "./listbox.js";

/** @param {Element} root */
function parts(root) {
  const input = root.querySelector("input");
  const listbox = listboxIn(root);
  return {
    input: input instanceof HTMLInputElement ? input : null,
    listbox
  };
}

/** @param {HTMLInputElement} input @param {HTMLElement} listbox */
function link(input, listbox) {
  if (!listbox.id) listbox.id = uniqueId("loseta-listbox");
  if (!input.hasAttribute("role")) input.setAttribute("role", "combobox");
  if (!input.hasAttribute("aria-controls")) input.setAttribute("aria-controls", listbox.id);
  if (!input.hasAttribute("aria-expanded")) input.setAttribute("aria-expanded", "true");
  if (!input.hasAttribute("aria-autocomplete")) input.setAttribute("aria-autocomplete", "list");
}

/** @param {Element} root @param {HTMLInputElement} input */
function refresh(root, input) {
  const { listbox } = parts(root);
  if (!listbox) return;

  link(input, listbox);
  if (input.value.trim() === "") {
    resetFilter(listbox);
  } else {
    filterOptions(listbox, input.value);
  }
  highlight(listbox, firstOption(listbox), input);
}

on("focusin", ".command input", (_event, target) => {
  if (!(target instanceof HTMLInputElement)) return;
  const root = target.closest(".command");
  if (!root) return;
  const { listbox } = parts(root);
  if (!listbox) return;
  link(target, listbox);
  if (!listbox.querySelector("[data-highlighted]")) {
    highlight(listbox, firstOption(listbox), target);
  }
});

on("input", ".command input", (_event, target) => {
  if (!(target instanceof HTMLInputElement)) return;
  const root = target.closest(".command");
  if (root) refresh(root, target);
});

on("keydown", ".command input", (event, target) => {
  if (!(event instanceof KeyboardEvent) || !(target instanceof HTMLInputElement)) return;
  const root = target.closest(".command");
  if (!root) return;
  const { listbox } = parts(root);
  if (!listbox) return;

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    const next = moveHighlight(listbox, event.key === "ArrowDown" ? 1 : -1);
    if (next) highlight(listbox, next, target);
    event.preventDefault();
    return true;
  }

  if (event.key === "Home" || event.key === "End") {
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
    if (option instanceof HTMLElement) option.click();
    event.preventDefault();
    return true;
  }
});

on("pointermove", ".command [role='option']", (event, target) => {
  if (!(event instanceof PointerEvent) || !(target instanceof HTMLElement)) return;
  const root = target.closest(".command");
  if (!root) return;
  const { input, listbox } = parts(root);
  if (listbox) highlight(listbox, target, input);
});

init();
