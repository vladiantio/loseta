import { searchGroupOrder, searchResults } from "@/lib/search";
import type { SearchIndex, SearchResult } from "@/lib/search";
import type { PageBehavior } from "./lifecycle";

const suggestions: SearchResult[] = [
  {
    id: "suggested-installation",
    title: "Installation",
    context: "/docs/installation",
    href: "/docs/installation",
    group: "Guides",
    kind: "page"
  },
  {
    id: "suggested-components",
    title: "Components",
    context: "/docs/components",
    href: "/docs/components",
    group: "Components",
    kind: "page"
  },
  {
    id: "suggested-button",
    title: "Button",
    context: "/docs/components/button",
    href: "/docs/components/button",
    group: "Components",
    kind: "page"
  },
  {
    id: "suggested-dialog",
    title: "Dialog",
    context: "/docs/components/dialog",
    href: "/docs/components/dialog",
    group: "Components",
    kind: "page"
  },
  {
    id: "suggested-theming",
    title: "Theming",
    context: "/docs/theming",
    href: "/docs/theming",
    group: "Guides",
    kind: "page"
  },
  {
    id: "suggested-styles",
    title: "Styles",
    context: "/docs/styles",
    href: "/docs/styles",
    group: "Styles",
    kind: "page"
  },
  {
    id: "suggested-blocks",
    title: "Blocks",
    context: "/blocks",
    href: "/blocks",
    group: "Blocks",
    kind: "page"
  },
  {
    id: "suggested-typography",
    title: "Typography",
    context: "/docs/guidelines/typography",
    href: "/docs/guidelines/typography",
    group: "Guides",
    kind: "page"
  }
];

const suggestedRoutes = new Set(suggestions.map((suggestion) => suggestion.href));

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
    const listbox = dialog?.querySelector<HTMLElement>("[data-search-results]");
    const empty = listbox?.querySelector<HTMLElement>("[data-slot='empty']") ?? null;
    const clear = dialog?.querySelector<HTMLButtonElement>("[data-search-clear]");
    const shortcut = document.querySelector<HTMLElement>("[data-search-shortcut]");
    if (!dialog || !trigger || !input || !listbox || !empty || !clear) return;

    let index: SearchIndex | null = null;
    let optionId = 0;
    let destroyed = false;

    if (shortcut) {
      shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K";
    }

    const renderGroups = (items: SearchResult[], groups: string[], hideCorpus = false) => {
      optionId = 0;
      listbox.replaceChildren();

      for (const [groupIndex, group] of groups.entries()) {
        const matches = group === "Suggested" ? suggestions : items.filter((item) => item.group === group);
        if (matches.length === 0) continue;

        const groupElement = document.createElement("div");
        const labelId = `docs-search-group-${groupIndex}`;
        groupElement.setAttribute("role", "group");
        groupElement.setAttribute("aria-labelledby", labelId);
        groupElement.hidden = hideCorpus && group !== "Suggested";

        const label = document.createElement("div");
        label.id = labelId;
        label.dataset.slot = "label";
        label.setAttribute("aria-hidden", "true");
        label.textContent = group;
        groupElement.append(label);

        for (const result of matches) {
          const option = document.createElement("a");
          option.id = `docs-search-option-${optionId++}`;
          option.className = "docs-search-option";
          option.href = result.href;
          option.setAttribute("role", "option");
          option.tabIndex = -1;
          option.dataset.slot = "option";
          option.dataset.searchResult = "";
          option.dataset.searchKind = result.kind;

          const text = document.createElement("span");
          text.dataset.slot = "text";
          const title = document.createElement("span");
          title.className = "docs-search-option-title";
          title.textContent = result.title;
          // Keep the page context in the filter text without showing paths.
          const context = document.createElement("span");
          context.className = "docs-search-option-context";
          context.hidden = true;
          context.textContent = result.context;
          text.append(title, " ", context);
          option.append(text);
          groupElement.append(option);
        }

        listbox.append(groupElement);
      }

      listbox.append(empty);
      empty.hidden = true;
    };

    const restoreNativeState = () => {
      const query = input.value;
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.value = query;
    };

    const renderSuggestions = () => renderGroups([], ["Suggested"]);

    const renderIndex = () => {
      if (!index) return;
      restoreNativeState();
      const corpus = searchResults(index).filter(
        (result) => result.kind === "heading" || !suggestedRoutes.has(result.href)
      );
      renderGroups(corpus, ["Suggested", ...searchGroupOrder], true);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const showMessage = (message: string) => {
      restoreNativeState();
      listbox.replaceChildren(empty);
      empty.hidden = false;
      empty.textContent = message;
    };

    const renderQuery = () => {
      const query = input.value.trim();
      clear.hidden = input.value.length === 0;
      empty.textContent = query ? `No results for “${query}”.` : "No results found.";

      if (!query) {
        if (!listbox.querySelector("[role='option']")) renderSuggestions();
        return;
      }
      if (!index) showMessage("Loading search index…");
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
      if (!index) renderSuggestions();
      renderQuery();
      void loadIndex()
        .then((loadedIndex) => {
          if (destroyed) return;
          index = loadedIndex;
          renderIndex();
        })
        .catch(() => {
          if (destroyed) return;
          showMessage("Search could not be loaded. Close and reopen to try again.");
        });
    };

    const reset = () => {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      clear.hidden = true;
      empty.hidden = true;
    };

    const onToggle = (event: Event) => {
      if (!(event instanceof CustomEvent) || event.detail?.open !== true) return;
      open();
    };

    const onInput = () => renderQuery();

    const onClear = () => {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    };

    const onResultClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-search-result]")) close();
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
    clear.addEventListener("click", onClear);
    listbox.addEventListener("click", onResultClick);
    document.addEventListener("keydown", onShortcut);

    return () => {
      destroyed = true;
      close();
      dialog.removeEventListener("toggle", onToggle);
      dialog.removeEventListener("close", reset);
      input.removeEventListener("input", onInput);
      clear.removeEventListener("click", onClear);
      listbox.removeEventListener("click", onResultClick);
      document.removeEventListener("keydown", onShortcut);
    };
  },

  navigationStart() {
    const dialog = document.querySelector<HTMLDialogElement>("[data-search-dialog]");
    if (dialog?.open) dialog.close();
  }
};
