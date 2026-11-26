import { searchGroupOrder, searchPages } from "@/lib/search";
import type { SearchIndex, SearchResult } from "@/lib/search";
import type { PageBehavior } from "./lifecycle";

const suggestions: SearchResult[] = [
  {
    id: "suggested-installation",
    title: "Installation",
    context: "/docs/installation",
    href: "/docs/installation",
    group: "Guides",
    kind: "page",
    score: 0
  },
  {
    id: "suggested-components",
    title: "Components",
    context: "/docs/components",
    href: "/docs/components",
    group: "Components",
    kind: "page",
    score: 0
  },
  {
    id: "suggested-button",
    title: "Button",
    context: "/docs/components/button",
    href: "/docs/components/button",
    group: "Components",
    kind: "page",
    score: 0
  },
  {
    id: "suggested-dialog",
    title: "Dialog",
    context: "/docs/components/dialog",
    href: "/docs/components/dialog",
    group: "Components",
    kind: "page",
    score: 0
  },
  {
    id: "suggested-theming",
    title: "Theming",
    context: "/docs/theming",
    href: "/docs/theming",
    group: "Guides",
    kind: "page",
    score: 0
  },
  {
    id: "suggested-styles",
    title: "Styles",
    context: "/docs/styles",
    href: "/docs/styles",
    group: "Styles",
    kind: "page",
    score: 0
  },
  {
    id: "suggested-blocks",
    title: "Blocks",
    context: "/blocks",
    href: "/blocks",
    group: "Blocks",
    kind: "page",
    score: 0
  },
  {
    id: "suggested-typography",
    title: "Typography",
    context: "/docs/guidelines/typography",
    href: "/docs/guidelines/typography",
    group: "Guides",
    kind: "page",
    score: 0
  }
];

let indexPromise: Promise<SearchIndex> | null = null;

function loadIndex(): Promise<SearchIndex> {
  if (!indexPromise) {
    indexPromise = fetch("/search-index.json", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        const payload: unknown = await response.json();
        if (
          typeof payload !== "object" ||
          payload === null ||
          !("version" in payload) ||
          payload.version !== 1 ||
          !("pages" in payload) ||
          !Array.isArray(payload.pages)
        ) {
          throw new Error("Search index response is invalid.");
        }
        return payload as SearchIndex;
      })
      .catch((error: unknown) => {
        indexPromise = null;
        throw error;
      });
  }

  return indexPromise;
}

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    ((target instanceof HTMLElement && target.isContentEditable) ||
      Boolean(target.closest("input, textarea, select")))
  );
}

export const search: PageBehavior = {
  mount() {
    const dialog = document.querySelector<HTMLDialogElement>("[data-search-dialog]");
    const trigger = document.querySelector<HTMLButtonElement>("[data-search-trigger]");
    const input = dialog?.querySelector<HTMLInputElement>("[data-search-input]");
    const results = dialog?.querySelector<HTMLElement>("[data-search-results]");
    const clear = dialog?.querySelector<HTMLButtonElement>("[data-search-clear]");
    const shortcut = document.querySelector<HTMLElement>("[data-search-shortcut]");
    if (!dialog || !trigger || !input || !results || !clear) return;

    let index: SearchIndex | null = null;
    let activeIndex = -1;
    let optionId = 0;
    let destroyed = false;

    if (shortcut) {
      shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K";
    }

    const options = () =>
      Array.from(results.querySelectorAll<HTMLAnchorElement>("[data-search-result]"));

    const setActive = (nextIndex: number, scroll = true) => {
      const items = options();
      if (items.length === 0) {
        activeIndex = -1;
        input.removeAttribute("aria-activedescendant");
        return;
      }

      activeIndex = (nextIndex + items.length) % items.length;
      items.forEach((item, itemIndex) => {
        item.setAttribute("aria-selected", String(itemIndex === activeIndex));
      });
      const active = items[activeIndex];
      input.setAttribute("aria-activedescendant", active.id);
      if (scroll) active.scrollIntoView({ block: "nearest" });
    };

    const showMessage = (message: string, busy = false) => {
      activeIndex = -1;
      optionId = 0;
      input.removeAttribute("aria-activedescendant");
      results.replaceChildren();
      results.setAttribute("role", "status");
      results.setAttribute("aria-live", "polite");
      results.setAttribute("aria-busy", String(busy));

      const container = document.createElement("div");
      container.className = "docs-search-message";
      if (busy) {
        const spinner = document.createElement("span");
        spinner.className = "docs-search-spinner";
        spinner.setAttribute("aria-hidden", "true");
        container.append(spinner);
      }
      const text = document.createElement("span");
      text.textContent = message;
      container.append(text);
      results.append(container);
    };

    const renderGroups = (items: SearchResult[], groups: string[]) => {
      activeIndex = -1;
      optionId = 0;
      results.replaceChildren();
      results.setAttribute("role", "listbox");
      results.setAttribute("aria-label", "Search results");
      results.removeAttribute("aria-live");
      results.setAttribute("aria-busy", "false");
      results.scrollTop = 0;

      for (const [groupIndex, group] of groups.entries()) {
        const matches =
          group === "Suggested" ? items : items.filter((item) => item.group === group);
        if (matches.length === 0) continue;

        const groupElement = document.createElement("div");
        const labelId = `docs-search-group-${groupIndex}`;
        groupElement.setAttribute("role", "group");
        groupElement.setAttribute("aria-labelledby", labelId);
        groupElement.className = "docs-search-group";

        const label = document.createElement("div");
        label.id = labelId;
        label.className = "docs-search-group-label";
        label.textContent = group;
        groupElement.append(label);

        for (const result of matches) {
          const option = document.createElement("a");
          option.id = `docs-search-option-${optionId++}`;
          option.className = "docs-search-option";
          option.href = result.href;
          option.setAttribute("role", "option");
          option.setAttribute("aria-selected", "false");
          option.dataset.searchResult = "";
          option.dataset.searchKind = result.kind;

          const title = document.createElement("span");
          title.className = "docs-search-option-title";
          title.textContent = result.title;
          const context = document.createElement("span");
          context.className = "docs-search-option-context";
          context.textContent = result.context;
          option.append(title, context);
          groupElement.append(option);
        }

        results.append(groupElement);
      }

      setActive(0, false);
    };

    const renderQuery = () => {
      const query = input.value.trim();
      clear.hidden = input.value.length === 0;

      if (!query) {
        renderGroups(suggestions, ["Suggested"]);
        return;
      }
      if (!index) {
        showMessage("Loading search index…", true);
        return;
      }

      const matches = searchPages(index, query);
      if (matches.length === 0) {
        showMessage(`No results for “${query}”.`);
        return;
      }

      renderGroups(matches, searchGroupOrder);
    };

    const close = () => {
      if (dialog.open) dialog.close();
    };

    const toggle = () => {
      if (dialog.open) close();
      else trigger.click();
    };

    const open = () => {
      input.value = "";
      input.setAttribute("aria-expanded", "true");
      trigger.setAttribute("aria-expanded", "true");
      renderQuery();
      void loadIndex()
        .then((loadedIndex) => {
          if (destroyed) return;
          index = loadedIndex;
          renderQuery();
        })
        .catch(() => {
          if (destroyed) return;
          showMessage("Search could not be loaded. Close and reopen to try again.");
        });
    };

    const reset = () => {
      input.value = "";
      input.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      clear.hidden = true;
      activeIndex = -1;
      results.replaceChildren();
    };

    const onToggle = (event: Event) => {
      if (!(event instanceof CustomEvent) || event.detail?.open !== true) return;
      open();
    };

    const onInput = () => renderQuery();

    const onClear = () => {
      input.value = "";
      renderQuery();
      input.focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return;
      const items = options();

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (items.length === 0) return;
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex =
          activeIndex < 0 ? (direction === 1 ? 0 : items.length - 1) : activeIndex + direction;
        setActive(nextIndex);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        if (items.length > 0) setActive(event.key === "Home" ? 0 : items.length - 1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (activeIndex >= 0) items[activeIndex]?.click();
      } else if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    const onResultClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-search-result]")) close();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const option = event.target.closest<HTMLAnchorElement>("[data-search-result]");
      if (!option) return;
      const itemIndex = options().indexOf(option);
      if (itemIndex >= 0 && itemIndex !== activeIndex) setActive(itemIndex, false);
    };

    const onShortcut = (event: KeyboardEvent) => {
      if (event.repeat || event.isComposing) return;
      const key = event.key.toLowerCase();
      const commandKey = (event.metaKey || event.ctrlKey) && key === "k";
      const slashKey = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;

      if (commandKey) {
        if (isEditableTarget(event.target) && !dialog.open) return;
        event.preventDefault();
        toggle();
      } else if (slashKey) {
        if (isEditableTarget(event.target)) return;
        event.preventDefault();
        toggle();
      }
    };

    dialog.addEventListener("toggle", onToggle);
    dialog.addEventListener("close", reset);
    input.addEventListener("input", onInput);
    input.addEventListener("keydown", onKeyDown);
    clear.addEventListener("click", onClear);
    results.addEventListener("click", onResultClick);
    results.addEventListener("pointermove", onPointerMove);
    document.addEventListener("keydown", onShortcut);

    return () => {
      destroyed = true;
      close();
      dialog.removeEventListener("toggle", onToggle);
      dialog.removeEventListener("close", reset);
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeyDown);
      clear.removeEventListener("click", onClear);
      results.removeEventListener("click", onResultClick);
      results.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("keydown", onShortcut);
    };
  },

  navigationStart() {
    const dialog = document.querySelector<HTMLDialogElement>("[data-search-dialog]");
    if (dialog?.open) dialog.close();
  }
};
