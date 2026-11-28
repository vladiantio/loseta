// @ts-check

import {
  emit,
  init,
  labelOf,
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
  optionsOf,
  resetFilter,
  selectOption,
  selectedOptions,
  visibleOptions
} from "./listbox.js";

/** @type {number | null} */
let scrollTimer = null;

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

/** @param {Element} option */
function valueOf(option) {
  return option.getAttribute("data-value") ?? labelOf(option);
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

/** @param {HTMLElement} control @param {boolean} placeholder */
function setPlaceholder(control, placeholder) {
  control.toggleAttribute("data-placeholder", placeholder);
}

/** @param {HTMLElement} panel */
function updateScrollButtons(panel) {
  const up = panel.querySelector("[data-slot='scroll-up']");
  const down = panel.querySelector("[data-slot='scroll-down']");
  const scroller = listboxIn(panel) ?? panel;
  const remaining = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;

  if (up instanceof HTMLElement) up.hidden = scroller.scrollTop <= 0;
  if (down instanceof HTMLElement) down.hidden = remaining <= 1;
}

function stopScroll() {
  if (scrollTimer === null) return;
  clearInterval(scrollTimer);
  scrollTimer = null;
}

/**
 * Steps one row at a time, keeping the target row clear of the overlay.
 * @param {HTMLElement} panel
 * @param {-1 | 1} direction
 */
function scrollStep(panel, direction) {
  const listbox = listboxIn(panel);
  if (!listbox) return;

  const items = /** @type {HTMLElement[]} */ (
    optionsOf(listbox).filter((item) => item instanceof HTMLElement)
  );
  if (items.length === 0) return;

  const arrow = panel.querySelector(
    direction < 0 ? "[data-slot='scroll-up']" : "[data-slot='scroll-down']"
  );
  const arrowHeight = arrow instanceof HTMLElement ? arrow.offsetHeight : 0;
  const max = Math.max(0, listbox.scrollHeight - listbox.clientHeight);
  const top = listbox.scrollTop;
  let target = direction < 0 ? 0 : max;

  if (direction < 0) {
    const visibleTop = top + arrowHeight - 1;
    const index = items.findIndex((item) => item.offsetTop >= visibleTop);
    const previous = items[Math.max(0, (index === -1 ? items.length : index) - 1)];
    target = previous ? previous.offsetTop - arrowHeight : 0;
  } else {
    const visibleBottom = top + listbox.clientHeight - arrowHeight + 1;
    const index = items.findIndex(
      (item) => item.offsetTop + item.offsetHeight > visibleBottom
    );
    const next = items[index === -1 ? items.length - 1 : index];
    target = next
      ? next.offsetTop + next.offsetHeight - listbox.clientHeight + arrowHeight
      : max;
  }

  listbox.scrollTop = Math.max(0, Math.min(target, max));
  updateScrollButtons(panel);
}

/** @param {HTMLElement} button */
function startScroll(button) {
  stopScroll();
  const panel = button.closest("[data-popover]");
  if (!(panel instanceof HTMLElement)) return;

  const direction = button.getAttribute("data-slot") === "scroll-up" ? -1 : 1;
  scrollTimer = window.setInterval(() => {
    if (!panel.isConnected || panel.getAttribute("aria-hidden") === "true") {
      stopScroll();
      return;
    }
    scrollStep(panel, direction);
    if (button.hidden) stopScroll();
  }, 40);
}

/**
 * Reflects the authored `aria-selected` option into the trigger value, the
 * placeholder state and the optional hidden input.
 * @param {HTMLElement} control
 */
function sync(control) {
  const { listbox } = parts(control);
  if (!listbox) return;

  const selected = selectedOptions(listbox)[0] ?? null;
  setPlaceholder(control, !selected);
  if (!selected) return;

  const root = rootOf(control);
  const valueSlot = root.querySelector("[data-slot='value']");
  if (valueSlot instanceof HTMLElement && valueSlot.childElementCount === 0) {
    valueSlot.textContent = labelOf(selected);
  }

  const hidden = root.querySelector("input[data-slot='input']");
  if (hidden instanceof HTMLInputElement) hidden.value = valueOf(selected);
}

/** @param {HTMLElement} control */
function openSelect(control) {
  sync(control);

  const { panel, listbox } = parts(control);
  if (!panel || !listbox) return;

  resetFilter(listbox);
  setExpanded(control, true);

  const selected = selectedOptions(listbox)[0] ?? firstOption(listbox);
  highlight(listbox, selected, control);
  updateScrollButtons(panel);
}

/** @param {HTMLElement} control @param {boolean} focusTrigger */
function closeSelect(control, focusTrigger) {
  const { listbox } = parts(control);
  stopScroll();
  setExpanded(control, false);
  if (listbox) highlight(listbox, null, control);
  if (focusTrigger) control.focus();
}

/** @param {HTMLElement} control @param {Element} option */
function choose(control, option) {
  const { listbox } = parts(control);
  if (!listbox) return;

  selectOption(listbox, option, false);

  const root = rootOf(control);
  const valueSlot = root.querySelector("[data-slot='value']");
  if (valueSlot instanceof HTMLElement && valueSlot.childElementCount === 0) {
    valueSlot.textContent = labelOf(option);
  }
  setPlaceholder(control, false);

  const hidden = root.querySelector("input[data-slot='input']");
  if (hidden instanceof HTMLInputElement) hidden.value = valueOf(option);

  emit(root, "change", { value: valueOf(option) });
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

on("scroll", ".select [role='listbox']", (event, target) => {
  const panel = target.closest("[data-popover]");
  if (panel instanceof HTMLElement) updateScrollButtons(panel);
});

on("pointerover", ".select [data-slot='scroll-up'], .select [data-slot='scroll-down']", (event, target) => {
  if (target instanceof HTMLElement) startScroll(target);
});

on("pointerout", ".select [data-slot='scroll-up'], .select [data-slot='scroll-down']", (event, target) => {
  if (!(target instanceof HTMLElement) || !(event instanceof PointerEvent)) return;
  if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
  stopScroll();
});

on("click", ".select [data-slot='scroll-up'], .select [data-slot='scroll-down']", (event, target) => {
  if (!(target instanceof HTMLElement)) return;
  const panel = target.closest("[data-popover]");
  if (!(panel instanceof HTMLElement)) return;
  const direction = target.getAttribute("data-slot") === "scroll-up" ? -1 : 1;
  stopScroll();
  scrollStep(panel, direction);
  event.preventDefault();
  return true;
});

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

if (typeof document !== "undefined") {
  for (const control of document.querySelectorAll(".select [role='combobox']")) {
    if (control instanceof HTMLElement) sync(control);
  }
}
