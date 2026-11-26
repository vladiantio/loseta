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
  score: number;
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

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function editDistance(left: string, right: string, limit: number): number {
  if (Math.abs(left.length - right.length) > limit) return limit + 1;
  if (left === right) return 0;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    let rowMinimum = current[0];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution =
        previous[rightIndex - 1] +
        (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
      const insertion = current[rightIndex - 1] + 1;
      const deletion = previous[rightIndex] + 1;
      const value = Math.min(substitution, insertion, deletion);
      current.push(value);
      rowMinimum = Math.min(rowMinimum, value);
    }

    if (rowMinimum > limit) return limit + 1;
    previous = current;
  }

  return previous[right.length];
}

function tokenScore(token: string, value: string): number {
  if (!token) return 0;
  if (value.includes(token)) return value.startsWith(token) ? 3 : 2.5;

  let best = 0;
  for (const word of value.split(" ")) {
    if (!word) continue;
    if (word.startsWith(token) && token.length >= 2) {
      best = Math.max(best, 2.25);
      continue;
    }

    const limit = token.length >= 7 ? 2 : 1;
    if (token.length >= 3 && editDistance(token, word, limit) <= limit) {
      best = Math.max(best, 1.5);
    }
  }

  return best;
}

type WeightedField = {
  value: string;
  weight: number;
};

function scoreFields(queryTokens: string[], fields: WeightedField[]): number | null {
  const normalizedFields = fields.map((field) => ({
    ...field,
    value: normalize(field.value)
  }));
  let score = 0;

  for (const token of queryTokens) {
    let best = 0;
    for (const field of normalizedFields) {
      best = Math.max(best, tokenScore(token, field.value) * field.weight);
    }
    if (best === 0) return null;
    score += best;
  }

  return score;
}

function pageResult(page: SearchPage): SearchResult {
  return {
    id: `page:${page.route}`,
    title: page.title,
    context: page.route,
    href: page.route,
    group: page.group,
    kind: "page",
    score: 0
  };
}

function headingResult(page: SearchPage, heading: SearchHeading): SearchResult {
  return {
    id: `heading:${page.route}#${heading.id}`,
    title: heading.text,
    context: `${page.title} · ${page.group}`,
    href: `${page.route}#${heading.id}`,
    group: page.group,
    kind: "heading",
    score: 0
  };
}

/** Searches page metadata and table-of-contents headings without a network service. */
export function searchPages(index: SearchIndex, query: string): SearchResult[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const queryTokens = normalizedQuery.split(" ");
  const results: SearchResult[] = [];

  for (const page of index.pages) {
    const candidates = [
      pageResult(page),
      ...page.headings.map((heading) => headingResult(page, heading))
    ];

    for (const candidate of candidates) {
      const candidateTitle = normalize(candidate.title);
      if (
        candidate.kind === "heading" &&
        !queryTokens.some((token) => tokenScore(token, candidateTitle) > 0)
      ) {
        continue;
      }

      const fields: WeightedField[] = [
        { value: candidate.title, weight: 20 },
        { value: page.title, weight: candidate.kind === "heading" ? 14 : 20 },
        { value: page.keywords.join(" "), weight: 12 },
        { value: page.group, weight: 6 }
      ];
      if (candidate.kind === "page") {
        fields.push({ value: page.description, weight: 4 });
      }

      let score = scoreFields(queryTokens, fields);
      if (score === null) continue;

      const title = normalize(candidate.title);
      if (title === normalizedQuery) score += 200;
      else if (title.startsWith(normalizedQuery)) score += 100;
      else if (title.includes(normalizedQuery)) score += 70;

      if (candidate.kind === "page") score += 5;
      results.push({ ...candidate, score });
    }
  }

  return results.sort(
    (left, right) =>
      right.score - left.score ||
      left.title.localeCompare(right.title) ||
      left.href.localeCompare(right.href)
  );
}
