import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { components } from "../src/data/components";

const registry = JSON.parse(
  readFileSync(
    new URL("../../packages/loseta/registry/registry.json", import.meta.url),
    "utf8"
  )
) as { styles: Array<{ name: string }> };
const styleNames = registry.styles.map((style) => style.name);

const staticPages = [
  "/",
  "/docs",
  "/docs/installation",
  "/docs/theming",
  "/docs/styles",
  "/docs/components"
];
const pages = [
  ...staticPages,
  ...components.map((component) => `/docs/components/${component.id}`)
];

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

function blocking(violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]) {
  return violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical"
  );
}

const schemeSelectors = [
  "body",
  ".docs-style-specimen .btn",
  ".docs-style-specimen .btn[data-variant='secondary']",
  ".docs-style-specimen .btn[data-variant='outline']",
  ".docs-style-specimen .badge",
  ".docs-style-specimen .input",
  ".docs-style-specimen .checkbox",
  ".docs-style-specimen .card",
  ".code-block > pre"
];

const schemeProperties = [
  "background-color",
  "color",
  "border-color",
  "box-shadow",
  "background-image"
];

async function readScheme(
  page: Page,
  media: "light" | "dark",
  classes: string[]
): Promise<Record<string, string>> {
  await page.emulateMedia({ colorScheme: media });
  await page.evaluate((active) => {
    document.documentElement.classList.toggle("dark", active.includes("dark"));
    document.documentElement.classList.toggle("light", active.includes("light"));
  }, classes);

  return page.evaluate(
    ({ selectors, properties }) => {
      const values: Record<string, string> = {};
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (!element) {
          throw new Error(`Missing color-scheme probe: ${selector}`);
        }
        const style = getComputedStyle(element);
        for (const property of properties) {
          values[`${selector} ${property}`] = style.getPropertyValue(property);
        }
      }
      return values;
    },
    { selectors: schemeSelectors, properties: schemeProperties }
  );
}

test("home renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Native CSS scaffolds");
});

test("color scheme switch supports system, light and dark", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const system = page.getByRole("button", { name: "System color scheme" });
  const light = page.getByRole("button", { name: "Light color scheme" });
  const dark = page.getByRole("button", { name: "Dark color scheme" });

  await expect(system).toHaveAttribute("aria-pressed", "true");

  await light.click();
  await expect(light).toHaveAttribute("aria-pressed", "true");
  await expect(html).toHaveClass(/\blight\b/);
  await expect(html).not.toHaveClass(/\bdark\b/);
  expect(await page.evaluate(() => localStorage.getItem("scheme"))).toBe("light");

  await dark.click();
  await expect(dark).toHaveAttribute("aria-pressed", "true");
  await expect(html).toHaveClass(/\bdark\b/);
  await expect(html).not.toHaveClass(/\blight\b/);

  await page.reload();
  await expect(dark).toHaveAttribute("aria-pressed", "true");
  await expect(html).toHaveClass(/\bdark\b/);

  await system.click();
  await expect(system).toHaveAttribute("aria-pressed", "true");
  await expect(html).not.toHaveClass(/\bdark\b/);
  await expect(html).not.toHaveClass(/\blight\b/);

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(html).not.toHaveClass(/\bdark\b/);
  const darkBackground = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor
  );

  await page.emulateMedia({ colorScheme: "light" });
  await expect(html).not.toHaveClass(/\bdark\b/);
  const lightBackground = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor
  );

  expect(darkBackground).not.toBe(lightBackground);
});

test("color scheme overrides work on nested containers", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ colorScheme: "light" });

  await page.evaluate(() => {
    const host = document.createElement("div");
    host.id = "scheme-probes";
    host.innerHTML = `
      <div id="scoped-dark" class="dark" style="background-color: var(--background)">
        <div id="scoped-light" class="light" style="background-color: var(--background)"></div>
      </div>
    `;
    document.body.append(host);
  });

  const backgrounds = await page.evaluate(() => {
    const read = (id: string) => {
      const element = document.getElementById(id);
      return element ? getComputedStyle(element).backgroundColor : null;
    };
    return {
      page: getComputedStyle(document.body).backgroundColor,
      dark: read("scoped-dark"),
      light: read("scoped-light"),
      schemeDark: getComputedStyle(document.getElementById("scoped-dark")!).colorScheme,
      schemeLight: getComputedStyle(document.getElementById("scoped-light")!).colorScheme
    };
  });

  expect(backgrounds.dark).not.toBe(backgrounds.page);
  expect(backgrounds.light).toBe(backgrounds.page);
  expect(backgrounds.schemeDark).toContain("dark");
  expect(backgrounds.schemeLight).toContain("light");
});

test("native select chevron follows the color scheme", async ({ page }) => {
  await page.goto("/docs/components/native-select");
  const chevron = page.locator(".native-select").first();

  await page.emulateMedia({ colorScheme: "light" });
  const lightIcon = await chevron.evaluate((element) => getComputedStyle(element).backgroundImage);

  await page.emulateMedia({ colorScheme: "dark" });
  const darkIcon = await chevron.evaluate((element) => getComputedStyle(element).backgroundImage);

  expect(lightIcon).not.toBe(darkIcon);

  await page.evaluate(() => document.documentElement.classList.add("light"));
  const forcedLightIcon = await chevron.evaluate(
    (element) => getComputedStyle(element).backgroundImage
  );

  expect(forcedLightIcon).toBe(lightIcon);

  await page.emulateMedia({ colorScheme: "light" });
  await page.evaluate(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  });
  const forcedDarkIcon = await chevron.evaluate(
    (element) => getComputedStyle(element).backgroundImage
  );

  expect(forcedDarkIcon).toBe(darkIcon);
});

test("style switch loads the selected stylesheet", async ({ page }) => {
  await page.goto("/docs/styles");
  const select = page.locator("[data-style-select]");
  const link = page.locator("[data-style-link]");

  await expect(select).toHaveValue("nova");
  await expect(link).toHaveAttribute("href", "/styles/nova.css");
  await expect(page.locator("html")).toHaveAttribute("data-style", "nova");

  await select.selectOption("vega");
  await expect(link).toHaveAttribute("href", "/styles/vega.css");
  await expect(page.locator("html")).toHaveAttribute("data-style", "vega");
  expect(await page.evaluate(() => localStorage.getItem("style"))).toBe("vega");

  await page.reload();
  await expect(select).toHaveValue("vega");
  await expect(link).toHaveAttribute("href", "/styles/vega.css");
});

test("style cards select the previewed style", async ({ page }) => {
  await page.goto("/docs/styles");
  const vega = page.locator('[data-style-option="vega"]');

  await expect(vega).toHaveAttribute("aria-pressed", "false");
  await vega.click();

  await expect(vega).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-style-link]")).toHaveAttribute(
    "href",
    "/styles/vega.css"
  );
});

test("styles change control geometry", async ({ page }) => {
  await page.goto("/docs/styles");
  const button = page.locator(".docs-style-specimen .btn").first();

  await expect(button).toHaveCSS("height", "32px");

  await page.locator("[data-style-select]").selectOption("vega");

  await expect(button).toHaveCSS("height", "36px");
  await expect(button).toHaveCSS("border-top-left-radius", "8px");
});

test("every style loads and passes axe in every color scheme", async ({ page }) => {
  expect(styleNames.length).toBeGreaterThan(0);
  await page.goto("/docs/styles");
  await page.addStyleTag({
    content: "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });
  const select = page.locator("[data-style-select]");
  const link = page.locator("[data-style-link]");

  for (const style of styleNames) {
    await select.selectOption(style);
    await expect(link).toHaveAttribute("href", `/styles/${style}.css`);
    await page.waitForFunction((name) => {
      return [...document.styleSheets].some(
        (sheet) => sheet.href && sheet.href.endsWith(`/styles/${name}.css`)
      );
    }, style);

    const modes: Array<{ name: string; media: "light" | "dark"; classes: string[] }> = [
      { name: "system light", media: "light", classes: [] },
      { name: "system dark", media: "dark", classes: [] },
      { name: "forced light", media: "dark", classes: ["light"] },
      { name: "forced dark", media: "light", classes: ["dark"] }
    ];

    for (const mode of modes) {
      await page.emulateMedia({ colorScheme: mode.media });
      await page.evaluate((classes) => {
        document.documentElement.classList.toggle("dark", classes.includes("dark"));
        document.documentElement.classList.toggle("light", classes.includes("light"));
      }, mode.classes);
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      const violations = blocking(results.violations);
      expect(
        violations,
        `${style} ${mode.name}: ${JSON.stringify(violations, null, 2)}`
      ).toEqual([]);
    }
  }
});

test("system and forced color schemes resolve the same values", async ({ page }) => {
  await page.goto("/docs/styles");
  await page.addStyleTag({
    content: "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });
  const select = page.locator("[data-style-select]");
  const link = page.locator("[data-style-link]");

  for (const style of styleNames) {
    await select.selectOption(style);
    await expect(link).toHaveAttribute("href", `/styles/${style}.css`);
    await page.waitForFunction((name) => {
      return [...document.styleSheets].some(
        (sheet) => sheet.href && sheet.href.endsWith(`/styles/${name}.css`)
      );
    }, style);

    const systemLight = await readScheme(page, "light", []);
    const forcedLight = await readScheme(page, "dark", ["light"]);
    expect(forcedLight, `${style}: forced light differs from system light`).toEqual(
      systemLight
    );

    const systemDark = await readScheme(page, "dark", []);
    expect(
      systemDark["body background-color"],
      `${style}: dark scheme did not change the page background`
    ).not.toBe(systemLight["body background-color"]);

    const forcedDark = await readScheme(page, "light", ["dark"]);
    expect(forcedDark, `${style}: forced dark differs from system dark`).toEqual(
      systemDark
    );
  }
});

test("install command switches between pnpm and npm", async ({ page }) => {
  await page.goto("/docs/installation");
  const commands = page.locator(".install-command");
  const command = commands.first();
  const pnpm = command.locator("[data-package-manager-value='pnpm']");
  const npm = command.locator("[data-package-manager-value='npm']");
  const pnpmPanel = command.locator("[data-package-manager-panel='pnpm']");
  const npmPanel = command.locator("[data-package-manager-panel='npm']");

  await expect(pnpm).toHaveAttribute("aria-pressed", "true");
  await expect(npm).toHaveAttribute("aria-pressed", "false");
  await expect(pnpmPanel).toBeVisible();
  await expect(pnpmPanel.locator("code")).toContainText("pnpm dlx loseta init");
  await expect(pnpmPanel.locator("code")).not.toHaveAttribute("tabindex");
  await expect(npmPanel).toBeHidden();

  await npm.click();
  await expect(npm).toHaveAttribute("aria-pressed", "true");
  await expect(pnpm).toHaveAttribute("aria-pressed", "false");
  await expect(pnpmPanel).toBeHidden();
  await expect(npmPanel.locator("code")).toContainText("npx loseta init");

  const count = await commands.count();
  expect(count).toBeGreaterThan(1);
  for (let index = 0; index < count; index += 1) {
    const item = commands.nth(index);
    await expect(item.locator("[data-package-manager-value='pnpm']")).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    await expect(item.locator("[data-package-manager-value='npm']")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(item.locator("[data-package-manager-panel='pnpm']")).toBeHidden();
    await expect(item.locator("[data-package-manager-panel='npm']")).toBeVisible();
  }
});

test("install command remembers the package manager", async ({ page }) => {
  await page.goto("/docs/installation");
  const first = page.locator(".install-command").first();
  await first.locator("[data-package-manager-value='npm']").click();

  await page.reload();
  await expect(first.locator("[data-package-manager-value='pnpm']")).toHaveAttribute(
    "aria-pressed",
    "false"
  );
  await expect(first.locator("[data-package-manager-value='npm']")).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(first.locator("[data-package-manager-panel='npm']")).toBeVisible();

  await page.goto("/docs/components");
  const command = page.locator(".install-command").first();
  await expect(command.locator("[data-package-manager-value='npm']")).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(command.locator("[data-package-manager-panel='npm']")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("package-manager"))).toBe("npm");
});

test("code block wrap toggle updates the pre", async ({ page }) => {
  await page.goto("/docs/components/code-block");
  const block = page.locator('[data-demo="code-block"]:has([data-demo-wrap])');
  const toggle = block.locator("[data-demo-wrap]");
  const pre = block.locator("pre");

  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(pre).toHaveAttribute("data-wrap", "");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(pre).not.toHaveAttribute("data-wrap", "");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(pre).toHaveAttribute("data-wrap", "");
});

test("component preview reveals cleaned example code", async ({ page }) => {
  await page.goto("/docs/components/dialog");
  const preview = page.locator("[data-component-preview]").first();
  const toggle = preview.getByRole("button", { name: "View code" });
  const source = preview.locator("[data-preview-source]");
  const pre = source.locator("pre");

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(source).toHaveAttribute("aria-hidden", "true");
  await expect(pre).toHaveAttribute("tabindex", "-1");
  await expect(pre).toHaveCSS("overflow-x", "hidden");
  await expect(source.locator("code")).not.toContainText("data-open-dialog");

  await toggle.click();

  await expect(toggle).toBeHidden();
  await expect(source).not.toHaveAttribute("aria-hidden", "true");
  await expect(pre).toHaveAttribute("tabindex", "0");
  await expect(pre).toHaveCSS("overflow-x", "auto");
  await expect(pre).toBeFocused();
});

test("component preview copies the cleaned example markup", async ({ page }) => {
  await page.goto("/docs/components/dialog");
  const preview = page.locator("[data-component-preview]").first();

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as unknown as { copiedCode?: string }).copiedCode = text;
        }
      }
    });
  });

  await preview.getByRole("button", { name: "View code" }).click();
  await preview.locator("[data-preview-source] [data-copy-icon]").click();

  const copied = await page.evaluate(
    () => (window as unknown as { copiedCode?: string }).copiedCode
  );
  expect(copied).toContain('<button type="button" class="btn">Open dialog</button>');
  expect(copied).not.toContain("data-open-dialog");
  await expect(page.getByRole("status")).toHaveText("Copied");
});

test("component preview remounts collapsed after client navigation", async ({
  page
}) => {
  await page.goto("/docs/components/button");
  const first = page.locator("[data-component-preview]").first();
  await first.getByRole("button", { name: "View code" }).click();
  await expect(first.locator("[data-preview-toggle]")).toBeHidden();

  await page
    .getByRole("navigation", { name: "Documentation" })
    .getByRole("link", { name: "Card", exact: true })
    .click();

  const next = page.locator("[data-component-preview]").first();
  await expect(next.getByRole("button", { name: "View code" })).toBeVisible();
  await expect(next.locator("[data-preview-source]")).toHaveAttribute(
    "aria-hidden",
    "true"
  );
});

test("short component examples keep their code visible", async ({ page }) => {
  for (const path of [
    "/docs/components/label",
    "/docs/components/button-group"
  ]) {
    await page.goto(path);
    const preview = page.locator("[data-component-preview]").first();

    await expect(preview, path).toHaveAttribute("data-code-open", "true");
    await expect(
      preview.getByRole("button", { name: "View code" }),
      path
    ).toHaveCount(0);
    await expect(preview.locator("[data-preview-source] pre"), path).toBeVisible();
    await expect(
      preview.locator("[data-preview-source] [data-copy-icon]"),
      path
    ).toBeVisible();
  }

  await page.goto("/docs/components/alert");
  const longPreview = page.locator("[data-component-preview]").first();
  await expect(
    longPreview.getByRole("button", { name: "View code" })
  ).toBeVisible();
});

test("component preview copy button appears on hover", async ({ page }) => {
  await page.goto("/docs/components/label");
  const preview = page.locator("[data-component-preview]").first();
  const actions = preview.locator("[data-preview-source] [data-slot='actions']");
  const pre = preview.locator("[data-preview-source] pre");

  await expect(actions).toHaveCSS("opacity", "0");
  await pre.hover();
  await expect(actions).toHaveCSS("opacity", "1");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("component preview keeps code readable", async ({ page }) => {
    await page.goto("/docs/components/button");
    const preview = page.locator("[data-component-preview]").first();

    await expect(preview.locator("[data-preview-toggle]")).toBeHidden();
    await expect(preview.locator("[data-preview-source] pre")).toBeVisible();
    await expect(preview.locator("[data-preview-source] code")).toContainText(
      "Default"
    );
  });
});

test("every page has a table of contents with valid anchors", async ({ page }) => {
  for (const path of pages) {
    await page.goto(path);
    const toc = page.getByRole("navigation", { name: "Table of contents" });
    await expect(toc, path).toBeVisible();
    await expect(toc.locator("a").first(), path).toBeVisible();

    const broken = await toc.locator("a").evaluateAll((links) =>
      (links as HTMLAnchorElement[])
        .map((link) => link.hash)
        .filter((hash) => !document.getElementById(decodeURIComponent(hash.slice(1))))
    );
    expect(broken, path).toEqual([]);
  }
});

test("table of contents tracks the active heading", async ({ page }) => {
  await page.goto("/docs/theming");
  const toc = page.getByRole("navigation", { name: "Table of contents" });
  const layers = toc.getByRole("link", { name: "Layers" });
  const colorScheme = toc.getByRole("link", { name: "Color scheme" });

  await expect(layers).toHaveAttribute("aria-current", "location");
  await expect(page.locator("#layers")).toHaveText("Layers");

  await colorScheme.click();
  await expect(colorScheme).toHaveAttribute("aria-current", "location");
  await expect(page).toHaveURL(/#color-scheme$/);
});

test("table of contents skips demo preview headings", async ({ page }) => {
  await page.goto("/docs/components/alert");
  const toc = page.getByRole("navigation", { name: "Table of contents" });

  await expect(toc.getByRole("link", { name: "Default" })).toBeVisible();
  await expect(toc.getByRole("link", { name: "Heads up!" })).toHaveCount(0);
  await expect(page.locator(".docs-preview h3").filter({ hasText: "Heads up!" })).toHaveCount(1);
});

for (const path of pages) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await page.addStyleTag({
      content: "*, *::before, *::after { transition: none !important; animation: none !important; }"
    });

    await page.emulateMedia({ colorScheme: "light" });
    const light = await new AxeBuilder({ page }).withTags(tags).analyze();
    const lightBlocking = blocking(light.violations);
    expect(lightBlocking, JSON.stringify(lightBlocking, null, 2)).toEqual([]);

    await page.emulateMedia({ colorScheme: "dark" });
    const dark = await new AxeBuilder({ page }).withTags(tags).analyze();
    const darkBlocking = blocking(dark.violations);
    expect(darkBlocking, JSON.stringify(darkBlocking, null, 2)).toEqual([]);
  });
}
