// @ts-check

import { emit, init, isRTL, on } from "./core.js";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_MONTH = /^\d{4}-\d{2}$/;
const DAY_SELECTOR = "button[data-date]";

/**
 * @typedef {"single" | "range" | "multiple"} SelectionMode
 * @typedef {object} CalendarState
 * @property {SelectionMode} selection
 * @property {number} year
 * @property {number} month
 * @property {string | null} value
 * @property {string[]} values
 * @property {string | null} rangeStart
 * @property {string | null} rangeEnd
 * @property {Set<string>} unavailable
 * @property {string | null} min
 * @property {string | null} max
 * @property {string | null} today
 * @property {boolean} weekNumbers
 * @property {number[]} weekOrder
 * @property {string} locale
 * @property {string | null} focused
 */

/** @type {WeakMap<HTMLElement, CalendarState>} */
const states = new WeakMap();
/** @type {WeakSet<HTMLElement>} */
const skipped = new WeakSet();

/** @param {number} value */
const pad = (value) => String(value).padStart(2, "0");

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 */
function isoDate(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

/** @param {string} value */
function parseDate(value) {
  if (!ISO_DATE.test(value)) return null;
  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText) - 1;
  const day = Number(dayText);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

/** @param {string} value */
function parseMonth(value) {
  if (!ISO_MONTH.test(value)) return null;
  const [yearText, monthText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText) - 1;
  if (!Number.isInteger(year) || month < 0 || month > 11) return null;
  return { year, month };
}

/** @param {string} value */
function dateFromIso(value) {
  return new Date(`${value}T00:00:00Z`);
}

/** @param {string} value @param {number} days */
function addDays(value, days) {
  const date = dateFromIso(value);
  date.setUTCDate(date.getUTCDate() + days);
  return isoDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** @param {number} year @param {number} month */
function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/** @param {number} year @param {number} month @param {number} day */
function weekdayOf(year, month, day) {
  return new Date(Date.UTC(year, month, day)).getUTCDay();
}

/** @param {string} value @param {number} year @param {number} month */
function sameMonth(value, year, month) {
  const parsed = parseDate(value);
  return parsed !== null && parsed.year === year && parsed.month === month;
}

/** @param {Date} date */
function isoWeek(date) {
  const target = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const dayNumber = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3);
  return (
    1 +
    Math.round((target.getTime() - firstThursday.getTime()) / 604800000)
  );
}

/** @param {string} locale */
function latin(locale) {
  const tag = locale.trim() || "en";
  return tag.includes("-u-") ? tag : `${tag}-u-nu-latn`;
}

/** @param {string} locale */
function dayLabelFormatter(locale) {
  return new Intl.DateTimeFormat(latin(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  });
}

/** @param {string} locale @param {string} value */
function dayLabel(locale, value) {
  return dayLabelFormatter(locale).format(dateFromIso(value));
}

/** @param {string} locale @param {number} year @param {number} month */
function monthLabel(locale, year, month) {
  return new Intl.DateTimeFormat(latin(locale), {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(year, month, 1)));
}

/** @param {string} locale */
function weekdayLabels(locale) {
  const full = new Intl.DateTimeFormat(latin(locale), {
    weekday: "long",
    timeZone: "UTC"
  });
  const short = new Intl.DateTimeFormat(latin(locale), {
    weekday: "short",
    timeZone: "UTC"
  });
  const names = { full: /** @type {string[]} */ ([]), short: /** @type {string[]} */ ([]) };

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(Date.UTC(2024, 0, 7 + index));
    names.full.push(full.format(date));
    names.short.push(short.format(date));
  }

  return names;
}

/** @param {string} locale */
function firstDayOfWeek(locale) {
  try {
    const info = /** @type {{ weekInfo?: { firstDay?: number } }} */ (
      /** @type {unknown} */ (new Intl.Locale(locale))
    );
    const firstDay = info.weekInfo?.firstDay;
    if (typeof firstDay === "number") return firstDay % 7;
  } catch {
    // Intl.Locale or weekInfo is unavailable; fall back to Sunday.
  }
  return 0;
}

/** @param {Element} calendar @param {string} locale */
function weekOrderFor(calendar, locale) {
  const cells = [...calendar.querySelectorAll("thead th[scope='col']")];
  const labels = cells
    .map(
      (cell) =>
        cell.getAttribute("aria-label") ?? cell.textContent?.trim() ?? ""
    )
    .filter((label) => label !== "" && label !== "Week");
  const names = weekdayLabels(locale);
  const matched = labels
    .map((label) => {
      const fullIndex = names.full.indexOf(label);
      if (fullIndex !== -1) return fullIndex;
      return names.short.indexOf(label);
    })
    .filter((index) => index !== -1);

  if (matched.length === 7) return matched;

  const first = firstDayOfWeek(locale);
  return Array.from({ length: 7 }, (_, index) => (first + index) % 7);
}

/** @param {Element} calendar */
function hasWeekNumbers(calendar) {
  return [...calendar.querySelectorAll("thead th[scope='col']")].some((cell) => {
    if (cell.getAttribute("aria-label") === "Week") return true;
    return (cell.textContent ?? "").trim() === "";
  });
}

/** @param {string | null} value */
function parseDateAttribute(value) {
  if (!value) return null;
  return parseDate(value) ? value : null;
}

/** @param {string | null} value */
function parseList(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => parseDate(part) !== null);
}

/** @param {Element} calendar */
function initialMonth(calendar) {
  const explicit = parseMonth(calendar.getAttribute("data-month") ?? "");
  if (explicit) return explicit;

  const first = calendar.querySelector(DAY_SELECTOR)?.getAttribute("data-date");
  if (first) {
    const parsed = parseDate(first);
    if (parsed) return { year: parsed.year, month: parsed.month };
  }

  const monthSelect = calendar.querySelector(
    "[data-slot='month'], select[aria-label='Month']"
  );
  const yearSelect = calendar.querySelector(
    "[data-slot='year'], select[aria-label='Year']"
  );
  if (monthSelect instanceof HTMLSelectElement) {
    const month = Number(monthSelect.value) - 1;
    const year =
      yearSelect instanceof HTMLSelectElement
        ? Number(yearSelect.value)
        : new Date().getFullYear();
    if (Number.isInteger(year) && month >= 0 && month < 12) {
      return { year, month };
    }
  }

  const today = new Date();
  return { year: today.getFullYear(), month: today.getMonth() };
}

/** @param {Element} calendar */
function initialValues(calendar) {
  const values = [...calendar.querySelectorAll("td[aria-selected='true']")]
    .map((cell) => cell.querySelector(DAY_SELECTOR)?.getAttribute("data-date"))
    .filter((value) => typeof value === "string" && parseDate(value) !== null);

  return /** @type {string[]} */ ([...new Set(values)]).sort();
}

/** @param {Element} calendar @param {number} year @param {number} month */
function initialUnavailable(calendar, year, month) {
  const unavailable = new Set(parseList(calendar.getAttribute("data-unavailable")));

  for (const button of calendar.querySelectorAll(DAY_SELECTOR)) {
    if (button.getAttribute("aria-disabled") !== "true") continue;
    const value = button.getAttribute("data-date");
    if (!value) continue;
    const parsed = parseDate(value);
    if (parsed && parsed.year === year && parsed.month === month) {
      unavailable.add(value);
    }
  }

  return unavailable;
}

/** @param {Element} calendar */
function initialToday(calendar) {
  const current = calendar
    .querySelector("button[aria-current='date'][data-date]")
    ?.getAttribute("data-date");
  if (current && parseDate(current)) return current;

  const today = new Date();
  return isoDate(today.getFullYear(), today.getMonth(), today.getDate());
}

/** @param {Element} calendar */
function readSelection(calendar) {
  const value = calendar.getAttribute("data-selection");
  if (value === "range" || value === "multiple") return value;

  const grid = calendar.querySelector("table[role='grid']");
  if (grid?.getAttribute("aria-multiselectable") === "true") return "range";
  return "single";
}

/** @param {Element} calendar @param {string | null} focus */
function setRovingTabindex(calendar, focus) {
  for (const button of calendar.querySelectorAll(DAY_SELECTOR)) {
    button.setAttribute(
      "tabindex",
      focus !== null && button.getAttribute("data-date") === focus ? "0" : "-1"
    );
  }
}

/** @param {Element} calendar */
function hasCustomDayContent(calendar) {
  for (const cell of calendar.querySelectorAll("td[role='gridcell']")) {
    const button = cell.querySelector(":scope > button");
    if (!button) return true;
    if (button.children.length > 0) return true;
    if (cell.children.length !== 1) return true;
  }
  return false;
}

/**
 * @param {Element} calendar
 * @returns {CalendarState | null}
 */
function ensure(calendar) {
  if (!(calendar instanceof HTMLElement)) {
    throw new Error("calendar root must be an HTMLElement");
  }

  const existing = states.get(calendar);
  if (existing) return existing;
  if (skipped.has(calendar)) return null;
  if (hasCustomDayContent(calendar)) {
    skipped.add(calendar);
    return null;
  }

  const month = initialMonth(calendar);
  const values = initialValues(calendar);
  const selection = readSelection(calendar);
  const locale =
    calendar.closest("[lang]")?.getAttribute("lang") ??
    document.documentElement.lang ??
    "en";
  const state = /** @type {CalendarState} */ ({
    selection,
    year: month.year,
    month: month.month,
    value: null,
    values: [],
    rangeStart: null,
    rangeEnd: null,
    unavailable: initialUnavailable(calendar, month.year, month.month),
    min: parseDateAttribute(calendar.getAttribute("data-min")),
    max: parseDateAttribute(calendar.getAttribute("data-max")),
    today: initialToday(calendar),
    weekNumbers: hasWeekNumbers(calendar),
    weekOrder: weekOrderFor(calendar, locale),
    locale,
    focused: null
  });

  if (selection === "single") {
    state.value = values[0] ?? null;
    state.values = state.value ? [state.value] : [];
  } else if (selection === "multiple") {
    state.values = values;
  } else {
    state.rangeStart = values[0] ?? null;
    state.rangeEnd = values.length > 1 ? values[values.length - 1] ?? null : null;
    state.value = state.rangeStart;
    if (state.rangeStart) state.values.push(state.rangeStart);
    if (state.rangeEnd) state.values.push(state.rangeEnd);
  }

  const focused =
    calendar
      .querySelector("button[tabindex='0'][data-date]")
      ?.getAttribute("data-date") ?? null;
  state.focused =
    focused && parseDate(focused)
      ? focused
      : state.value ?? state.today ?? isoDate(state.year, state.month, 1);

  states.set(calendar, state);

  const grid = calendar.querySelector("table[role='grid']");
  if (grid) {
    if (state.selection === "single") {
      grid.removeAttribute("aria-multiselectable");
    } else {
      grid.setAttribute("aria-multiselectable", "true");
    }
  }

  setRovingTabindex(calendar, state.focused);
  return state;
}

/** @param {CalendarState} state @param {string} value */
function isDisabled(state, value) {
  const parsed = parseDate(value);
  if (!parsed) return true;
  if (state.min && value < state.min) return true;
  if (state.max && value > state.max) return true;
  return state.unavailable.has(value);
}

/** @param {CalendarState} state @param {string} value */
function isSelected(state, value) {
  if (state.selection === "single") return state.value === value;
  if (state.selection === "multiple") return state.values.includes(value);
  if (!state.rangeStart) return false;
  if (!state.rangeEnd) return state.rangeStart === value;
  return value >= state.rangeStart && value <= state.rangeEnd;
}

/**
 * @param {Element} calendar
 * @param {CalendarState} state
 * @param {string} value
 * @param {boolean} extend
 */
function selectDate(calendar, state, value, extend) {
  if (state.selection === "single") {
    state.value = value;
    state.values = [value];
    state.rangeStart = null;
    state.rangeEnd = null;
  } else if (state.selection === "multiple") {
    const index = state.values.indexOf(value);
    if (index === -1) {
      state.values = [...state.values, value];
    } else {
      state.values = state.values.filter((candidate) => candidate !== value);
    }
    state.value = null;
    state.rangeStart = null;
    state.rangeEnd = null;
  } else if (extend && state.rangeStart) {
    const start = state.rangeStart;
    state.rangeStart = value < start ? value : start;
    state.rangeEnd = value < start ? start : value;
    state.values = [state.rangeStart, state.rangeEnd];
    state.value = state.rangeStart;
  } else if (state.rangeStart && state.rangeEnd) {
    state.rangeStart = value;
    state.rangeEnd = null;
    state.values = [value];
    state.value = value;
  } else if (state.rangeStart) {
    const start = state.rangeStart;
    state.rangeStart = value < start ? value : start;
    state.rangeEnd = value < start ? start : value;
    state.values = [state.rangeStart, state.rangeEnd];
    state.value = state.rangeStart;
  } else {
    state.rangeStart = value;
    state.rangeEnd = null;
    state.values = [value];
    state.value = value;
  }

  state.focused = value;
  emit(calendar, "change", {
    value: state.value,
    values: [...state.values],
    range:
      state.rangeStart && state.rangeEnd
        ? { start: state.rangeStart, end: state.rangeEnd }
        : null
  });
}

/**
 * @param {Element} calendar
 * @param {CalendarState} state
 * @param {string | null} focusDate
 */
function render(calendar, state, focusDate) {
  const table = calendar.querySelector("table[role='grid']");
  if (!table) return;

  for (const value of parseList(calendar.getAttribute("data-unavailable"))) {
    state.unavailable.add(value);
  }

  const names = weekdayLabels(state.locale);
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  if (!thead || !tbody) return;

  const headerRow = document.createElement("tr");
  if (state.weekNumbers) {
    const week = document.createElement("th");
    week.scope = "col";
    week.setAttribute("aria-label", "Week");
    headerRow.append(week);
  }

  for (const index of state.weekOrder) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.setAttribute("aria-label", names.full[index] ?? "");
    cell.textContent = names.short[index] ?? "";
    headerRow.append(cell);
  }

  thead.replaceChildren(headerRow);
  tbody.replaceChildren();

  const firstWeekday = weekdayOf(state.year, state.month, 1);
  const startOffset =
    (firstWeekday - (state.weekOrder[0] ?? 0) + 7) % 7;
  const days = daysInMonth(state.year, state.month);
  const cellCount = Math.ceil((startOffset + days) / 7) * 7;

  let focus =
    focusDate && sameMonth(focusDate, state.year, state.month)
      ? focusDate
      : state.focused && sameMonth(state.focused, state.year, state.month)
        ? state.focused
        : state.value && sameMonth(state.value, state.year, state.month)
          ? state.value
          : state.today && sameMonth(state.today, state.year, state.month)
            ? state.today
            : isoDate(state.year, state.month, 1);

  if (isDisabled(state, focus)) {
    for (let day = 1; day <= days; day += 1) {
      const candidate = isoDate(state.year, state.month, day);
      if (!isDisabled(state, candidate)) {
        focus = candidate;
        break;
      }
    }
  }
  state.focused = focus;

  for (let index = 0; index < cellCount; index += 7) {
    const row = document.createElement("tr");
    const rowStart = new Date(
      Date.UTC(state.year, state.month, 1 - startOffset + index)
    );

    if (state.weekNumbers) {
      const week = document.createElement("th");
      week.scope = "row";
      const number = isoWeek(rowStart);
      week.setAttribute("aria-label", `Week ${number}`);
      week.textContent = pad(number);
      row.append(week);
    }

    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(rowStart);
      date.setUTCDate(date.getUTCDate() + offset);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      const value = isoDate(year, month, day);
      const currentMonth = year === state.year && month === state.month;
      const selected = isSelected(state, value);
      const disabled = !currentMonth || isDisabled(state, value);
      const current = value === state.today;

      const cell = document.createElement("td");
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-selected", String(selected));

      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("data-date", value);
      button.setAttribute("aria-label", dayLabel(state.locale, value));
      button.setAttribute("tabindex", value === focus ? "0" : "-1");
      if (disabled) button.setAttribute("aria-disabled", "true");
      if (current) button.setAttribute("aria-current", "date");
      button.textContent = String(day);

      cell.append(button);
      row.append(cell);
    }

    tbody.append(row);
  }

  const caption = table.querySelector("caption");
  if (caption) {
    caption.textContent = monthLabel(state.locale, state.year, state.month);
  }

  const title = calendar.querySelector(
    ":scope > header > [data-slot='title']"
  );
  if (title) {
    title.textContent = monthLabel(state.locale, state.year, state.month);
  }

  const monthSelect = calendar.querySelector(
    "[data-slot='month'], select[aria-label='Month']"
  );
  if (monthSelect instanceof HTMLSelectElement) {
    const monthFormatter = new Intl.DateTimeFormat(latin(state.locale), {
      month: "long",
      timeZone: "UTC"
    });
    const namesByMonth = Array.from({ length: 12 }, (_, index) =>
      monthFormatter.format(new Date(Date.UTC(2024, index, 1)))
    );

    if (monthSelect.options.length !== 12) {
      monthSelect.replaceChildren();
      for (let index = 0; index < 12; index += 1) {
        const option = document.createElement("option");
        option.value = String(index + 1);
        option.textContent = namesByMonth[index] ?? "";
        monthSelect.append(option);
      }
    } else {
      for (let index = 0; index < 12; index += 1) {
        const option = monthSelect.options[index];
        if (!option) continue;
        option.value = String(index + 1);
        option.textContent = namesByMonth[index] ?? "";
      }
    }
    monthSelect.value = String(state.month + 1);
  }

  const yearSelect = calendar.querySelector(
    "[data-slot='year'], select[aria-label='Year']"
  );
  if (yearSelect instanceof HTMLSelectElement) {
    const value = String(state.year);
    if (![...yearSelect.options].some((option) => option.value === value)) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      yearSelect.append(option);
    }
    yearSelect.value = value;
  }

  calendar.setAttribute("data-month", `${state.year}-${pad(state.month + 1)}`);

  const target = calendar.querySelector(`button[data-date="${focus}"]`);
  if (target instanceof HTMLElement) {
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "nearest" });
  }
}

/**
 * @param {Element} calendar
 * @param {CalendarState} state
 * @param {string} value
 */
function moveFocus(calendar, state, value) {
  const parsed = parseDate(value);
  if (!parsed) return;

  if (parsed.year !== state.year || parsed.month !== state.month) {
    state.year = parsed.year;
    state.month = parsed.month;
    render(calendar, state, value);
    return;
  }

  state.focused = value;
  setRovingTabindex(calendar, value);
  const target = calendar.querySelector(`button[data-date="${value}"]`);
  if (target instanceof HTMLElement) {
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "nearest" });
  }
}

/**
 * @param {Element} calendar
 * @param {CalendarState} state
 * @param {number} months
 */
function shiftMonth(calendar, state, months) {
  const date = new Date(Date.UTC(state.year, state.month + months, 1));
  state.year = date.getUTCFullYear();
  state.month = date.getUTCMonth();
  const focus =
    state.focused && sameMonth(state.focused, state.year, state.month)
      ? state.focused
      : isoDate(state.year, state.month, 1);
  render(calendar, state, focus);
}

on("focusin", ".calendar", (event, element) => {
  if (!(element instanceof HTMLElement)) return;
  const state = ensure(element);
  if (!state) return;
  if (!(event.target instanceof HTMLElement)) return;
  if (!event.target.matches(DAY_SELECTOR)) return;
  const value = event.target.getAttribute("data-date");
  if (value && parseDate(value)) state.focused = value;
});

on("click", ".calendar button[data-date]", (event, element) => {
  if (!(element instanceof HTMLElement)) return;
  const calendar = element.closest(".calendar");
  if (!(calendar instanceof HTMLElement)) return;
  const value = element.getAttribute("data-date");
  if (!value) return;

  const state = ensure(calendar);
  if (!state) return;
  const parsed = parseDate(value);
  if (
    !parsed ||
    parsed.year !== state.year ||
    parsed.month !== state.month ||
    isDisabled(state, value)
  ) {
    event.preventDefault();
    return true;
  }

  selectDate(calendar, state, value, event instanceof MouseEvent && event.shiftKey);
  render(calendar, state, value);
  event.preventDefault();
  return true;
});

on(
  "click",
  ".calendar [data-slot='previous'], .calendar [data-slot='next']",
  (event, element) => {
    if (!(element instanceof HTMLElement)) return;
    const calendar = element.closest(".calendar");
    if (!(calendar instanceof HTMLElement)) return;
    const state = ensure(calendar);
    if (!state) return;
    shiftMonth(
      calendar,
      state,
      element.getAttribute("data-slot") === "next" ? 1 : -1
    );
    event.preventDefault();
    return true;
  }
);

on(
  "change",
  ".calendar [data-slot='month'], .calendar [data-slot='year']",
  (_event, element) => {
    if (!(element instanceof HTMLElement)) return;
    const calendar = element.closest(".calendar");
    if (!(calendar instanceof HTMLElement)) return;
    const state = ensure(calendar);
    if (!state) return;
    const monthSelect = calendar.querySelector(
      "[data-slot='month'], select[aria-label='Month']"
    );
    const yearSelect = calendar.querySelector(
      "[data-slot='year'], select[aria-label='Year']"
    );

    if (monthSelect instanceof HTMLSelectElement) {
      const month = Number(monthSelect.value) - 1;
      if (Number.isInteger(month) && month >= 0 && month < 12) {
        state.month = month;
      }
    }
    if (yearSelect instanceof HTMLSelectElement) {
      const year = Number(yearSelect.value);
      if (Number.isInteger(year)) state.year = year;
    }

    render(calendar, state, isoDate(state.year, state.month, 1));
  }
);

on("keydown", ".calendar", (event, element) => {
  if (!(event instanceof KeyboardEvent)) return;
  if (!(element instanceof HTMLElement)) return;
  if (!(event.target instanceof HTMLElement)) return;
  if (!event.target.matches(DAY_SELECTOR)) return;

  const value = event.target.getAttribute("data-date");
  if (!value) return;
  const parsed = parseDate(value);
  if (!parsed) return;

  const calendar = element;
  const state = ensure(calendar);
  if (!state) return;
  const rtl = isRTL(calendar);
  let next = value;

  if (event.key === "ArrowRight") {
    next = addDays(value, rtl ? -1 : 1);
  } else if (event.key === "ArrowLeft") {
    next = addDays(value, rtl ? 1 : -1);
  } else if (event.key === "ArrowDown") {
    next = addDays(value, 7);
  } else if (event.key === "ArrowUp") {
    next = addDays(value, -7);
  } else if (event.key === "Home" || event.key === "End") {
    const offset =
      (weekdayOf(parsed.year, parsed.month, parsed.day) -
        (state.weekOrder[0] ?? 0) +
        7) %
      7;
    const day =
      event.key === "Home"
        ? Math.max(1, parsed.day - offset)
        : Math.min(daysInMonth(parsed.year, parsed.month), parsed.day + (6 - offset));
    next = isoDate(parsed.year, parsed.month, day);
  } else if (event.key === "PageUp" || event.key === "PageDown") {
    const direction = event.key === "PageDown" ? 1 : -1;
    const target = new Date(
      Date.UTC(
        parsed.year + (event.shiftKey ? direction : 0),
        parsed.month + (event.shiftKey ? 0 : direction),
        1
      )
    );
    const year = target.getUTCFullYear();
    const month = target.getUTCMonth();
    const day = Math.min(parsed.day, daysInMonth(year, month));
    next = isoDate(year, month, day);
  } else {
    return;
  }

  event.preventDefault();
  moveFocus(calendar, state, next);
  return true;
});

init();
