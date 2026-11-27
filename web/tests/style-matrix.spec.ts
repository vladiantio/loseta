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
  pseudo?: string;
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
    id: "card",
    selector: ".docs-preview .card",
    property: "row-gap",
    values: {
      nova: "16px",
      vega: "24px",
      maia: "24px",
      lyra: "16px",
      mira: "16px",
      luma: "24px",
      sera: "32px",
      rhea: "20px"
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
  },
  {
    id: "toggle",
    selector: ".docs-preview .toggle",
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
    id: "field",
    selector: ".docs-preview .field",
    property: "row-gap",
    values: {
      nova: "8px",
      vega: "12px",
      maia: "12px",
      lyra: "8px",
      mira: "12px",
      luma: "12px",
      sera: "12px",
      rhea: "12px"
    }
  },
  {
    id: "avatar",
    selector: ".docs-preview .avatar[data-size='sm'] [data-slot='fallback']",
    property: "font-size",
    values: {
      nova: "12px",
      vega: "12px",
      maia: "12px",
      lyra: "10px",
      mira: "10px",
      luma: "12px",
      sera: "12px",
      rhea: "12px"
    }
  },
  {
    id: "avatar",
    selector: ".docs-preview .avatar-group [data-slot='count']",
    property: "font-size",
    values: {
      nova: "14px",
      vega: "14px",
      maia: "14px",
      lyra: "12px",
      mira: "12px",
      luma: "14px",
      sera: "14px",
      rhea: "14px"
    }
  },
  {
    id: "progress",
    selector: ".docs-preview .progress",
    property: "height",
    values: {
      nova: "4px",
      vega: "6px",
      maia: "12px",
      lyra: "4px",
      mira: "4px",
      luma: "12px",
      sera: "2px",
      rhea: "8px"
    }
  },
  {
    id: "accordion",
    selector: ".docs-preview .accordion summary",
    property: "padding-top",
    values: {
      nova: "10px",
      vega: "12px",
      maia: "12px",
      lyra: "8px",
      mira: "8px",
      luma: "12px",
      sera: "14px",
      rhea: "10px"
    }
  },
  {
    id: "breadcrumb",
    selector: ".docs-preview .breadcrumb > ol",
    property: "font-size",
    values: {
      nova: "14px",
      vega: "14px",
      maia: "14px",
      lyra: "12px",
      mira: "12px",
      luma: "14px",
      sera: "14px",
      rhea: "14px"
    }
  },
  {
    id: "input-group",
    selector: ".docs-preview .input-group",
    property: "min-height",
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
    id: "input-group",
    selector:
      ".docs-preview .input-group:has(> [data-slot='addon'] .btn[data-size='icon-xs'])",
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
    id: "input-otp",
    selector: ".docs-preview .input-otp",
    property: "height",
    values: {
      nova: "40px",
      vega: "44px",
      maia: "44px",
      lyra: "40px",
      mira: "36px",
      luma: "44px",
      sera: "48px",
      rhea: "40px"
    }
  },
  {
    id: "sidebar",
    selector: ".docs-preview .sidebar nav a",
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
    id: "slider",
    selector: ".docs-preview .slider",
    property: "height",
    values: {
      nova: "20px",
      vega: "24px",
      maia: "24px",
      lyra: "16px",
      mira: "16px",
      luma: "24px",
      sera: "28px",
      rhea: "20px"
    }
  },
  {
    id: "menubar",
    selector: ".docs-preview .menubar",
    property: "height",
    values: {
      nova: "32px",
      vega: "36px",
      maia: "36px",
      lyra: "32px",
      mira: "36px",
      luma: "36px",
      sera: "40px",
      rhea: "32px"
    }
  },
  {
    id: "navigation-menu",
    selector: ".docs-preview .navigation-menu > ul > li > :is(a, button)",
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
    id: "drawer",
    selector: ".docs-preview .drawer > [data-slot='drawer-content']",
    property: "font-size",
    values: {
      nova: "14px",
      vega: "14px",
      maia: "14px",
      lyra: "12px",
      mira: "12px",
      luma: "14px",
      sera: "14px",
      rhea: "14px"
    }
  },
  {
    id: "drawer",
    selector: ".docs-preview .drawer [data-slot='handle']",
    pseudo: "::after",
    property: "width",
    values: {
      nova: "96px",
      vega: "100px",
      maia: "100px",
      lyra: "48px",
      mira: "48px",
      luma: "100px",
      sera: "100px",
      rhea: "100px"
    }
  },
  {
    id: "drawer",
    selector: ".docs-preview .drawer > [data-slot='drawer-content']",
    pseudo: "::before",
    property: "content",
    values: {
      nova: "none",
      vega: "none",
      maia: "none",
      lyra: "none",
      mira: "none",
      luma: "none",
      sera: "none",
      rhea: "none"
    }
  },
  {
    id: "drawer",
    selector:
      ".docs-preview .drawer[data-side='inline-start'] > [data-slot='drawer-content']",
    property: "border-inline-end-width",
    values: {
      nova: "1px",
      vega: "1px",
      maia: "1px",
      lyra: "1px",
      mira: "1px",
      luma: "1px",
      sera: "1px",
      rhea: "1px"
    }
  },
  {
    id: "drawer",
    selector:
      ".docs-preview .drawer[data-side='inline-end'] > [data-slot='drawer-content']",
    property: "border-inline-start-width",
    values: {
      nova: "1px",
      vega: "1px",
      maia: "1px",
      lyra: "1px",
      mira: "1px",
      luma: "1px",
      sera: "1px",
      rhea: "1px"
    }
  },
  {
    id: "sheet",
    selector: ".docs-preview .sheet > [data-slot='sheet-content']",
    property: "font-size",
    values: {
      nova: "14px",
      vega: "14px",
      maia: "14px",
      lyra: "12px",
      mira: "12px",
      luma: "14px",
      sera: "14px",
      rhea: "14px"
    }
  },
  {
    id: "sheet",
    selector:
      ".docs-preview .sheet > [data-slot='sheet-content'] > header > [data-slot='title']",
    property: "font-size",
    values: {
      nova: "16px",
      vega: "14px",
      maia: "16px",
      lyra: "14px",
      mira: "14px",
      luma: "16px",
      sera: "18px",
      rhea: "16px"
    }
  },
  {
    id: "sheet",
    selector: ".docs-preview .sheet > [data-slot='sheet-content'] > header",
    property: "padding-top",
    values: {
      nova: "16px",
      vega: "16px",
      maia: "24px",
      lyra: "16px",
      mira: "24px",
      luma: "24px",
      sera: "32px",
      rhea: "24px"
    }
  },
  {
    id: "sheet",
    selector: ".docs-preview .sheet",
    pseudo: "::backdrop",
    property: "background-color",
    values: {
      nova: "rgba(0, 0, 0, 0.1)",
      vega: "rgba(0, 0, 0, 0.1)",
      maia: "rgba(0, 0, 0, 0.8)",
      lyra: "rgba(0, 0, 0, 0.1)",
      mira: "rgba(0, 0, 0, 0.8)",
      luma: "rgba(0, 0, 0, 0.3)",
      sera: "rgba(0, 0, 0, 0.2)",
      rhea: "rgba(0, 0, 0, 0.3)"
    }
  },
  {
    id: "sheet",
    selector: ".docs-preview .sheet",
    pseudo: "::backdrop",
    property: "backdrop-filter",
    values: {
      nova: "blur(4px)",
      vega: "blur(4px)",
      maia: "blur(4px)",
      lyra: "blur(4px)",
      mira: "blur(4px)",
      luma: "blur(8px)",
      sera: "blur(8px)",
      rhea: "blur(8px)"
    }
  },
  {
    id: "popover",
    selector: ".docs-preview .popover > [data-popover]",
    property: "border-top-left-radius",
    values: {
      nova: "10px",
      vega: "8px",
      maia: "18px",
      lyra: "0px",
      mira: "10px",
      luma: "22px",
      sera: "0px",
      rhea: "18px"
    }
  },
  {
    id: "toast",
    selector: ".docs-preview .toast",
    property: "border-top-left-radius",
    values: {
      nova: "10px",
      vega: "8px",
      maia: "18px",
      lyra: "0px",
      mira: "10px",
      luma: "22px",
      sera: "0px",
      rhea: "18px"
    }
  },
  {
    id: "alert",
    selector: ".docs-preview .alert",
    property: "padding-top",
    values: {
      nova: "8px",
      vega: "12px",
      maia: "12px",
      lyra: "8px",
      mira: "6px",
      luma: "12px",
      sera: "12px",
      rhea: "12px"
    }
  },
  {
    id: "select",
    selector: ".docs-preview .select > button",
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
    id: "combobox",
    selector: ".docs-preview .combobox > input",
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
    id: "calendar",
    selector: ".docs-preview .calendar td > button",
    property: "width",
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
    id: "carousel",
    selector: ".docs-preview .carousel-button",
    property: "width",
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
    id: "chart",
    selector: ".docs-preview .chart [data-slot='swatch']",
    property: "width",
    values: {
      nova: "8px",
      vega: "8px",
      maia: "10px",
      lyra: "8px",
      mira: "6px",
      luma: "10px",
      sera: "8px",
      rhea: "8px"
    }
  },
  {
    id: "resizable",
    selector: ".docs-preview .resizable",
    property: "border-top-left-radius",
    values: {
      nova: "10px",
      vega: "8px",
      maia: "18px",
      lyra: "0px",
      mira: "10px",
      luma: "26px",
      sera: "0px",
      rhea: "18px"
    }
  },
  {
    id: "attachment",
    selector: ".docs-preview .attachment",
    property: "border-top-left-radius",
    values: {
      nova: "14px",
      vega: "14px",
      maia: "18px",
      lyra: "0px",
      mira: "10px",
      luma: "26px",
      sera: "0px",
      rhea: "18px"
    }
  },
  {
    id: "bubble",
    selector: ".docs-preview .bubble [data-slot='content']",
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
    id: "marker",
    selector: ".docs-preview .marker",
    property: "font-size",
    values: {
      nova: "14px",
      vega: "14px",
      maia: "14px",
      lyra: "12px",
      mira: "12px",
      luma: "14px",
      sera: "14px",
      rhea: "14px"
    }
  },
  {
    id: "message",
    selector: ".docs-preview .message [data-slot='avatar']",
    property: "min-width",
    values: {
      nova: "32px",
      vega: "32px",
      maia: "36px",
      lyra: "32px",
      mira: "28px",
      luma: "36px",
      sera: "36px",
      rhea: "32px"
    }
  },
  {
    id: "message-scroller",
    selector: ".docs-preview .message-scroller [data-slot='jump']",
    property: "width",
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
    id: "questionnaire",
    selector: ".docs-preview .questionnaire progress",
    property: "height",
    values: {
      nova: "6px",
      vega: "6px",
      maia: "8px",
      lyra: "4px",
      mira: "4px",
      luma: "8px",
      sera: "8px",
      rhea: "6px"
    }
  },
  {
    id: "empty",
    selector: ".docs-preview .empty",
    property: "padding-top",
    values: {
      nova: "24px",
      vega: "24px",
      maia: "48px",
      lyra: "24px",
      mira: "24px",
      luma: "48px",
      sera: "48px",
      rhea: "48px"
    }
  },
  {
    id: "trace",
    selector: ".docs-preview .trace summary",
    property: "padding-top",
    values: {
      nova: "8px",
      vega: "10px",
      maia: "10px",
      lyra: "6px",
      mira: "6px",
      luma: "10px",
      sera: "10px",
      rhea: "8px"
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

async function disableMotion(page: Page): Promise<void> {
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });
}

for (const [index, entry] of cases.entries()) {
  test(`style case ${index + 1}: ${entry.id} ${entry.property}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(`/docs/components/${entry.id}`);
    await disableMotion(page);
    const select = page.locator("[data-style-select]");
    const probe = page.locator(entry.selector).first();

    for (const style of styleNames) {
      await select.selectOption(style);
      await waitForStyle(page, style);
      if (entry.pseudo) {
        const value = await probe.evaluate(
          (element, { property, pseudo }) =>
            getComputedStyle(element, pseudo).getPropertyValue(property),
          { property: entry.property, pseudo: entry.pseudo }
        );
        expect(value).toBe(entry.values[style]);
      } else {
        await expect(probe).toHaveCSS(entry.property, entry.values[style]);
      }
    }
  });
}

for (const style of styleNames) {
  test(`button passes axe in ${style}`, async ({ page }) => {
    await page.goto("/docs/components/button");
    await disableMotion(page);
    const select = page.locator("[data-style-select]");

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
  });
}
