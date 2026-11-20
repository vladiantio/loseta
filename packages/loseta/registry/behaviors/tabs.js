// @ts-check

import {
  emit,
  firstEnabled,
  init,
  isDisabled,
  lastEnabled,
  nextEnabled,
  on,
  panelFor
} from "./core.js";

const TAB_SELECTOR = "[role='tab']";

/** @param {Element} tab */
function tablistOf(tab) {
  const tablist = tab.closest("[role='tablist']");
  return tablist instanceof HTMLElement ? tablist : null;
}

/** @param {Element} tablist */
function tabsOf(tablist) {
  return [...tablist.querySelectorAll(TAB_SELECTOR)].filter(
    (tab) => tab.closest("[role='tablist']") === tablist
  );
}

/** @param {Element} tab */
function rootOf(tab) {
  return tab.closest(".tabs") ?? tablistOf(tab) ?? tab;
}

/**
 * @param {Element} tab
 * @param {boolean} focus
 */
function selectTab(tab, focus) {
  const tablist = tablistOf(tab);
  if (!tablist) return;

  const tabs = tabsOf(tablist);
  for (const candidate of tabs) {
    const selected = candidate === tab;
    candidate.setAttribute("aria-selected", String(selected));
    candidate.setAttribute("tabindex", selected ? "0" : "-1");

    const panel = panelFor(candidate);
    if (panel instanceof HTMLElement) {
      panel.hidden = !selected;
    }
  }

  emit(rootOf(tab), "change", { value: tab.id });
  if (focus && tab instanceof HTMLElement) tab.focus();
}

on("click", ".tabs [role='tab']", (event, target) => {
  if (!(target instanceof HTMLElement) || isDisabled(target)) return;
  selectTab(target, false);
  event.preventDefault();
  return true;
});

on("keydown", ".tabs [role='tab']", (event, target) => {
  if (!(event instanceof KeyboardEvent)) return;
  if (!(target instanceof HTMLElement)) return;
  const tablist = tablistOf(target);
  if (!tablist) return;

  const tabs = tabsOf(tablist);
  const vertical = tablist.getAttribute("aria-orientation") === "vertical";
  const nextKey = vertical ? "ArrowDown" : "ArrowRight";
  const previousKey = vertical ? "ArrowUp" : "ArrowLeft";

  if (event.key === nextKey || event.key === previousKey) {
    const next = nextEnabled(
      tabs,
      target,
      event.key === nextKey ? 1 : -1
    );
    if (next instanceof HTMLElement) selectTab(next, true);
    event.preventDefault();
    return true;
  }

  if (event.key === "Home" || event.key === "End") {
    const next = event.key === "Home" ? firstEnabled(tabs) : lastEnabled(tabs);
    if (next instanceof HTMLElement) selectTab(next, true);
    event.preventDefault();
    return true;
  }
});

init();
