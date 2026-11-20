import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("combobox filters, selects and syncs the hidden input", async ({ page }) => {
  const fixture = page.locator('[data-fixture="combobox"] [data-example="Default"]');
  const input = fixture.locator("[role='combobox']");
  const panel = page.locator("#combobox-default-panel");
  const options = panel.locator("[role='option']");
  const empty = panel.locator("[data-slot='empty']");
  const hidden = fixture.locator("input[data-slot='input']");

  await page.evaluate(() => {
    (window as any).__comboboxChange = null;
    document
      .querySelector('[data-fixture="combobox"] [data-example="Default"] .combobox')
      ?.addEventListener("change", (event) => {
        (window as any).__comboboxChange = (event as CustomEvent).detail;
      });
  });

  await input.focus();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(input).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.type("vu");
  await expect(options.nth(0)).toHaveJSProperty("hidden", true);
  await expect(options.nth(1)).toHaveJSProperty("hidden", false);
  await expect(options.nth(2)).toHaveJSProperty("hidden", true);
  await expect(empty).toHaveJSProperty("hidden", true);

  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("Vue");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(hidden).toHaveValue("Vue");
  expect(await page.evaluate(() => (window as any).__comboboxChange)).toEqual({
    value: "Vue"
  });
});

test("combobox shows the empty state and restores the value on Escape", async ({ page }) => {
  const fixture = page.locator('[data-fixture="combobox"] [data-example="Default"]');
  const input = fixture.locator("[role='combobox']");
  const panel = page.locator("#combobox-default-panel");
  const empty = panel.locator("[data-slot='empty']");

  await input.focus();
  await page.keyboard.type("zzz");
  await expect(empty).toHaveJSProperty("hidden", false);

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(input).toHaveValue("");
});

test("single combobox clears its selection", async ({ page }) => {
  const fixture = page.locator('[data-fixture="combobox"] [data-example="Single"]');
  const input = fixture.locator("[role='combobox']");
  const panel = page.locator("#combobox-fruit-panel");
  const hidden = fixture.locator("input[data-slot='input']");
  const selected = fixture.locator("[role='option'][aria-selected='true']");

  await input.focus();
  await page.keyboard.type("app");
  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("Apple");
  await expect(hidden).toHaveValue("Apple");
  await expect(selected).toHaveCount(1);

  await fixture.locator("[data-slot='clear']").click();
  await expect(input).toHaveValue("");
  await expect(hidden).toHaveValue("");
  await expect(fixture.locator("[role='option'][aria-selected='true']")).toHaveCount(0);
  await expect(panel).toHaveAttribute("aria-hidden", "false");
});

test("multiple combobox toggles values and keeps the panel open", async ({ page }) => {
  const fixture = page.locator('[data-fixture="combobox"] [data-example="Multiple"]');
  const input = fixture.locator("[role='combobox']");
  const panel = page.locator("#combobox-tag-panel");
  const options = panel.locator("[role='option']");

  await page.evaluate(() => {
    (window as any).__comboboxValues = null;
    document
      .querySelector('[data-fixture="combobox"] [data-example="Multiple"] .combobox')
      ?.addEventListener("change", (event) => {
        (window as any).__comboboxValues = (event as CustomEvent).detail;
      });
  });

  await input.focus();
  await page.keyboard.type("e");
  await options.nth(1).click();
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(input).toHaveValue("");
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await options.nth(0).click();
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "false");
  expect(await page.evaluate(() => (window as any).__comboboxValues)).toEqual({
    values: ["Engineering", "Docs"]
  });
});
