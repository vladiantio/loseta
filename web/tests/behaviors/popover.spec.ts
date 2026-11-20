import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("popover toggles, focuses the dialog panel and restores focus", async ({ page }) => {
  const fixture = page.locator('[data-fixture="popover"] [data-example="Default"]');
  const trigger = fixture.locator("button[aria-haspopup='dialog']");
  const panel = page.locator("#demo-popover-default-panel");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect
    .poll(() => panel.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);

  await panel.locator("input").click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("popover closes on outside click and keeps one chain open", async ({ page }) => {
  const first = page.locator('[data-fixture="popover"] [data-example="Default"]');
  const second = page.locator('[data-fixture="popover"] [data-example="Basic"]');
  const firstPanel = page.locator("#demo-popover-default-panel");
  const secondPanel = page.locator("#demo-popover-basic-panel");

  await first.locator("button[aria-haspopup='dialog']").click();
  await expect(firstPanel).toHaveAttribute("aria-hidden", "false");

  await second
    .locator("button[aria-haspopup='dialog']")
    .evaluate((element) => (element as HTMLElement).click());
  await expect(firstPanel).toHaveAttribute("aria-hidden", "true");
  await expect(secondPanel).toHaveAttribute("aria-hidden", "false");

  await page.mouse.click(2, 2);
  await expect(secondPanel).toHaveAttribute("aria-hidden", "true");
});
