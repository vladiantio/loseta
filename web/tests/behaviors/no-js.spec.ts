import { expect, test } from "@playwright/test";

test("content stays readable and overlays stay inert without JavaScript", async ({
  page
}) => {
  await page.goto("/fixtures/behaviors");

  await expect(page.getByRole("heading", { name: "dialog", exact: true })).toBeVisible();
  const trigger = page.locator('[data-open-dialog="demo-dialog-default"]');
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveText("Open dialog");

  await trigger.click();
  await expect(page.locator("dialog[open]")).toHaveCount(0);

  const menu = page.locator('[data-fixture="dropdown-menu"] [data-popover]').first();
  await expect(menu).toHaveAttribute("aria-hidden", "true");

  const tabs = page.locator('[data-fixture="tabs"] [role="tabpanel"]').nth(1);
  await expect(tabs).toHaveJSProperty("hidden", true);
});
