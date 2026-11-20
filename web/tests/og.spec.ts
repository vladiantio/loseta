import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const origin = "https://loseta.vladiantio.com";
const webRoot = fileURLToPath(new URL("../", import.meta.url));
const distRoot = path.join(webRoot, "dist");

function metaContent(html: string, attribute: "property" | "name", value: string) {
  const pattern = new RegExp(
    `<meta[^>]*\\b${attribute}="${value}"[^>]*\\bcontent="([^"]*)"`,
    "i"
  );

  return html.match(pattern)?.[1];
}

async function findFiles(directory: string, extension: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findFiles(entryPath, extension)));
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(entryPath);
    }
  }

  return files;
}

function expectPng(buffer: Buffer) {
  expect(buffer.subarray(1, 4).toString()).toBe("PNG");
  expect(buffer.readUInt32BE(16)).toBe(1200);
  expect(buffer.readUInt32BE(20)).toBe(630);
}

test("home exposes Open Graph metadata", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "loseta");
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `${origin}/`);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `${origin}/og.png`
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image"
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${origin}/`);
});

test("component page exposes Open Graph metadata and serves its image", async ({
  page,
  request
}) => {
  await page.goto("/docs/components/button");

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Button");
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    "Displays a button or a component that looks like a button."
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "loseta");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    `${origin}/docs/components/button/`
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    `${origin}/og/docs/components/button.png`
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    "Button — loseta"
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    `${origin}/og/docs/components/button.png`
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/docs/components/button/`
  );

  const response = await request.get("/og/docs/components/button.png");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("image/png");
  expectPng(await response.body());
});

test("every built page has a 1200x630 Open Graph image", async ({ browserName }) => {
  test.skip(browserName !== "chromium", "Build artifact check runs once.");

  const htmlFiles = (await findFiles(distRoot, ".html")).filter((file) => {
    if (path.basename(file) === "404.html") return false;
    return !path.relative(distRoot, file).startsWith("fixtures/");
  });
  const imageFiles = [
    ...(await findFiles(path.join(distRoot, "og"), ".png")),
    path.join(distRoot, "og.png")
  ];

  expect(htmlFiles.length).toBeGreaterThan(0);
  expect(imageFiles.length).toBe(htmlFiles.length);

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    const imageUrl = metaContent(html, "property", "og:image");

    expect(imageUrl, `missing og:image in ${path.relative(distRoot, htmlFile)}`).toBeTruthy();
    expect(metaContent(html, "property", "og:title")).toBeTruthy();

    const parsed = new URL(imageUrl as string);
    expect(parsed.origin).toBe(origin);

    const imageFile = path.join(distRoot, decodeURIComponent(parsed.pathname).replace(/^\//, ""));
    expectPng(await readFile(imageFile));
  }
});
