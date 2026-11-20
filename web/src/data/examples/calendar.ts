import type { Example } from "./types";
import { chevronDown, chevronLeft, chevronRight } from "./icons";

const calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/></svg>`;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر"
];

type Weekday = [full: string, short: string];

type CalendarLocale = {
  months: string[];
  weekdays: Weekday[];
  dayLabel: (year: number, monthIndex: number, day: number) => string;
  previous: string;
  next: string;
};

const ENGLISH: CalendarLocale = {
  months: MONTHS,
  weekdays: [
    ["Sunday", "Su"],
    ["Monday", "Mo"],
    ["Tuesday", "Tu"],
    ["Wednesday", "We"],
    ["Thursday", "Th"],
    ["Friday", "Fr"],
    ["Saturday", "Sa"]
  ],
  dayLabel: (year, monthIndex, day) =>
    `${MONTHS[monthIndex]} ${day}, ${year}`,
  previous: "Previous month",
  next: "Next month"
};

const ARABIC: CalendarLocale = {
  months: ARABIC_MONTHS,
  weekdays: [
    ["الأحد", "أحد"],
    ["الاثنين", "اثن"],
    ["الثلاثاء", "ثلا"],
    ["الأربعاء", "أرب"],
    ["الخميس", "خمي"],
    ["الجمعة", "جمع"],
    ["السبت", "سبت"]
  ],
  dayLabel: (year, monthIndex, day) =>
    `${day} ${ARABIC_MONTHS[monthIndex]} ${year}`,
  previous: "الشهر السابق",
  next: "الشهر التالي"
};

const pad = (value: number): string => String(value).padStart(2, "0");

const isoDate = (year: number, monthIndex: number, day: number): string =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

const monthLabel = (
  year: number,
  monthIndex: number,
  locale: CalendarLocale
): string => `${locale.months[monthIndex]} ${year}`;

const isoWeek = (date: Date): number => {
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
};

const indent = (markup: string, spaces: number): string =>
  markup
    .split("\n")
    .map((line) => `${" ".repeat(spaces)}${line}`)
    .join("\n");

type CalendarOptions = {
  year: number;
  monthIndex: number;
  selected?: string[];
  disabled?: string[];
  today?: string;
  weekNumbers?: boolean;
  dropdowns?: boolean;
  multiselectable?: boolean;
  width?: string;
  locale?: CalendarLocale;
  dir?: "rtl";
};

const dropdownCaption = (year: number, monthIndex: number): string => `\
<span data-slot="caption">
    <span data-slot="dropdown">
      <select aria-label="Month">
${MONTHS.map(
  (month, index) =>
    `        <option value="${index + 1}"${index === monthIndex ? " selected" : ""}>${month}</option>`
).join("\n")}
      </select>
      ${chevronDown}
    </span>
    <span data-slot="dropdown">
      <select aria-label="Year">
${[2024, 2025, 2026, 2027, 2028]
  .map(
    (option) =>
      `        <option value="${option}"${option === year ? " selected" : ""}>${option}</option>`
  )
  .join("\n")}
      </select>
      ${chevronDown}
    </span>
  </span>`;

const calendarTable = ({
  year,
  monthIndex,
  selected = [],
  disabled = [],
  today,
  weekNumbers = false,
  multiselectable = false,
  locale = ENGLISH
}: CalendarOptions): string => {
  const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const selectedDays = new Set(selected);
  const disabledDays = new Set(disabled);
  const rows: string[] = [];

  for (let index = 0; index < cellCount; index += 7) {
    const cells: string[] = [];

    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(
        Date.UTC(year, monthIndex, index + offset - firstWeekday + 1)
      );
      const cellYear = date.getUTCFullYear();
      const cellMonth = date.getUTCMonth();
      const cellDay = date.getUTCDate();
      const currentMonth = cellMonth === monthIndex && cellYear === year;
      const key = isoDate(cellYear, cellMonth, cellDay);
      const isSelected = selectedDays.has(key);
      const isDisabled = !currentMonth || disabledDays.has(key);
      const attributes = [
        `type="button"`,
        `aria-label="${locale.dayLabel(cellYear, cellMonth, cellDay)}"`,
        isDisabled ? `aria-disabled="true"` : "",
        today === key ? `aria-current="date"` : ""
      ]
        .filter(Boolean)
        .join(" ");

      cells.push(
        `<td role="gridcell" aria-selected="${isSelected ? "true" : "false"}"><button ${attributes}>${cellDay}</button></td>`
      );
    }

    const rowStart = new Date(
      Date.UTC(year, monthIndex, index - firstWeekday + 1)
    );
    const weekNumber = weekNumbers
      ? `        <th scope="row" aria-label="Week ${isoWeek(rowStart)}">${pad(isoWeek(rowStart))}</th>\n`
      : "";

    rows.push(
      `      <tr>\n${weekNumber}${cells.map((cell) => `        ${cell}`).join("\n")}\n      </tr>`
    );
  }

  const columns = locale.weekdays
    .map(
      ([full, short]) => `        <th scope="col" aria-label="${full}">${short}</th>`
    )
    .join("\n");
  const weekColumn = weekNumbers
    ? `        <th scope="col" aria-label="Week"></th>\n`
    : "";

  return `<table role="grid"${multiselectable ? ' aria-multiselectable="true"' : ""}>
    <caption class="sr-only">${monthLabel(year, monthIndex, locale)}</caption>
    <thead>
      <tr>
${weekColumn}${columns}
      </tr>
    </thead>
    <tbody>
${rows.join("\n")}
    </tbody>
  </table>`;
};

const calendar = (options: CalendarOptions): string => {
  const {
    year,
    monthIndex,
    dropdowns = false,
    width,
    dir,
    locale = ENGLISH
  } = options;
  const caption = dropdowns
    ? dropdownCaption(year, monthIndex)
    : `<span data-slot="title" aria-live="polite">${monthLabel(year, monthIndex, locale)}</span>`;
  const attributes = [
    dir ? `dir="${dir}" lang="ar"` : "",
    width ? `style="width: ${width}"` : ""
  ].filter(Boolean);

  return `<div class="calendar"${attributes.length > 0 ? ` ${attributes.join(" ")}` : ""}>
  <header>
    <button type="button" aria-label="${locale.previous}">${chevronLeft}</button>
${indent(caption, 4)}
    <button type="button" aria-label="${locale.next}">${chevronRight}</button>
  </header>
${indent(calendarTable({ ...options, locale }), 2)}
</div>`;
};

const rangeJanuary = Array.from({ length: 20 }, (_, index) =>
  isoDate(2026, 0, 12 + index)
);
const rangeFebruary = Array.from({ length: 12 }, (_, index) =>
  isoDate(2026, 1, 1 + index)
);
const unavailable = Array.from({ length: 15 }, (_, index) =>
  isoDate(2026, 2, 12 + index)
);

const timeField = (id: string, label: string, value: string): string => `\
<div class="field">
      <label class="label" for="${id}">${label}</label>
      <input class="input" id="${id}" type="time" value="${value}" step="60">
    </div>`;

export const calendarExamples: Example[] = [
  {
    title: "Default",
    html: calendar({
      year: 2026,
      monthIndex: 1,
      selected: ["2026-02-14"],
      today: "2026-02-12"
    })
  },
  {
    title: "Month and year selector",
    html: calendar({
      year: 2026,
      monthIndex: 1,
      selected: ["2026-02-14"],
      today: "2026-02-12",
      dropdowns: true
    })
  },
  {
    title: "Range",
    html: `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem">
${indent(
  calendar({
    year: 2026,
    monthIndex: 0,
    selected: rangeJanuary,
    today: "2026-01-19",
    multiselectable: true
  }),
  2
)}
${indent(
  calendar({
    year: 2026,
    monthIndex: 1,
    selected: rangeFebruary,
    multiselectable: true
  }),
  2
)}
</div>`
  },
  {
    title: "Unavailable dates",
    html: calendar({
      year: 2026,
      monthIndex: 2,
      selected: ["2026-03-06"],
      disabled: unavailable
    })
  },
  {
    title: "Week numbers",
    html: calendar({
      year: 2026,
      monthIndex: 1,
      selected: ["2026-02-14"],
      today: "2026-02-12",
      weekNumbers: true,
      width: "20.5rem"
    })
  },
  {
    title: "Presets",
    html: `<div class="card" data-size="sm" style="width: 20rem; margin-inline: auto">
  <section>
${indent(
  calendar({
    year: 2026,
    monthIndex: 1,
    selected: ["2026-02-12"],
    today: "2026-02-20",
    width: "100%"
  }),
  4
)}
  </section>
  <footer style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem">
    <button type="button" class="btn" data-variant="outline" data-size="sm">Today</button>
    <button type="button" class="btn" data-variant="outline" data-size="sm">Tomorrow</button>
    <button type="button" class="btn" data-variant="outline" data-size="sm">In 3 days</button>
    <button type="button" class="btn" data-variant="outline" data-size="sm">In a week</button>
  </footer>
</div>`
  },
  {
    title: "Date and time",
    html: `<div class="card" data-size="sm" style="width: 20rem; margin-inline: auto">
  <section>
${indent(
  calendar({
    year: 2026,
    monthIndex: 1,
    selected: ["2026-02-12"],
    today: "2026-02-20",
    width: "100%"
  }),
  4
)}
  </section>
  <footer>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%">
      ${indent(timeField("demo-calendar-time-start", "Start time", "10:30"), 6)}
      ${indent(timeField("demo-calendar-time-end", "End time", "12:30"), 6)}
    </div>
  </footer>
</div>`
  },
  {
    title: "Date picker",
    html: `<div style="display: flex; align-items: flex-start; justify-content: center; min-height: 27rem">
  <div class="popover" data-demo="calendar" style="display: flex; flex-direction: column; align-items: stretch; width: 20rem">
    <button type="button" class="btn" data-variant="outline" aria-haspopup="dialog" aria-expanded="true" aria-controls="demo-calendar-picker-panel" style="justify-content: space-between">
      <span style="display: inline-flex; align-items: center; gap: 0.5rem">${calendarIcon} February 14, 2026</span>
      ${chevronDown}
    </button>
    <div data-popover data-side="bottom" data-align="start" id="demo-calendar-picker-panel" role="dialog" tabindex="-1" aria-label="Choose a date" aria-hidden="false" style="width: 20rem">
${indent(
  calendar({
    year: 2026,
    monthIndex: 1,
    selected: ["2026-02-14"],
    today: "2026-02-12",
    width: "100%"
  }),
  6
)}
    </div>
  </div>
</div>`
  },
  {
    title: "Right-to-left",
    html: calendar({
      year: 2026,
      monthIndex: 1,
      selected: ["2026-02-14"],
      today: "2026-02-12",
      locale: ARABIC,
      dir: "rtl"
    })
  }
];
