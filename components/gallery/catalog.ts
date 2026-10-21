/**
 * The catalogue: every registry item, filed under the category it is shown in.
 *
 * This list is checked against registry.json by tests/catalog.test.ts — if an
 * item is added to the registry and not filed here (or filed twice), that test
 * fails. The gallery therefore cannot silently under-report what ships.
 */

export const REGISTRY_BASE_URL = "https://ui.lscaturchio.xyz/r";

export function installCommand(name: string) {
  return `npx shadcn add ${REGISTRY_BASE_URL}/${name}.json`;
}

export interface Category {
  slug: string;
  index: string;
  label: string;
  description: string;
  /** Registry item names shown under this category. */
  items: readonly string[];
}

export const CATEGORIES: readonly Category[] = [
  {
    slug: "forms",
    index: "05.1",
    label: "Forms & inputs",
    description: "Everything that takes a value: fields, choosers, and the buttons that submit them.",
    items: [
      "button", "button-group", "calendar", "checkbox", "combobox", "field",
      "form", "input", "input-group", "input-otp", "label", "native-select",
      "radio-group", "select", "slider", "switch", "textarea", "toggle",
      "toggle-group",
    ],
  },
  {
    slug: "overlays",
    index: "05.2",
    label: "Overlays",
    description: "Anything that opens on top of the page — modals, menus, popovers, toasts.",
    items: [
      "alert-dialog", "command", "context-menu", "dialog", "drawer",
      "dropdown-menu", "hover-card", "menubar", "popover", "sheet", "sonner",
      "tooltip",
    ],
  },
  {
    slug: "navigation",
    index: "05.3",
    label: "Navigation",
    description: "Wayfinding: where you are, where you can go, and how to page through it.",
    items: [
      "breadcrumb", "breadcrumb-nav", "direction", "navigation-menu",
      "pagination", "sidebar", "tabs",
    ],
  },
  {
    slug: "data",
    index: "05.4",
    label: "Data display",
    description: "Read-only surfaces: tables, charts, cards, and the small labels around them.",
    items: [
      "aspect-ratio", "avatar", "badge", "card", "carousel", "chart", "empty",
      "item", "kbd", "marker", "table",
    ],
  },
  {
    slug: "feedback",
    index: "05.5",
    label: "Feedback",
    description: "Status told in the identity’s own status tokens — success, warning, info, destructive.",
    items: ["alert", "progress", "skeleton", "spinner"],
  },
  {
    slug: "layout",
    index: "05.6",
    label: "Layout",
    description: "Structure and rhythm: the section shell, dividers, and things that fold away.",
    items: ["accordion", "collapsible", "resizable", "scroll-area", "section", "separator"],
  },
  {
    slug: "chat",
    index: "05.7",
    label: "AI chat",
    description: "UI-only chat primitives. They render messages; the backend is yours.",
    items: ["attachment", "bubble", "message", "message-scroller"],
  },
] as const;

/** Patterns and foundations — shown on /patterns, not in the component catalog. */
export const PATTERN_ITEMS = [
  "active-nav-link", "reveal", "scroll-to-top", "theme", "theme-toggle",
  "use-mobile",
] as const;

/** Components filed under a catalog category. */
export const CATALOG_COMPONENTS = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

/** Everything the registry ships, components plus patterns and foundations. */
export const CATALOG_TOTAL = CATALOG_COMPONENTS + PATTERN_ITEMS.length;
