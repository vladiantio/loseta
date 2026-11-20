import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("command filters and highlights options", async ({ page }) => {
  const fixture = page.locator('[data-fixture="command"] [data-example="Default"]');
  const input = fixture.locator("[role='combobox']");
  const options = fixture.locator("[role='option']");

  await expect(input).toHaveAttribute("aria-controls", "demo-command-listbox-1");
  await expect(input).toHaveAttribute("aria-expanded", "true");

  await input.focus();
  await page.keyboard.type("set");
  await expect(options.nth(0)).toHaveJSProperty("hidden", true);
  await expect(options.nth(5)).toHaveJSProperty("hidden", false);
  await expect(options.nth(5)).toHaveAttribute("data-highlighted", "");

  await input.fill("");
  await page.keyboard.type("o");
  await expect(options.nth(0)).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("data-highlighted", "");
});

test("command Enter activates the highlighted option without closing its dialog", async ({
  page
}) => {
  const trigger = page.locator('[data-open-dialog="demo-command"]');
  const dialog = page.locator("#demo-command");
  const input = dialog.locator("[role='combobox']");

  await trigger.click();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(input).toBeFocused();

  await page.keyboard.type("set");
  await page.keyboard.press("Enter");
  await expect(dialog).toHaveJSProperty("open", true);
});
