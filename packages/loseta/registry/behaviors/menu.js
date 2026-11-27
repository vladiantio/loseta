// @ts-check

import {
  emit,
  firstEnabled,
  focusWhenVisible,
  init,
  isDisabled,
  isRTL,
  lastEnabled,
  nextEnabled,
  on,
  onDocument,
  panelFor,
  typeaheadTarget
} from "./core.js";

const ITEM_SELECTOR =
  "[role='menuitem'], [role='menuitemcheckbox'], [role='menuitemradio']";

/**
 * @typedef {object} MenuEntry
 * @property {HTMLElement} trigger
 * @property {HTMLElement} panel
 * @property {Element} root
 */

/** @type {Map<HTMLElement, MenuEntry>} */
const openMenus = new Map();
/** @type {WeakMap<Element, number>} */
const hoverTimers = new WeakMap();
/** @type {WeakMap<Element, number>} */
const closeTimers = new WeakMap();

/** @param {Element | null | undefined} element @returns {element is HTMLElement} */
function isHTMLElement(element) {
  return element instanceof HTMLElement;
}

/** @param {Element} trigger */
function contextPanelFor(trigger) {
  const child = trigger.querySelector(":scope > .context-menu");
  return isHTMLElement(child) ? child : null;
}

/** @param {Element} trigger */
function isContextArea(trigger) {
  return trigger.matches("[aria-haspopup='menu'][aria-controls]") && contextPanelFor(trigger) !== null;
}

/** @param {Element} trigger */
function menuPanel(trigger) {
  const byId = panelFor(trigger);
  if (isHTMLElement(byId)) return byId;
  const parent = trigger.parentElement;
  const sibling = parent?.querySelector(":scope > [data-popover]");
  return isHTMLElement(sibling) ? sibling : null;
}

/** @param {Element} panel */
function menuOf(panel) {
  if (panel.matches("[role='menu']")) return /** @type {HTMLElement} */ (panel);
  const menu = panel.querySelector("[role='menu']");
  return isHTMLElement(menu) ? menu : null;
}

/** @param {Element} menu */
function itemsOf(menu) {
  return [...menu.querySelectorAll(ITEM_SELECTOR)].filter(
    (item) => item.closest("[role='menu']") === menu
  );
}

/** @param {Element} menu */
function panelOfMenu(menu) {
  if (menu.matches("[data-popover], .context-menu")) {
    return /** @type {HTMLElement} */ (menu);
  }
  const panel = menu.closest("[data-popover], .context-menu");
  return isHTMLElement(panel) ? panel : null;
}

/** @param {Element} trigger @param {Element} panel */
function rootFor(trigger, panel) {
  const component = trigger.closest(".dropdown-menu, .menubar, .navigation-menu");
  if (component) return component;
  const context = trigger.closest(".context-menu") ?? panel.closest(".context-menu");
  return context ?? trigger;
}

/** @param {Element} item */
function focusItem(item) {
  const menu = item.closest("[role='menu']");
  if (menu) {
    for (const candidate of itemsOf(menu)) {
      candidate.setAttribute("tabindex", "-1");
      candidate.removeAttribute("data-highlighted");
    }
  }
  item.setAttribute("tabindex", "0");
  item.setAttribute("data-highlighted", "");
  focusWhenVisible(item);
}

/** @param {HTMLElement} trigger @param {boolean} open */
function setTriggerExpanded(trigger, open) {
  if (trigger.matches("button") || trigger.hasAttribute("aria-expanded")) {
    trigger.setAttribute("aria-expanded", String(open));
  }
}

/** @param {MenuEntry} entry @param {boolean} focusTrigger */
function closeEntry(entry, focusTrigger) {
  if (!openMenus.has(entry.panel)) return;

  for (const [panel, child] of [...openMenus]) {
    if (panel !== entry.panel && entry.panel.contains(panel)) {
      closeEntry(child, false);
    }
  }

  clearHover(entry.trigger);
  clearClose(entry.trigger);
  clearClose(entry.panel);
  for (const trigger of entry.panel.querySelectorAll("[aria-haspopup='menu']")) {
    clearHover(trigger);
    clearClose(trigger);
  }
  for (const item of entry.panel.querySelectorAll(ITEM_SELECTOR)) {
    item.removeAttribute("data-highlighted");
  }

  openMenus.delete(entry.panel);
  setTriggerExpanded(entry.trigger, false);
  entry.panel.setAttribute("aria-hidden", "true");
  emit(entry.root, "toggle", { open: false });
  if (focusTrigger) entry.trigger.focus();
}

/** @param {HTMLElement} trigger @param {HTMLElement} panel @param {"first" | "last" | "none"} focus */
function openEntry(trigger, panel, focus) {
  clearClose(trigger);
  clearClose(panel);

  const existing = openMenus.get(panel);
  if (existing) {
    if (focus !== "none") {
      const menu = menuOf(panel);
      if (menu) {
        const items = itemsOf(menu);
        const target = focus === "last" ? lastEnabled(items) : firstEnabled(items);
        if (target) focusItem(target);
      }
    }
    return;
  }

  for (const [otherPanel, entry] of [...openMenus]) {
    if (otherPanel === panel) continue;
    if (otherPanel.contains(panel)) continue;
    closeEntry(entry, false);
  }

  const root = rootFor(trigger, panel);
  if (root instanceof Element) {
    root.setAttribute("data-dropdown-menu-initialized", "");
  }
  setTriggerExpanded(trigger, true);
  panel.setAttribute("aria-hidden", "false");
  openMenus.set(panel, { trigger, panel, root });
  emit(root, "toggle", { open: true });

  const menu = menuOf(panel);
  if (menu) {
    const items = itemsOf(menu);
    for (const item of items) item.setAttribute("tabindex", "-1");
    if (focus !== "none") {
      const target = focus === "last" ? lastEnabled(items) : firstEnabled(items);
      if (target) focusItem(target);
    }
  }
}

/** @param {boolean} focusTrigger */
function closeAll(focusTrigger) {
  const entries = [...openMenus.values()];
  for (const entry of entries) closeEntry(entry, focusTrigger);
}

/** @param {HTMLElement} item */
function topTriggerFor(item) {
  const menu = item.closest("[role='menu']");
  const panel = menu ? panelOfMenu(menu) : null;
  let top = panel ? openMenus.get(panel) : undefined;
  if (!top) return null;

  for (const entry of openMenus.values()) {
    if (entry.panel !== top.panel && entry.panel.contains(top.panel)) {
      top = entry;
    }
  }
  return top.trigger;
}

/** @param {HTMLElement} item */
function activateItem(item) {
  const role = item.getAttribute("role");
  if (role === "menuitemcheckbox") {
    const checked = item.getAttribute("aria-checked") === "true";
    item.setAttribute("aria-checked", String(!checked));
    emit(item, "change", { checked: !checked });
  } else if (role === "menuitemradio") {
    const menu = item.closest("[role='menu']");
    const group = item.closest("[role='group']") ?? menu;
    for (const sibling of group?.querySelectorAll("[role='menuitemradio']") ?? []) {
      if (sibling !== item) sibling.setAttribute("aria-checked", "false");
    }
    item.setAttribute("aria-checked", "true");
    emit(item, "change", { checked: true });
  }

  const top = topTriggerFor(item);
  closeAll(false);
  top?.focus();
}

/** @param {Element} element */
function clearHover(element) {
  const timer = hoverTimers.get(element);
  if (timer !== undefined) {
    clearTimeout(timer);
    hoverTimers.delete(element);
  }
}

/** @param {Element} element @param {number} delay @param {() => void} callback */
function scheduleHover(element, delay, callback) {
  clearHover(element);
  const timer = window.setTimeout(() => {
    hoverTimers.delete(element);
    callback();
  }, delay);
  hoverTimers.set(element, timer);
}

/** @param {Element} element */
function clearClose(element) {
  const timer = closeTimers.get(element);
  if (timer !== undefined) {
    clearTimeout(timer);
    closeTimers.delete(element);
  }
}

/** @param {Element} element @param {number} delay @param {() => void} callback */
function scheduleClose(element, delay, callback) {
  clearClose(element);
  const timer = window.setTimeout(() => {
    closeTimers.delete(element);
    callback();
  }, delay);
  closeTimers.set(element, timer);
}

/** @param {HTMLElement} menubar */
function menubarItems(menubar) {
  return [...menubar.querySelectorAll("[role='menuitem'][aria-haspopup='menu']")].filter(
    (trigger) => !trigger.closest("[role='menu']")
  );
}

/** @param {HTMLElement} menubar */
function menubarTriggers(menubar) {
  return menubarItems(menubar).filter((trigger) => !isDisabled(trigger));
}

/** @param {Document | Element} root */
function initMenubarTabs(root) {
  for (const menubar of root.querySelectorAll("[role='menubar']")) {
    if (!isHTMLElement(menubar)) continue;

    const triggers = menubarItems(menubar);
    const first = menubarTriggers(menubar)[0] ?? triggers[0];

    for (const trigger of triggers) {
      trigger.setAttribute("tabindex", trigger === first ? "0" : "-1");
    }
  }
}

// Clicking a menu trigger, sub-trigger or menubar item toggles its panel.
on(
  "click",
  "[aria-haspopup='menu']",
  (event, target) => {
    if (!isHTMLElement(target) || isContextArea(target)) return;
    const panel = menuPanel(target);
    if (!panel) return;

    clearHover(target);
    const existing = openMenus.get(panel);
    if (existing) {
      closeEntry(existing, true);
    } else {
      openEntry(target, panel, "first");
    }

    event.preventDefault();
    return true;
  },
  10
);

// Navigation menu triggers are disclosure buttons without aria-haspopup.
on(
  "click",
  ".navigation-menu button[aria-controls]",
  (event, target) => {
    if (!isHTMLElement(target)) return;
    const panel = panelFor(target);
    if (!isHTMLElement(panel)) return;

    const existing = openMenus.get(panel);
    if (existing) {
      closeEntry(existing, true);
    } else {
      openEntry(target, panel, "none");
    }

    event.preventDefault();
    return true;
  },
  5
);

on("keydown", ".navigation-menu button[aria-controls]", (event, target) => {
  if (!(event instanceof KeyboardEvent) || event.key !== "ArrowDown") return;
  if (!isHTMLElement(target)) return;
  const panel = panelFor(target);
  if (!isHTMLElement(panel)) return;

  openEntry(target, panel, "none");
  const first = panel.querySelector("a[href], button:not([disabled])");
  if (isHTMLElement(first)) focusWhenVisible(first);
  event.preventDefault();
  return true;
});

// Top-level dropdown triggers open with the keyboard.
on("keydown", "[aria-haspopup='menu']", (event, target) => {
  if (!(event instanceof KeyboardEvent) || !isHTMLElement(target)) return;
  if (isContextArea(target)) return;
  if (target.closest("[role='menu']") || target.closest(".menubar")) return;

  const opens =
    event.key === "ArrowDown" ||
    event.key === "ArrowUp" ||
    event.key === "Enter" ||
    event.key === " ";
  if (!opens) return;

  const panel = menuPanel(target);
  if (!panel) return;
  openEntry(target, panel, event.key === "ArrowUp" ? "last" : "first");
  event.preventDefault();
  return true;
});

// Menu keyboard navigation.
on(
  "keydown",
  "[role='menu']",
  (event, menuElement) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (!(event.target instanceof HTMLElement)) return;
    if (!event.target.matches(ITEM_SELECTOR)) return;

    const menu = menuElement;
    const item = event.target;
    const items = itemsOf(menu);
    const rtl = isRTL(menu);
    const openKey = rtl ? "ArrowLeft" : "ArrowRight";
    const closeKey = rtl ? "ArrowRight" : "ArrowLeft";
    const panel = panelOfMenu(menu);

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const target = nextEnabled(items, item, event.key === "ArrowDown" ? 1 : -1);
      if (target) focusItem(target);
      event.preventDefault();
      return true;
    }

    if (event.key === "Home" || event.key === "End") {
      const target = event.key === "Home" ? firstEnabled(items) : lastEnabled(items);
      if (target) focusItem(target);
      event.preventDefault();
      return true;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (item.matches("[aria-haspopup='menu']")) {
        const submenu = menuPanel(item);
        if (submenu) openEntry(item, submenu, "first");
      } else {
        item.click();
      }
      return true;
    }

    if (event.key === openKey && item.matches("[aria-haspopup='menu']")) {
      const submenu = menuPanel(item);
      if (submenu) openEntry(item, submenu, "first");
      event.preventDefault();
      return true;
    }

    if (event.key === closeKey && panel) {
      const entry = openMenus.get(panel);
      const parentMenu = menu.parentElement?.closest("[role='menu']");
      if (entry && parentMenu) {
        closeEntry(entry, true);
        event.preventDefault();
        return true;
      }
    }

    if ((event.key === openKey || event.key === closeKey) && panel) {
      const entry = openMenus.get(panel);
      const parentMenu = menu.parentElement?.closest("[role='menu']");
      const root = entry?.root;

      if (
        entry &&
        !parentMenu &&
        root instanceof HTMLElement &&
        root.matches("[role='menubar']")
      ) {
        const triggers = menubarTriggers(root);
        const index = triggers.indexOf(entry.trigger);

        if (index !== -1 && triggers.length > 1) {
          const step = event.key === openKey ? 1 : -1;
          const next = triggers[(index + step + triggers.length) % triggers.length];

          if (isHTMLElement(next)) {
            const nextPanel = menuPanel(next);

            if (nextPanel) {
              openEntry(next, nextPanel, "first");
              event.preventDefault();
              return true;
            }
          }
        }
      }
    }

    if (event.key === "Tab") {
      closeAll(false);
      return true;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const searchable = items.filter(
        (candidate) => !candidate.matches(":disabled, [aria-disabled='true']")
      );
      const target = typeaheadTarget(menu, event.key, searchable, item);
      if (target) {
        focusItem(target);
        event.preventDefault();
        return true;
      }
    }
  },
  10
);

// Menubar top-level arrows and opening keys.
on("keydown", "[role='menubar']", (event, menubar) => {
  if (!(event instanceof KeyboardEvent)) return;
  if (!(event.target instanceof HTMLElement)) return;
  if (!event.target.matches("[role='menuitem'][aria-haspopup='menu']")) return;
  if (event.target.closest("[role='menu']")) return;

  const triggers = menubarTriggers(/** @type {HTMLElement} */ (menubar));
  const index = triggers.indexOf(event.target);
  const rtl = isRTL(menubar);
  const nextKey = rtl ? "ArrowLeft" : "ArrowRight";
  const previousKey = rtl ? "ArrowRight" : "ArrowLeft";

  if (event.key === nextKey || event.key === previousKey) {
    if (triggers.length === 0 || index === -1) return;
    const next =
      triggers[
        (index + (event.key === nextKey ? 1 : -1) + triggers.length) % triggers.length
      ];
    if (!isHTMLElement(next)) return;

    const open = [...openMenus.values()].some((entry) => entry.root === menubar);
    if (open) {
      const panel = menuPanel(next);
      if (panel) openEntry(next, panel, "first");
    } else {
      next.focus();
    }
    event.preventDefault();
    return true;
  }

  if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
    const panel = menuPanel(event.target);
    if (!panel) return;
    openEntry(event.target, panel, "first");
    event.preventDefault();
    return true;
  }

  if (event.key === "ArrowUp") {
    const panel = menuPanel(event.target);
    if (!panel) return;
    openEntry(event.target, panel, "last");
    event.preventDefault();
    return true;
  }
});

// Only the focused top-level trigger stays in the tab order.
on("focusin", ".menubar [role='menuitem'][aria-haspopup='menu']", (_event, target) => {
  if (!isHTMLElement(target) || target.closest("[role='menu']")) return;
  const menubar = target.closest("[role='menubar']");
  if (!isHTMLElement(menubar)) return;

  for (const trigger of menubarItems(menubar)) {
    trigger.setAttribute("tabindex", trigger === target ? "0" : "-1");
  }
});

// Menubar hover switching while a menu is open.
on("pointerover", ".menubar [role='menuitem'][aria-haspopup='menu']", (_event, target) => {
  if (!isHTMLElement(target) || target.closest("[role='menu']")) return;
  const menubar = target.closest("[role='menubar']");
  if (!menubar) return;
  const open = [...openMenus.values()].some((entry) => entry.root === menubar);
  if (!open) return;

  scheduleHover(target, 100, () => {
    const panel = menuPanel(target);
    if (panel) openEntry(target, panel, "first");
  });
});

// Pointer hover highlights one menu item at a time.
on(
  "pointerover",
  "[role='menu'] [role='menuitem'], [role='menu'] [role='menuitemcheckbox'], [role='menu'] [role='menuitemradio']",
  (_event, target) => {
    if (!isHTMLElement(target)) return;
    const menu = target.closest("[role='menu']");
    if (!menu) return;
    for (const item of itemsOf(menu)) item.removeAttribute("data-highlighted");
    if (isDisabled(target)) return;
    target.setAttribute("data-highlighted", "");
  }
);

on("pointerout", ITEM_SELECTOR, (event, target) => {
  if (!(event instanceof PointerEvent) || !isHTMLElement(target)) return;
  const next = event.relatedTarget;
  if (next instanceof Element && target.contains(next)) return;
  target.removeAttribute("data-highlighted");
});

on("pointerleave", "[role='menu']", (_event, menuElement) => {
  for (const item of itemsOf(menuElement)) item.removeAttribute("data-highlighted");
});

// Submenu hover opens a submenu without stealing focus.
on("pointerover", "[role='menu'] [aria-haspopup='menu']", (_event, target) => {
  if (!isHTMLElement(target)) return;
  clearClose(target);
  const panel = menuPanel(target);
  if (panel) clearClose(panel);
  const parentMenu = target.closest("[role='menu']");
  const parentPanel = parentMenu ? panelOfMenu(parentMenu) : null;
  if (!parentPanel || !openMenus.has(parentPanel)) return;

  scheduleHover(target, 150, () => {
    if (!openMenus.has(parentPanel)) return;
    const panel = menuPanel(target);
    if (panel && !openMenus.has(panel)) openEntry(target, panel, "none");
  });
});

on("pointerout", "[role='menu'] [aria-haspopup='menu']", (event, target) => {
  if (!(event instanceof PointerEvent) || !isHTMLElement(target)) return;
  clearHover(target);
  const panel = menuPanel(target);
  if (!panel || !openMenus.has(panel)) return;
  const next = event.relatedTarget;
  if (next instanceof Node && (target.contains(next) || panel.contains(next))) return;

  scheduleClose(panel, 150, () => {
    const entry = openMenus.get(panel);
    if (!entry) return;
    if (entry.panel.contains(document.activeElement)) return;
    closeEntry(entry, false);
  });
});

on("pointerover", "[data-popover]", (_event, target) => {
  if (!isHTMLElement(target)) return;
  clearClose(target);
  const entry = openMenus.get(target);
  if (entry) clearClose(entry.trigger);
});

on("pointerout", "[data-popover]", (event, target) => {
  if (!(event instanceof PointerEvent) || !isHTMLElement(target)) return;
  const entry = openMenus.get(target);
  if (!entry) return;
  const parentMenu = target.parentElement?.closest("[role='menu']");
  if (!parentMenu) return;
  const next = event.relatedTarget;
  if (next instanceof Node && (target.contains(next) || entry.trigger.contains(next))) return;

  scheduleClose(target, 150, () => {
    const current = openMenus.get(target);
    if (!current) return;
    if (current.panel.contains(document.activeElement)) return;
    closeEntry(current, false);
  });
});

on("pointerout", ".menubar [role='menuitem'][aria-haspopup='menu']", (event, target) => {
  if (!(event instanceof PointerEvent) || !isHTMLElement(target)) return;
  clearHover(target);
});

// Context menus open on right-click and Shift+F10 / the ContextMenu key.
on(
  "contextmenu",
  "[aria-haspopup='menu'][aria-controls]",
  (event, target) => {
    if (!(event instanceof MouseEvent) || !isHTMLElement(target) || !isContextArea(target)) {
      return;
    }
    const panel = contextPanelFor(target) ?? menuPanel(target);
    if (!panel) return;

    event.preventDefault();
    panel.style.setProperty("--context-x", `${event.clientX}px`);
    panel.style.setProperty("--context-y", `${event.clientY}px`);
    openEntry(target, panel, "first");
    return true;
  },
  20
);

on("keydown", "[aria-haspopup='menu'][aria-controls]", (event, target) => {
  if (!(event instanceof KeyboardEvent) || !isHTMLElement(target)) return;
  if (!isContextArea(target)) return;

  const keyboard =
    event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");
  if (!keyboard) return;

  const panel = contextPanelFor(target) ?? menuPanel(target);
  if (!panel) return;

  const rect = target.getBoundingClientRect();
  panel.style.setProperty("--context-x", `${rect.left + 8}px`);
  panel.style.setProperty("--context-y", `${rect.top + 8}px`);
  openEntry(target, panel, "first");
  event.preventDefault();
  return true;
});

// Menu item activation.
on(
  "click",
  "[role='menu'] [role='menuitem'], [role='menu'] [role='menuitemcheckbox'], [role='menu'] [role='menuitemradio']",
  (_event, target) => {
    if (!isHTMLElement(target)) return;
    if (target.matches("[aria-haspopup='menu']")) return;
    activateItem(target);
    return true;
  },
  0
);

// Escape closes the deepest menu and returns focus to its trigger.
onDocument(
  "keydown",
  (event) => {
    if (!(event instanceof KeyboardEvent) || event.key !== "Escape") return;
    const entries = [...openMenus.values()];
    const entry = entries[entries.length - 1];
    if (!entry) return;
    closeEntry(entry, true);
    event.preventDefault();
    return true;
  },
  30
);

// Outside pointerdown closes menus without moving focus.
onDocument("pointerdown", (event) => {
  if (!(event.target instanceof Node)) return;
  for (const entry of [...openMenus.values()]) {
    if (entry.panel.contains(event.target) || entry.trigger.contains(event.target)) {
      continue;
    }
    closeEntry(entry, false);
  }
});

// Focus leaving an open panel closes it.
on("focusout", "[role='menu']", (event, menuElement) => {
  if (!(event instanceof FocusEvent)) return;
  const next = event.relatedTarget;
  if (next === null) return;

  const panel = panelOfMenu(menuElement);
  if (!panel) return;
  const entry = openMenus.get(panel);
  if (!entry) return;

  if (next instanceof Node && menuElement.contains(next)) return;

  const parentMenu = menuElement.parentElement?.closest("[role='menu']");
  if (parentMenu) {
    closeEntry(entry, false);
    return;
  }

  if (next instanceof Node && entry.root.contains(next)) return;
  closeEntry(entry, false);
});

on("focusout", ".navigation-menu", (event, root) => {
  if (!(event instanceof FocusEvent)) return;
  const next = event.relatedTarget;
  if (next === null) return;
  if (next instanceof Node && root.contains(next)) return;
  for (const entry of [...openMenus.values()]) {
    if (entry.root === root) closeEntry(entry, false);
  }
});

if (typeof document !== "undefined") initMenubarTabs(document);
init();
