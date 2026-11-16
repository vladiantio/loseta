import registry from "../../../packages/loseta/registry/registry.json" with { type: "json" };
import { examples } from "./examples";

export type ComponentGroup =
  | "Forms"
  | "Surfaces"
  | "Overlays"
  | "Disclosure"
  | "Navigation"
  | "Feedback"
  | "Conversation";

const groupBy: Record<string, ComponentGroup> = {
  accordion: "Disclosure",
  attachment: "Conversation",
  "aspect-ratio": "Surfaces",
  avatar: "Surfaces",
  breadcrumb: "Navigation",
  bubble: "Conversation",
  button: "Forms",
  "button-group": "Forms",
  calendar: "Forms",
  checkbox: "Forms",
  collapsible: "Disclosure",
  combobox: "Forms",
  command: "Overlays",
  "context-menu": "Overlays",
  drawer: "Overlays",
  field: "Forms",
  "hover-card": "Overlays",
  input: "Forms",
  "input-group": "Forms",
  "input-otp": "Forms",
  label: "Forms",
  marker: "Conversation",
  menubar: "Navigation",
  message: "Conversation",
  "message-scroller": "Conversation",
  "navigation-menu": "Navigation",
  "native-select": "Forms",
  pagination: "Navigation",
  progress: "Feedback",
  questionnaire: "Conversation",
  radio: "Forms",
  resizable: "Surfaces",
  "scroll-area": "Surfaces",
  select: "Forms",
  separator: "Surfaces",
  sidebar: "Navigation",
  slider: "Forms",
  spinner: "Feedback",
  switch: "Forms",
  textarea: "Forms",
  toast: "Feedback",
  toggle: "Forms",
  "toggle-group": "Forms",
  alert: "Surfaces",
  badge: "Surfaces",
  card: "Surfaces",
  carousel: "Surfaces",
  chart: "Surfaces",
  "code-block": "Surfaces",
  empty: "Surfaces",
  item: "Surfaces",
  kbd: "Surfaces",
  skeleton: "Surfaces",
  table: "Surfaces",
  "alert-dialog": "Overlays",
  dialog: "Overlays",
  "dropdown-menu": "Overlays",
  popover: "Overlays",
  tooltip: "Overlays",
  trace: "Conversation",
  tabs: "Disclosure"
};

const notesBy: Record<string, string> = {
  accordion:
    "Uses native <details> and <summary>. Put the content directly after summary; exclusive groups use the native name attribute. Mark disabled items with inert.",
  attachment:
    "Use aria-busy=\"true\" while uploading or processing. Put an error in [data-slot=\"description\"] with role=\"alert\"; the root styles it through :has(). Media, content and actions use data-slot. An optional [data-slot=\"trigger\"] overlay keeps actions above the hit area.",
  "aspect-ratio":
    "Set --ratio on the root (default 16 / 9). Media children fill the box; data-fit=\"contain\" preserves the whole image.",
  avatar:
    "Render the fallback under the image. CSS cannot detect a broken image, so hide the img (or omit it) when loading fails. Use alt text for img and aria-hidden on decorative badges.",
  breadcrumb:
    "Use nav[aria-label=\"breadcrumb\"] and an ordered list. Mark the current page with aria-current=\"page\" and separators with aria-hidden=\"true\".",
  bubble:
    "Variants default, secondary, muted, tinted, outline, ghost and destructive. [data-slot=\"content\"] may be a div, a or button. Reactions use [data-slot=\"reactions\"] with [data-slot=\"reaction\"] buttons and aria-pressed. data-align=\"end\" aligns a standalone bubble.",
  button:
    "Use data-variant and data-size for the public variants. Mark inline icons with data-icon=\"inline-start|inline-end\"; icon-only buttons need an accessible label. aria-invalid and aria-expanded are supported states. Apply .btn to an <a> for link actions without adding role=\"button\".",
  "button-group":
    "Use role=\"group\" with an aria-label on the root. data-orientation=\"horizontal|vertical\" controls the layout; horizontal is the default. Compose buttons, inputs, dropdown-menu, popover or select wrappers, span/label/output text and hr[role=\"separator\"]. Use a toggle-group when the buttons toggle state instead of performing actions.",
  card: "Use data-slot=\"title\", \"description\" and \"action\" for parts. data-separator=\"bottom\" adds a header divider.",
  "code-block":
    "Use [data-slot=\"actions\"] for copy and wrap controls; it floats when it is a direct child of the root. Add data-line-numbers to the pre; line numbers need explicit [data-slot=\"line\"] elements. Set style=\"--line-start: 42\" to change the first number and data-wrap to wrap long lines. Copy and wrap behavior is consumer JavaScript; the pre is dir=\"ltr\" and focusable. Syntax highlighting is not included; put token spans inside [data-slot=\"line-content\"]. Use footer for controls below the code; Show More needs your own JavaScript.",
  checkbox:
    "The .checkbox class is required. Use native checked/disabled and aria-invalid=\"true\"; set the indeterminate property from JavaScript. Groups compose with .fieldset, a legend and [data-slot=\"checkbox-group\"].",
  dialog:
    "Uses native <dialog>. CSS only handles presentation; call showModal() and close() from your JavaScript.",
  "alert-dialog":
    "Uses native <dialog>. CSS only handles presentation; call showModal() and close() from your JavaScript.",
  "dropdown-menu":
    "Requires JavaScript for open/close and keyboard navigation. Toggle aria-hidden on [data-popover] and aria-expanded on the trigger.",
  popover:
    "Requires JavaScript for open/close. Toggle aria-hidden on [data-popover] and aria-expanded on the trigger.",
  pagination:
    "Use nav[aria-label=\"pagination\"] and .btn links. The current page uses aria-current=\"page\"; the ellipsis is decorative. Button is optional composition, not a hard dependency.",
  progress:
    "Use native <progress> with value and max. Omit value for the indeterminate state. Keep a text fallback inside the element.",
  separator:
    "Use <hr class=\"separator\"> for a semantic horizontal separator. For vertical use <div role=\"separator\" data-orientation=\"vertical\">; decorative separators use role=\"presentation\" or aria-hidden.",
  "context-menu":
    "CSS cannot follow the pointer. The consumer sets --context-x and --context-y on the panel (physical left/top, even in RTL), toggles aria-hidden and manages roving focus. Items use role=\"menu\" and role=\"menuitem\".",
  calendar:
    "A native table month grid. Day cells use aria-selected; day buttons use aria-current=\"date\" and aria-disabled. Month navigation, selection and keyboard grid movement are consumer JavaScript.",
  carousel:
    "A scroll-snap viewport and track. Items use scroll-snap-align. Consumers own scrolling, aria-current on indicators, aria-hidden/inert on offscreen slides and any autoplay.",
  chart:
    "CSS chrome only: container, plot, legend and tooltip. data-series=\"1\" through \"5\" map to --chart-1 through --chart-5; consumers render the SVG or canvas and position the tooltip.",
  collapsible:
    "Native <details> with <summary> as the trigger and content directly after it. Use [open] and inert; no JavaScript is required. For exclusive groups, use several details with the same name.",
  combobox:
    "An input with role=\"combobox\", aria-expanded and aria-controls. The panel is a [data-popover] containing a [role=\"listbox\"]. Add aria-multiselectable=\"true\" for multiple selection. Filtering, selection and keyboard navigation are consumer JavaScript; selected chips are composed with badges.",
  command:
    "Content-only: a search field composed with input-group and a listbox of commands. Place it inside a dialog, popover or card. Filtering, keyboard navigation and closing on selection are consumer JavaScript. Shortcuts use [data-slot=\"shortcut\"].",
  drawer:
    "Native <dialog> with data-side=\"block-end\". CSS only handles presentation; call showModal() and close(). The handle is [data-slot=\"handle\"]; drag gestures are consumer JavaScript. data-size sm/default/lg changes the height.",
  "input-group":
    "role=\"group\" root. Addons use [data-slot=\"addon\"] and data-align=\"inline-start|inline-end|block-start|block-end\". The group owns the border and focus ring; inner input and textarea controls are borderless. Clicking an addon does not focus the control; that is consumer JavaScript.",
  "input-otp":
    "A single native input. Use inputmode=\"numeric\", autocomplete=\"one-time-code\", maxlength and pattern. CSS draws no per-digit slots and does not auto-advance; those need consumer behavior.",
  "scroll-area":
    "Put .scroll-area on the scroll container and size it with your own layout or inline styles. Native scrollbars follow the --scrollbar-* tokens; data-orientation limits the axis and data-size=\"sm\" narrows the scrollbar. A scrollable region needs tabindex=\"0\" and an accessible name.",
  select:
    "A button with role=\"combobox\", aria-expanded and aria-controls. The panel is a [data-popover] containing a [role=\"listbox\"]. Single-select only. Open/close, selection and keyboard navigation are consumer JavaScript; update [data-slot=\"value\"] and remove data-placeholder when a value is selected.",
  resizable:
    "Flex layout with panels sized by --panel-size flex-grow. Handles use role=\"separator\" with aria-orientation and aria-valuenow/min/max; drag and keyboard resizing are consumer JavaScript.",
  sidebar:
    "Composition, not a stateful widget. Use an aside with header/section/footer; active links use aria-current=\"page\"; groups use collapsible; the mobile composition uses sheet.",
  slider:
    "Native input[type=\"range\"]. accent-color draws the filled track and thumb; a custom thumb needs appearance:none and consumer-managed fill. data-size sm/default/lg changes the hit area.",
  "hover-card":
    "CSS-only: opens on hover and focus-within with a 300ms delay. Point the trigger at the panel with aria-describedby. Use popover for interactive content that needs explicit dismissal.",
  marker:
    "Use data-variant=\"separator\" for a divider and \"border\" for a trailing rule. The icon is decorative; put the status in the content text and use role=\"status\" for live updates.",
  menubar:
    "role=\"menubar\" with .menubar-item wrappers (role=\"none\"). Each trigger is role=\"menuitem\" with aria-haspopup=\"menu\" and aria-expanded; submenus are [data-popover] panels with role=\"menu\". Roving focus and arrow keys are consumer JavaScript; there is no built-in mobile layout.",
  "navigation-menu":
    "nav > ul > li. Triggers use aria-expanded and aria-controls; panels are [data-popover] panels with links and title/description slots. Open/close and keyboard navigation are consumer JavaScript; there is no built-in mobile layout.",
  sheet:
    "Native <dialog> with data-side=\"inline-start|inline-end\". CSS only handles presentation; call showModal() and close(). Use header/section/footer inside the panel. data-size sm/default/lg changes the width.",
  spinner:
    "The spinner is a span; add role=\"status\" and a .sr-only label for standalone use. data-size picks sm, default or lg. Motion slows under prefers-reduced-motion.",
  tabs:
    "Requires JavaScript to switch aria-selected and the hidden attribute. CSS styles the visual states.",
  toggle:
    "Use a button with aria-pressed=\"true|false\". CSS styles aria-pressed, not a data-state alias. data-variant and data-size are optional.",
  "toggle-group":
    "Wrap toggles in role=\"group\" with an accessible label. Each toggle carries its own aria-pressed. Single-choice selection belongs to a radio group; data-spacing=\"joined\" merges the edges.",
  trace:
    "A native details disclosure. Put the line in summary with data-slot icon, title and status, and the detail in data-slot body. Use data-variant=\"error\" or \"success\" on status; aria-busy=\"true\" marks a running step. Nested traces compose inside the body.",
  tooltip:
    "CSS-only: visible on hover and focus-visible. Use data-arrow for the pointer arrow and data-side/data-align to place it. Keep an aria-label or aria-describedby for screen readers.",
  field: "Use aria-invalid=\"true\" on the control and role=\"alert\" for error messages.",
  table: "Use aria-selected=\"true\" on selectable rows.",
  input:
    "Pair every input with a label; a placeholder is not a label. Use native required and disabled states, aria-invalid=\"true\" for the invalid state and type=\"file\" for uploads; the native file-selector button is styled. Compose labels and descriptions with .field.",
  textarea: "Use aria-invalid=\"true\" for the invalid state.",
  toast:
    "Wrap toasts in .toaster for fixed positioning. Items use role=\"status\" or role=\"alert\"; timing and dismissal are consumer JavaScript. Sonner is a compatibility note, not a registry item; keep the toast markup and add Sonner in consumer code when you need its queue.",
  message:
    "A presentational row. Avatar, header, content and footer use data-slot; data-align=\"start|end\" controls the side. Compose the surface with bubble and give a message group an accessible name.",
  "message-scroller":
    "The viewport is the scroll container and needs tabindex=\"0\" and an accessible name. Following new messages, anchoring, scroll position and showing [data-slot=\"jump\"] are consumer JavaScript; the jump button needs an accessible label.",
  "native-select":
    ".native-select is the native select root. The custom Select is a separate component with its own install.",
  switch:
    "Use input[type=\"checkbox\"] with role=\"switch\" and the .switch class. Compose rows with .field[data-orientation=\"horizontal\"] and a label; a label wrapping a .field becomes a selectable card. data-size=\"sm\" shrinks the control and aria-invalid=\"true\" marks it invalid. Native checked and disabled states need no JavaScript.",
  questionnaire:
    "A sequence of fieldset steps. Use aria-current=\"step\" on the active item and hidden on inactive ones, a native progress with an accessible name, and native radios, checkboxes and inputs for answers. Step changes, validation and completion are consumer JavaScript.",
  radio:
    "The .radio class is required. Use native checked/disabled and aria-invalid=\"true\". Compose rows with .field[data-orientation=\"horizontal\"] and a label; group them with role=\"radiogroup\", using [data-slot=\"radio-group\"] inside a .fieldset.",
  label: "Use .label or a native <label> inside .field. A label wrapping a .field becomes a selectable card.",
  empty: "Uses header/figure/section/footer structure.",
  item: "Uses figure/section/aside/header/footer structure.",
  kbd: "Use .kbd inside menus, tooltips or shortcut hints.",
  skeleton: "Set width and height inline or with your own layout classes.",
  alert: "Use role=\"alert\" for dynamic messages."
};

export interface ComponentDoc {
  id: string;
  title: string;
  description: string;
  group: ComponentGroup;
  status: string;
  deps: string[];
  optional: string[];
  files: {
    path: string;
    target: string;
    role: string;
    layer: string;
  }[];
  examples: {
    title: string;
    html: string;
  }[];
  notes: string[];
}

export const components: ComponentDoc[] = registry.items
  .filter(
    (item) =>
      item.type === "component" &&
      (item.status === "stable" || item.status === "experimental")
  )
  .map((item) => ({
    id: item.name,
    title: item.title,
    description: item.description,
    group: groupBy[item.name] ?? "Surfaces",
    status: item.status,
    deps: item.registryDependencies ?? [],
    optional: item.optionalDependencies ?? [],
    files: item.files,
    examples: examples[item.name] ?? [],
    notes: notesBy[item.name] ? [notesBy[item.name]] : []
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

export const stableComponents = components.filter(
  (component) => component.status === "stable"
);

export const experimentalComponents = components.filter(
  (component) => component.status === "experimental"
);

export const componentGroups: ComponentGroup[] = [
  "Forms",
  "Surfaces",
  "Overlays",
  "Disclosure",
  "Navigation",
  "Feedback",
  "Conversation"
];

export function getComponent(id: string): ComponentDoc | undefined {
  return components.find((component) => component.id === id);
}

export function componentsInGroup(group: ComponentGroup): ComponentDoc[] {
  return components.filter((component) => component.group === group);
}

export function stableComponentsInGroup(group: ComponentGroup): ComponentDoc[] {
  return stableComponents.filter((component) => component.group === group);
}
