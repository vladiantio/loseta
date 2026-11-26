import { expect, test } from "@playwright/test";

const origin = "https://loseta.vladiantio.com";

test("llms.txt serves curated documentation with working canonical links", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");

  const body = await response.text();
  expect(body).toContain("# loseta");
  expect(body).toContain(
    "> loseta is a copy-paste registry of native CSS components, markup contracts, and optional ESM behavior modules."
  );

  const links = [...body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
  expect(links).toHaveLength(12);

  const localLinks = links.filter((link) => new URL(link).origin === origin);
  expect(localLinks).toHaveLength(11);

  for (const link of links) {
    const url = new URL(link);
    expect(url.protocol).toBe("https:");
    expect(url.href).toBe(link);

    if (url.origin !== origin) continue;

    const linkedResponse = await request.get(`${url.pathname}${url.search}`);
    expect(linkedResponse.ok(), `${url.href} should resolve`).toBe(true);
  }
});
