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
    id: "avatar",
    selector: ".docs-preview .avatar [data-slot='fallback']",
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
    id: "progress",
    selector: ".docs-preview .progress",
    property: "height",
    values: {
      nova: "8px",
      vega: "8px",
      maia: "8px",
      lyra: "6px",
      mira: "6px",
      luma: "8px",
      sera: "10px",
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
    selector: ".docs-preview .menubar [role='menuitem']",
    property: "height",
    values: {
      nova: "28px",
      vega: "32px",
      maia: "32px",
      lyra: "28px",
      mira: "24px",
      luma: "32px",
      sera: "36px",
      rhea: "28px"
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
    selector: ".docs-preview .resizable-panel",
    property: "padding-top",
    values: {
      nova: "16px",
      vega: "20px",
      maia: "20px",
      lyra: "12px",
      mira: "12px",
      luma: "20px",
      sera: "24px",
      rhea: "16px"
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
