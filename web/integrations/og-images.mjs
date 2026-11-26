import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractMeta, findHtmlFiles } from "./html-utils.mjs";

function imagePathForHtml(relativeHtml) {
  const normalized = relativeHtml.split(path.sep).join("/");

  if (normalized === "index.html") {
    return "og.png";
  }

  if (normalized.endsWith("/index.html")) {
    return `og/${normalized.slice(0, -"/index.html".length)}.png`;
  }

  return `og/${normalized.replace(/\.html$/, ".png")}`;
}

/**
 * Renders one Open Graph image per built HTML page. The page metadata is read
 * from the built document, so Layout.astro stays the single source of truth.
 */
export default function ogImages() {
  return {
    name: "loseta:og-images",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const distDirectory = fileURLToPath(dir);
        const { renderOgCard } = await import("../src/lib/og-render.mjs");
        const { OG_SITE_DESCRIPTION } = await import("../src/lib/og-card.mjs");

        const htmlFiles = (await findHtmlFiles(distDirectory)).filter((file) => {
          if (path.basename(file) === "404.html") return false;
          return !path
            .relative(distDirectory, file)
            .startsWith(`fixtures${path.sep}`);
        });

        let generated = 0;

        for (const file of htmlFiles) {
          const relativeHtml = path.relative(distDirectory, file);
          const html = await readFile(file, "utf8");
          const { byProperty, byName } = extractMeta(html);
          const title = byProperty.get("og:title")?.trim();

          if (!title) {
            throw new Error(`Missing og:title in ${relativeHtml}. Render the page with Layout.astro.`);
          }

          const imagePath = imagePathForHtml(relativeHtml);
          const ogImage = byProperty.get("og:image");

          if (!ogImage) {
            throw new Error(`Missing og:image in ${relativeHtml}. Render the page with Layout.astro.`);
          }

          let declaredImagePath;

          try {
            declaredImagePath = decodeURIComponent(new URL(ogImage).pathname);
          } catch {
            throw new Error(`og:image in ${relativeHtml} is not a valid absolute URL: ${ogImage}`);
          }

          if (declaredImagePath !== `/${imagePath}`) {
            throw new Error(
              `og:image in ${relativeHtml} points to ${declaredImagePath}; expected /${imagePath}.`
            );
          }

          const description =
            byName.get("description")?.trim() || OG_SITE_DESCRIPTION;
          const output = path.join(distDirectory, imagePath);

          await mkdir(path.dirname(output), { recursive: true });
          await writeFile(output, await renderOgCard({ title, description }));
          generated += 1;
        }

        if (generated !== htmlFiles.length) {
          throw new Error(
            `Generated ${generated} Open Graph images for ${htmlFiles.length} HTML pages.`
          );
        }

        logger.info(`Generated ${generated} Open Graph images.`);
      }
    }
  };
}
