// @ts-check

import { emit, init, isRTL, on, onDocument } from "./core.js";

const PANEL_SELECTOR = ".resizable-panel";
const HANDLE_SELECTOR = "[data-slot='handle'][role='separator']";

/**
 * @typedef {object} Constraint
 * @property {number} min
 * @property {number} max
 */

/**
 * @typedef {object} Group
 * @property {HTMLElement} root
 * @property {HTMLElement[]} panels
 * @property {Constraint[]} constraints
 * @property {number[]} initial
 * @property {number[]} layout
 * @property {boolean} initialized
 */

/**
 * @typedef {object} Parts
 * @property {Group} group
 * @property {HTMLElement} first
 * @property {HTMLElement} second
 * @property {number} firstIndex
 * @property {number} secondIndex
 * @property {"x" | "y"} axis
 * @property {boolean} rtl
 */

/**
 * @typedef {object} DragState
 * @property {Parts} parts
 * @property {boolean} active
 * @property {boolean} moved
 * @property {number} pointerId
 * @property {string} pointerType
 * @property {number} startX
 * @property {number} startY
 * @property {number} startFirst
 * @property {number} startSpace
 * @property {number[]} startLayout
 */

/**
 * @typedef {object} AxisSnapshot
 * @property {number} startFirst
 * @property {number[]} startLayout
 * @property {number} space
 */

/**
 * @typedef {object} CornerParts
 * @property {HTMLElement} outerHandle
 * @property {HTMLElement} innerHandle
 * @property {Parts} outer
 * @property {Parts} inner
 */

/**
 * @typedef {object} CornerState
 * @property {HTMLElement} target
 * @property {HTMLElement} innerHandle
 * @property {Parts} outer
 * @property {Parts} inner
 * @property {AxisSnapshot} outerSnapshot
 * @property {AxisSnapshot} innerSnapshot
 * @property {boolean} moved
 * @property {number} pointerId
 * @property {string} pointerType
 * @property {number} startX
 * @property {number} startY
 */

/** @type {WeakMap<HTMLElement, Group>} */
const groups = new WeakMap();

/** @type {WeakMap<HTMLElement, DragState>} */
const states = new WeakMap();

/** @type {HTMLElement | null} */
let activeHandle = null;

/** @type {CornerState | null} */
let cornerDrag = null;

/** @type {HTMLElement[]} */
let cornerCursorHandles = [];

/** @returns {Constraint} */
function emptyConstraint() {
  return { min: 0, max: 100 };
}

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** @param {number} value */
function round(value) {
  return Math.round(value * 100) / 100;
}

/** @param {HTMLElement} root @returns {HTMLElement[]} */
function directPanels(root) {
  /** @type {HTMLElement[]} */
  const panels = [];
  for (const child of root.children) {
    if (child instanceof HTMLElement && child.matches(PANEL_SELECTOR)) {
      panels.push(child);
    }
  }
  return panels;
}

/** @param {HTMLElement} root @returns {HTMLElement[]} */
function directHandles(root) {
  /** @type {HTMLElement[]} */
  const handles = [];
  for (const child of root.children) {
    if (child instanceof HTMLElement && child.matches(HANDLE_SELECTOR)) {
      handles.push(child);
    }
  }
  return handles;
}

/** @param {HTMLElement} panel */
function readWeight(panel) {
  const raw = getComputedStyle(panel).getPropertyValue("--panel-size").trim();
  if (raw === "") return 1;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value >= 0 ? value : 1;
}

/** @param {HTMLElement} panel @returns {Constraint} */
function readConstraint(panel) {
  const style = getComputedStyle(panel);
  const rawMin = Number.parseFloat(style.getPropertyValue("--panel-min"));
  const rawMax = Number.parseFloat(style.getPropertyValue("--panel-max"));
  const min = Number.isFinite(rawMin) ? clamp(rawMin, 0, 100) : 0;
  const max = Number.isFinite(rawMax) ? clamp(rawMax, min, 100) : 100;
  return { min, max };
}

/** @param {number[]} values @returns {number[]} */
function normalize(values) {
  const count = values.length;
  if (count === 0) return [];

  const weights = values.map((value) =>
    Number.isFinite(value) && value > 0 ? value : 0
  );
  const total = weights.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return weights.map(() => 100 / count);
  return weights.map((value) => (value / total) * 100);
}

/**
 * Converts weights into percentages and folds in the panel constraints. The
 * loop distributes any remainder across the panels that still have room.
 * @param {number[]} values
 * @param {Constraint[]} constraints
 * @returns {number[]}
 */
function fitLayout(values, constraints) {
  const count = values.length;
  if (count === 0) return [];

  const layout = normalize(values);
  for (let index = 0; index < count; index += 1) {
    const constraint = constraints[index] ?? emptyConstraint();
    layout[index] = clamp(layout[index] ?? 0, constraint.min, constraint.max);
  }

  for (let guard = 0; guard < 20; guard += 1) {
    const total = layout.reduce((sum, value) => sum + value, 0);
    const difference = 100 - total;
    if (Math.abs(difference) <= 0.001) break;

    const room = layout.map((value, index) => {
      const constraint = constraints[index] ?? emptyConstraint();
      return difference > 0
        ? constraint.max - value
        : value - constraint.min;
    });
    const capacity = room.reduce(
      (sum, value) => sum + Math.max(0, value),
      0
    );
    if (capacity <= 0.001) break;

    const ratio = Math.min(1, Math.abs(difference) / capacity);
    const direction = Math.sign(difference);
    for (let index = 0; index < count; index += 1) {
      const available = Math.max(0, room[index] ?? 0);
      layout[index] = (layout[index] ?? 0) + direction * available * ratio;
    }
  }

  const total = layout.reduce((sum, value) => sum + value, 0);
  if (total > 0 && Math.abs(total - 100) > 0.001) {
    return layout.map((value) => (value / total) * 100);
  }
  return layout;
}

/**
 * @param {HTMLElement} root
 * @returns {Group | null}
 */
function readGroup(root) {
  const panels = directPanels(root);
  if (panels.length === 0) return null;

  const constraints = panels.map(readConstraint);
  const existing = groups.get(root);
  if (
    existing &&
    existing.panels.length === panels.length &&
    existing.panels.every((panel, index) => panel === panels[index])
  ) {
    existing.constraints = constraints;
    existing.layout = normalize(panels.map(readWeight));
    return existing;
  }

  const initial = fitLayout(panels.map(readWeight), constraints);
  const group = {
    root,
    panels,
    constraints,
    initial,
    layout: initial.slice(),
    initialized: false
  };
  groups.set(root, group);
  return group;
}

/**
 * @param {Group} group
 * @param {number[]} layout
 * @returns {number[]}
 */
function writeLayout(group, layout) {
  const sizes = layout.map((value) => round(clamp(value, 0, 100)));
  if (sizes.length > 0) {
    let head = 0;
    for (let index = 0; index < sizes.length - 1; index += 1) {
      head += sizes[index] ?? 0;
    }

    let last = round(100 - head);
    if (last < 0) {
      for (let index = 0; index < sizes.length - 1; index += 1) {
        const value = sizes[index] ?? 0;
        if (value + last >= 0) {
          sizes[index] = round(value + last);
          last = 0;
          break;
        }
      }
    }
    sizes[sizes.length - 1] = round(clamp(last, 0, 100));
  }

  for (let index = 0; index < group.panels.length; index += 1) {
    const panel = group.panels[index];
    const size = sizes[index];
    if (panel && size !== undefined) {
      panel.style.setProperty("--panel-size", String(size));
    }
  }

  group.layout = sizes;
  updateHandles(group);
  return sizes;
}

/**
 * @param {HTMLElement} handle
 * @param {HTMLElement} root
 * @returns {"x" | "y"}
 */
function axisFor(handle, root) {
  const orientation = handle.getAttribute("aria-orientation");
  if (orientation === "horizontal") return "y";
  if (orientation === "vertical") return "x";
  return root.getAttribute("data-orientation") === "vertical" ? "y" : "x";
}

/**
 * @param {HTMLElement} handle
 * @param {Group} group
 * @returns {Parts | null}
 */
function partsFor(handle, group) {
  const first = handle.previousElementSibling;
  const second = handle.nextElementSibling;
  if (
    !(first instanceof HTMLElement) ||
    !(second instanceof HTMLElement) ||
    !first.matches(PANEL_SELECTOR) ||
    !second.matches(PANEL_SELECTOR) ||
    first.parentElement !== group.root ||
    second.parentElement !== group.root
  ) {
    return null;
  }

  const firstIndex = group.panels.indexOf(first);
  const secondIndex = group.panels.indexOf(second);
  if (firstIndex < 0 || secondIndex !== firstIndex + 1) return null;

  const axis = axisFor(handle, group.root);
  return {
    group,
    first,
    second,
    firstIndex,
    secondIndex,
    axis,
    rtl: axis === "x" && isRTL(handle)
  };
}

/**
 * The range the leading panel can reach by moving this one handle. Both
 * adjacent panels keep their combined size while the handle moves.
 * @param {Group} group
 * @param {number} firstIndex
 * @param {number} secondIndex
 * @param {number[]} layout
 * @returns {[number, number]}
 */
function pairRange(group, firstIndex, secondIndex, layout) {
  const first = group.constraints[firstIndex] ?? emptyConstraint();
  const second = group.constraints[secondIndex] ?? emptyConstraint();
  const pair = (layout[firstIndex] ?? 0) + (layout[secondIndex] ?? 0);
  const lower = Math.max(first.min, pair - second.max);
  const upper = Math.min(first.max, pair - second.min);
  return [
    clamp(Math.min(lower, upper), 0, 100),
    clamp(Math.max(lower, upper), 0, 100)
  ];
}

/**
 * @param {Group} group
 * @param {number} firstIndex
 * @param {number} secondIndex
 * @param {number} targetFirst
 * @param {number[]} [source]
 * @returns {number[]}
 */
function applyPair(group, firstIndex, secondIndex, targetFirst, source) {
  const layout = (source ?? group.layout).slice();
  const [lower, upper] = pairRange(
    group,
    firstIndex,
    secondIndex,
    layout
  );
  const pair = (layout[firstIndex] ?? 0) + (layout[secondIndex] ?? 0);
  const first = clamp(targetFirst, lower, upper);
  layout[firstIndex] = first;
  layout[secondIndex] = pair - first;
  return writeLayout(group, layout);
}

/**
 * @param {HTMLElement} handle
 * @param {Group} group
 */
function updateHandle(handle, group) {
  const parts = partsFor(handle, group);
  if (!parts) return;

  const current = group.layout[parts.firstIndex] ?? 0;
  const [lower, upper] = pairRange(
    group,
    parts.firstIndex,
    parts.secondIndex,
    group.layout
  );
  const min = Math.round(lower);
  const max = Math.round(upper);
  const value = clamp(Math.round(current), min, max);

  handle.setAttribute("aria-valuenow", String(value));
  handle.setAttribute("aria-valuemin", String(min));
  handle.setAttribute("aria-valuemax", String(max));

  if (parts.first.id) {
    handle.setAttribute("aria-controls", parts.first.id);
  }
  if (!handle.hasAttribute("aria-orientation")) {
    handle.setAttribute(
      "aria-orientation",
      parts.axis === "x" ? "vertical" : "horizontal"
    );
  }
}

/** @param {Group} group */
function updateHandles(group) {
  for (const handle of directHandles(group.root)) {
    updateHandle(handle, group);
  }
}

/**
 * @param {HTMLElement} root
 * @returns {Group | null}
 */
function syncGroup(root) {
  const group = readGroup(root);
  if (!group) return null;

  if (!group.initialized) {
    group.initialized = true;
    const sizes = writeLayout(group, group.initial);
    group.initial = sizes.slice();
    return group;
  }

  writeLayout(group, group.layout);
  return group;
}

/**
 * @param {HTMLElement} handle
 * @returns {Group | null}
 */
function groupFor(handle) {
  const root = handle.closest(".resizable");
  return root instanceof HTMLElement ? syncGroup(root) : null;
}

/**
 * Total content space shared by the panels. Padding and borders stay outside
 * the flex ratio, so the pointer delta has to ignore them as well.
 * @param {HTMLElement} root
 * @param {"x" | "y"} axis
 */
function contentSpace(root, axis) {
  let total = 0;
  for (const panel of directPanels(root)) {
    const style = getComputedStyle(panel);
    const padding =
      axis === "x"
        ? (Number.parseFloat(style.paddingLeft) || 0) +
          (Number.parseFloat(style.paddingRight) || 0)
        : (Number.parseFloat(style.paddingTop) || 0) +
          (Number.parseFloat(style.paddingBottom) || 0);
    const size =
      axis === "x"
        ? panel.clientWidth - padding
        : panel.clientHeight - padding;
    total += Math.max(0, size);
  }
  return total;
}

/**
 * @param {Parts} parts
 * @returns {AxisSnapshot}
 */
function axisSnapshot(parts) {
  return {
    startFirst: parts.group.layout[parts.firstIndex] ?? 0,
    startLayout: parts.group.layout.slice(),
    space: contentSpace(parts.group.root, parts.axis)
  };
}

/**
 * @param {Parts} parts
 * @param {AxisSnapshot} snapshot
 * @param {number} deltaX
 * @param {number} deltaY
 */
function moveAxis(parts, snapshot, deltaX, deltaY) {
  if (snapshot.space <= 0) return;

  const delta =
    parts.axis === "x" ? deltaX * (parts.rtl ? -1 : 1) : deltaY;
  const target = snapshot.startFirst + (delta / snapshot.space) * 100;
  applyPair(
    parts.group,
    parts.firstIndex,
    parts.secondIndex,
    target,
    snapshot.startLayout
  );
}

/**
 * @param {CornerState} state
 * @param {number} clientX
 * @param {number} clientY
 */
function moveCorner(state, clientX, clientY) {
  if (clientX !== state.startX || clientY !== state.startY) {
    state.moved = true;
  }

  const deltaX = clientX - state.startX;
  const deltaY = clientY - state.startY;
  moveAxis(state.outer, state.outerSnapshot, deltaX, deltaY);
  moveAxis(state.inner, state.innerSnapshot, deltaX, deltaY);
}

/**
 * @param {HTMLElement} root
 * @returns {Group | null}
 */
function groupForHover(root) {
  return groups.get(root) ?? syncGroup(root);
}

/** @returns {number} */
function cornerHitSize() {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches
    ? 20
    : 10;
}

/**
 * @param {DOMRect} rect
 * @param {number} x
 * @param {number} y
 */
function withinRect(rect, x, y) {
  return (
    x >= rect.left - 1 &&
    x <= rect.right + 1 &&
    y >= rect.top - 1 &&
    y <= rect.bottom + 1
  );
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} targetX
 * @param {number} targetY
 */
function withinCorner(x, y, targetX, targetY) {
  const radius = cornerHitSize() / 2;
  return (
    Math.abs(x - targetX) <= radius && Math.abs(y - targetY) <= radius
  );
}

/**
 * A corner is the intersection of an inner handle and the outer handle that
 * meets it. The inner group must sit directly inside an outer panel.
 * @param {HTMLElement} handle
 * @param {number} clientX
 * @param {number} clientY
 * @param {boolean} sync
 * @returns {CornerParts | null}
 */
function cornerFromInner(handle, clientX, clientY, sync) {
  const innerRoot = handle.closest(".resizable");
  if (!(innerRoot instanceof HTMLElement)) return null;

  const panel = innerRoot.parentElement;
  if (!(panel instanceof HTMLElement) || !panel.matches(PANEL_SELECTOR)) {
    return null;
  }

  const outerRoot = panel.parentElement;
  if (!(outerRoot instanceof HTMLElement) || !outerRoot.matches(".resizable")) {
    return null;
  }

  const innerGroup = sync ? syncGroup(innerRoot) : groupForHover(innerRoot);
  const outerGroup = sync ? syncGroup(outerRoot) : groupForHover(outerRoot);
  if (!innerGroup || !outerGroup) return null;

  const inner = partsFor(handle, innerGroup);
  if (!inner) return null;

  const outerAxis =
    outerRoot.getAttribute("data-orientation") === "vertical" ? "y" : "x";
  if (outerAxis === inner.axis) return null;

  const innerRect = handle.getBoundingClientRect();
  const innerX = innerRect.left + innerRect.width / 2;
  const innerY = innerRect.top + innerRect.height / 2;

  /** @type {HTMLElement | null} */
  let outerHandle = null;
  let best = Number.POSITIVE_INFINITY;

  for (const candidate of [
    panel.previousElementSibling,
    panel.nextElementSibling
  ]) {
    if (
      !(candidate instanceof HTMLElement) ||
      candidate.parentElement !== outerRoot ||
      !candidate.matches(HANDLE_SELECTOR)
    ) {
      continue;
    }

    const rect = candidate.getBoundingClientRect();
    const distance =
      outerAxis === "x"
        ? Math.abs(rect.left + rect.width / 2 - clientX)
        : Math.abs(rect.top + rect.height / 2 - clientY);
    if (distance < best) {
      best = distance;
      outerHandle = candidate;
    }
  }

  if (!outerHandle) return null;
  const outer = partsFor(outerHandle, outerGroup);
  if (!outer || outer.axis !== outerAxis) return null;

  const outerRect = outerHandle.getBoundingClientRect();
  const x =
    outerAxis === "x"
      ? outerRect.left + outerRect.width / 2
      : innerX;
  const y =
    outerAxis === "y"
      ? outerRect.top + outerRect.height / 2
      : innerY;

  if (
    !withinCorner(clientX, clientY, x, y) ||
    !withinRect(innerRect, x, y)
  ) {
    return null;
  }

  return { outerHandle, innerHandle: handle, outer, inner };
}

/**
 * @param {HTMLElement} handle
 * @param {number} clientX
 * @param {number} clientY
 * @param {boolean} sync
 * @returns {CornerParts | null}
 */
function cornerFromOuter(handle, clientX, clientY, sync) {
  const outerRoot = handle.closest(".resizable");
  if (!(outerRoot instanceof HTMLElement)) return null;

  const outerGroup = sync ? syncGroup(outerRoot) : groupForHover(outerRoot);
  if (!outerGroup) return null;

  const outer = partsFor(handle, outerGroup);
  if (!outer) return null;

  const outerRect = handle.getBoundingClientRect();
  const outerX = outerRect.left + outerRect.width / 2;
  const outerY = outerRect.top + outerRect.height / 2;

  for (const panel of [
    handle.previousElementSibling,
    handle.nextElementSibling
  ]) {
    if (
      !(panel instanceof HTMLElement) ||
      panel.parentElement !== outerRoot ||
      !panel.matches(PANEL_SELECTOR)
    ) {
      continue;
    }

    for (const innerRoot of panel.children) {
      if (!(innerRoot instanceof HTMLElement) || !innerRoot.matches(".resizable")) {
        continue;
      }

      const innerGroup = sync ? syncGroup(innerRoot) : groupForHover(innerRoot);
      if (!innerGroup) continue;

      for (const innerHandle of directHandles(innerRoot)) {
        const inner = partsFor(innerHandle, innerGroup);
        if (!inner || inner.axis === outer.axis) continue;

        const innerRect = innerHandle.getBoundingClientRect();
        const innerX = innerRect.left + innerRect.width / 2;
        const innerY = innerRect.top + innerRect.height / 2;
        const x = outer.axis === "x" ? outerX : innerX;
        const y = outer.axis === "y" ? outerY : innerY;

        if (
          !withinCorner(clientX, clientY, x, y) ||
          !withinRect(innerRect, x, y)
        ) {
          continue;
        }

        return { outerHandle: handle, innerHandle, outer, inner };
      }
    }
  }

  return null;
}

/**
 * @param {HTMLElement} handle
 * @param {number} clientX
 * @param {number} clientY
 * @param {boolean} sync
 * @returns {CornerParts | null}
 */
function cornerPartsFor(handle, clientX, clientY, sync) {
  return (
    cornerFromInner(handle, clientX, clientY, sync) ??
    cornerFromOuter(handle, clientX, clientY, sync)
  );
}

/**
 * Mirrors the library's cursor support: Chrome and Firefox get `move`, other
 * engines fall back to `grab`.
 * @returns {string}
 */
function cornerCursor() {
  if (
    typeof navigator !== "undefined" &&
    (navigator.userAgent.includes("Chrome") ||
      navigator.userAgent.includes("Firefox"))
  ) {
    return "move";
  }
  return "grab";
}

function clearCornerCursor() {
  for (const handle of cornerCursorHandles) {
    handle.style.removeProperty("cursor");
  }
  cornerCursorHandles = [];
  if (typeof document !== "undefined") {
    document.documentElement.style.removeProperty("cursor");
  }
}

/**
 * @param {CornerParts} parts
 */
function setCornerCursor(parts) {
  const next = [parts.outerHandle, parts.innerHandle];
  for (const handle of cornerCursorHandles) {
    if (!next.includes(handle)) {
      handle.style.removeProperty("cursor");
    }
  }
  const cursor = cornerCursor();
  for (const handle of next) {
    handle.style.cursor = cursor;
  }
  cornerCursorHandles = next;
  if (typeof document !== "undefined") {
    document.documentElement.style.cursor = cursor;
  }
}

/**
 * @param {Event} event
 */
function updateCornerHover(event) {
  if (!(event instanceof MouseEvent)) return;
  if (cornerDrag || activeHandle) return;

  const target =
    event.target instanceof Element
      ? event.target.closest(HANDLE_SELECTOR)
      : null;
  if (!(target instanceof HTMLElement)) {
    clearCornerCursor();
    return;
  }

  const parts = cornerPartsFor(target, event.clientX, event.clientY, false);
  if (!parts) {
    clearCornerCursor();
    return;
  }

  setCornerCursor(parts);
}

/**
 * @param {CornerParts} parts
 * @param {PointerEvent} event
 * @param {HTMLElement} target
 */
function startCorner(parts, event, target) {
  if (cornerDrag) return false;

  const outerSnapshot = axisSnapshot(parts.outer);
  const innerSnapshot = axisSnapshot(parts.inner);
  if (outerSnapshot.space <= 0 || innerSnapshot.space <= 0) return false;

  cornerDrag = {
    target,
    innerHandle: parts.innerHandle,
    outer: parts.outer,
    inner: parts.inner,
    outerSnapshot,
    innerSnapshot,
    moved: false,
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    startX: event.clientX,
    startY: event.clientY
  };

  setCornerCursor(parts);

  const focusOptions = /** @type {FocusOptions & { focusVisible?: boolean }} */ ({
    focusVisible: false,
    preventScroll: true
  });
  parts.innerHandle.focus(focusOptions);
  return true;
}

/**
 * @param {boolean} notify
 */
function finishCorner(notify) {
  const state = cornerDrag;
  if (!state) return false;

  cornerDrag = null;

  const outer = state.outer.group;
  const inner = state.inner.group;
  const outerChanged =
    Math.abs(
      (outer.layout[state.outer.firstIndex] ?? 0) -
        state.outerSnapshot.startFirst
    ) >= 0.005;
  const innerChanged =
    Math.abs(
      (inner.layout[state.inner.firstIndex] ?? 0) -
        state.innerSnapshot.startFirst
    ) >= 0.005;

  if (state.moved && document.activeElement === state.innerHandle) {
    state.innerHandle.blur();
  }

  if (state.target.hasPointerCapture(state.pointerId)) {
    try {
      state.target.releasePointerCapture(state.pointerId);
    } catch {
      // The browser already released capture for this pointer.
    }
  }

  if (notify) {
    if (outerChanged) {
      emit(outer.root, "change", { sizes: outer.layout.slice() });
    }
    if (innerChanged) {
      emit(inner.root, "change", { sizes: inner.layout.slice() });
    }
  }
  return true;
}

/**
 * @param {{ pointerId: number, pointerType: string }} state
 * @param {PointerEvent} event
 */
function samePointer(state, event) {
  return (
    event.pointerId === state.pointerId ||
    // There is only one pen, but it may receive a new pointerId each time it
    // comes back into range.
    (event.pointerType === "pen" && state.pointerType === "pen")
  );
}

/**
 * @param {HTMLElement} handle
 * @param {DragState} state
 * @param {number} clientX
 * @param {number} clientY
 */
function moveTo(handle, state, clientX, clientY) {
  if (clientX !== state.startX || clientY !== state.startY) {
    state.moved = true;
  }

  const { parts } = state;
  const space = state.startSpace;
  if (space <= 0) return;

  const delta =
    parts.axis === "x"
      ? (clientX - state.startX) * (parts.rtl ? -1 : 1)
      : clientY - state.startY;
  const target = state.startFirst + (delta / space) * 100;
  applyPair(
    parts.group,
    parts.firstIndex,
    parts.secondIndex,
    target,
    state.startLayout
  );
}

/**
 * @param {HTMLElement} handle
 * @param {boolean} notify
 */
function finish(handle, notify) {
  const state = states.get(handle);
  if (!state || !state.active) return false;

  state.active = false;
  if (activeHandle === handle) activeHandle = null;

  const group = state.parts.group;
  const current = group.layout[state.parts.firstIndex] ?? 0;
  const changed = Math.abs(current - state.startFirst) >= 0.005;

  if (state.moved && document.activeElement === handle) {
    handle.blur();
  }

  if (handle.hasPointerCapture(state.pointerId)) {
    try {
      handle.releasePointerCapture(state.pointerId);
    } catch {
      // The browser already released capture for this pointer.
    }
  }

  if (notify && changed) {
    emit(group.root, "change", { sizes: group.layout.slice() });
  }
  return true;
}

on("pointerdown", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof PointerEvent) || !(element instanceof HTMLElement)) {
    return;
  }
  if (event.defaultPrevented) return;
  if (event.pointerType === "mouse" && event.button > 0) return;

  if (cornerDrag) {
    if (samePointer(cornerDrag, event)) finishCorner(true);
    event.preventDefault();
    return true;
  }

  if (activeHandle) {
    const activeState = states.get(activeHandle);
    if (activeState?.active) {
      // A second press from the same pointer means its release was missed;
      // commit that drag instead of starting a new one. Other pointers are
      // ignored so the active drag is never orphaned.
      if (samePointer(activeState, event)) finish(activeHandle, true);
      event.preventDefault();
      return true;
    }
    activeHandle = null;
  }

  const group = groupFor(element);
  if (!group) return;
  const parts = partsFor(element, group);
  if (!parts) return;

  const corner = cornerPartsFor(element, event.clientX, event.clientY, true);
  if (corner && startCorner(corner, event, element)) {
    event.preventDefault();
    return true;
  }

  const startSpace = contentSpace(group.root, parts.axis);
  if (startSpace <= 0) return;

  const state = {
    parts,
    active: true,
    moved: false,
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    startX: event.clientX,
    startY: event.clientY,
    startFirst: group.layout[parts.firstIndex] ?? 0,
    startSpace,
    startLayout: group.layout.slice()
  };

  states.set(element, state);
  activeHandle = element;

  const focusOptions = /** @type {FocusOptions & { focusVisible?: boolean }} */ ({
    focusVisible: false,
    preventScroll: true
  });
  element.focus(focusOptions);

  event.preventDefault();
  return true;
});

onDocument("pointermove", (event) => {
  if (!(event instanceof PointerEvent)) return;
  if (event.defaultPrevented) return;
  if (!activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }
  if (!samePointer(state, event)) return;

  // A release outside this document (for example over a cross-origin iframe)
  // may produce a later hover instead of "pointerup". Commit what was last
  // previewed rather than treat the hover position as movement.
  if (event.buttons === 0) {
    finish(handle, true);
    return true;
  }

  if (!state.parts.first.isConnected || !state.parts.second.isConnected) {
    finish(handle, true);
    return true;
  }

  // Delay capture until the pointer actually moves. Capturing on press would
  // prevent a plain click from reaching the handle.
  if (!handle.hasPointerCapture(event.pointerId)) {
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      // The pointer may already be gone; the next end event still finishes.
    }
  }

  moveTo(handle, state, event.clientX, event.clientY);
  return true;
});

onDocument("pointerup", (event) => {
  if (!(event instanceof PointerEvent)) return;
  if (event.defaultPrevented) return;
  if (event.pointerType === "mouse" && event.button > 0) return;
  if (!activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }
  if (!samePointer(state, event)) return;

  moveTo(handle, state, event.clientX, event.clientY);
  finish(handle, true);
  event.preventDefault();
  return true;
});

onDocument("pointercancel", (event) => {
  if (!(event instanceof PointerEvent)) return;
  if (!activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }
  if (!samePointer(state, event)) return;

  finish(handle, true);
  return true;
});

onDocument("lostpointercapture", (event) => {
  // When another element takes the pointer, the browser releases capture from
  // the handle. Finish the drag so the layout cannot get stuck mid-gesture.
  if (!(event instanceof PointerEvent) || !activeHandle) return;
  if (event.target !== activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }
  if (!samePointer(state, event)) return;

  finish(handle, true);
  return true;
});

onDocument("contextmenu", (event) => {
  if (!(event instanceof MouseEvent) || !activeHandle) return;

  const handle = activeHandle;
  const state = states.get(handle);
  if (!state?.active) {
    activeHandle = null;
    return;
  }

  moveTo(handle, state, event.clientX, event.clientY);
  finish(handle, true);
  event.preventDefault();
  return true;
});

onDocument(
  "pointermove",
  (event) => {
    if (!cornerDrag) return;
    if (!(event instanceof PointerEvent)) return;
    if (event.defaultPrevented) return;

    const state = cornerDrag;
    if (!samePointer(state, event)) return;

    if (event.buttons === 0) {
      finishCorner(true);
      updateCornerHover(event);
      return true;
    }

    if (
      !state.target.isConnected ||
      !state.innerHandle.isConnected ||
      !state.outer.first.isConnected ||
      !state.outer.second.isConnected ||
      !state.inner.first.isConnected ||
      !state.inner.second.isConnected
    ) {
      finishCorner(true);
      return true;
    }

    if (!state.target.hasPointerCapture(event.pointerId)) {
      try {
        state.target.setPointerCapture(event.pointerId);
      } catch {
        // The pointer may already be gone; the next end event still finishes.
      }
    }

    moveCorner(state, event.clientX, event.clientY);
    return true;
  },
  20
);

onDocument(
  "pointerup",
  (event) => {
    if (!cornerDrag) return;
    if (!(event instanceof PointerEvent)) return;
    if (event.pointerType === "mouse" && event.button > 0) return;

    const state = cornerDrag;
    if (!samePointer(state, event)) return;

    moveCorner(state, event.clientX, event.clientY);
    finishCorner(true);
    updateCornerHover(event);
    event.preventDefault();
    return true;
  },
  20
);

onDocument(
  "pointercancel",
  (event) => {
    if (!cornerDrag) return;
    if (!(event instanceof PointerEvent)) return;
    if (!samePointer(cornerDrag, event)) return;

    finishCorner(true);
    clearCornerCursor();
    return true;
  },
  20
);

onDocument(
  "lostpointercapture",
  (event) => {
    if (!(event instanceof PointerEvent) || !cornerDrag) return;
    if (event.target !== cornerDrag.target) return;
    if (!samePointer(cornerDrag, event)) return;

    finishCorner(true);
    clearCornerCursor();
    return true;
  },
  20
);

onDocument(
  "contextmenu",
  (event) => {
    if (!(event instanceof MouseEvent) || !cornerDrag) return;

    moveCorner(cornerDrag, event.clientX, event.clientY);
    finishCorner(true);
    updateCornerHover(event);
    event.preventDefault();
    return true;
  },
  20
);

onDocument("pointermove", updateCornerHover, 5);

on("keydown", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof KeyboardEvent) || !(element instanceof HTMLElement)) {
    return;
  }
  if (event.defaultPrevented || event.target !== element) return;
  if (states.get(element)?.active) return;

  const group = groupFor(element);
  if (!group) return;
  const parts = partsFor(element, group);
  if (!parts) return;

  const current = group.layout[parts.firstIndex] ?? 0;
  const [lower, upper] = pairRange(
    group,
    parts.firstIndex,
    parts.secondIndex,
    group.layout
  );
  const step = 5;
  let target = current;

  if (event.key === "Home") {
    target = lower;
  } else if (event.key === "End") {
    target = upper;
  } else {
    const horizontal = parts.axis === "x";
    const positive = horizontal
      ? parts.rtl
        ? "ArrowLeft"
        : "ArrowRight"
      : "ArrowDown";
    const negative = horizontal
      ? parts.rtl
        ? "ArrowRight"
        : "ArrowLeft"
      : "ArrowUp";

    if (event.key === positive) {
      target = current + step;
    } else if (event.key === negative) {
      target = current - step;
    } else {
      return;
    }
  }

  event.preventDefault();
  const next = clamp(target, lower, upper);
  if (Math.abs(next - current) < 0.005) return true;

  const sizes = applyPair(
    group,
    parts.firstIndex,
    parts.secondIndex,
    next
  );
  emit(group.root, "change", { sizes });
  return true;
});

on("dblclick", HANDLE_SELECTOR, (event, element) => {
  if (!(event instanceof MouseEvent) || !(element instanceof HTMLElement)) {
    return;
  }
  if (event.defaultPrevented || activeHandle) return;

  const group = groupFor(element);
  if (!group) return;
  const parts = partsFor(element, group);
  if (!parts) return;

  const first = group.layout[parts.firstIndex] ?? 0;
  const second = group.layout[parts.secondIndex] ?? 0;
  const pair = first + second;
  const initialFirst = group.initial[parts.firstIndex] ?? 0;
  const initialSecond = group.initial[parts.secondIndex] ?? 0;
  const initialPair = initialFirst + initialSecond;
  const target =
    initialPair > 0 ? pair * (initialFirst / initialPair) : pair / 2;
  const [lower, upper] = pairRange(
    group,
    parts.firstIndex,
    parts.secondIndex,
    group.layout
  );
  const next = clamp(target, lower, upper);

  event.preventDefault();
  if (Math.abs(next - first) < 0.005) return true;

  const sizes = applyPair(
    group,
    parts.firstIndex,
    parts.secondIndex,
    next
  );
  emit(group.root, "change", { sizes });
  return true;
});

on("focusin", HANDLE_SELECTOR, (_event, element) => {
  if (element instanceof HTMLElement) groupFor(element);
});

/**
 * Syncs every group under a root with its panel sizes and constraints. The
 * entry module calls this for the initial document; consumers can call it for
 * a late-mounted subtree.
 * @param {Document | Element} [root]
 */
export function mount(root) {
  if (typeof document === "undefined") return;
  const scope = root ?? document;

  /** @type {HTMLElement[]} */
  const targets = [];
  if (scope instanceof HTMLElement && scope.matches(".resizable")) {
    targets.push(scope);
  }
  for (const element of scope.querySelectorAll(".resizable")) {
    if (element instanceof HTMLElement) targets.push(element);
  }
  for (const element of targets) {
    syncGroup(element);
  }
}

init();

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mount(document), {
      once: true
    });
  } else {
    mount(document);
  }
}
