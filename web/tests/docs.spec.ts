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
  "/docs/behavior",
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
  const block = page.locator('.code-block:has([data-slot="wrap"])');
  const toggle = block.locator("[data-slot='wrap']");
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

test("joined toggle group collapses borders and lifts the focused item", async ({
  page
}) => {
  await page.goto("/docs/components/toggle-group");
  const group = page.getByRole("group", { name: "Joined spacing" });
  const middle = group.getByRole("button", { name: "Italic" });

  await expect(middle).toHaveCSS("border-inline-start-width", "0px");

  await middle.focus();
  const stacking = await middle.evaluate((element) => {
    const style = getComputedStyle(element);
    return { position: style.position, zIndex: style.zIndex };
  });

  expect(stacking.position).toBe("relative");
  expect(Number(stacking.zIndex)).toBeGreaterThan(0);
});

test("joined outline toggle group carries a single shadow", async ({ page }) => {
  await page.goto("/docs/components/toggle-group");
  await page.locator("[data-style-select]").selectOption("vega");
  await page.waitForFunction(() =>
    [...document.styleSheets].some(
      (sheet) => sheet.href && sheet.href.endsWith("/styles/vega.css")
    )
  );

  const group = page.getByRole("group", { name: "Joined spacing" });
  const middle = group.getByRole("button", { name: "Italic" });

  await expect(middle).toHaveCSS("box-shadow", "none");
  await expect(group).toHaveCSS("box-shadow", /rgb/);
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

test("input otp builds a slot row and aligns the value", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components/input-otp");
  await page.evaluate(() => document.fonts.ready);

  const components = page.locator(".docs-preview .input-otp");
  const count = await components.count();
  expect(count).toBeGreaterThanOrEqual(10);

  for (let index = 0; index < count; index += 1) {
    const component = components.nth(index);
    const control = component.locator("input");
    const maxLength = await control.evaluate(
      (element) => (element as HTMLInputElement).maxLength
    );
    const name = await control.evaluate((element) => {
      const input = element as HTMLInputElement;
      const labels = input.labels
        ? Array.from(input.labels)
            .map((label) => label.textContent?.trim())
            .filter(Boolean)
        : [];
      return input.getAttribute("aria-label") ?? labels.join(" ") ?? "";
    });

    await expect(component.locator("[data-slot='cell']")).toHaveCount(maxLength);
    await expect(component.locator("[data-slot='entry']")).toHaveCount(1);
    expect(name).not.toBe("");
  }

  const component = components.first();
  const cells = component.locator("[data-slot='cell']");
  const input = component.locator("input");

  await expect(cells).toHaveCount(6);
  await expect(input).toHaveCount(1);

  const structure = await component.evaluate((element) => {
    const control = element.querySelector("input")!;
    const cell = element.querySelector("[data-slot='cell']")!;
    const style = getComputedStyle(element);
    const cellStyle = getComputedStyle(cell);
    const rect = cell.getBoundingClientRect();
    return {
      tag: element.tagName,
      direction: style.direction,
      gap: parseFloat(style.columnGap),
      cellWidth: rect.width,
      cellHeight: rect.height,
      radius: cellStyle.borderStartStartRadius,
      numeric: getComputedStyle(control).fontVariantNumeric
    };
  });

  expect(structure.tag).toBe("LABEL");
  expect(structure.direction).toBe("ltr");
  expect(structure.gap).toBe(8);
  expect(structure.cellWidth).toBe(40);
  expect(structure.cellHeight).toBe(40);
  expect(structure.radius).toBe("10px");
  expect(structure.numeric).toContain("tabular-nums");

  const fourthBox = await cells.nth(3).boundingBox();
  expect(fourthBox).not.toBeNull();
  await page.mouse.click(
    fourthBox!.x + fourthBox!.width / 2,
    fourthBox!.y + fourthBox!.height / 2
  );
  await expect(input).toBeFocused();

  await input.fill("123456");
  await expect(input).toHaveValue("123456");

  const alignment = await component.evaluate((element) => {
    const control = element.querySelector("input")!;
    const inputStyle = getComputedStyle(control);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    context.font = `${inputStyle.fontStyle} ${inputStyle.fontWeight} ${inputStyle.fontSize} ${inputStyle.fontFamily}`;
    const charWidth = context.measureText("0").width;
    const paddingStart = parseFloat(inputStyle.paddingInlineStart);
    const spacing = parseFloat(inputStyle.letterSpacing);
    const inputLeft = control.getBoundingClientRect().left;

    return [...element.querySelectorAll("[data-slot='cell']")].map(
      (cell, index) => {
        const rect = cell.getBoundingClientRect();
        return {
          cell: rect.left + rect.width / 2,
          glyph:
            inputLeft +
            paddingStart +
            index * (charWidth + spacing) +
            charWidth / 2
        };
      }
    );
  });

  for (const pair of alignment) {
    expect(Math.abs(pair.cell - pair.glyph)).toBeLessThanOrEqual(1);
  }

  await input.fill("123");
  const active = await component.evaluate((element) => {
    const control = element.querySelector("input")!;
    const entry = element.querySelector("[data-slot='entry']")!;
    const entryStyle = getComputedStyle(entry);
    const activeStyle = getComputedStyle(entry, "::after");
    const cells = [...element.querySelectorAll("[data-slot='cell']")];
    return {
      visibility: activeStyle.visibility,
      shadow: activeStyle.boxShadow,
      border: activeStyle.borderTopColor,
      indicatorLeft:
        control.getBoundingClientRect().right +
        parseFloat(entryStyle.columnGap) +
        parseFloat(activeStyle.marginInlineStart),
      fourthLeft: cells[3].getBoundingClientRect().left
    };
  });

  expect(active.visibility).toBe("visible");
  expect(active.shadow).toContain("3px");
  expect(Math.abs(active.indicatorLeft - active.fourthLeft)).toBeLessThanOrEqual(1);

  await input.fill("123456");
  const completed = await component.evaluate((element) => {
    const entry = element.querySelector("[data-slot='entry']")!;
    const cell = element.querySelector("[data-slot='cell']")!;
    return {
      visibility: getComputedStyle(entry, "::after").visibility,
      cellShadow: getComputedStyle(cell).boxShadow
    };
  });

  expect(completed.visibility).toBe("hidden");
  expect(completed.cellShadow).toBe("none");
  await expect
    .poll(() =>
      component.evaluate(
        (element) =>
          getComputedStyle(element.querySelector("[data-slot='cell']")!)
            .borderTopColor
      )
    )
    .toBe(active.border);

  const selection = await input.evaluate(
    (element) => getComputedStyle(element, "::selection").backgroundColor
  );
  expect(selection).not.toBe("rgba(0, 0, 0, 0)");
  expect(selection).not.toBe("oklch(0.205 0 0)");

  const joinedInput = page.locator("#demo-input-otp-joined");
  const joined = page.locator(".docs-preview .input-otp").filter({
    has: joinedInput
  });
  const joinedCells = joined.locator("[data-slot='cell']");

  await expect(joinedInput).toHaveValue("123456");
  await expect(joinedCells).toHaveCount(6);
  await expect(joined).toHaveCSS("column-gap", "0px");
  await expect(joinedCells.nth(1)).toHaveCSS("border-inline-start-width", "0px");
  await expect(joinedCells.first()).toHaveCSS(
    "border-start-start-radius",
    "10px"
  );
  await expect(joinedCells.last()).toHaveCSS("border-start-end-radius", "10px");

  const sizes = [
    { selector: "#demo-input-otp-sm", size: 32 },
    { selector: "#demo-input-otp-default", size: 40 },
    { selector: "#demo-input-otp-lg", size: 48 }
  ];

  for (const { selector, size } of sizes) {
    const control = page.locator(selector);
    const root = page.locator(".docs-preview .input-otp").filter({
      has: control
    });
    const cell = root.locator("[data-slot='cell']").first();

    await expect(cell).toHaveCSS("width", `${size}px`);
    await expect(cell).toHaveCSS("height", `${size}px`);
    await expect(control).toHaveCSS("height", `${size}px`);
  }

  const rtlInput = page.locator("#demo-input-otp-rtl");
  const rtl = page.locator(".docs-preview .input-otp").filter({
    has: rtlInput
  });
  const rtlCells = rtl.locator("[data-slot='cell']");
  const field = page.locator(".docs-preview .field").filter({ has: rtlInput });

  await expect(rtlInput).toHaveValue("123456");
  expect(await rtlInput.evaluate((element) => getComputedStyle(element).direction)).toBe(
    "ltr"
  );
  const firstBox = await rtlCells.first().boundingBox();
  const lastBox = await rtlCells.last().boundingBox();
  const fieldBox = await field.boundingBox();
  const rtlBox = await rtl.boundingBox();
  expect(firstBox).not.toBeNull();
  expect(lastBox).not.toBeNull();
  expect(fieldBox).not.toBeNull();
  expect(rtlBox).not.toBeNull();
  expect(firstBox!.x).toBeLessThan(lastBox!.x);
  expect(
    Math.abs(fieldBox!.x + fieldBox!.width - (rtlBox!.x + rtlBox!.width))
  ).toBeLessThanOrEqual(1);
});

test("input otp keeps focus, invalid and disabled states", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components/input-otp");

  const component = page.locator(".docs-preview .input-otp").first();
  const input = component.locator("input");
  const cell = component.locator("[data-slot='cell']").first();
  const defaultBorder = await cell.evaluate(
    (element) => getComputedStyle(element).borderTopColor
  );

  await input.focus();
  await expect(component).toHaveCSS("box-shadow", "none");
  await expect(cell).toHaveCSS("box-shadow", "none");
  await expect(cell).toHaveCSS("border-top-color", defaultBorder);
  const active = await component.evaluate((element) => {
    const entry = element.querySelector("[data-slot='entry']")!;
    const style = getComputedStyle(entry, "::after");
    return { visibility: style.visibility, shadow: style.boxShadow };
  });
  expect(active.visibility).toBe("visible");
  expect(active.shadow).toContain("3px");

  const invalidInput = page.locator("#demo-input-otp-invalid");
  const invalid = page.locator(".docs-preview .input-otp").filter({
    has: invalidInput
  });
  const invalidCell = invalid.locator("[data-slot='cell']").first();

  await expect(invalidInput).toHaveAttribute("aria-invalid", "true");
  await expect(invalid).toHaveCSS("box-shadow", "none");
  const invalidBorder = await invalidCell.evaluate(
    (element) => getComputedStyle(element).borderTopColor
  );
  expect(invalidBorder).not.toBe(defaultBorder);

  await invalidInput.focus();
  await expect(invalidCell).toHaveCSS("box-shadow", /3px/);

  await invalidInput.fill("123");
  await expect(invalidCell).toHaveCSS("box-shadow", /3px/);
  const invalidActive = await invalid.evaluate((element) => {
    const entry = element.querySelector("[data-slot='entry']")!;
    const style = getComputedStyle(entry, "::after");
    return {
      visibility: style.visibility,
      border: style.borderTopColor,
      shadow: style.boxShadow
    };
  });
  expect(invalidActive.visibility).toBe("visible");
  expect(invalidActive.border).not.toBe(defaultBorder);
  expect(invalidActive.shadow).toContain("3px");

  const disabledInput = page.locator("#demo-input-otp-disabled");
  const disabled = page.locator(".docs-preview .input-otp").filter({
    has: disabledInput
  });

  await expect(disabledInput).toBeDisabled();
  await expect(disabled).toHaveCSS("opacity", "0.5");
  await expect(disabled).toHaveCSS("cursor", "not-allowed");
});

test("input otp keeps a focus outline in forced-colors mode", async ({ page }) => {
  await page.goto("/docs/components/input-otp");
  await page.emulateMedia({ forcedColors: "active" });
  const component = page.locator(".docs-preview .input-otp").first();
  const cell = component.locator("[data-slot='cell']").first();

  await component.locator("input").focus();
  const active = await component.evaluate((element) => {
    const entry = element.querySelector("[data-slot='entry']")!;
    const style = getComputedStyle(entry, "::after");
    return {
      visibility: style.visibility,
      width: style.outlineWidth,
      style: style.outlineStyle,
      offset: style.outlineOffset
    };
  });

  expect(active.visibility).toBe("visible");
  expect(active.width).toBe("2px");
  expect(active.style).toBe("solid");
  expect(active.offset).toBe("2px");
  await expect(cell).toHaveCSS("outline-style", "none");

  const fullInput = page.locator("#demo-input-otp-rtl");
  const full = page.locator(".docs-preview .input-otp").filter({
    has: fullInput
  });
  const fullCell = full.locator("[data-slot='cell']").first();

  await fullInput.focus();
  await expect(fullCell).toHaveCSS("outline-width", "2px");
  await expect(fullCell).toHaveCSS("outline-style", "solid");
  await expect(fullCell).toHaveCSS("outline-offset", "2px");
  const fullActive = await full.evaluate((element) => {
    const entry = element.querySelector("[data-slot='entry']")!;
    return getComputedStyle(entry, "::after").visibility;
  });
  expect(fullActive).toBe("hidden");
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

test("card spacing follows the size and the custom property", async ({ page }) => {
  await page.goto("/docs/components/card");

  const defaultCard = page.locator(".docs-preview .card").first();
  await expect(defaultCard).toHaveCSS("padding-top", "16px");
  await expect(defaultCard).toHaveCSS("row-gap", "16px");
  await expect(defaultCard.locator("header").first()).toHaveCSS(
    "padding-left",
    "16px"
  );

  const smallCard = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Small$/ }) })
    .locator(".card");
  await expect(smallCard).toHaveCSS("padding-top", "12px");
  await expect(smallCard).toHaveCSS("row-gap", "12px");
  await expect(smallCard.locator("header")).toHaveCSS("padding-left", "12px");

  const spacingCards = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Spacing$/ }) })
    .locator(".card");
  await expect(spacingCards.nth(1)).toHaveCSS("padding-top", "24px");
  await expect(spacingCards.nth(1)).toHaveCSS("row-gap", "24px");
  await expect(spacingCards.nth(1).locator("header")).toHaveCSS(
    "padding-left",
    "24px"
  );
  await expect(spacingCards.nth(2)).toHaveCSS("padding-top", "32px");
  await expect(spacingCards.nth(2)).toHaveCSS("row-gap", "32px");
});

test("card images fill the width and follow the card radius", async ({ page }) => {
  await page.goto("/docs/components/card");

  const card = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Image$/ }) })
    .locator(".card");
  const geometry = await card.evaluate((element) => {
    const image = element.querySelector(":scope > img");
    if (!(image instanceof HTMLElement)) throw new Error("missing card image");
    const cardBox = element.getBoundingClientRect();
    const imageBox = image.getBoundingClientRect();
    const imageStyle = getComputedStyle(image);
    return {
      cardWidth: cardBox.width,
      imageWidth: imageBox.width,
      cardRadius: getComputedStyle(element).borderTopLeftRadius,
      imageRadius: imageStyle.borderTopLeftRadius,
      display: imageStyle.display
    };
  });

  expect(Math.abs(geometry.imageWidth - geometry.cardWidth)).toBeLessThanOrEqual(1);
  expect(geometry.cardRadius).not.toBe("0px");
  expect(geometry.imageRadius).toBe(geometry.cardRadius);
  expect(geometry.display).toBe("block");
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
    "-6px"
  );

  const badgeAvatar = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Badge$/ }) })
    .locator(".avatar");
  await expect(badgeAvatar).toHaveCSS("overflow", "visible");
  await expect(badgeAvatar.locator("[data-slot='badge']")).toHaveCSS(
    "width",
    "10px"
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
  await expect(groupCount).toHaveCSS("position", "relative");

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

test("breadcrumb styles separators and opens collapsed menus", async ({ page }) => {
  await page.goto("/docs/components/breadcrumb");

  const defaultExample = page.locator(".docs-preview .breadcrumb").first();
  const current = defaultExample.locator("[aria-current='page']");
  await expect(current).toHaveText("Breadcrumb");
  await expect(current).toHaveCSS("cursor", "default");
  await expect(defaultExample.locator("li[aria-hidden='true']")).toHaveCount(2);
  await expect(
    defaultExample.locator("li[aria-hidden='true'] svg").first()
  ).toHaveAttribute("data-rtl-flip", "");

  const custom = page
    .locator("section.example")
    .filter({
      has: page.locator(".example-title", { hasText: /^Custom separator$/ })
    });
  await expect(custom.locator("li[aria-hidden='true'] svg").first()).toHaveCSS(
    "width",
    "14px"
  );

  const rtl = page
    .locator("section.example")
    .filter({
      has: page.locator(".example-title", { hasText: /^Right-to-left$/ })
    });
  await expect(rtl.locator(".breadcrumb > ol")).toHaveCSS("direction", "rtl");
  expect(
    await rtl
      .locator("li[aria-hidden='true'] svg")
      .first()
      .evaluate((icon) => getComputedStyle(icon).rotate)
  ).toBe("180deg");

  const ellipsisMenu = page
    .locator("section.example")
    .filter({
      has: page.locator(".example-title", { hasText: /^Ellipsis menu$/ })
    });
  await ellipsisMenu
    .getByRole("button", { name: "Show more breadcrumb items" })
    .click();
  const ellipsisPanel = page.locator("#demo-breadcrumb-ellipsis-panel");
  await expect(ellipsisPanel).toHaveAttribute("aria-hidden", "false");
  await expect(
    ellipsisPanel.getByRole("menuitem", { name: "Themes" })
  ).toBeVisible();
  await page.keyboard.press("Escape");

  const dropdown = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Dropdown$/ }) });
  const trigger = dropdown.getByRole("button", { name: "Components" });
  await trigger.click();
  const panel = page.locator("#demo-breadcrumb-dropdown-panel");
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  const documentation = panel.getByRole("menuitem", { name: "Documentation" });
  await expect(documentation).toBeVisible();

  await trigger.focus();
  await page.keyboard.press("Tab");
  await expect(documentation).toBeFocused();
  await expect(documentation).toHaveCSS("box-shadow", "none");
  await expect(documentation).toHaveCSS("border-top-left-radius", "8px");

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("badge tightens its icon edge and keeps state colors above variants", async ({
  page
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components/badge");
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });

  const icons = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^With icons$/ }) });
  const verified = icons.locator(".badge").nth(0);
  await expect(verified).toHaveCSS("padding-left", "6px");
  await expect(verified).toHaveCSS("padding-right", "8px");
  await expect(verified.locator("svg")).toHaveCSS("width", "12px");
  await expect(verified.locator("svg")).toHaveAttribute(
    "data-icon",
    "inline-start"
  );

  const bookmark = icons.locator(".badge").nth(1);
  await expect(bookmark).toHaveCSS("padding-left", "8px");
  await expect(bookmark).toHaveCSS("padding-right", "6px");
  await expect(bookmark.locator("svg")).toHaveAttribute(
    "data-icon",
    "inline-end"
  );

  const variants = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Variants$/ }) });
  const outline = variants.locator(".badge[data-variant='outline']");
  const destructive = variants.locator(".badge[data-variant='destructive']");
  await outline.evaluate((element) =>
    element.setAttribute("aria-invalid", "true")
  );

  const [invalid, destructiveColor] = await Promise.all([
    outline.evaluate((element) => {
      const style = getComputedStyle(element);
      return { border: style.borderTopColor, shadow: style.boxShadow };
    }),
    destructive.evaluate((element) => getComputedStyle(element).color)
  ]);
  expect(invalid.border).toBe(destructiveColor);
  expect(invalid.shadow).not.toBe("none");

  const rtl = page
    .locator("section.example")
    .filter({
      has: page.locator(".example-title", { hasText: /^Right-to-left$/ })
    });
  await expect(rtl.locator(".badge").nth(4)).toHaveCSS("padding-right", "6px");
  await expect(rtl.locator(".badge").nth(5)).toHaveCSS("padding-left", "6px");
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

test("sheet sides, close control and scrolling", async ({ page }) => {
  await page.goto("/docs/components/sheet");
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  const sheet = page.locator("#demo-sheet-default");
  await page.locator('[data-open-dialog="demo-sheet-default"]').click();
  await expect(sheet).toHaveAttribute("open", "");
  await expect(sheet.locator("[data-slot='title']")).toBeVisible();
  const panelBox = await sheet.locator(":scope > div").boundingBox();
  const closeBox = await sheet.getByRole("button", { name: "Close" }).boundingBox();
  expect(panelBox).not.toBeNull();
  expect(closeBox).not.toBeNull();
  expect(closeBox!.x).toBeGreaterThan(panelBox!.x + panelBox!.width - 60);
  await sheet.getByRole("button", { name: "Close" }).click();
  await expect(sheet).not.toHaveAttribute("open", "");

  const top = page.locator("#demo-sheet-side-top");
  await page.locator('[data-open-dialog="demo-sheet-side-top"]').click();
  await expect(top).toHaveAttribute("open", "");
  const topPanelBox = await top.locator(":scope > div").boundingBox();
  expect(topPanelBox).not.toBeNull();
  expect(topPanelBox!.y).toBeLessThan(4);
  expect(topPanelBox!.width).toBeGreaterThan(600);
  await top.getByRole("button", { name: "Close top sheet" }).click();
  await expect(top).not.toHaveAttribute("open", "");

  const bottom = page.locator("#demo-sheet-side-bottom");
  await page.locator('[data-open-dialog="demo-sheet-side-bottom"]').click();
  await expect(bottom).toHaveAttribute("open", "");
  const bottomPanelBox = await bottom.locator(":scope > div").boundingBox();
  expect(bottomPanelBox).not.toBeNull();
  expect(bottomPanelBox!.y + bottomPanelBox!.height).toBeGreaterThan(
    viewport!.height - 4
  );
  await page.keyboard.press("Escape");
  await expect(bottom).not.toHaveAttribute("open", "");

  const left = page.locator("#demo-sheet-left");
  await page.locator('[data-open-dialog="demo-sheet-left"]').click();
  await expect(left).toHaveAttribute("open", "");
  await expect(left.locator("[data-slot='title']")).toBeVisible();
  const leftPanelBox = await left.locator(":scope > div").boundingBox();
  expect(leftPanelBox).not.toBeNull();
  expect(leftPanelBox!.x).toBeLessThan(4);
  await left.getByRole("button", { name: "Close left sheet" }).click();
  await expect(left).not.toHaveAttribute("open", "");

  const scrollable = page.locator("#demo-sheet-scrollable");
  await page.locator('[data-open-dialog="demo-sheet-scrollable"]').click();
  const scrollSection = scrollable.locator("section");
  await expect(scrollSection).toHaveAttribute("role", "region");
  await expect(scrollSection).toHaveAttribute("tabindex", "0");
  expect(
    await scrollSection.evaluate((element) => element.scrollHeight)
  ).toBeGreaterThan(
    await scrollSection.evaluate((element) => element.clientHeight)
  );
  await page.keyboard.press("Escape");
  await expect(scrollable).not.toHaveAttribute("open", "");
});

test("drawer sides, sizes, nested dialogs and scrolling", async ({ page }) => {
  await page.goto("/docs/components/drawer");
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  const drawer = page.locator("#demo-drawer-default");
  await page.locator('[data-open-dialog="demo-drawer-default"]').click();
  await expect(drawer).toHaveAttribute("open", "");
  await expect(drawer.locator("[data-slot='handle']")).toBeVisible();
  await drawer.getByRole("button", { name: "Cancel" }).click();
  await expect(drawer).not.toHaveAttribute("open", "");

  const top = page.locator("#demo-drawer-top");
  await page.locator('[data-open-dialog="demo-drawer-top"]').click();
  await expect(top).toHaveAttribute("open", "");
  const topPanelBox = await top.locator(":scope > div").boundingBox();
  const topHandleBox = await top.locator("[data-slot='handle']").boundingBox();
  expect(topPanelBox).not.toBeNull();
  expect(topHandleBox).not.toBeNull();
  expect(topPanelBox!.y).toBeLessThan(4);
  expect(topHandleBox!.y).toBeGreaterThan(
    topPanelBox!.y + topPanelBox!.height - 40
  );
  await top.getByRole("button", { name: "Close" }).click();
  await expect(top).not.toHaveAttribute("open", "");

  const small = page.locator("#demo-drawer-small");
  await page.locator('[data-open-dialog="demo-drawer-small"]').click();
  const smallPanelBox = await small.locator(":scope > div").boundingBox();
  expect(smallPanelBox).not.toBeNull();
  expect(smallPanelBox!.height).toBeCloseTo(viewport!.height / 2, 0);
  await page.keyboard.press("Escape");
  await expect(small).not.toHaveAttribute("open", "");

  const scrollable = page.locator("#demo-drawer-scrollable");
  await page.locator('[data-open-dialog="demo-drawer-scrollable"]').click();
  const scrollSection = scrollable.locator("section");
  await expect(scrollSection).toHaveAttribute("role", "region");
  await expect(scrollSection).toHaveAttribute("tabindex", "0");
  expect(
    await scrollSection.evaluate((element) => element.scrollHeight)
  ).toBeGreaterThan(
    await scrollSection.evaluate((element) => element.clientHeight)
  );
  await page.keyboard.press("Escape");
  await expect(scrollable).not.toHaveAttribute("open", "");

  const nested = page.locator("#demo-drawer-nested");
  await page.locator('[data-open-dialog="demo-drawer-nested"]').click();
  await nested.getByRole("button", { name: "Open nested drawer" }).click();
  const child = page.locator("#demo-drawer-nested-child");
  await expect(child).toHaveAttribute("open", "");
  await expect(child.locator("[data-slot='title']")).toHaveText("Nested drawer");
  await child.getByRole("button", { name: "Close" }).click();
  await expect(child).not.toHaveAttribute("open", "");
  await nested.getByRole("button", { name: "Close" }).click();
  await expect(nested).not.toHaveAttribute("open", "");
});

test("open overlay panels pass axe in every color scheme", async ({ page }) => {
  const disableMotion = async () => {
    await page.addStyleTag({
      content:
        "*, *::before, *::after { transition: none !important; animation: none !important; }"
    });
  };
  const audit = async (label: string) => {
    for (const scheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      const violations = blocking(results.violations);
      expect(
        violations,
        `${label} ${scheme}: ${JSON.stringify(violations, null, 2)}`
      ).toEqual([]);
    }
  };

  await page.goto("/docs/components/sheet");
  await disableMotion();
  await page.locator('[data-open-dialog="demo-sheet-default"]').click();
  await expect(page.locator("#demo-sheet-default")).toHaveAttribute("open", "");
  await audit("sheet");
  await page.keyboard.press("Escape");
  await expect(page.locator("#demo-sheet-default")).not.toHaveAttribute("open", "");

  await page.goto("/docs/components/sidebar");
  await disableMotion();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.locator("#demo-sidebar-mobile")).toHaveAttribute("open", "");
  await audit("sidebar mobile sheet");
  await page.keyboard.press("Escape");
  await expect(page.locator("#demo-sidebar-mobile")).not.toHaveAttribute(
    "open",
    ""
  );

  await page.goto("/docs/components/drawer");
  await disableMotion();
  await page.locator('[data-open-dialog="demo-drawer-default"]').click();
  await expect(page.locator("#demo-drawer-default")).toHaveAttribute("open", "");
  await audit("drawer");
  await page.keyboard.press("Escape");
  await expect(page.locator("#demo-drawer-default")).not.toHaveAttribute("open", "");

  await page.goto("/docs/components/command");
  await disableMotion();
  await page.getByRole("button", { name: "Open command", exact: true }).click();
  await expect(page.locator("#demo-command")).toHaveAttribute("open", "");
  await audit("command dialog");
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Open command menu" }).click();
  const popover = page.locator("#demo-command-popover-panel");
  await expect(popover).toHaveAttribute("aria-hidden", "false");
  await audit("command popover");
  await page.keyboard.press("Escape");
  await expect(popover).toHaveAttribute("aria-hidden", "true");

  await page.goto("/docs/components/select");
  await disableMotion();
  await page.locator("#demo-select-groups-trigger").click();
  const selectPanel = page.locator("#demo-select-groups-panel");
  await expect(selectPanel).toHaveAttribute("aria-hidden", "false");
  await audit("select panel");
  await page.keyboard.press("Escape");
});

test("dialog examples open, close and scroll", async ({ page }) => {
  await page.goto("/docs/components/dialog");
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });

  const dialog = page.locator("#demo-dialog-default");
  await page.locator('[data-open-dialog="demo-dialog-default"]').click();
  await expect(dialog).toHaveAttribute("open", "");
  await expect(dialog.getByRole("heading", { name: "Dialog title" })).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).not.toHaveAttribute("open", "");

  const share = page.locator("#demo-dialog-close-button");
  await page.locator('[data-open-dialog="demo-dialog-close-button"]').click();
  await expect(share).toHaveAttribute("open", "");
  const sharePanelBox = await share.locator(":scope > div").boundingBox();
  const shareCloseBox = await share
    .getByRole("button", { name: "Close" })
    .boundingBox();
  expect(sharePanelBox).not.toBeNull();
  expect(shareCloseBox).not.toBeNull();
  expect(shareCloseBox!.x - sharePanelBox!.x).toBeLessThan(40);
  await share.getByRole("button", { name: "Close" }).click();
  await expect(share).not.toHaveAttribute("open", "");

  const scrollable = page.locator("#demo-dialog-scrollable");
  await page.locator('[data-open-dialog="demo-dialog-scrollable"]').click();
  const scrollSection = scrollable.locator("section");
  await expect(scrollSection).toHaveAttribute("role", "region");
  await expect(scrollSection).toHaveAttribute("tabindex", "0");
  expect(
    await scrollSection.evaluate((element) => element.scrollHeight)
  ).toBeGreaterThan(
    await scrollSection.evaluate((element) => element.clientHeight)
  );
  await page.keyboard.press("Escape");
  await expect(scrollable).not.toHaveAttribute("open", "");

  const sticky = page.locator("#demo-dialog-sticky-footer");
  await page.locator('[data-open-dialog="demo-dialog-sticky-footer"]').click();
  const stickySection = sticky.locator("section");
  const stickyFooter = sticky.locator("footer");
  await expect(stickySection).toHaveAttribute("role", "region");
  await expect(stickySection).toHaveAttribute("tabindex", "0");
  expect(
    await stickySection.evaluate((element) => element.scrollHeight)
  ).toBeGreaterThan(
    await stickySection.evaluate((element) => element.clientHeight)
  );
  const panelBox = await sticky.locator(":scope > div").boundingBox();
  const footerBox = await stickyFooter.boundingBox();
  expect(footerBox).not.toBeNull();
  expect(panelBox).not.toBeNull();
  await stickySection.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const scrolledFooterBox = await stickyFooter.boundingBox();
  expect(scrolledFooterBox).not.toBeNull();
  expect(scrolledFooterBox!.y).toBeCloseTo(footerBox!.y, 0);
  expect(scrolledFooterBox!.y + scrolledFooterBox!.height).toBeLessThanOrEqual(
    panelBox!.y + panelBox!.height + 4
  );
  await stickyFooter.getByRole("button", { name: "Close" }).click();
  await expect(sticky).not.toHaveAttribute("open", "");
});

test("alert dialog media, size and destructive treatment", async ({ page }) => {
  await page.goto("/docs/components/alert-dialog");
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });

  const small = page.locator("#demo-alert-dialog-small-media");
  await page.locator('[data-open-dialog="demo-alert-dialog-small-media"]').click();
  await expect(small).toHaveAttribute("open", "");

  const smallPanel = small.locator(":scope > div");
  const smallBox = await smallPanel.boundingBox();
  expect(smallBox).not.toBeNull();
  expect(smallBox!.width).toBeLessThanOrEqual(320);

  const figureBox = await small.locator("header figure").boundingBox();
  const titleBox = await small
    .getByRole("heading", { name: "Allow accessory to connect?" })
    .boundingBox();
  expect(figureBox).not.toBeNull();
  expect(titleBox).not.toBeNull();
  expect(titleBox!.y).toBeGreaterThan(figureBox!.y + figureBox!.height - 1);
  await page.keyboard.press("Escape");
  await expect(small).not.toHaveAttribute("open", "");

  const destructive = page.locator("#demo-alert-dialog-destructive");
  await page.locator('[data-open-dialog="demo-alert-dialog-destructive"]').click();
  await expect(destructive).toHaveAttribute("open", "");
  const mediaColor = await destructive
    .locator("header figure")
    .evaluate((element) => getComputedStyle(element).color);
  const actionColor = await destructive
    .getByRole("button", { name: "Delete" })
    .evaluate((element) => getComputedStyle(element).color);
  expect(mediaColor).toBe(actionColor);
  await page.keyboard.press("Escape");
  await expect(destructive).not.toHaveAttribute("open", "");
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

test("popover examples toggle, align and mirror placement", async ({ page }) => {
  await page.goto("/docs/components/popover");

  const hero = page.locator("section.example").first();
  const trigger = hero.getByRole("button", { name: "Open popover" });
  const panel = page.locator("#demo-popover-default-panel");

  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(panel).toHaveAttribute("role", "dialog");
  await expect(panel).toHaveAttribute("tabindex", "-1");
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAttribute("aria-controls", "demo-popover-default-panel");
  await expect(panel).toHaveAccessibleName("Dimensions");
  await expect
    .poll(() => panel.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);

  const openAxe = await new AxeBuilder({ page }).withTags(tags).analyze();
  const openViolations = blocking(openAxe.violations);
  expect(openViolations, JSON.stringify(openViolations, null, 2)).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();

  const alignments = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Alignments$/ }) });
  const centerTrigger = alignments.locator("#demo-popover-align-center-trigger");
  const centerPanel = page.locator("#demo-popover-align-center-panel");
  await expect(centerPanel).toHaveCSS("translate", "-50% -8px");
  await centerTrigger.click();
  await expect(centerPanel).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      centerPanel.evaluate((element) => element === document.activeElement)
    )
    .toBe(true);

  const triggerBox = await centerTrigger.boundingBox();
  const panelBox = await centerPanel.boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(panelBox).not.toBeNull();
  if (triggerBox && panelBox) {
    const triggerCenter = triggerBox.x + triggerBox.width / 2;
    const panelCenter = panelBox.x + panelBox.width / 2;
    expect(Math.abs(triggerCenter - panelCenter)).toBeLessThan(2);
  }

  const sides = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Sides$/ }) });
  const topTrigger = sides.locator("#demo-popover-side-top-trigger");
  const topPanel = page.locator("#demo-popover-side-top-panel");
  await topTrigger.click();
  await expect(topPanel).toHaveCSS("opacity", "1");

  const topTriggerBox = await topTrigger.boundingBox();
  const topPanelBox = await topPanel.boundingBox();
  if (topTriggerBox && topPanelBox) {
    expect(topPanelBox.y + topPanelBox.height).toBeLessThanOrEqual(
      topTriggerBox.y + 1
    );
  }

  const rtl = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Right-to-left$/ }) });
  const inlineStartTrigger = rtl.locator("#demo-popover-rtl-inline-start-trigger");
  const inlineStartPanel = page.locator("#demo-popover-rtl-inline-start-panel");
  await inlineStartTrigger.click();
  await expect(inlineStartPanel).toHaveCSS("opacity", "1");

  const rtlTriggerBox = await inlineStartTrigger.boundingBox();
  const rtlPanelBox = await inlineStartPanel.boundingBox();
  if (rtlTriggerBox && rtlPanelBox) {
    expect(rtlPanelBox.x).toBeGreaterThanOrEqual(
      rtlTriggerBox.x + rtlTriggerBox.width
    );
  }
});

test("tooltip wraps content, opens from the wrapper and keeps its tail", async ({ page }) => {
  await page.goto("/docs/components/tooltip");
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });

  const hero = page.locator("section.example").first();
  const trigger = hero.getByRole("button", { name: "Hover" });
  const wrapper = page.locator("#demo-tooltip-default");
  const content = page.locator("#demo-tooltip-default-description");

  const readBubble = (target: Locator, pseudo = false) =>
    target.evaluate((element, usePseudo) => {
      const style = usePseudo
        ? getComputedStyle(element, "::before")
        : getComputedStyle(element);
      return {
        content: style.content,
        visibility: style.visibility,
        opacity: style.opacity,
        scale: style.scale,
        width: style.width,
        height: style.height,
        translate: style.translate,
        whiteSpace: style.whiteSpace
      };
    }, pseudo);

  const readTail = (target: Locator) =>
    target.evaluate((element) => {
      const style = getComputedStyle(element, "::after");
      return {
        visibility: style.visibility,
        opacity: style.opacity,
        width: style.width,
        height: style.height,
        top: style.top,
        bottom: style.bottom,
        rotate: style.rotate,
        maskImage: style.maskImage
      };
    });

  expect((await readBubble(content)).visibility).toBe("hidden");
  expect((await readTail(wrapper)).visibility).toBe("hidden");
  await expect(content).toHaveAttribute("role", "tooltip");

  await trigger.focus();
  await expect
    .poll(async () => (await readBubble(content)).visibility)
    .toBe("visible");
  await expect(trigger).toHaveAccessibleDescription("Add to library");
  await expect
    .poll(async () => (await readTail(wrapper)).visibility)
    .toBe("visible");

  await trigger.evaluate((element) => element.blur());
  await expect
    .poll(async () => (await readBubble(content)).visibility)
    .toBe("hidden");

  await trigger.hover();
  await expect
    .poll(async () => (await readBubble(content)).visibility)
    .toBe("visible");
  const shown = await readBubble(content);
  expect(shown.opacity).toBe("1");
  expect(shown.scale).toBe("1");
  await expect(content).toHaveText("Add to library");

  const shownTail = await readTail(wrapper);
  expect(shownTail.opacity).toBe("1");
  expect(shownTail.width).toBe("10px");
  expect(shownTail.height).toBe("4px");
  expect(shownTail.maskImage).toContain("data:image/svg+xml");
  await expect(page.locator("[data-arrow]")).toHaveCount(0);

  await page.mouse.move(0, 0);
  await expect
    .poll(async () => (await readBubble(content)).visibility)
    .toBe("hidden");

  const alignStart = page.locator("#demo-tooltip-align-top-start");
  await alignStart.hover();
  const startBubble = await readBubble(alignStart, true);
  expect(startBubble.visibility).toBe("visible");
  expect(startBubble.translate).toBe("none");
  expect((await readTail(alignStart)).maskImage).toContain("image/svg+xml");

  const leftStart = page.locator("#demo-tooltip-align-left-start");
  const leftEnd = page.locator("#demo-tooltip-align-left-end");
  await leftStart.hover();
  const startTailTop = Number.parseFloat((await readTail(leftStart)).top);
  await leftEnd.hover();
  const endTailTop = Number.parseFloat((await readTail(leftEnd)).top);
  expect(startTailTop).toBeGreaterThan(endTailTop);

  const longContent = page.locator("#demo-tooltip-long-content-description");
  await page.locator("#demo-tooltip-long-content").hover();
  const wrapped = await readBubble(longContent);
  expect(wrapped.visibility).toBe("visible");
  expect(wrapped.width).toBe("320px");
  expect(wrapped.whiteSpace).toBe("normal");
  expect(Number.parseFloat(wrapped.height)).toBeGreaterThan(28);

  const disabled = page.locator("#demo-tooltip-disabled");
  const disabledContent = page.locator("#demo-tooltip-disabled-description");
  await expect
    .poll(async () => (await readBubble(disabledContent)).visibility)
    .toBe("hidden");
  await disabled.hover();
  await expect
    .poll(async () => (await readBubble(disabledContent)).visibility)
    .toBe("visible");
  await expect(disabled.locator("button")).toHaveAccessibleDescription(
    "This feature is currently unavailable"
  );

  const keyboard = page.locator("#demo-tooltip-keyboard");
  const keyboardContent = page.locator("#demo-tooltip-keyboard-description");
  await keyboard.hover();
  await expect
    .poll(async () => (await readBubble(keyboardContent)).visibility)
    .toBe("visible");
  await expect(keyboardContent.locator(".kbd")).toHaveText("S");
  await expect(keyboard.locator("button")).toHaveAccessibleDescription(
    /Save changes/
  );

  const shorthand = page.locator("#demo-tooltip-shorthand");
  await shorthand.hover();
  const shorthandBubble = await readBubble(shorthand, true);
  expect(shorthandBubble.visibility).toBe("visible");
  expect(shorthandBubble.content).toContain("Copy link");
  await expect(shorthand.locator("button")).toHaveAttribute(
    "aria-label",
    "Copy link"
  );

  const inlineStart = page.locator("#demo-tooltip-rtl-inline-start");
  const inlineEnd = page.locator("#demo-tooltip-rtl-inline-end");
  const physicalLeft = page.locator("#demo-tooltip-rtl-left");
  const physicalRight = page.locator("#demo-tooltip-rtl-right");
  const offset = (target: Locator) =>
    target.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        left: Number.parseFloat(style.left),
        marginLeft: Number.parseFloat(style.marginLeft) || 0
      };
    });

  await inlineStart.hover();
  const mirroredStart = await offset(
    page.locator("#demo-tooltip-rtl-inline-start-description")
  );
  expect(mirroredStart.left + mirroredStart.marginLeft).toBeGreaterThan(1);

  await inlineEnd.hover();
  const mirroredEnd = await offset(
    page.locator("#demo-tooltip-rtl-inline-end-description")
  );
  expect(mirroredEnd.left).toBeLessThan(-1);

  await physicalLeft.hover();
  const physicalLeftOffset = await offset(
    page.locator("#demo-tooltip-rtl-left-description")
  );
  expect(physicalLeftOffset.left).toBeLessThan(-1);

  await physicalRight.hover();
  const physicalRightOffset = await offset(
    page.locator("#demo-tooltip-rtl-right-description")
  );
  expect(physicalRightOffset.left + physicalRightOffset.marginLeft).toBeGreaterThan(
    1
  );
});

test("kbd groups keys and keeps tooltip keys on the inverted surface", async ({
  page
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/docs/components/kbd");

  const groupExample = page
    .locator("section.example")
    .filter({
      has: page.locator(".example-title", { hasText: /^Group$/ })
    });
  const group = groupExample.locator(".kbd-group").first();
  await expect(group).toHaveCSS("display", "inline-flex");
  await expect(group).toHaveCSS("column-gap", "4px");

  const button = page.getByRole("button", { name: "Accept" });
  const buttonKey = button.locator(".kbd");
  await expect(buttonKey).toHaveCSS("height", "20px");
  await expect(buttonKey).toHaveAttribute("aria-hidden", "true");
  await expect(button).toHaveAttribute("aria-keyshortcuts", "Enter");

  const tooltip = page.locator("#demo-kbd-tooltip");
  await tooltip.hover();
  const content = page.locator("#demo-kbd-tooltip-description");
  await expect(content).toBeVisible();
  await expect(content.locator(".kbd")).toBeVisible();

  const colors = await tooltip.evaluate((element) => {
    const bubble = element.querySelector("[data-slot='content']");
    const key = bubble?.querySelector(".kbd");
    if (!(bubble instanceof HTMLElement) || !(key instanceof HTMLElement)) {
      throw new Error("missing tooltip kbd");
    }
    return {
      bubbleColor: getComputedStyle(bubble).color,
      bubbleBackground: getComputedStyle(bubble).backgroundColor,
      keyColor: getComputedStyle(key).color,
      keyBackground: getComputedStyle(key).backgroundColor
    };
  });

  expect(colors.keyColor).toBe(colors.bubbleColor);
  expect(colors.keyBackground).not.toBe(colors.bubbleBackground);

  const menuExample = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^In a menu$/ }) });
  await menuExample.locator("button[aria-haspopup='menu']").click();
  const menuItem = menuExample.getByRole("menuitem", {
    name: /Command palette/
  });
  await expect(menuItem).toBeVisible();

  const menuGeometry = await menuItem.evaluate((item) => {
    const group = item.querySelector(".kbd-group");
    const lastKey = group?.lastElementChild;
    if (!(group instanceof HTMLElement) || !(lastKey instanceof HTMLElement)) {
      throw new Error("missing menu kbd group");
    }
    const itemBox = item.getBoundingClientRect();
    const groupBox = group.getBoundingClientRect();
    return {
      gapToEnd: itemBox.right - groupBox.right,
      itemPaddingEnd: getComputedStyle(item).paddingInlineEnd,
      lastKeyPaddingStart: getComputedStyle(lastKey).paddingInlineStart
    };
  });

  expect(
    Math.abs(
      menuGeometry.gapToEnd - Number.parseFloat(menuGeometry.itemPaddingEnd)
    )
  ).toBeLessThanOrEqual(1);
  expect(menuGeometry.lastKeyPaddingStart).toBe("4px");
  await page.keyboard.press("Escape");
});

test("context menu opens at the pointer and closes with Escape", async ({ page }) => {
  await page.goto("/docs/components/context-menu");
  const area = page.locator("[aria-haspopup='menu'][aria-controls]").first();
  const menu = area.locator(".context-menu");

  await expect(menu).toHaveAttribute("aria-hidden", "true");
  await area.click({ button: "right" });
  await expect(menu).toHaveAttribute("aria-hidden", "false");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Profile" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-hidden", "true");
});

test("context menu opens a nested panel beside its trigger", async ({ page }) => {
  await page.goto("/docs/components/context-menu");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Submenu$/ }) });
  const area = example.locator("div[aria-haspopup='menu'][aria-controls]");

  await area.click({ button: "right" });
  const menu = area.locator(".context-menu");
  const trigger = menu.locator('[role="menuitem"][aria-haspopup="menu"]', {
    hasText: "More tools"
  });
  await trigger.click();

  const panel = page.locator("#demo-context-submenu-more");
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toHaveAttribute("aria-hidden", "false");

  const triggerBox = await trigger.boundingBox();
  const panelBox = await panel.boundingBox();
  if (triggerBox && panelBox) {
    expect(panelBox.x).toBeGreaterThanOrEqual(
      triggerBox.x + triggerBox.width - 1
    );
  }

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("menubar switches between menus", async ({ page }) => {
  await page.goto("/docs/components/menubar");
  const menubar = page.locator(".menubar").first();
  const items = menubar.locator(".menubar-item");
  const file = items.nth(0).locator("[data-popover]").first();
  const edit = items.nth(1).locator("[data-popover]").first();

  await menubar.getByRole("menuitem", { name: "File", exact: true }).click();
  await expect(file).toHaveAttribute("aria-hidden", "false");
  await expect(edit).toHaveAttribute("aria-hidden", "true");

  await menubar.getByRole("menuitem", { name: "Edit", exact: true }).click();
  await expect(file).toHaveAttribute("aria-hidden", "true");
  await expect(edit).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(edit).toHaveAttribute("aria-hidden", "true");
});

test("menubar submenus keep the parent open and use menu typography", async ({
  page
}) => {
  await page.goto("/docs/components/menubar");
  const menubar = page.locator(".menubar").first();
  const file = menubar
    .locator(".menubar-item")
    .first()
    .locator("[data-popover]")
    .first();

  await menubar.getByRole("menuitem", { name: "File", exact: true }).click();
  await menubar.getByRole("menuitem", { name: "Share", exact: true }).click();

  const submenu = page.locator("#demo-menubar-file-share");
  const item = submenu.getByRole("menuitem", { name: "Email link" });
  await expect(submenu).toHaveAttribute("aria-hidden", "false");
  await expect(file).toHaveAttribute("aria-hidden", "false");
  await expect(item).toBeVisible();
  await expect(item).toHaveCSS("font-weight", "400");

  await page.keyboard.press("Escape");
  await expect(submenu).toHaveAttribute("aria-hidden", "true");
  await expect(file).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(file).toHaveAttribute("aria-hidden", "true");
});

test("navigation menu switches between panels", async ({ page }) => {
  await page.goto("/docs/components/navigation-menu");
  const nav = page.locator(".navigation-menu").first();
  const gettingStarted = page.locator("#demo-nav-starting");
  const components = page.locator("#demo-nav-components");

  await nav.getByRole("button", { name: /Getting started/ }).click();
  await expect(gettingStarted).toHaveAttribute("aria-hidden", "false");
  await expect(components).toHaveAttribute("aria-hidden", "true");

  await nav.getByRole("button", { name: /^Components$/ }).click();
  await expect(gettingStarted).toHaveAttribute("aria-hidden", "true");
  await expect(components).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(components).toHaveAttribute("aria-hidden", "true");
});

test("navigation menu lays out an icon link beside its title", async ({ page }) => {
  await page.goto("/docs/components/navigation-menu");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^With icons$/ }) });
  await example.getByRole("button", { name: /Status/ }).click();

  const link = example.locator("#demo-nav-status").getByRole("link", {
    name: "Backlog"
  });
  await expect(link).toHaveCSS("display", "flex");
  await expect(link.locator("[data-slot='icon'] svg")).toHaveCSS("width", "16px");
});

test("sidebar labels groups, sizes icons and reserves trailing slots", async ({
  page
}) => {
  await page.goto("/docs/components/sidebar");
  const example = (title: string) =>
    page.locator("section.example").filter({
      has: page.locator(".example-title", { hasText: new RegExp(`^${title}$`) })
    });

  const groups = example("Groups");
  const platform = groups.getByRole("navigation", { name: "Platform" });
  await expect(
    platform.getByRole("heading", { name: "Platform" })
  ).toHaveCSS("font-size", "12px");
  await expect(platform.getByRole("link", { name: "Playground" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  await expect(platform.getByRole("link", { name: "Playground" })).toHaveCSS(
    "text-decoration-line",
    "none"
  );

  const icons = example("With icons");
  await expect(
    icons.getByRole("link", { name: "Playground" }).locator("svg")
  ).toHaveCSS("width", "16px");

  const groupActionExample = example("Group action");
  const groupHeader = groupActionExample.locator("nav > header");
  const addProject = groupActionExample.getByRole("button", {
    name: "Add project"
  });
  const groupHeaderBox = await groupHeader.boundingBox();
  const addProjectBox = await addProject.boundingBox();
  expect(groupHeaderBox).not.toBeNull();
  expect(addProjectBox).not.toBeNull();
  expect(addProjectBox!.x).toBeGreaterThan(
    groupHeaderBox!.x + groupHeaderBox!.width - 40
  );

  const collapsibleGroups = example("Collapsible groups");
  await expect(
    collapsibleGroups.locator("summary[data-slot='group-label']").first()
  ).toHaveCSS("font-size", "12px");

  const badges = example("Badges");
  const badgeRow = badges
    .locator("li")
    .filter({ hasText: "Design Engineering" });
  await expect(badgeRow.locator("a")).toHaveCSS("padding-right", "32px");
  const badge = badgeRow.locator("[data-slot='menu-badge']");
  await expect(badge).toHaveCSS("pointer-events", "none");
  const badgeBox = await badge.boundingBox();
  const badgeRowBox = await badgeRow.locator("a").boundingBox();
  expect(badgeBox).not.toBeNull();
  expect(badgeRowBox).not.toBeNull();
  expect(badgeBox!.x).toBeGreaterThan(
    badgeRowBox!.x + badgeRowBox!.width - 40
  );

  const actions = example("Actions");
  await expect(
    actions.getByRole("link", { name: "Design Engineering" })
  ).toHaveCSS("padding-right", "32px");
  const action = actions.getByRole("button", {
    name: "More actions for Design Engineering"
  });
  const actionBox = await action.boundingBox();
  const actionRowBox = await action.locator("xpath=..").boundingBox();
  expect(actionBox).not.toBeNull();
  expect(actionRowBox).not.toBeNull();
  expect(actionBox!.x + actionBox!.width).toBeLessThanOrEqual(
    actionRowBox!.x + actionRowBox!.width
  );
});

test("sidebar scrolls its section between the header and footer", async ({
  page
}) => {
  await page.goto("/docs/components/sidebar");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Scrollable content" }) });
  const sidebar = example.locator(".sidebar");
  const section = sidebar.locator("section");
  const header = sidebar.locator(":scope > header");

  await expect(section).toHaveAttribute("tabindex", "0");
  expect(
    await section.evaluate((element) => element.scrollHeight)
  ).toBeGreaterThan(await section.evaluate((element) => element.clientHeight));

  const headerBefore = await header.boundingBox();
  await section.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  expect(await section.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  const headerAfter = await header.boundingBox();
  expect(headerBefore).not.toBeNull();
  expect(headerAfter).not.toBeNull();
  expect(headerAfter!.y).toBe(headerBefore!.y);
});

test("sidebar composes into a labelled mobile sheet", async ({ page }) => {
  await page.goto("/docs/components/sidebar");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Mobile$/ }) });
  await example.getByRole("button", { name: "Open navigation" }).click();

  const sheet = page.locator("#demo-sidebar-mobile");
  await expect(sheet).toHaveAttribute("open", "");
  await expect(
    sheet.getByRole("heading", { name: "Acme Inc" })
  ).toBeVisible();
  await expect(
    sheet.locator(".sidebar").getByRole("link", { name: "Playground" })
  ).toBeVisible();

  await sheet.getByRole("button", { name: "Close navigation" }).click();
  await expect(sheet).not.toHaveAttribute("open", "");
});

test("sidebar mirrors its edge and nested indent in right-to-left", async ({
  page
}) => {
  await page.goto("/docs/components/sidebar");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Right-to-left" }) });
  const sidebar = example.locator(".sidebar");
  const nested = sidebar.locator("nav ul ul");

  await expect(sidebar).toHaveCSS("border-left-width", "1px");
  await expect(sidebar).toHaveCSS("border-right-width", "0px");
  await expect(nested).toHaveCSS("border-right-width", "1px");
  await expect(nested).toHaveCSS("border-left-width", "0px");

  const action = sidebar.getByRole("button", { name: "إضافة مشروع" });
  const groupHeader = sidebar.locator("nav > header").first();
  const actionBox = await action.boundingBox();
  const groupHeaderBox = await groupHeader.boundingBox();
  expect(actionBox).not.toBeNull();
  expect(groupHeaderBox).not.toBeNull();
  expect(actionBox!.x).toBeLessThan(
    groupHeaderBox!.x + groupHeaderBox!.width / 2
  );

  const badge = sidebar.locator("[data-slot='menu-badge']");
  const row = sidebar.getByRole("link", { name: /هندسة التصميم/ });
  const badgeBox = await badge.boundingBox();
  const rowBox = await row.boundingBox();
  expect(badgeBox).not.toBeNull();
  expect(rowBox).not.toBeNull();
  expect(badgeBox!.x).toBeLessThan(rowBox!.x + rowBox!.width / 2);
});


test("dropdown menu still opens after the menu primitive refactor", async ({ page }) => {
  await page.goto("/docs/components/dropdown-menu");
  const dropdown = page.locator(".dropdown-menu").first();
  const panel = dropdown.locator("[data-popover]").first();

  await dropdown.getByRole("button", { name: "Open menu" }).click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(dropdown.getByRole("menuitem", { name: "Profile" })).toBeVisible();

  await page.getByRole("heading", { level: 1 }).click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("dropdown menu nested submenus keep their ancestors open", async ({ page }) => {
  await page.goto("/docs/components/dropdown-menu");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Submenu$/ }) });

  await example.getByRole("button", { name: "Open team menu" }).click();
  const panel = example.locator("[data-popover]").first();
  const invite = panel.getByRole("menuitem", { name: "Invite users" });
  await invite.click();

  const submenu = page.locator("#demo-dropdown-submenu-invite");
  await expect(submenu).toHaveAttribute("aria-hidden", "false");
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(invite).toHaveAttribute("aria-expanded", "true");

  await submenu.getByRole("menuitem", { name: "More options" }).click();
  const deeper = page.locator("#demo-dropdown-submenu-more");
  await expect(deeper).toHaveAttribute("aria-hidden", "false");
  await expect(submenu).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(deeper).toHaveAttribute("aria-hidden", "true");
  await expect(submenu).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(submenu).toHaveAttribute("aria-hidden", "true");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("menu checkbox indicators follow aria-checked", async ({ page }) => {
  await page.goto("/docs/components/dropdown-menu");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Checkboxes$/ }) });

  await example.getByRole("button", { name: "Open appearance" }).click();
  const checked = example.getByRole("menuitemcheckbox", { name: "Status Bar" });
  const unchecked = example.getByRole("menuitemcheckbox", { name: "Panel" });

  await expect(checked.locator("[data-slot='indicator']")).toBeVisible();
  await expect(unchecked.locator("[data-slot='indicator']")).toBeHidden();
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

test("select groups options with labels and dividers", async ({ page }) => {
  await page.goto("/docs/components/select");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Groups" }) });
  const select = example.locator(".select");
  const trigger = select.locator('[role="combobox"]');
  const panel = select.locator("[data-popover]");

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(select.getByRole("group")).toHaveCount(2);
  await expect(select.locator('[role="separator"]')).toHaveCount(1);

  await select.getByRole("option", { name: "Carrot", exact: true }).click();
  await expect(trigger).toContainText("Carrot");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("select panel caps its height and scrolls", async ({ page }) => {
  await page.goto("/docs/components/select");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: "Scrollable" }) });
  const trigger = example.locator('[role="combobox"]');
  const panel = example.locator("[data-popover]");

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  const metrics = await panel.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      maxHeight: style.maxHeight,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight
    };
  });

  expect(metrics.maxHeight).toBe("288px");
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
});

test("select invalid trigger follows the field invalid state", async ({ page }) => {
  await page.goto("/docs/components/select");
  const example = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Invalid$/ }) });
  const trigger = example.locator('[role="combobox"]');
  const normal = page.locator(".select:has(#demo-select-default-panel) > button");

  await expect(trigger).toHaveAttribute("aria-invalid", "true");

  const invalidStyle = await trigger.evaluate((element) => {
    const style = getComputedStyle(element);
    return { borderColor: style.borderTopColor, boxShadow: style.boxShadow };
  });
  const normalStyle = await normal.evaluate((element) => {
    const style = getComputedStyle(element);
    return { borderColor: style.borderTopColor, boxShadow: style.boxShadow };
  });

  expect(invalidStyle.borderColor).not.toBe(normalStyle.borderColor);
  expect(invalidStyle.boxShadow).not.toBe("none");
  expect(normalStyle.boxShadow).toBe("none");
});

test("select and native select follow the field type scale", async ({ page }) => {
  await page.goto("/docs/components/select");
  const trigger = page.locator(".select:has(#demo-select-default-panel) > button");

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(trigger).toHaveCSS("font-size", "14px");

  await page.setViewportSize({ width: 600, height: 900 });
  await expect(trigger).toHaveCSS("font-size", "16px");

  await page.goto("/docs/components/native-select");
  const nativeSelect = page.locator("#demo-native-select-default");
  await expect(nativeSelect).toHaveCSS("font-size", "16px");

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(nativeSelect).toHaveCSS("font-size", "14px");
});

test("native select examples expose native states and sizes", async ({ page }) => {
  await page.goto("/docs/components/native-select");

  await expect(page.locator("#demo-native-select-disabled")).toBeDisabled();
  await expect(page.locator("#demo-native-select-invalid")).toHaveAttribute(
    "aria-invalid",
    "true"
  );
  await expect(page.locator("#demo-native-select-groups optgroup")).toHaveCount(3);

  const sizes = await page.evaluate(() => {
    const small = document.querySelector("#demo-native-select-size-sm");
    const fallback = document.querySelector("#demo-native-select-size-default");
    if (!small || !fallback) throw new Error("Missing native select size examples");
    return {
      small: parseFloat(getComputedStyle(small).height),
      default: parseFloat(getComputedStyle(fallback).height)
    };
  });

  expect(sizes.small).toBeLessThan(sizes.default);
});

test("native select chevron flips in right-to-left content", async ({ page }) => {
  await page.goto("/docs/components/native-select");
  const position = (selector: string) =>
    page
      .locator(selector)
      .evaluate((element) => getComputedStyle(element).backgroundPosition);

  const ltr = await position("#demo-native-select-default");
  const rtl = await position("#demo-native-select-rtl");

  expect(ltr).not.toBe(rtl);
  expect(ltr).toContain("calc");
  expect(rtl).toContain("10px");
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
  const input = combobox.locator("input[role='combobox']");
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
  const multipleInput = multiple.locator("input[role='combobox']");
  await multipleInput.click();
  await multiple.getByRole("option", { name: "Engineering", exact: true }).click();
  await expect(
    multiple.getByRole("option", { name: "Engineering", exact: true })
  ).toHaveAttribute("aria-selected", "true");
  await expect(multiple.locator("[data-popover]")).toHaveAttribute("aria-hidden", "false");
});

test("command filters groups, shows an empty state and closes on selection", async ({ page }) => {
  await page.goto("/docs/components/command");
  const dialog = page.locator("#demo-command");
  const input = dialog.getByRole("combobox", { name: "Search commands" });

  await page.getByRole("button", { name: "Open command", exact: true }).click();
  await expect(dialog).toHaveAttribute("open", "");
  await expect(input).toBeFocused();

  await input.fill("set");
  await expect(dialog.getByRole("option", { name: "Open settings" })).toBeVisible();
  await expect(dialog.getByRole("option", { name: "Go home" })).toBeHidden();
  await expect(
    dialog.locator("[data-slot='label']", { hasText: "Actions" })
  ).toBeHidden();
  expect(
    await dialog
      .locator("[role='separator']")
      .evaluateAll((nodes) => nodes.every((node) => node.hasAttribute("hidden")))
  ).toBe(true);
  await expect(dialog.locator(".command [data-slot='empty']")).toBeHidden();

  await input.fill("zzz");
  await expect(dialog.locator(".command [data-slot='empty']")).toBeVisible();

  await input.fill("set");
  await dialog.getByRole("option", { name: "Open settings" }).click();
  await expect(dialog).toHaveAttribute("open", "");

  await page.keyboard.press("Escape");
  await expect(dialog).not.toHaveAttribute("open", "");

  const scrollable = page.locator("#demo-command-scrollable");
  await page.locator('[data-open-dialog="demo-command-scrollable"]').click();
  const list = scrollable.locator("[role='listbox']");
  expect(await list.evaluate((element) => element.scrollHeight)).toBeGreaterThan(
    await list.evaluate((element) => element.clientHeight)
  );
  await page.keyboard.press("Escape");
  await expect(scrollable).not.toHaveAttribute("open", "");

  const trigger = page.getByRole("button", { name: "Open command menu" });
  const popover = page.locator("#demo-command-popover-panel");
  await trigger.click();
  await expect(popover).toHaveAttribute("aria-hidden", "false");
  await popover.getByRole("option", { name: "Settings" }).click();
  await expect(popover).toHaveAttribute("aria-hidden", "false");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});

test("calendar exposes a grid with a selected day", async ({ page }) => {
  await page.goto("/docs/components/calendar");

  const grid = page.locator(".example").first().getByRole("grid");
  await expect(grid).toBeVisible();
  await expect(grid.locator('td[aria-selected="true"]')).toHaveCount(1);
  await expect(
    grid.getByRole("button", { name: "February 14, 2026" })
  ).toBeVisible();
});

test("calendar month and year selector exposes native selects", async ({
  page
}) => {
  await page.goto("/docs/components/calendar");

  const example = page.locator(".example").filter({
    has: page.locator(".example-title", {
      hasText: /^Month and year selector$/
    })
  });
  await expect(example.getByRole("combobox", { name: "Month" })).toHaveValue(
    "2"
  );
  await expect(example.getByRole("combobox", { name: "Year" })).toHaveValue(
    "2026"
  );
});

test("calendar range marks every day and the grid as multiselectable", async ({
  page
}) => {
  await page.goto("/docs/components/calendar");

  const example = page.locator(".example").filter({
    has: page.locator(".example-title", { hasText: /^Range$/ })
  });
  const grid = example.getByRole("grid").first();
  await expect(grid).toHaveAttribute("aria-multiselectable", "true");
  await expect(example.locator('td[aria-selected="true"]')).toHaveCount(32);
  await expect(
    example.locator(
      'td[aria-selected="true"] button[aria-label="January 12, 2026"]'
    )
  ).toHaveCount(1);
});

test("calendar week numbers use row headers", async ({ page }) => {
  await page.goto("/docs/components/calendar");

  const example = page.locator(".example").filter({
    has: page.locator(".example-title", { hasText: /^Week numbers$/ })
  });
  await expect(
    example.getByRole("columnheader", { name: "Week" })
  ).toBeVisible();
  await expect(example.getByRole("rowheader", { name: "Week 5" })).toBeVisible();
});

test("calendar marks unavailable days as aria-disabled", async ({ page }) => {
  await page.goto("/docs/components/calendar");

  const example = page.locator(".example").filter({
    has: page.locator(".example-title", { hasText: /^Unavailable dates$/ })
  });
  await expect(
    example.getByRole("button", { name: "March 15, 2026" })
  ).toHaveAttribute("aria-disabled", "true");
  await expect(
    example.getByRole("button", { name: "March 6, 2026" })
  ).not.toHaveAttribute("aria-disabled", "true");
});

test("calendar date picker toggles its popover", async ({ page }) => {
  await page.goto("/docs/components/calendar");

  const example = page.locator(".example").filter({
    has: page.locator(".example-title", { hasText: /^Date picker$/ })
  });
  const trigger = example.locator(".docs-preview .btn");
  const panel = example.locator("#demo-calendar-picker-panel");

  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
});

test("date-picker recipe toggles its panel", async ({ page }) => {
  await page.goto("/docs/recipes/date-picker");
  const trigger = page.locator(
    'button[aria-haspopup="dialog"][aria-controls="recipe-date-panel"]'
  );
  const panel = page.locator("#recipe-date-panel");

  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
});

test("calendar mirrors in right-to-left containers", async ({ page }) => {
  await page.goto("/docs/components/calendar");

  const example = page.locator(".example").filter({
    has: page.locator(".example-title", { hasText: /^Right-to-left$/ })
  });
  const calendar = example.locator(".calendar");

  await expect(calendar).toHaveAttribute("dir", "rtl");
  await expect(calendar).toHaveCSS("direction", "rtl");
  await expect(
    example.getByRole("button", { name: "14 فبراير 2026" })
  ).toBeVisible();
  await expect(
    example.getByRole("button", { name: "الشهر السابق" }).locator("svg")
  ).toHaveCSS("rotate", "180deg");
});

test("carousel controls scroll the viewport and update indicators", async ({ page }) => {
  await page.goto("/docs/components/carousel");
  const carousel = page.locator(".carousel").first();
  const viewport = carousel.locator(".carousel-viewport");
  const scrollLeft = () =>
    viewport.evaluate((element) => element.scrollLeft);

  expect(await scrollLeft()).toBe(0);

  await carousel.getByRole("button", { name: "Next slide" }).click();
  await expect.poll(scrollLeft).toBeGreaterThan(0);

  await carousel.getByRole("button", { name: "Go to slide 3" }).click();
  await expect(
    carousel.getByRole("button", { name: "Go to slide 3" })
  ).toHaveAttribute("aria-current", "true");
});

test("toast dismissal hides the item", async ({ page }) => {
  await page.goto("/docs/components/toast");
  const toasts = page.locator(".toast");

  await expect(toasts).toHaveCount(3);
  await toasts.first().getByRole("button", { name: "Dismiss" }).click();
  await expect(toasts).toHaveCount(3);
  await expect(toasts.first()).toHaveJSProperty("hidden", true);
});

test("questionnaire navigates between fieldset steps", async ({ page }) => {
  await page.goto("/docs/components/questionnaire");
  const questionnaire = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Steps$/ }) })
    .locator(".questionnaire");
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

test("CSS-only components explain their no-module decision", async ({ page }) => {
  for (const id of ["input-otp", "slider", "scroll-area", "sidebar"]) {
    await page.goto(`/docs/components/${id}`);
    await expect(
      page.getByRole("heading", { name: "Behavior", exact: true })
    ).toBeVisible();
    await expect(page.getByText("No behavior module")).toBeVisible();
  }

  await page.goto("/docs/behavior");
  await expect(
    page.getByRole("heading", { name: "CSS-only by design" })
  ).toBeVisible();
});

test("progress mirrors its indeterminate sweep in right-to-left", async ({ page }) => {
  await page.goto("/docs/components/progress");
  const rtl = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Right-to-left$/ }) });
  const sweep = rtl.locator(".progress").nth(1);

  await expect(sweep).toHaveCSS("animation-direction", "reverse");
});

test("alert lays out icons, descriptions and actions in both directions", async ({
  page
}) => {
  await page.goto("/docs/components/alert");

  const hero = page.locator("section.example").first();
  const icon = hero.locator(".alert > svg");
  const title = hero.locator(".alert > h3");
  const section = hero.locator(".alert > section");

  await expect(icon).toHaveCSS("width", "16px");
  await expect(icon).toHaveCSS("height", "16px");
  await expect(section).toHaveCSS("display", "grid");

  const iconBox = await icon.boundingBox();
  const titleBox = await title.boundingBox();
  const sectionBox = await section.boundingBox();
  expect(iconBox).not.toBeNull();
  expect(titleBox).not.toBeNull();
  expect(sectionBox).not.toBeNull();
  if (iconBox && titleBox && sectionBox) {
    expect(titleBox.x).toBeGreaterThan(iconBox.x + iconBox.width);
    expect(Math.abs(titleBox.x - sectionBox.x)).toBeLessThan(1);
  }

  const actionExample = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Action$/ }) });
  const actionAlert = actionExample.locator(".alert");
  const description = actionAlert.locator("[data-slot='description']");
  const action = actionAlert.locator("footer .btn");

  await expect(description).toHaveCSS("display", "block");
  await expect(actionAlert).toHaveCSS("padding-right", "72px");
  await expect(action).toBeVisible();

  const actionAlertBox = await actionAlert.boundingBox();
  const actionBox = await action.boundingBox();
  expect(actionAlertBox).not.toBeNull();
  expect(actionBox).not.toBeNull();
  if (actionAlertBox && actionBox) {
    expect(
      actionAlertBox.x + actionAlertBox.width - (actionBox.x + actionBox.width)
    ).toBeLessThanOrEqual(10);
    expect(actionBox.y - actionAlertBox.y).toBeLessThanOrEqual(10);
  }

  const rtl = page
    .locator("section.example")
    .filter({ has: page.locator(".example-title", { hasText: /^Right-to-left$/ }) });
  const rtlAlert = rtl.locator(".alert").first();
  await expect(rtlAlert).toHaveCSS("direction", "rtl");

  const rtlIconBox = await rtlAlert.locator("svg").boundingBox();
  const rtlTitleBox = await rtlAlert.locator("h3").boundingBox();
  expect(rtlIconBox).not.toBeNull();
  expect(rtlTitleBox).not.toBeNull();
  if (rtlIconBox && rtlTitleBox) {
    expect(rtlIconBox.x).toBeGreaterThan(rtlTitleBox.x + rtlTitleBox.width);
  }
});

test("alert description containers keep paragraph spacing", async ({ page }) => {
  await page.goto("/docs/components/alert");
  const example = page
    .locator("section.example")
    .filter({
      has: page.locator(".example-title", { hasText: /^Description container$/ })
    });
  const description = example.locator(".alert > [data-slot='description']");
  const paragraphs = description.locator("p");

  await expect(description).toHaveCSS("display", "block");
  await expect(paragraphs).toHaveCount(2);
  await expect(paragraphs.first()).toHaveCSS("margin-bottom", "16px");
  await expect(paragraphs.last()).toHaveCSS("margin-bottom", "0px");
});

test("progress keeps a visible system-color track in forced-colors mode", async ({
  page
}) => {
  await page.goto("/docs/components/progress");
  await page.emulateMedia({ forcedColors: "active" });
  const bar = page.locator(".docs-preview .progress").first();

  await expect(bar).toHaveCSS("outline-width", "1px");
  await expect(bar).toHaveCSS("outline-style", "solid");
  const background = await bar.evaluate(
    (element) => getComputedStyle(element).backgroundColor
  );
  expect(background).not.toBe("rgba(0, 0, 0, 0)");
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
  await expect(source.locator("code")).toContainText("data-open-dialog");
  await expect(source.locator("code")).not.toContainText("data-demo");

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
  expect(copied).toContain('data-open-dialog="demo-dialog-default"');
  expect(copied).not.toContain("data-demo");
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
