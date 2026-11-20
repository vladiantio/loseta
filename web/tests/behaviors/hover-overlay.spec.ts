import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");

  // The calendar date-picker example starts with its popover open. Close it so
  // its Escape handler does not consume the key before the hover overlay.
  const datePicker = page.locator(
    '[data-fixture="calendar"] [data-example="Date picker"]'
  );
  const trigger = datePicker.locator(
    'button[aria-controls="demo-calendar-picker-panel"]'
  );
  if ((await trigger.count()) > 0) {
    await trigger.click();
  }
});

test("tooltip opens on hover, closes on Escape and restores focus", async ({
  page
}) => {
  const fixture = page.locator('[data-fixture="tooltip"] [data-example="Default"]');
  const wrapper = fixture.locator(".tooltip");
  const trigger = wrapper.getByRole("button", { name: "Hover" });
  const content = wrapper.locator("[data-slot='content']");

  await wrapper.evaluate((element) => {
    (window as any).__tooltipToggle = null;
    element.addEventListener("toggle", (event) => {
      (window as any).__tooltipToggle = (event as CustomEvent).detail;
    });
  });

  await trigger.hover();
  await expect(content).toHaveAttribute("aria-hidden", "false");
  await expect(content).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as any).__tooltipToggle))
    .toEqual({ open: true });

  await page.keyboard.press("Escape");
  await expect(content).toHaveAttribute("aria-hidden", "true");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => (window as any).__tooltipToggle)).toEqual({
    open: false
  });
});

test("hover card opens on hover, closes on Escape and restores focus", async ({
  page
}) => {
  const fixture = page.locator(
    '[data-fixture="hover-card"] [data-example="Default"]'
  );
  const wrapper = fixture.locator(".hover-card");
  const trigger = wrapper.getByRole("link", { name: "@loseta" });
  const panel = wrapper.locator("[data-popover]");

  await wrapper.evaluate((element) => {
    (window as any).__hoverCardToggle = null;
    element.addEventListener("toggle", (event) => {
      (window as any).__hoverCardToggle = (event as CustomEvent).detail;
    });
  });

  await trigger.hover();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(panel).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as any).__hoverCardToggle))
    .toEqual({ open: true });

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => (window as any).__hoverCardToggle)).toEqual({
    open: false
  });
});

test("tooltip text shorthand stays CSS-only", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="tooltip"] [data-example="Text shorthand"]'
  );
  const wrapper = fixture.locator(".tooltip");
  const trigger = wrapper.getByRole("button", { name: "Copy link" });

  await trigger.hover();
  await expect
    .poll(() =>
      wrapper.evaluate(
        (element) => getComputedStyle(element, "::before").visibility
      )
    )
    .toBe("visible");

  await page.keyboard.press("Escape");
  expect(
    await wrapper.evaluate(
      (element) => getComputedStyle(element, "::before").visibility
    )
  ).toBe("visible");
});
