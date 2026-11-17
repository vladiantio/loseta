const announce = (message: string): void => {
  let region = document.querySelector("[data-copy-status]");
  if (!region) {
    region = document.createElement("span");
    region.setAttribute("data-copy-status", "");
    region.setAttribute("role", "status");
    region.className = "sr-only";
    document.body.append(region);
  }
  region.textContent = "";
  requestAnimationFrame(() => {
    region.textContent = message;
  });
};

const popoverTrigger = (popover: Element): HTMLElement | null => {
  const root = popover.closest("[data-demo]");
  return (
    root?.querySelector<HTMLElement>(
      "[data-demo-trigger], [data-demo-menu-trigger]"
    ) ?? null
  );
};

const restorePopoverFocus = (popover: Element): void => {
  if (popover.getAttribute("role") !== "dialog") return;
  if (
    !(popover instanceof HTMLElement) ||
    !popover.contains(document.activeElement)
  ) {
    return;
  }
  popoverTrigger(popover)?.focus();
};

const focusPopover = (popover: Element): void => {
  if (popover.getAttribute("role") !== "dialog") return;
  if (!(popover instanceof HTMLElement)) return;

  const target =
    popover.querySelector<HTMLElement>(
      "input, select, textarea, button, a[href], [tabindex]:not([tabindex='-1'])"
    ) ?? popover;

  const focus = (): void => {
    if (popover.getAttribute("aria-hidden") !== "false") return;
    const active = document.activeElement;
    if (active !== document.body && active !== popoverTrigger(popover)) return;
    target.focus();
  };

  const duration = Number.parseFloat(getComputedStyle(popover).transitionDuration);
  if (Number.isFinite(duration) && duration > 0) {
    // visibility is discrete in the panel transition, so focus after it flips.
    setTimeout(focus, duration * 1000);
  } else {
    setTimeout(focus, 0);
  }
};

const triggerPanel = (trigger: Element): Element | null => {
  if (trigger.hasAttribute("data-demo-menu-trigger")) {
    return trigger.parentElement?.querySelector("[data-popover]") ?? null;
  }
  if (trigger.hasAttribute("data-demo-select-trigger")) {
    return trigger.closest(".select")?.querySelector("[data-popover]") ?? null;
  }
  if (trigger.hasAttribute("data-demo-combobox-input")) {
    return trigger.closest(".combobox")?.querySelector("[data-popover]") ?? null;
  }
  return trigger.closest("[data-demo]")?.querySelector("[data-popover]") ?? null;
};

const syncTriggerState = (): void => {
  document
    .querySelectorAll(
      "[data-demo-trigger], [data-demo-menu-trigger], [data-demo-select-trigger], [data-demo-combobox-input]"
    )
    .forEach((trigger) => {
      const panel = triggerPanel(trigger);
      trigger.setAttribute(
        "aria-expanded",
        panel?.getAttribute("aria-hidden") === "false" ? "true" : "false"
      );
    });
};

const closeAllPopovers = (except?: Element): void => {
  document.querySelectorAll("[data-demo] [data-popover]").forEach((popover) => {
    if (popover === except) return;
    // Keep the ancestor panels of an open submenu visible.
    if (except && popover.contains(except)) return;
    restorePopoverFocus(popover);
    popover.setAttribute("aria-hidden", "true");
  });
  document.querySelectorAll("[data-demo] .context-menu").forEach((menu) => {
    if (menu === except) return;
    if (except && menu.contains(except)) return;
    menu.setAttribute("aria-hidden", "true");
  });
  syncTriggerState();
};

const optionLabel = (option: Element): string =>
  option.querySelector("[data-slot='text']")?.textContent?.trim() ?? "";

const filterOptions = (root: Element, query: string): void => {
  const options = [...root.querySelectorAll<HTMLElement>('[role="option"]')];
  let visible = 0;

  for (const option of options) {
    const match = optionLabel(option).toLowerCase().includes(query);
    option.toggleAttribute("hidden", !match);
    if (match) visible += 1;
  }

  root.querySelectorAll<HTMLElement>('[role="group"]').forEach((group) => {
    const anyVisible = [
      ...group.querySelectorAll<HTMLElement>('[role="option"]')
    ].some((option) => !option.hasAttribute("hidden"));
    group.toggleAttribute("hidden", !anyVisible);
  });

  root
    .querySelector<HTMLElement>("[data-slot='empty']")
    ?.toggleAttribute("hidden", visible > 0);
};

const questionnaireStep = (button: Element): void => {
  const root = button.closest(".questionnaire");
  if (!(root instanceof HTMLElement)) return;

  const steps = [...root.querySelectorAll<HTMLElement>("[data-slot='item']")];
  if (steps.length === 0) return;

  const current = Math.max(
    0,
    steps.findIndex((step) => step.getAttribute("aria-current") === "step")
  );
  const next = button.hasAttribute("data-demo-questionnaire-prev")
    ? current - 1
    : current + 1;
  if (next < 0 || next >= steps.length) return;

  steps.forEach((step, index) => {
    step.hidden = index !== next;
    if (index === next) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });

  const progress = root.querySelector<HTMLProgressElement>("progress");
  if (progress) {
    progress.value = next + 1;
    progress.textContent = `${next + 1} of ${steps.length}`;
  }

  const label = root.querySelector<HTMLElement>("[data-slot='progress-label']");
  if (label) label.textContent = `Question ${next + 1} of ${steps.length}`;

  const previous = root.querySelector<HTMLButtonElement>(
    "[data-demo-questionnaire-prev]"
  );
  if (previous) previous.disabled = next === 0;

  const forward = root.querySelector<HTMLButtonElement>(
    "[data-demo-questionnaire-next]"
  );
  if (forward) forward.disabled = next === steps.length - 1;

  steps[next]
    .querySelector<HTMLElement>("input, button, select, textarea")
    ?.focus();
};

const updateMessageScroller = (scroller: Element): void => {
  const viewport = scroller.querySelector<HTMLElement>(
    ".message-scroller-viewport"
  );
  const jump = scroller.querySelector<HTMLElement>("[data-slot='jump']");
  if (!viewport || !jump) return;

  const distance =
    viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
  jump.hidden = distance < 24;
};

const refreshMessageScrollers = (): void => {
  document
    .querySelectorAll<HTMLElement>("[data-demo='message-scroller']")
    .forEach(updateMessageScroller);
};

const refreshIndeterminateCheckboxes = (): void => {
  document
    .querySelectorAll<HTMLInputElement>("[data-demo-indeterminate]")
    .forEach((input) => {
      input.indeterminate = true;
    });
};

const onClick = async (event: MouseEvent): Promise<void> => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const copy = target.closest("[data-copy], [data-demo-copy]");
  if (copy) {
    const block = copy.closest(".code-block, .install-command");
    const manager = document.documentElement.dataset.packageManager ?? "pnpm";
    const code =
      block?.querySelector(`[data-package-manager-panel="${manager}"] code`) ??
      block?.querySelector("code");
    if (code) {
      try {
        const lines = code.querySelectorAll("[data-slot='line']");
        const text =
          lines.length > 0
            ? Array.from(lines, (line) => line.textContent ?? "").join("\n")
            : code instanceof HTMLElement
              ? code.innerText
              : (code.textContent ?? "");
        await navigator.clipboard.writeText(text);
        const iconCopy = copy.hasAttribute("data-copy-icon") || Boolean(copy.querySelector("svg"));
        const previousText = copy.textContent;
        const previousLabel = copy.getAttribute("aria-label");
        if (iconCopy) {
          copy.setAttribute("data-copied", "true");
          copy.setAttribute("aria-label", "Copied");
        } else {
          copy.textContent = "Copied";
        }
        announce("Copied");
        setTimeout(() => {
          if (iconCopy) {
            copy.removeAttribute("data-copied");
            if (previousLabel) copy.setAttribute("aria-label", previousLabel);
          } else {
            copy.textContent = previousText;
          }
        }, 1500);
      } catch {
        announce("Copy failed");
      }
    }
    return;
  }

  const wrap = target.closest("[data-demo-wrap]");
  if (wrap) {
    const block = wrap.closest('[data-demo="code-block"]');
    const pre = block?.querySelector("pre");
    if (pre) {
      const next = !pre.hasAttribute("data-wrap");
      pre.toggleAttribute("data-wrap", next);
      wrap.setAttribute("aria-pressed", String(next));
    }
    return;
  }

  const open = target.closest("[data-open-dialog]");
  if (open) {
    const dialog = document.getElementById(open.getAttribute("data-open-dialog") ?? "");
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[autofocus]")?.focus();
    }
    return;
  }

  const close = target.closest("[data-close-dialog]");
  if (close) {
    const dialog = close.closest("dialog");
    if (dialog instanceof HTMLDialogElement) dialog.close();
    return;
  }

  const toggle = target.closest("[data-demo-toggle]");
  if (toggle instanceof HTMLButtonElement) {
    if (toggle.disabled) return;
    const pressed = toggle.getAttribute("aria-pressed") === "true";
    toggle.setAttribute("aria-pressed", String(!pressed));
    return;
  }

  const carouselButton = target.closest(
    "[data-demo-carousel-prev], [data-demo-carousel-next]"
  );
  if (carouselButton) {
    const carousel = carouselButton.closest(".carousel");
    const viewport = carousel?.querySelector<HTMLElement>(".carousel-viewport");
    if (viewport) {
      const vertical = carousel?.getAttribute("data-orientation") === "vertical";
      const direction = carouselButton.hasAttribute("data-demo-carousel-next") ? 1 : -1;
      viewport.scrollBy({
        left: vertical ? 0 : direction * viewport.clientWidth,
        top: vertical ? direction * viewport.clientHeight : 0,
        behavior: "smooth"
      });
    }
    return;
  }

  const carouselGo = target.closest("[data-demo-carousel-go]");
  if (carouselGo) {
    const carousel = carouselGo.closest(".carousel");
    const viewport = carousel?.querySelector<HTMLElement>(".carousel-viewport");
    const items = viewport?.querySelectorAll<HTMLElement>(".carousel-item");
    const index = Number(carouselGo.getAttribute("data-demo-carousel-go"));
    const item = items?.[index];
    if (viewport && item) {
      viewport.scrollTo({
        left: item.offsetLeft,
        top: item.offsetTop,
        behavior: "smooth"
      });
      carousel
        ?.querySelectorAll("[data-demo-carousel-go]")
        .forEach((dot) =>
          dot.setAttribute(
            "aria-current",
            dot === carouselGo ? "true" : "false"
          )
        );
    }
    return;
  }

  const toastClose = target.closest("[data-demo-toast-close]");
  if (toastClose) {
    toastClose.closest(".toast")?.remove();
    return;
  }

  const questionnaire = target.closest(
    "[data-demo-questionnaire-next], [data-demo-questionnaire-prev]"
  );
  if (questionnaire) {
    questionnaireStep(questionnaire);
    return;
  }

  const scrollEnd = target.closest("[data-demo-scroll-end]");
  if (scrollEnd) {
    const scroller = scrollEnd.closest(".message-scroller");
    const viewport = scroller?.querySelector<HTMLElement>(
      ".message-scroller-viewport"
    );
    if (scroller && viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      updateMessageScroller(scroller);
    }
    return;
  }

  const clear = target.closest("[data-demo-clear]");
  if (clear) {
    const root = clear.closest(".combobox");
    const input = root?.querySelector<HTMLInputElement>("input");
    root
      ?.querySelectorAll('[role="option"]')
      .forEach((option) => option.setAttribute("aria-selected", "false"));
    root?.querySelector("[data-popover]")?.setAttribute("aria-hidden", "false");
    if (input) {
      input.value = "";
      input.setAttribute("aria-expanded", "true");
      input.focus();
    }
    if (root) filterOptions(root, "");
    return;
  }

  const selectTrigger = target.closest("[data-demo-select-trigger]");
  if (selectTrigger) {
    const root = selectTrigger.closest(".select");
    const popover = root?.querySelector("[data-popover]");
    if (popover) {
      const willOpen = popover.getAttribute("aria-hidden") === "true";
      closeAllPopovers(popover);
      popover.setAttribute("aria-hidden", willOpen ? "false" : "true");
      selectTrigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    }
    return;
  }

  const comboboxInput = target.closest("[data-demo-combobox-input]");
  if (comboboxInput instanceof HTMLInputElement) {
    const root = comboboxInput.closest(".combobox");
    const popover = root?.querySelector("[data-popover]");
    if (popover) {
      closeAllPopovers(popover);
      popover.setAttribute("aria-hidden", "false");
      comboboxInput.setAttribute("aria-expanded", "true");
    }
    return;
  }

  const option = target.closest("[data-demo-option]");
  if (option) {
    if (option.getAttribute("aria-disabled") === "true") return;
    const root = option.closest(".select, .combobox, .command");
    if (!root) return;

    const listbox = option.closest('[role="listbox"]');
    const multiple = listbox?.getAttribute("aria-multiselectable") === "true";

    if (multiple) {
      const selected = option.getAttribute("aria-selected") === "true";
      option.setAttribute("aria-selected", selected ? "false" : "true");
    } else {
      root.querySelectorAll('[role="option"]').forEach((item) => {
        item.setAttribute("aria-selected", item === option ? "true" : "false");
      });
    }

    if (root.classList.contains("select")) {
      const value = root.querySelector("[data-slot='value']");
      if (value) {
        value.textContent = optionLabel(option);
        value.removeAttribute("data-placeholder");
      }
      root.querySelector("[data-popover]")?.setAttribute("aria-hidden", "true");
      const trigger = root.querySelector<HTMLElement>("[data-demo-select-trigger]");
      trigger?.setAttribute("aria-expanded", "false");
      trigger?.focus();
    } else if (root.classList.contains("combobox")) {
      const input = root.querySelector<HTMLInputElement>("input");
      const popover = root.querySelector("[data-popover]");
      if (input && !multiple) input.value = optionLabel(option);
      if (!multiple) {
        popover?.setAttribute("aria-hidden", "true");
        input?.setAttribute("aria-expanded", "false");
      }
      if (input) {
        input.dataset.suppressOpen = "true";
        input.focus();
        delete input.dataset.suppressOpen;
      }
    } else if (root.classList.contains("command")) {
      option.closest("dialog")?.close();
    }
    return;
  }

  const trigger = target.closest("[data-demo-trigger], [data-demo-menu-trigger]");
  if (trigger) {
    const root = trigger.closest("[data-demo]");
    const popover = trigger.hasAttribute("data-demo-menu-trigger")
      ? trigger.parentElement?.querySelector("[data-popover]")
      : root?.querySelector("[data-popover]");
    if (popover) {
      const willOpen = popover.getAttribute("aria-hidden") === "true";
      if (!willOpen) restorePopoverFocus(popover);
      closeAllPopovers(popover);
      popover.setAttribute("aria-hidden", willOpen ? "false" : "true");
      trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      if (willOpen) focusPopover(popover);
    }
    return;
  }

  const tab = target.closest('[role="tab"]');
  if (tab) {
    const tabs = tab.closest(".tabs");
    if (tabs) {
      tabs.querySelectorAll<HTMLElement>('[role="tab"]').forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", selected ? "true" : "false");
        item.setAttribute("tabindex", selected ? "0" : "-1");
      });
      tabs.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      });
    }
    return;
  }

  if (
    !target.closest(
      "[data-popover], [data-demo-trigger], [data-demo-menu-trigger], [data-demo-select-trigger], [data-demo-combobox-input]"
    )
  ) {
    closeAllPopovers();
  }
};

const onKeyDown = (event: KeyboardEvent): void => {
  if (event.key === "Escape") {
    closeAllPopovers();
    document.querySelectorAll<HTMLDialogElement>("dialog[open]").forEach((dialog) => {
      dialog.close();
    });
  }
};

const onContextMenu = (event: MouseEvent): void => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const area = target.closest("[data-demo-context]");
  if (!area) return;
  const menu = area.querySelector<HTMLElement>(".context-menu");
  if (!menu) return;

  event.preventDefault();
  closeAllPopovers(menu);
  menu.style.setProperty("--context-x", `${event.clientX}px`);
  menu.style.setProperty("--context-y", `${event.clientY}px`);
  menu.setAttribute("aria-hidden", "false");
  menu
    .querySelector<HTMLElement>(
      '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'
    )
    ?.focus();
};

const onInput = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (
    !target.matches("[data-demo-combobox-input], [data-demo-command-input]")
  ) {
    return;
  }
  const root = target.closest(".combobox, .command");
  if (root) filterOptions(root, target.value.trim().toLowerCase());
};

const onFocusIn = (event: FocusEvent): void => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (!target.matches("[data-demo-combobox-input]")) return;
  if (target.dataset.suppressOpen) return;
  const root = target.closest(".combobox");
  const popover = root?.querySelector("[data-popover]");
  if (popover) {
    closeAllPopovers(popover);
    popover.setAttribute("aria-hidden", "false");
    target.setAttribute("aria-expanded", "true");
  }
};

const onScroll = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const scroller = target.closest("[data-demo='message-scroller']");
  if (scroller) updateMessageScroller(scroller);
};

let mounted = false;

/** Demo-only interactions. Registered once; the docs client never re-mounts it. */
export function mountDemo(): void {
  if (mounted) return;
  mounted = true;
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("contextmenu", onContextMenu);
  document.addEventListener("input", onInput);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("scroll", onScroll, true);
  document.addEventListener("astro:page-load", () => {
    refreshMessageScrollers();
    refreshIndeterminateCheckboxes();
  });
  refreshMessageScrollers();
  refreshIndeterminateCheckboxes();
}
