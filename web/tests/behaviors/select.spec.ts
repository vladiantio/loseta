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
  await expect(hidden).toHaveValue("banana");
  expect(await page.evaluate(() => (window as any).__selectChange)).toEqual({
    value: "banana"
  });
});

test("select typeahead and dismissal", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Default"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-default-panel");
  const options = panel.locator("[role='option']");

  await trigger.click();
  await page.keyboard.press("p");
  await expect(options.nth(4)).toHaveAttribute("data-highlighted", "");

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(0)).toHaveAttribute("data-highlighted", "");

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.locator('[data-fixture="select"] > h2').click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("select syncs the authored selection on load", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Small, selected"]');
  const trigger = fixture.locator("[role='combobox']");
  const selected = fixture.locator("[role='option'][aria-selected='true']");

  await expect(trigger).not.toHaveAttribute("data-placeholder", "");
  await expect(fixture.locator("[data-slot='value']")).toHaveText("Apple");
  await expect(fixture.locator("input[data-slot='input']")).toHaveValue("apple");
  await expect(selected).toHaveAttribute("data-value", "apple");
});

test("select reveals scroll controls only while scrollable", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Scrollable"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-scrollable-panel");
  const listbox = panel.locator("[role='listbox']");
  const up = panel.locator("[data-slot='scroll-up']");
  const down = panel.locator("[data-slot='scroll-down']");

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(up).toBeHidden();
  await expect(down).toBeVisible();

  await down.dispatchEvent("click");
  await expect
    .poll(() => listbox.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await expect(up).toBeVisible();

  await listbox.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(down).toBeHidden();
});
