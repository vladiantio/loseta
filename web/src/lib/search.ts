export type SearchHeading = {
  depth: 2 | 3;
  id: string;
  text: string;
};

export type SearchPage = {
  route: string;
  title: string;
  description: string;
  group: SearchGroup;
  keywords: string[];
  headings: SearchHeading[];
};

export type SearchIndex = {
  version: 1;
  pages: SearchPage[];
};

export type SearchGroup = "Components" | "Blocks" | "Guides" | "Styles" | "Pages";

export type SearchResult = {
  id: string;
  title: string;
  context: string;
  href: string;
  group: SearchGroup;
  kind: "page" | "heading";
};

export const searchGroupOrder: SearchGroup[] = [
  "Components",
  "Blocks",
  "Guides",
  "Styles",
  "Pages"
];

export function groupForRoute(route: string): SearchGroup {
  if (route.startsWith("/docs/components")) return "Components";
  if (route.startsWith("/blocks")) return "Blocks";
  if (route === "/docs/styles") return "Styles";
  if (route.startsWith("/docs/")) return "Guides";
  return "Pages";
}

function pageResult(page: SearchPage): SearchResult {
  return {
    id: `page:${page.route}`,
    title: page.title,
    context: page.route,
    href: page.route,
    group: page.group,
    kind: "page"
  };
}

function headingResult(page: SearchPage, heading: SearchHeading): SearchResult {
  return {
    id: `heading:${page.route}#${heading.id}`,
    title: heading.text,
    context: `${page.title} · ${page.group}`,
    href: `${page.route}#${heading.id}`,
    group: page.group,
    kind: "heading"
  };
}

/** Flattens pages and table-of-contents headings for the native Command listbox. */
export function searchResults(index: SearchIndex): SearchResult[] {
  return index.pages.flatMap((page) => [
    pageResult(page),
    ...page.headings.map((heading) => headingResult(page, heading))
  ]);
}
