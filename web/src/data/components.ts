import registry from "../../../packages/loseta/registry/registry.json" with { type: "json" };
import { examples } from "./examples";

export type ComponentGroup =
  | "Forms"
  | "Surfaces"
  | "Overlays"
  | "Disclosure"
  | "Navigation"
  | "Feedback";

const groupBy: Record<string, ComponentGroup> = {
  accordion: "Disclosure",
  "aspect-ratio": "Surfaces",
  avatar: "Surfaces",
  breadcrumb: "Navigation",
  button: "Forms",
  "button-group": "Forms",
  checkbox: "Forms",
  field: "Forms",
  input: "Forms",
  label: "Forms",
  "native-select": "Forms",
  pagination: "Navigation",
  progress: "Feedback",
  radio: "Forms",
  separator: "Surfaces",
  spinner: "Feedback",
  switch: "Forms",
  textarea: "Forms",
  toggle: "Forms",
  "toggle-group": "Forms",
  alert: "Surfaces",
  badge: "Surfaces",
  card: "Surfaces",
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
  tabs: "Disclosure"
};

const notesBy: Record<string, string> = {
  accordion:
    "Uses native <details> and <summary>. Put the content directly after summary; exclusive groups use the native name attribute. Mark disabled items with inert.",
  "aspect-ratio":
    "Set --ratio on the root (default 16 / 9). Media children fill the box; data-fit=\"contain\" preserves the whole image.",
  avatar:
    "Render the fallback under the image. CSS cannot detect a broken image, so hide the img (or omit it) when loading fails. Use alt text for img and aria-hidden on decorative badges.",
  breadcrumb:
    "Use nav[aria-label=\"breadcrumb\"] and an ordered list. Mark the current page with aria-current=\"page\" and separators with aria-hidden=\"true\".",
  button:
    "Use data-variant and data-size for the public variants. aria-invalid and aria-expanded are supported states.",
  "button-group":
    "Composition is semantic: the CSS does not require .btn, but the examples use it so the group looks like buttons.",
  card: "Use data-slot=\"title\", \"description\" and \"action\" for parts. data-separator=\"bottom\" adds a header divider.",
  "code-block":
    "Use [data-slot=\"actions\"] for copy and wrap controls; it floats when it is a direct child of the root. Add data-line-numbers to the pre; line numbers need explicit [data-slot=\"line\"] elements. Set style=\"--line-start: 42\" to change the first number and data-wrap to wrap long lines. Copy and wrap behavior is consumer JavaScript; the pre is dir=\"ltr\" and focusable. Syntax highlighting is not included; put token spans inside [data-slot=\"line-content\"]. Use footer for controls below the code; Show More needs your own JavaScript.",
  checkbox: "The .checkbox class is required. Use native checked/disabled and aria-invalid=\"true\".",
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
  spinner:
    "The spinner is a span; add role=\"status\" and a .sr-only label for standalone use. data-size picks sm, default or lg. Motion slows under prefers-reduced-motion.",
  tabs:
    "Requires JavaScript to switch aria-selected and the hidden attribute. CSS styles the visual states.",
  toggle:
    "Use a button with aria-pressed=\"true|false\". CSS styles aria-pressed, not a data-state alias. data-variant and data-size are optional.",
  "toggle-group":
    "Wrap toggles in role=\"group\" with an accessible label. Each toggle carries its own aria-pressed. Single-choice selection belongs to a radio group; data-spacing=\"joined\" merges the edges.",
  tooltip:
    "CSS-only: visible on hover and focus-visible. Use data-arrow for the pointer arrow and data-side/data-align to place it. Keep an aria-label or aria-describedby for screen readers.",
  field: "Use aria-invalid=\"true\" on the control and role=\"alert\" for error messages.",
  table: "Use aria-selected=\"true\" on selectable rows.",
  input: "Use aria-invalid=\"true\" for the invalid state.",
  textarea: "Use aria-invalid=\"true\" for the invalid state.",
  "native-select":
    ".native-select is the native select root. The custom Select is experimental and is not part of v1.",
  switch: "Use input type=\"checkbox\" role=\"switch\" together with the .switch class.",
  radio: "Use .radio and a role=\"radiogroup\" container.",
  label: "Use .label or a native <label> inside .field.",
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
  "Feedback"
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
