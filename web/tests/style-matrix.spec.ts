import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const registry = JSON.parse(
  readFileSync(
    new URL("../../packages/loseta/registry/registry.json", import.meta.url),
    "utf8"
  )
) as { styles: Array<{ name: string }> };
const styleNames = registry.styles.map((style) => style.name);

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

function blocking(violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]) {
  return violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical"
  );
}

interface StyleCase {
  id: string;
  selector: string;
  property: string;
  values: Record<string, string>;
}

// Each promoted batch adds its signature components here. The values are part
// of the style contract: a style file that quietly keeps Nova geometry fails.
const cases: StyleCase[] = [
  {
    id: "button",
    selector: ".docs-preview .btn",
    property: "height",
    values: {
      nova: "32px",
      vega: "36px",
      maia: "36px",
      lyra: "32px",
      mira: "28px",
      luma: "36px",
      sera: "40px",
      rhea: "32px"
    }
  },
  {
    id: "card",
    selector: ".docs-preview .card",
    property: "border-top-left-radius",
    values: {
      nova: "14px",
      vega: "14px",
      maia: "18px",
      lyra: "0px",
      mira: "10px",
      luma: "26px",
      sera: "0px",
      rhea: "24px"
    }
  },
  {
    id: "input",
    selector: ".docs-preview .input",
    property: "height",
    values: {
      nova: "32px",
      vega: "36px",
      maia: "36px",
      lyra: "32px",
      mira: "28px",
      luma: "36px",
      sera: "40px",
      rhea: "32px"
    }
  }
];

async function waitForStyle(page: Page, style: string): Promise<void> {
  await expect(page.locator("[data-style-link]")).toHaveAttribute(
    "href",
    `/styles/${style}.css`
  );
  await page.waitForFunction((name) => {
    return [...document.styleSheets].some(
      (sheet) => sheet.href && sheet.href.endsWith(`/styles/${name}.css`)
    );
  }, style);
}

test("style files change component geometry and pass axe", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  const disableMotion = async () => {
    await page.addStyleTag({
      content:
        "*, *::before, *::after { transition: none !important; animation: none !important; }"
    });
  };

  for (const entry of cases) {
    await page.goto(`/docs/components/${entry.id}`);
    await disableMotion();
    const select = page.locator("[data-style-select]");
    const probe = page.locator(entry.selector).first();

    for (const style of styleNames) {
      await select.selectOption(style);
      await waitForStyle(page, style);
      await expect(probe).toHaveCSS(entry.property, entry.values[style]);
    }
  }

  await page.goto("/docs/components/button");
  await disableMotion();
  const select = page.locator("[data-style-select]");

  for (const style of styleNames) {
    await select.selectOption(style);
    await waitForStyle(page, style);

    for (const scheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      const violations = blocking(results.violations);
      expect(
        violations,
        `${style} ${scheme}: ${JSON.stringify(violations, null, 2)}`
      ).toEqual([]);
    }
  }
});
