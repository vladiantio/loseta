import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("select opens, navigates and selects with the keyboard", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Default"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-default-panel");
  const options = panel.locator("[role='option']");
  const hidden = fixture.locator("input[data-slot='input']");

  await page.evaluate(() => {
    (window as any).__selectChange = null;
    document
      .querySelector('[data-fixture="select"] [data-example="Default"] .select')
      ?.addEventListener("change", (event) => {
        (window as any).__selectChange = (event as CustomEvent).detail;
      });
  });

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(options.nth(0)).toHaveAttribute("data-highlighted", "");
  await expect(trigger).toHaveAttribute("aria-activedescendant", /.+/);

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Enter");

  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();
  await expect(fixture.locator("[data-slot='value']")).toHaveText("Banana");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(hidden).toHaveValue("Banana");
  expect(await page.evaluate(() => (window as any).__selectChange)).toEqual({
    value: "Banana"
  });
});

test("select typeahead, disabled options and dismissal", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Default"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-default-panel");
  const options = panel.locator("[role='option']");

  await trigger.click();
  await page.keyboard.press("o");
  await expect(options.nth(2)).toHaveAttribute("data-highlighted", "");

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(0)).toHaveAttribute("data-highlighted", "");

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.locator('[data-fixture="select"] > h2').click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});
