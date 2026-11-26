import type { Example } from "./types";
import {
  bell,
  calculator,
  calendarIcon,
  check,
  clipboardPaste,
  code,
  copy,
  creditCard,
  fileText,
  folder,
  folderPlus,
  grid,
  helpCircle,
  home,
  image,
  inbox,
  list,
  plus,
  scissors,
  search,
  settings,
  smile,
  trash,
  user,
  zoomIn,
  zoomOut
} from "./icons";

interface ItemOptions {
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
}

interface SearchOptions {
  autofocus?: boolean;
  dir?: "ltr" | "rtl";
  empty?: string;
  attrs?: string;
  tag?: "div" | "section";
}

const indicator = `<span data-slot="indicator" aria-hidden="true">${check}</span>`;

const item = (label: string, options: ItemOptions = {}) => {
  const disabled = options.disabled ? ' aria-disabled="true"' : "";
  const shortcut = options.shortcut
    ? `<span data-slot="shortcut">${options.shortcut}</span>`
    : "";
  const content = [
    options.icon ?? "",
    `<span data-slot="text">${label}</span>`,
    shortcut,
    indicator
  ]
    .filter(Boolean)
    .map((line) => `        ${line}`)
    .join("\n");
  return `      <div role="option"${disabled}>
${content}
      </div>`;
};

const group = (id: string, heading: string, items: string[]) =>
  `    <div role="group" aria-labelledby="${id}">
      <div data-slot="label" id="${id}" aria-hidden="true">${heading}</div>
${items.join("\n")}
    </div>`;

const separator = `    <div role="separator" aria-hidden="true"></div>`;

const indent = (html: string, spaces: number) =>
  html
    .split("\n")
    .map((line) => `${" ".repeat(spaces)}${line}`)
    .join("\n");

const command = (
  id: string,
  label: string,
  placeholder: string,
  groups: string,
  options: SearchOptions = {}
) => {
  const listboxId = `demo-command-listbox-${id}`;
  const direction = options.dir ? ` dir="${options.dir}"` : "";
  const autofocus = options.autofocus ? " autofocus" : "";
  const tag = options.tag ?? "div";
  return `<${tag} class="command"${options.attrs ? ` ${options.attrs}` : ""}>
  <div data-slot="command-input">
    <div class="input-group" role="group" aria-label="${label}">
      <input class="input" type="text" role="combobox" aria-controls="${listboxId}" aria-expanded="true" aria-autocomplete="list" placeholder="${placeholder}" aria-label="${label}"${direction}${autofocus}>
      <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
    </div>
  </div>
  <div role="listbox" id="${listboxId}" aria-label="${label}">
${groups}
    <div data-slot="empty" hidden>${options.empty ?? "No results found."}</div>
  </div>
</${tag}>`;
};

const commandDialog = (id: string, content: string) => `<button type="button" class="btn" data-variant="outline" data-open-dialog="demo-command-${id}">
  Open Menu
</button>

<dialog class="dialog" id="demo-command-${id}" aria-labelledby="demo-command-${id}-title" aria-describedby="demo-command-${id}-description">
  <div style="inset-block-start: 33.333%; translate: -50% 0; gap: 0; padding: 0; overflow: hidden">
    <header class="sr-only">
      <h2 data-slot="title" id="demo-command-${id}-title">Command Palette</h2>
      <p data-slot="description" id="demo-command-${id}-description">Search for a command to run...</p>
    </header>
${indent(content, 4)}
  </div>
</dialog>`;

const defaultGroups = `${group(
  "demo-command-default-suggestions",
  "Suggestions",
  [
    item("Calendar", { icon: calendarIcon }),
    item("Search Emoji", { icon: smile }),
    item("Calculator", { icon: calculator, disabled: true })
  ]
)}
${separator}
${group("demo-command-default-settings", "Settings", [
  item("Profile", { icon: user, shortcut: "⌘P" }),
  item("Billing", { icon: creditCard, shortcut: "⌘B" }),
  item("Settings", { icon: settings, shortcut: "⌘S" })
])}`;

const scrollableGroups = `${group("demo-command-scrollable-navigation", "Navigation", [
  item("Home", { icon: home, shortcut: "⌘H" }),
  item("Inbox", { icon: inbox, shortcut: "⌘I" }),
  item("Documents", { icon: fileText, shortcut: "⌘D" }),
  item("Folders", { icon: folder, shortcut: "⌘F" })
])}
${separator}
${group("demo-command-scrollable-actions", "Actions", [
  item("New File", { icon: plus, shortcut: "⌘N" }),
  item("New Folder", { icon: folderPlus, shortcut: "⇧⌘N" }),
  item("Copy", { icon: copy, shortcut: "⌘C" }),
  item("Cut", { icon: scissors, shortcut: "⌘X" }),
  item("Paste", { icon: clipboardPaste, shortcut: "⌘V" }),
  item("Delete", { icon: trash, shortcut: "⌫" })
])}
${separator}
${group("demo-command-scrollable-view", "View", [
  item("Grid View", { icon: grid }),
  item("List View", { icon: list }),
  item("Zoom In", { icon: zoomIn, shortcut: "⌘+" }),
  item("Zoom Out", { icon: zoomOut, shortcut: "⌘-" })
])}
${separator}
${group("demo-command-scrollable-account", "Account", [
  item("Profile", { icon: user, shortcut: "⌘P" }),
  item("Billing", { icon: creditCard, shortcut: "⌘B" }),
  item("Settings", { icon: settings, shortcut: "⌘S" }),
  item("Notifications", { icon: bell }),
  item("Help &amp; Support", { icon: helpCircle })
])}
${separator}
${group("demo-command-scrollable-tools", "Tools", [
  item("Calculator", { icon: calculator }),
  item("Calendar", { icon: calendarIcon }),
  item("Image Editor", { icon: image }),
  item("Code Editor", { icon: code })
])}`;

const frame = 'style="width: 100%; max-width: 24rem; border: 1px solid var(--border); border-radius: var(--radius-lg)"';

export const commandExamples: Example[] = [
  {
    title: "Default",
    html: command("1", "Search commands", "Type a command or search...", defaultGroups, {
      attrs: frame
    })
  },
  {
    title: "Basic",
    html: commandDialog(
      "basic",
      command(
        "2",
        "Search commands",
        "Type a command or search...",
        group("demo-command-basic-suggestions", "Suggestions", [
          item("Calendar"),
          item("Search Emoji"),
          item("Calculator")
        ]),
        { autofocus: true, tag: "section" }
      )
    )
  },
  {
    title: "Shortcuts",
    html: commandDialog(
      "shortcuts",
      command(
        "3",
        "Search commands",
        "Type a command or search...",
        group("demo-command-shortcuts-settings", "Settings", [
          item("Profile", { icon: user, shortcut: "⌘P" }),
          item("Billing", { icon: creditCard, shortcut: "⌘B" }),
          item("Settings", { icon: settings, shortcut: "⌘S" })
        ]),
        { autofocus: true, tag: "section" }
      )
    )
  },
  {
    title: "Groups",
    html: commandDialog(
      "groups",
      command(
        "4",
        "Search commands",
        "Type a command or search...",
        `${group("demo-command-groups-suggestions", "Suggestions", [
          item("Calendar", { icon: calendarIcon }),
          item("Search Emoji", { icon: smile }),
          item("Calculator", { icon: calculator })
        ])}
${separator}
${group("demo-command-groups-settings", "Settings", [
  item("Profile", { icon: user, shortcut: "⌘P" }),
  item("Billing", { icon: creditCard, shortcut: "⌘B" }),
  item("Settings", { icon: settings, shortcut: "⌘S" })
])}`,
        { autofocus: true, tag: "section" }
      )
    )
  },
  {
    title: "Scrollable",
    html: commandDialog(
      "scrollable",
      command("5", "Search commands", "Type a command or search...", scrollableGroups, {
        autofocus: true,
        tag: "section"
      })
    )
  },
  {
    title: "Right-to-left",
    html: command(
      "6",
      "ابحث عن الأوامر",
      "اكتب أمرًا أو ابحث...",
      `${group("demo-command-rtl-suggestions", "اقتراحات", [
        item("التقويم", { icon: calendarIcon }),
        item("البحث عن الرموز التعبيرية", { icon: smile }),
        item("الآلة الحاسبة", { icon: calculator, disabled: true })
      ])}
${separator}
${group("demo-command-rtl-settings", "الإعدادات", [
  item("الملف الشخصي", { icon: user, shortcut: "⌘P" }),
  item("الفوترة", { icon: creditCard, shortcut: "⌘B" }),
  item("الإعدادات", { icon: settings, shortcut: "⌘S" })
])}`,
      {
        attrs: `${frame} dir="rtl" lang="ar"`,
        dir: "rtl",
        empty: "لم يتم العثور على نتائج."
      }
    )
  }
];
