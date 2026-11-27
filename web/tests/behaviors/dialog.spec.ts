import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("dialog opens, traps focus, closes on Escape and restores focus", async ({ page }) => {
  const fixture = page.locator('[data-fixture="dialog"] [data-example="Default"]');
  const trigger = fixture.locator('[data-open-dialog="demo-dialog-default"]');
  const dialog = page.locator("#demo-dialog-default");

  await trigger.click();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect
    .poll(() => dialog.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);

  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) => element.contains(document.activeElement))
    ).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);
  await expect(trigger).toBeFocused();
});

test("dialog closes on a backdrop click and locks background scroll", async ({ page }) => {
  const trigger = page.locator('[data-open-dialog="demo-dialog-default"]');
  const dialog = page.locator("#demo-dialog-default");

  await trigger.click();
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .toBe("hidden");

  await page.mouse.click(2, 2);
  await expect(dialog).toHaveJSProperty("open", false);
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .not.toBe("hidden");
});

test("alert dialog ignores backdrop clicks but closes on Escape", async ({ page }) => {
  const trigger = page.locator('[data-open-dialog="demo-alert-dialog-default"]');
  const dialog = page.locator("#demo-alert-dialog-default");

  await trigger.click();
  await expect(dialog).toHaveJSProperty("open", true);

  await page.mouse.click(2, 2);
  await expect(dialog).toHaveJSProperty("open", true);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);
  await expect(trigger).toBeFocused();
});

test("drawer triggers expose and restore dialog state", async ({ page }) => {
  const trigger = page.locator('[data-open-dialog="demo-drawer-default"]');
  const drawer = page.locator("#demo-drawer-default");

  await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  await expect(trigger).toHaveAttribute("aria-controls", "demo-drawer-default");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(drawer).toHaveJSProperty("open", true);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(drawer).toHaveJSProperty("open", false);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("close controls dismiss sheet and drawer dialogs", async ({ page }) => {
  const sheetTrigger = page.locator('[data-open-dialog="demo-sheet-default"]');
  const sheet = page.locator("#demo-sheet-default");
  await sheetTrigger.click();
  await expect(sheet).toHaveJSProperty("open", true);
  await sheet.locator("[data-close-dialog]").first().click();
  await expect(sheet).toHaveJSProperty("open", false);

  const drawerTrigger = page.locator('[data-open-dialog="demo-drawer-default"]');
  const drawer = page.locator("#demo-drawer-default");
  await drawerTrigger.click();
  await expect(drawer).toHaveJSProperty("open", true);
  await drawer.locator("[data-close-dialog]").first().click();
  await expect(drawer).toHaveJSProperty("open", false);
});
