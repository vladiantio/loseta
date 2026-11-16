import { readFileSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { components, experimentalComponents } from "../src/data/components";

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
  "/docs/components",
  "/docs/recipes",
  "/docs/recipes/form",
  "/docs/recipes/data-table",
  "/docs/recipes/date-picker",
  "/docs/guidelines/typography"
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

test("toggle demo flips aria-pressed", async ({ page }) => {
  await page.goto("/docs/components/toggle");
  const toggle = page.locator("[data-demo-toggle]").first();

  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

test("checkbox demo marks the table select-all control indeterminate", async ({
  page
}) => {
  await page.goto("/docs/components/checkbox");
  const checkbox = page.locator("[data-demo-indeterminate]");

  await expect(checkbox).toHaveJSProperty("indeterminate", true);
  const indicator = await checkbox.evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return {
      width: style.width,
      height: style.height,
      mask: style.maskImage
    };
  });
  expect(indicator).toEqual({ width: "8px", height: "2px", mask: "none" });
});

test("radio demo centers the checked indicator and keeps a 24px target", async ({
  page
}) => {
  await page.goto("/docs/components/radio");
  const radio = page.locator(".radio").first();

  const metrics = await radio.evaluate((element) => {
    const dot = getComputedStyle(element, "::before");
    const target = getComputedStyle(element, "::after");
    return {
      dot: {
        width: dot.width,
        height: dot.height,
        inset: dot.inset,
        margin: dot.margin
      },
      target: { width: target.width, height: target.height }
    };
  });

  expect(metrics).toEqual({
    dot: { width: "8px", height: "8px", inset: "0px", margin: "3px" },
    target: { width: "24px", height: "24px" }
  });
});

test("switch demo keeps the thumb inside a 44px pointer target", async ({
  page
}) => {
  await page.goto("/docs/components/switch");
  const control = page.locator(".switch").first();

  const metrics = await control.evaluate((element) => {
    const thumb = getComputedStyle(element, "::before");
    const target = getComputedStyle(element, "::after");
    return {
      thumb: { width: thumb.width, height: thumb.height },
      target: {
        width: Number.parseFloat(target.width),
        height: Number.parseFloat(target.height)
      },
      position: getComputedStyle(element).position
    };
  });

  expect(metrics).toMatchObject({
    thumb: { width: "16px", height: "16px" },
    position: "relative"
  });
  expect(metrics.target.width).toBeGreaterThanOrEqual(44);
  expect(metrics.target.height).toBeGreaterThanOrEqual(24);
});

test("slider examples name every control and style the disabled state", async ({
  page
}) => {
  await page.goto("/docs/components/slider");
  const sliders = page.locator(".docs-preview .slider");
  const count = await sliders.count();

  expect(count).toBeGreaterThanOrEqual(7);
  for (let index = 0; index < count; index += 1) {
    const name = await sliders.nth(index).evaluate((element) => {
      const control = element as HTMLInputElement;
      return (
        control.labels?.[0]?.textContent?.trim() ??
        control.getAttribute("aria-label") ??
        ""
      );
    });
    expect(name).not.toBe("");
  }

  const disabled = page.locator("#demo-slider-disabled");
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveCSS("opacity", "0.5");
  await expect(disabled).toHaveCSS("cursor", "not-allowed");
});

test("input demo keeps the control type scale, selection and file button", async ({
  page
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components/input");
  const input = page.locator(".docs-preview .input").first();
  const file = page.locator(".docs-preview input[type='file']");

  const control = await input.evaluate((element) => {
    const style = getComputedStyle(element);
    const selection = getComputedStyle(element, "::selection");
    return {
      height: style.height,
      fontSize: style.fontSize,
      paddingInline: style.paddingInline,
      selectionBackground: selection.backgroundColor,
      selectionColor: selection.color
    };
  });

  const fileButton = await file.evaluate((element) => {
    const style = getComputedStyle(element, "::file-selector-button");
    return {
      height: style.height,
      borderWidth: style.borderWidth,
      backgroundColor: style.backgroundColor
    };
  });

  expect(control).toEqual({
    height: "32px",
    fontSize: "14px",
    paddingInline: "10px",
    selectionBackground: "oklch(0.205 0 0)",
    selectionColor: "oklch(0.985 0 0)"
  });
  expect(fileButton).toEqual({
    height: "24px",
    borderWidth: "0px",
    backgroundColor: "rgba(0, 0, 0, 0)"
  });
});

test("input file button follows the Mira type scale", async ({ page }) => {
  await page.goto("/docs/components/input");
  const file = page.locator(".docs-preview input[type='file']");

  await page.locator("[data-style-select]").selectOption("mira");
  await expect(page.locator("[data-style-link]")).toHaveAttribute(
    "href",
    "/styles/mira.css"
  );
  await page.waitForFunction(() => {
    return [...document.styleSheets].some(
      (sheet) => sheet.href && sheet.href.endsWith("/styles/mira.css")
    );
  });

  const fileButton = await file.evaluate((element) => {
    const style = getComputedStyle(element, "::file-selector-button");
    return { fontSize: style.fontSize, lineHeight: style.lineHeight };
  });

  expect(fileButton).toEqual({ fontSize: "12px", lineHeight: "16px" });
});

test("textarea demo keeps the control type scale, selection and growth", async ({
  page
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components/textarea");
  const textarea = page.locator(".docs-preview .textarea").first();

  const control = await textarea.evaluate((element) => {
    const style = getComputedStyle(element);
    const selection = getComputedStyle(element, "::selection");
    return {
      minHeight: style.minHeight,
      fontSize: style.fontSize,
      paddingInline: style.paddingInline,
      resize: style.resize,
      fieldSizing: style.getPropertyValue("field-sizing"),
      selectionBackground: selection.backgroundColor,
      selectionColor: selection.color
    };
  });

  expect(control).toEqual({
    minHeight: "64px",
    fontSize: "14px",
    paddingInline: "10px",
    resize: "vertical",
    fieldSizing: "content",
    selectionBackground: "oklch(0.205 0 0)",
    selectionColor: "oklch(0.985 0 0)"
  });

  const initialHeight = await textarea.evaluate(
    (element) => element.getBoundingClientRect().height
  );
  await textarea.fill("Line one\nLine two\nLine three\nLine four\nLine five");
  const grownHeight = await textarea.evaluate(
    (element) => element.getBoundingClientRect().height
  );

  expect(grownHeight).toBeGreaterThan(initialHeight);
});

test("textarea follows the Mira type scale", async ({ page }) => {
  await page.goto("/docs/components/textarea");
  const textarea = page.locator(".docs-preview .textarea").first();

  await page.locator("[data-style-select]").selectOption("mira");
  await expect(page.locator("[data-style-link]")).toHaveAttribute(
    "href",
    "/styles/mira.css"
  );
  await page.waitForFunction(() => {
    return [...document.styleSheets].some(
      (sheet) => sheet.href && sheet.href.endsWith("/styles/mira.css")
    );
  });

  const control = await textarea.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      paddingInline: style.paddingInline
    };
  });

  expect(control).toEqual({
    fontSize: "12px",
    lineHeight: "16px",
    paddingInline: "8px"
  });
});

test("field sets fill their container and responsive rows follow it", async ({
  page
}) => {
  await page.goto("/docs/components/field");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Responsive layout" }) });
  const fieldset = example.locator("fieldset.fieldset");
  const row = example.locator(".field[data-orientation='responsive']").first();
  const initialWidth = await fieldset.evaluate(
    (element) => element.getBoundingClientRect().width
  );

  expect(initialWidth).toBeGreaterThan(448);
  await expect(row).toHaveCSS("flex-direction", "row");

  await fieldset.evaluate((element) => {
    (element as HTMLElement).style.maxWidth = "20rem";
  });

  await expect(fieldset).toHaveCSS("width", "320px");
  await expect(row).toHaveCSS("flex-direction", "column");
});

test("field separator centers a bare hr behind its content", async ({ page }) => {
  await page.goto("/docs/components/field");
  const separator = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Field group" }) })
    .locator(".field-separator");

  const geometry = await separator.evaluate((element) => {
    const hr = element.querySelector("hr");
    if (!(hr instanceof HTMLElement)) throw new Error("missing separator hr");
    const box = element.getBoundingClientRect();
    const line = hr.getBoundingClientRect();
    return {
      position: getComputedStyle(hr).position,
      centerOffset: line.top + line.height / 2 - (box.top + box.height / 2)
    };
  });

  expect(geometry.position).toBe("absolute");
  expect(Math.abs(geometry.centerOffset)).toBeLessThanOrEqual(1);
  await expect(separator.locator("span")).toHaveText("Or");
});

test("field invalid state colors the block and lists every error", async ({
  page
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components/field");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Validation and errors" }) });
  const field = example.locator(".field");
  const vertical = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Vertical" }) })
    .locator(".field");

  const colors = await field.evaluate((element) => {
    const alert = element.querySelector("[role='alert']");
    const input = element.querySelector("input");
    return {
      block: getComputedStyle(element).color,
      alert: alert instanceof HTMLElement ? getComputedStyle(alert).color : null,
      inputBorder:
        input instanceof HTMLElement ? getComputedStyle(input).borderTopColor : null
    };
  });
  const normalColor = await vertical.evaluate(
    (element) => getComputedStyle(element).color
  );

  expect(colors.block).not.toBe(normalColor);
  expect(colors.alert).toBe(colors.block);
  expect(colors.inputBorder).toBe(colors.block);

  const list = field.locator("[role='alert'] ul");
  await expect(list).toHaveCSS("list-style-type", "disc");
  await expect(list).toHaveCSS("margin-left", "16px");
  await expect(list).toHaveCSS("row-gap", "4px");
});

test("empty draws its dashed outline and scopes media spacing", async ({ page }) => {
  await page.goto("/docs/components/empty");
  const defaultExample = page.locator(".docs-preview .empty").first();
  const figure = defaultExample.locator("figure");

  await expect(defaultExample).toHaveCSS("border-top-width", "1px");
  await expect(defaultExample).toHaveCSS("border-top-style", "dashed");
  await expect(defaultExample.locator("header")).toHaveCSS("max-width", "384px");
  await expect(figure).toHaveCSS("width", "32px");
  await expect(figure).toHaveCSS("margin-bottom", "8px");

  const avatarExample = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Avatar$/ }) })
    .locator(".empty");
  await expect(avatarExample.locator("figure")).toHaveCSS("margin-bottom", "0px");
  await expect(avatarExample.locator(".avatar")).toHaveCSS("width", "40px");

  const imageExample = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Image$/ }) })
    .locator(".empty");
  const figureBox = await imageExample.locator("figure").boundingBox();
  expect(figureBox).not.toBeNull();
  expect(figureBox!.width).toBeGreaterThan(0);
  expect(figureBox!.width / figureBox!.height).toBeCloseTo(16 / 9, 1);
});

test("avatar groups overlap and size their count with the group", async ({
  page
}) => {
  await page.goto("/docs/components/avatar");

  const group = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Group$/ }) })
    .locator(".avatar-group");
  await expect(group.locator(".avatar").first()).toHaveCSS(
    "margin-right",
    "-8px"
  );

  const groupCount = page
    .locator("section.example")
    .filter({
      has: page.locator(".example-title", { hasText: /^Group count$/ })
    })
    .locator("[data-slot='count']");
  await expect(groupCount).toHaveCSS("width", "32px");
  await expect(groupCount).toHaveCSS("height", "32px");
  await expect(groupCount).toHaveCSS("border-top-width", "1px");

  const rtl = page
    .locator("section.example")
    .filter({
      has: page.locator(".example-title", { hasText: /^Right-to-left$/ })
    });
  await expect(rtl.locator("[data-slot='count']")).toHaveCSS("width", "40px");
  await expect(rtl.locator(".avatar [data-slot='badge']")).toHaveCSS(
    "left",
    "0px"
  );
});

test("accordion and collapsible animate their content on close", async ({ page }) => {
  for (const [slug, selector] of [
    ["accordion", ".accordion details"],
    ["collapsible", ".collapsible"]
  ] as const) {
    await page.goto(`/docs/components/${slug}`);
    const transition = await page
      .locator(`.docs-preview ${selector}`)
      .first()
      .evaluate((element) => {
        const style = getComputedStyle(element, "::details-content");
        return {
          property: style.transitionProperty,
          duration: style.transitionDuration,
          behavior: style.transitionBehavior
        };
      });

    expect(transition.property).toContain("block-size");
    expect(transition.property).toContain("content-visibility");
    expect(transition.duration).toBe("0.15s");
    expect(transition.behavior).toBe("allow-discrete");
  }
});

test("experimental pages expose the banner, install flag and stylesheet", async ({
  page
}) => {
  const experimental = experimentalComponents[0];
  if (!experimental) {
    test.skip();
    return;
  }

  await page.goto(`/docs/components/${experimental.id}`);

  await expect(page.locator(".docs-callout")).toContainText(
    "outside the v1 compatibility contract"
  );
  await expect(page.locator(".install-command").first()).toContainText(
    "--experimental"
  );
  await expect(page.locator("[data-experimental-css]")).toHaveCount(1);
  await expect(
    page
      .getByRole("navigation", { name: "Documentation" })
      .getByRole("link", { name: experimental.title, exact: true })
  ).toBeVisible();

  await page.goto("/docs/components/button");
  await expect(page.locator("[data-experimental-css]")).toHaveCount(0);
});

test("button keeps icon padding logical in RTL", async ({ page }) => {
  await page.goto("/docs/components/button");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Right-to-left" }) });
  const button = example.locator(".btn").first();

  await expect(button).toHaveCSS("padding-right", "8px");
  await expect(button).toHaveCSS("padding-left", "10px");
});

test("input group positions addons visually and rings only the control", async ({
  page
}) => {
  await page.goto("/docs/components/input-group");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Inline addons" }) });
  const group = example.locator(".input-group");
  const input = group.locator("input");
  const start = group.locator("[data-slot='addon'][data-align='inline-start']");
  const end = group.locator("[data-slot='addon'][data-align='inline-end']");
  const button = end.locator("button");

  const startBox = await start.boundingBox();
  const inputBox = await input.boundingBox();
  const endBox = await end.boundingBox();
  expect(startBox).not.toBeNull();
  expect(inputBox).not.toBeNull();
  expect(endBox).not.toBeNull();
  expect(startBox!.x + startBox!.width).toBeLessThanOrEqual(inputBox!.x);
  expect(inputBox!.x + inputBox!.width).toBeLessThanOrEqual(endBox!.x);
  await expect(group).toHaveCSS("height", "32px");

  await input.focus();
  await expect(group).toHaveCSS("border-top-color", "oklch(0.708 0 0)");
  await expect(group).toHaveCSS("box-shadow", /3px/);

  await button.focus();
  await expect(button).toHaveCSS("box-shadow", /3px/);
  await expect(group).toHaveCSS("border-top-color", "oklch(0.922 0 0)");
  await expect(group).toHaveCSS("box-shadow", "none");
});

test("input group tints disabled controls and fades addons", async ({ page }) => {
  await page.goto("/docs/components/input-group");
  const states = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "States" }) });
  const disabled = states
    .locator(".field")
    .filter({ has: page.locator("#demo-input-group-disabled") });
  const disabledGroup = disabled.locator(".input-group");
  const enabledGroup = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Inline addons" }) })
    .locator(".input-group");

  const background = (locator: Locator) =>
    locator.evaluate((element) => getComputedStyle(element).backgroundColor);

  expect(await background(disabledGroup)).not.toBe(await background(enabledGroup));
  await expect(disabledGroup.locator("[data-slot='addon']")).toHaveCSS(
    "opacity",
    "0.5"
  );
  await expect(disabledGroup).toHaveCSS("height", "32px");
});

test("input group custom controls get the group geometry and focus ring", async ({
  page
}) => {
  await page.goto("/docs/components/input-group");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Custom control" }) });
  const group = example.locator(".input-group");
  const control = group.locator("[data-slot='input-group-control']");

  await expect(control).toHaveCSS("border-top-width", "0px");
  await expect(control).toHaveCSS("font-size", "14px");
  await control.focus();
  await expect(group).toHaveCSS("border-top-color", "oklch(0.708 0 0)");
  await expect(group).toHaveCSS("box-shadow", /3px/);
});

test("button styles link actions without the button role", async ({ page }) => {
  await page.goto("/docs/components/button");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "As link" }) });
  const link = example.getByRole("link", { name: "Login", exact: true });

  await expect(link).toHaveCSS("text-decoration-line", "none");
  await expect(example.getByRole("button", { name: "Login", exact: true })).toHaveCount(0);
});

test("sheet and drawer dialogs open and close", async ({ page }) => {
  await page.goto("/docs/components/sheet");
  const sheet = page.locator("#demo-sheet");
  await page.locator('[data-open-dialog="demo-sheet"]').click();
  await expect(sheet).toHaveAttribute("open", "");
  await expect(sheet.locator("[data-slot='title']")).toBeVisible();
  await sheet.getByRole("button", { name: "Cancel" }).click();
  await expect(sheet).not.toHaveAttribute("open", "");

  const left = page.locator("#demo-sheet-left");
  await page.getByRole("button", { name: "Open left sheet" }).click();
  await expect(left).toHaveAttribute("open", "");
  await expect(left.locator("[data-slot='title']")).toBeVisible();
  await left.getByRole("button", { name: "Close" }).click();
  await expect(left).not.toHaveAttribute("open", "");

  await page.goto("/docs/components/drawer");
  const drawer = page.locator("#demo-drawer");
  await page.getByRole("button", { name: "Open drawer" }).click();
  await expect(drawer).toHaveAttribute("open", "");
  await expect(drawer.locator("[data-slot='handle']")).toBeVisible();
  await drawer.getByRole("button", { name: "Cancel" }).click();
  await expect(drawer).not.toHaveAttribute("open", "");
});

test("hover card opens on hover and closes on leave", async ({ page }) => {
  await page.goto("/docs/components/hover-card");
  const panel = page.locator("#hover-card-profile");

  await expect(panel).toBeHidden();
  await page.getByRole("link", { name: "@loseta" }).hover();
  await expect(panel).toBeVisible();

  await page.mouse.move(0, 0);
  await expect(panel).toBeHidden();
});

test("context menu opens at the pointer and closes with Escape", async ({ page }) => {
  await page.goto("/docs/components/context-menu");
  const menu = page.locator(".context-menu");

  await expect(menu).toHaveAttribute("aria-hidden", "true");
  await page.locator("[data-demo-context]").click({ button: "right" });
  await expect(menu).toHaveAttribute("aria-hidden", "false");
  await expect(menu).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-hidden", "true");
});

test("menubar switches between menus", async ({ page }) => {
  await page.goto("/docs/components/menubar");
  const items = page.locator(".menubar-item");
  const file = items.nth(0).locator("[data-popover]");
  const edit = items.nth(1).locator("[data-popover]");

  await page.getByRole("menuitem", { name: "File" }).click();
  await expect(file).toHaveAttribute("aria-hidden", "false");
  await expect(edit).toHaveAttribute("aria-hidden", "true");

  await page.getByRole("menuitem", { name: "Edit" }).click();
  await expect(file).toHaveAttribute("aria-hidden", "true");
  await expect(edit).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(edit).toHaveAttribute("aria-hidden", "true");
});

test("navigation menu switches between panels", async ({ page }) => {
  await page.goto("/docs/components/navigation-menu");
  const products = page.locator("#nav-products");
  const resources = page.locator("#nav-resources");

  await page.getByRole("button", { name: /Products/ }).click();
  await expect(products).toHaveAttribute("aria-hidden", "false");
  await expect(resources).toHaveAttribute("aria-hidden", "true");

  await page.getByRole("button", { name: /Resources/ }).click();
  await expect(products).toHaveAttribute("aria-hidden", "true");
  await expect(resources).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(resources).toHaveAttribute("aria-hidden", "true");
});

test("dropdown menu still opens after the menu primitive refactor", async ({ page }) => {
  await page.goto("/docs/components/dropdown-menu");
  const panel = page.locator(".dropdown-menu [data-popover]");

  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(page.getByRole("menuitem", { name: "Profile" })).toBeVisible();

  await page.getByRole("heading", { level: 1 }).click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("select opens, selects an option and updates the trigger", async ({ page }) => {
  await page.goto("/docs/components/select");
  const select = page.locator(".select").first();
  const trigger = select.locator('[role="combobox"]');
  const panel = select.locator("[data-popover]");

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await select.getByRole("option", { name: "Banana", exact: true }).click();
  await expect(trigger).toContainText("Banana");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("button group keeps a nested picker above the preview chrome", async ({ page }) => {
  await page.goto("/docs/components/button-group");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Select" }) });
  const select = example.locator(".select");
  const trigger = select.locator('[role="combobox"]');
  const panel = select.locator("[data-popover]");

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await select.getByRole("option", { name: "Euro", exact: true }).click();
  await expect(trigger).toContainText("€");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("combobox filters, selects, clears and shows an empty state", async ({ page }) => {
  await page.goto("/docs/components/combobox");
  const combobox = page.locator(".combobox:has(#combobox-fruit-panel)");
  const input = combobox.locator("input");
  const panel = combobox.locator("[data-popover]");

  await input.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await input.fill("ban");
  await expect(combobox.getByRole("option", { name: "Banana", exact: true })).toBeVisible();
  await expect(combobox.getByRole("option", { name: "Apple", exact: true })).toBeHidden();

  await combobox.getByRole("option", { name: "Banana", exact: true }).click();
  await expect(input).toHaveValue("Banana");
  await expect(panel).toHaveAttribute("aria-hidden", "true");

  await combobox.locator("[data-slot='clear']").click();
  await expect(input).toHaveValue("");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await input.fill("zzz");
  await expect(combobox.locator("[data-slot='empty']")).toBeVisible();

  const multiple = page.locator(".combobox:has(#combobox-tag-panel)");
  const multipleInput = multiple.locator("input");
  await multipleInput.click();
  await multiple.getByRole("option", { name: "Engineering", exact: true }).click();
  await expect(
    multiple.getByRole("option", { name: "Engineering", exact: true })
  ).toHaveAttribute("aria-selected", "true");
  await expect(multiple.locator("[data-popover]")).toHaveAttribute("aria-hidden", "false");
});

test("command filters, shows an empty state and closes on selection", async ({ page }) => {
  await page.goto("/docs/components/command");
  const dialog = page.locator("#demo-command");
  const input = dialog.getByRole("textbox", { name: "Search commands" });

  await page.getByRole("button", { name: "Open command" }).click();
  await expect(dialog).toHaveAttribute("open", "");
  await expect(input).toBeFocused();

  await input.fill("set");
  await expect(dialog.getByRole("option", { name: "Open settings" })).toBeVisible();
  await expect(dialog.getByRole("option", { name: "Go home" })).toBeHidden();
  await expect(dialog.locator(".command [data-slot='empty']")).toBeHidden();

  await input.fill("zzz");
  await expect(dialog.locator(".command [data-slot='empty']")).toBeVisible();

  await input.fill("set");
  await dialog.getByRole("option", { name: "Open settings" }).click();
  await expect(dialog).not.toHaveAttribute("open", "");
});

test("calendar exposes a grid with a selected day", async ({ page }) => {
  await page.goto("/docs/components/calendar");

  const grid = page.getByRole("grid");
  await expect(grid).toBeVisible();
  await expect(grid.locator('td[aria-selected="true"]')).toHaveCount(1);
  await expect(page.getByRole("button", { name: "February 14, 2026" })).toBeVisible();
});

test("carousel controls scroll the viewport and update indicators", async ({ page }) => {
  await page.goto("/docs/components/carousel");
  const viewport = page.locator(".carousel-viewport");
  const scrollLeft = () =>
    viewport.evaluate((element) => element.scrollLeft);

  expect(await scrollLeft()).toBe(0);

  await page.getByRole("button", { name: "Next slide" }).click();
  await expect.poll(scrollLeft).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Go to slide 3" }).click();
  await expect(
    page.getByRole("button", { name: "Go to slide 3" })
  ).toHaveAttribute("aria-current", "true");
});

test("toast dismissal removes the item", async ({ page }) => {
  await page.goto("/docs/components/toast");
  const toasts = page.locator(".toast");

  await expect(toasts).toHaveCount(2);
  await toasts.first().getByRole("button", { name: "Dismiss" }).click();
  await expect(toasts).toHaveCount(1);
});

test("questionnaire navigates between fieldset steps", async ({ page }) => {
  await page.goto("/docs/components/questionnaire");
  const questionnaire = page.locator(".questionnaire[data-demo='questionnaire']");
  const label = questionnaire.locator("[data-slot='progress-label']");
  const steps = questionnaire.locator("[data-slot='item']");

  await expect(label).toHaveText("Question 1 of 2");
  await expect(steps.first()).toBeVisible();
  await expect(
    questionnaire.getByRole("button", { name: "Previous" })
  ).toBeDisabled();

  await questionnaire.getByRole("button", { name: "Next" }).click();
  await expect(label).toHaveText("Question 2 of 2");
  await expect(steps.first()).toBeHidden();
  await expect(steps.nth(1)).toBeVisible();
  await expect(
    questionnaire.getByRole("button", { name: "Next" })
  ).toBeDisabled();

  await questionnaire.getByRole("button", { name: "Previous" }).click();
  await expect(label).toHaveText("Question 1 of 2");
  await expect(steps.first()).toBeVisible();
});

test("message scroller jumps to the latest message", async ({ page }) => {
  await page.goto("/docs/components/message-scroller");
  const scroller = page.locator(".message-scroller");
  const viewport = scroller.locator(".message-scroller-viewport");
  const jump = scroller.getByRole("button", { name: "Jump to latest" });
  const scrollTop = () => viewport.evaluate((element) => element.scrollTop);

  expect(await viewport.evaluate((element) => element.scrollHeight)).toBeGreaterThan(
    await viewport.evaluate((element) => element.clientHeight)
  );
  await expect(jump).toBeVisible();
  await jump.click();
  await expect.poll(scrollTop).toBeGreaterThan(0);
  await expect(jump).toBeHidden();
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
  await page.goto("/docs/components/alert");
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
      "Button"
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

  await expect(toc.getByRole("link", { name: "Examples" })).toBeVisible();
  await expect(toc.getByRole("link", { name: "Heads up!" })).toHaveCount(0);
  await expect(page.locator(".docs-preview h3").filter({ hasText: "Heads up!" })).toHaveCount(1);
});

test("default example leads the page without a heading", async ({ page }) => {
  await page.goto("/docs/components/alert");
  const content = page.locator(".docs-content");
  const firstExample = content.locator("section.example").first();

  await expect(firstExample.locator("h3.example-title")).toHaveCount(0);
  await expect(
    content.getByRole("heading", { name: "Installation", level: 2 })
  ).toBeVisible();

  const precedesInstallation = await content.evaluate((element) => {
    const preview = element.querySelector("section.example [data-component-preview]");
    const heading = (text: string) =>
      [...element.querySelectorAll("h2")].find(
        (node) => node.textContent?.trim() === text
      );
    const installation = heading("Installation");
    const command = element.querySelector(".install-command");
    const examples = heading("Examples");
    const follows = (before: Element | null | undefined, after: Element | null | undefined) =>
      Boolean(
        before &&
          after &&
          (before.compareDocumentPosition(after) &
            Node.DOCUMENT_POSITION_FOLLOWING)
      );

    return (
      follows(preview, installation) &&
      follows(installation, command) &&
      follows(command, examples)
    );
  });

  expect(precedesInstallation).toBe(true);
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
