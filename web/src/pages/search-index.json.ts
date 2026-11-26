import { blocks } from "@/data/blocks";
import { components } from "@/data/components";
import pageMeta from "@/data/page-meta.json";
import { groupForRoute } from "@/lib/search";
import type { SearchIndex, SearchPage } from "@/lib/search";
import registry from "../../../packages/loseta/registry/registry.json" with { type: "json" };

export const prerender = true;

/** Development fallback; the build integration replaces this with rendered headings. */
export function GET() {
  const blockByRoute = new Map(blocks.map((block) => [`/blocks/${block.slug}`, block]));
  const pages: SearchPage[] = Object.entries(pageMeta).map(([route, meta]) => {
    const block = blockByRoute.get(route);
    return {
      route,
      title: block?.title ?? meta.title,
      description: block?.description ?? meta.description,
      group: groupForRoute(route),
      keywords:
        route === "/docs/styles"
          ? registry.styles.flatMap((style) => [style.name, style.title])
          : [],
      headings: []
    };
  });

  for (const component of components) {
    pages.push({
      route: `/docs/components/${component.id}`,
      title: component.title,
      description: component.description,
      group: "Components",
      keywords: [component.id, component.group],
      headings: []
    });
  }

  pages.sort((left, right) => left.route.localeCompare(right.route));
  const index: SearchIndex = { version: 1, pages };

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache"
    }
  });
}
