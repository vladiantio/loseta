import { dashboard01Html } from "./block-examples/dashboard-01";
import { login01Html } from "./block-examples/login-01";
import { sidebar01Html } from "./block-examples/sidebar-01";
import { signup01Html } from "./block-examples/signup-01";

export type BlockCategory = "Dashboard" | "Sidebar" | "Login" | "Signup";

export interface Block {
  slug: string;
  title: string;
  category: BlockCategory;
  description: string;
  components: string[];
  html: string;
  wide?: boolean;
  notes: string[];
}

export const blocks = [
  {
    slug: "dashboard-01",
    title: "Dashboard",
    category: "Dashboard",
    description:
      "A complete analytics view with navigation, metrics, a revenue chart and recent transactions.",
    components: [
      "sidebar",
      "card",
      "chart",
      "table",
      "badge",
      "button",
      "avatar",
      "dropdown-menu",
      "input-group",
      "collapsible"
    ],
    html: dashboard01Html,
    wide: true,
    notes: [
      "Install the listed components, then adapt the markup and demo data to your application.",
      "The account menu uses the shipped menu behavior. Chart rendering, data, filtering and active navigation remain consumer-owned.",
      "The shell wraps at narrow widths; the table scrolls inside its own container."
    ]
  },
  {
    slug: "sidebar-01",
    title: "Sidebar",
    category: "Sidebar",
    description:
      "A workspace sidebar with icon navigation, native collapsible groups and an account footer.",
    components: ["sidebar", "collapsible", "avatar"],
    html: sidebar01Html,
    wide: true,
    notes: [
      "Sidebar is CSS-only. The disclosure groups use native details and summary elements.",
      "Keep aria-current synchronized with the consumer's route. A mobile sheet can be composed with the shipped dialog behavior.",
      "The preview uses a fixed height for demonstration; consumers own the surrounding application shell."
    ]
  },
  {
    slug: "login-01",
    title: "Login",
    category: "Login",
    description:
      "A centered sign-in card with email, password, remember-me and a secondary provider action.",
    components: ["card", "field", "input", "label", "button", "checkbox"],
    html: login01Html,
    notes: [
      "Every control has an explicit label and the appropriate autocomplete token.",
      "The preview buttons do not submit. In an application, use a submit button and handle the form action on the server or in client code.",
      "Authentication, password recovery and provider integrations remain consumer-owned."
    ]
  },
  {
    slug: "signup-01",
    title: "Signup",
    category: "Signup",
    description:
      "A centered registration card with account fields, password guidance and terms consent.",
    components: ["card", "field", "input", "label", "button", "checkbox"],
    html: signup01Html,
    notes: [
      "Use autocomplete=\"new-password\" for a new password and connect helper or error text with aria-describedby.",
      "Keep linked terms outside the checkbox label so the label remains a single accessible control.",
      "Account creation, password confirmation and provider integrations remain consumer-owned."
    ]
  }
] satisfies Block[];
