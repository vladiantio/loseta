import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("tabs select on click and keep roving tabindex in sync", async ({ page }) => {
  const fixture = page.locator('[data-fixture="tabs"] [data-example="Default"]');
  const account = fixture.locator("#tab-account");
  const password = fixture.locator("#tab-password");
  const accountPanel = fixture.locator("#panel-account");
  const passwordPanel = fixture.locator("#panel-password");

  await password.click();
  await expect(password).toHaveAttribute("aria-selected", "true");
  await expect(password).toHaveAttribute("tabindex", "0");
  await expect(account).toHaveAttribute("aria-selected", "false");
  await expect(account).toHaveAttribute("tabindex", "-1");
  await expect(accountPanel).toHaveJSProperty("hidden", true);
  await expect(passwordPanel).toHaveJSProperty("hidden", false);
});

test("tabs support arrow keys, Home and End with automatic activation", async ({ page }) => {
  const fixture = page.locator('[data-fixture="tabs"] [data-example="Default"]');
  const account = fixture.locator("#tab-account");
  const password = fixture.locator("#tab-password");

  await account.focus();
  await page.keyboard.press("ArrowRight");
  await expect(password).toBeFocused();
  await expect(password).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("Home");
  await expect(account).toBeFocused();
  await expect(account).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("End");
  await expect(password).toBeFocused();
  await expect(password).toHaveAttribute("aria-selected", "true");
});
