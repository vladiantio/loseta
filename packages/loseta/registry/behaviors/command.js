// @ts-check

import { init, labelOf, on, uniqueId } from "./core.js";
import { highlight, listboxIn, optionsOf } from "./listbox.js";

const BOUNDARY = /[\\\/_+.#"@\[\(\{&]/;
const BOUNDARIES = /[\\\/_+.#"@\[\(\{&]/g;
const WORD_SEPARATOR = /[\s-]/;
const WORD_SEPARATORS = /[\s-]/g;

/**
 * @typedef {object} CommandState
 * @property {Element[]} options
 * @property {Element[]} groups
 * @property {Map<Element, boolean>} hidden
 * @property {Map<Element, Node[]>} children
 */

/** @type {WeakMap<HTMLElement, CommandState>} */
const states = new WeakMap();

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

/** @param {Element} listbox */
function groupsOf(listbox) {
  return [...listbox.querySelectorAll("[role='group']")].filter(
    (group) => group.closest("[role='listbox']") === listbox
  );
}

/** @param {Element} listbox */
function separatorsOf(listbox) {
  return [...listbox.querySelectorAll("[role='separator']")].filter(
    (separator) => separator.closest("[role='listbox']") === listbox
  );
}

/** @param {HTMLElement} listbox */
function snapshot(listbox) {
  const current = states.get(listbox);
  if (current) return current;

  const options = optionsOf(listbox);
  const groups = groupsOf(listbox);
  const separators = separatorsOf(listbox);
  const empty = listbox.querySelector("[data-slot='empty']");
  const managed = [
    ...options,
    ...groups,
    ...separators,
    ...(empty ? [empty] : [])
  ];
  const parents = new Set([listbox]);

  for (const element of managed) {
    if (element.parentElement) parents.add(element.parentElement);
  }

  /** @type {Map<Element, boolean>} */
  const hidden = new Map();
  for (const element of managed) hidden.set(element, element.hasAttribute("hidden"));

  /** @type {Map<Element, Node[]>} */
  const children = new Map();
  for (const parent of parents) children.set(parent, [...parent.childNodes]);

  const state = { options, groups, hidden, children };
  states.set(listbox, state);
  return state;
}

/** @param {HTMLElement} listbox */
function restore(listbox) {
  const state = states.get(listbox);
  states.delete(listbox);
  if (!state) return;

  for (const [element, hidden] of state.hidden) {
    element.toggleAttribute("hidden", hidden);
  }
  for (const [parent, children] of state.children) {
    for (const child of children) {
      if (listbox.contains(child)) parent.appendChild(child);
    }
  }
}

/** @param {string} value */
function normalize(value) {
  return value.toLowerCase().replace(WORD_SEPARATORS, " ");
}

/**
 * Adapted from cmdk's command-score ranking: consecutive characters, word
 * boundaries and shorter gaps score higher, while subsequences still match.
 *
 * @param {string} value
 * @param {string} search
 * @param {number} valueIndex
 * @param {number} searchIndex
 * @param {Record<string, number>} cache
 */
function score(value, search, valueIndex, searchIndex, cache) {
  if (searchIndex === search.length) {
    return valueIndex === value.length ? 1 : 0.99;
  }

  const key = `${valueIndex},${searchIndex}`;
  const cached = cache[key];
  if (cached !== undefined) return cached;

  const character = search.charAt(searchIndex);
  let matchIndex = value.indexOf(character, valueIndex);
  let best = 0;

  while (matchIndex >= 0) {
    let candidate = score(value, search, matchIndex + 1, searchIndex + 1, cache);

    if (candidate > best) {
      if (matchIndex === valueIndex) {
        candidate *= 1;
      } else if (BOUNDARY.test(value.charAt(matchIndex - 1))) {
        candidate *= 0.8;
        const boundaries = value.slice(valueIndex, matchIndex - 1).match(BOUNDARIES);
        if (boundaries && valueIndex > 0) candidate *= 0.999 ** boundaries.length;
      } else if (WORD_SEPARATOR.test(value.charAt(matchIndex - 1))) {
        candidate *= 0.9;
        const separators = value.slice(valueIndex, matchIndex - 1).match(WORD_SEPARATORS);
        if (separators && valueIndex > 0) candidate *= 0.999 ** separators.length;
      } else {
        candidate *= 0.17;
        if (valueIndex > 0) candidate *= 0.999 ** (matchIndex - valueIndex);
      }
    }

    if (
      (candidate < 0.1 &&
        value.charAt(matchIndex - 1) === search.charAt(searchIndex + 1)) ||
      (search.charAt(searchIndex + 1) === character &&
        value.charAt(matchIndex - 1) !== character)
    ) {
      const skipped = score(value, search, matchIndex + 1, searchIndex + 2, cache) * 0.1;
      if (skipped > candidate) candidate = skipped;
    }

    if (candidate > best) best = candidate;
    matchIndex = value.indexOf(character, matchIndex + 1);
  }

  cache[key] = best;
  return best;
}

/** @param {string} value @param {string} search */
function fuzzyScore(value, search) {
  const cache = /** @type {Record<string, number>} */ (Object.create(null));
  return score(normalize(value), normalize(search), 0, 0, cache);
}

/**
 * @param {Map<Element, number>} scores
 * @param {Element[]} original
 */
function byScore(scores, original) {
  const order = new Map(original.map((element, index) => [element, index]));
  /** @param {Element} a @param {Element} b */
  const compare = (a, b) =>
    (scores.get(b) ?? 0) - (scores.get(a) ?? 0) ||
    (order.get(a) ?? 0) - (order.get(b) ?? 0);
  return compare;
}

/** @param {HTMLElement} listbox @param {string} query */
function filter(listbox, query) {
  const state = snapshot(listbox);
  /** @type {Map<Element, number>} */
  const scores = new Map();
  /** @type {Map<Element, number>} */
  const groupScores = new Map();
  let matches = 0;

  for (const option of state.options) {
    const rank = fuzzyScore(labelOf(option), query);
    scores.set(option, rank);
    option.toggleAttribute("hidden", rank <= 0);
    if (rank <= 0) continue;

    matches += 1;
    const group = option.closest("[role='group']");
    if (!group || group.closest("[role='listbox']") !== listbox) continue;
    groupScores.set(group, Math.max(groupScores.get(group) ?? 0, rank));
  }

  for (const group of state.groups) {
    group.toggleAttribute("hidden", (groupScores.get(group) ?? 0) <= 0);
  }
  for (const separator of separatorsOf(listbox)) {
    separator.toggleAttribute("hidden", true);
  }

  const empty = listbox.querySelector("[data-slot='empty']");
  if (empty instanceof HTMLElement) empty.hidden = matches > 0;

  for (const option of [...state.options].sort(byScore(scores, state.options))) {
    option.parentElement?.appendChild(option);
  }
  for (const group of state.groups
    .filter((group) => (groupScores.get(group) ?? 0) > 0)
    .sort(byScore(groupScores, state.groups))) {
    listbox.appendChild(group);
  }

  return matches;
}

/** @param {Element} listbox @param {Element} option */
function isHidden(listbox, option) {
  /** @type {Element | null} */
  let element = option;
  while (element) {
    if (element.hasAttribute("hidden")) return true;
    if (element === listbox) break;
    element = element.parentElement;
  }
  return false;
}

/** @param {Element} option */
function isDisabled(option) {
  return option.getAttribute("aria-disabled") === "true" || option.matches(":disabled");
}

/** @param {HTMLElement} listbox @param {Element} option */
function isAvailable(listbox, option) {
  return !isHidden(listbox, option) && !isDisabled(option);
}

/** @param {HTMLElement} listbox */
function availableOptions(listbox) {
  return optionsOf(listbox).filter((option) => isAvailable(listbox, option));
}

/** @param {HTMLElement} listbox */
function firstAvailable(listbox) {
  return availableOptions(listbox)[0] ?? null;
}

/** @param {HTMLElement} listbox */
function lastAvailable(listbox) {
  const options = availableOptions(listbox);
  return options[options.length - 1] ?? null;
}

/**
 * @param {HTMLElement} listbox
 * @param {1 | -1} direction
 * @param {Element[]} options
 */
function adjacentGroupOption(listbox, direction, options) {
  /** @type {{ group: Element, option: Element }[]} */
  const groups = [];

  for (const group of groupsOf(listbox)) {
    if (isHidden(listbox, group)) continue;
    const option = options.find((candidate) => candidate.closest("[role='group']") === group);
    if (option) groups.push({ group, option });
  }

  if (groups.length === 0) return null;
  const highlighted = listbox.querySelector("[data-highlighted]");
  const current = highlighted?.closest("[role='group']") ?? null;
  const index = groups.findIndex((entry) => entry.group === current);
  if (index < 0) return direction > 0 ? (groups[0]?.option ?? null) : null;
  return groups[index + direction]?.option ?? null;
}

/** @param {Element} root @param {HTMLInputElement} input */
function refresh(root, input) {
  const { listbox } = parts(root);
  if (!listbox) return;

  link(input, listbox);
  const query = input.value.trim();
  if (query === "") {
    restore(listbox);
  } else {
    filter(listbox, query);
  }
  highlight(listbox, firstAvailable(listbox), input);
}

on("focusin", ".command input", (_event, target) => {
  if (!(target instanceof HTMLInputElement)) return;
  const root = target.closest(".command");
  if (!root) return;
  const { listbox } = parts(root);
  if (!listbox) return;
  link(target, listbox);

  const highlighted = listbox.querySelector("[data-highlighted]");
  if (!highlighted || !isAvailable(listbox, highlighted)) {
    highlight(listbox, firstAvailable(listbox), target);
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
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const options = availableOptions(listbox);
    /** @type {Element | null} */
    let next = null;
    let highlighted = listbox.querySelector("[data-highlighted]");
    if (highlighted && !isAvailable(listbox, highlighted)) {
      highlight(listbox, null, target);
      highlighted = null;
    }

    if (event.metaKey || event.ctrlKey) {
      next = direction > 0 ? lastAvailable(listbox) : firstAvailable(listbox);
    } else if (event.altKey) {
      next = adjacentGroupOption(listbox, direction, options);
    } else {
      const index = highlighted ? options.indexOf(highlighted) : -1;
      next = options[index + direction] ?? null;
    }

    if (next) highlight(listbox, next, target);
    event.preventDefault();
    return true;
  }

  if (event.key === "Home" || event.key === "End") {
    highlight(
      listbox,
      event.key === "Home" ? firstAvailable(listbox) : lastAvailable(listbox),
      target
    );
    event.preventDefault();
    return true;
  }

  if (event.key === "Enter") {
    const option = listbox.querySelector("[data-highlighted]");
    if (option instanceof HTMLElement && isAvailable(listbox, option)) option.click();
    event.preventDefault();
    return true;
  }
});

on("pointermove", ".command [role='option']", (event, target) => {
  if (!(event instanceof PointerEvent) || !(target instanceof HTMLElement)) return;
  const root = target.closest(".command");
  if (!root) return;
  const { input, listbox } = parts(root);
  if (listbox && isAvailable(listbox, target)) highlight(listbox, target, input);
});

init();
