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

  const drawerTrigger = page.locator(
    '[data-open-dialog="demo-drawer-default"]'
  );
  await drawerTrigger.click();
  await expect(page.locator("#demo-drawer-default")).not.toHaveAttribute(
    "open",
    ""
  );

  const sheet = page.locator("#demo-sheet-default");
  await sheet.evaluate((element) => {
    if (!(element instanceof HTMLDialogElement)) {
      throw new Error("Expected a native dialog");
    }
    element.showModal();
  });
  await expect(sheet).toHaveJSProperty("open", true);
  await sheet.locator("[data-slot='close']").click();
  await expect(sheet).toHaveJSProperty("open", false);

  const menu = page.locator('[data-fixture="dropdown-menu"] [data-popover]').first();
  await expect(menu).toHaveAttribute("aria-hidden", "true");

  const tabs = page.locator('[data-fixture="tabs"] [role="tabpanel"]').nth(1);
  await expect(tabs).toHaveJSProperty("hidden", true);

  const calendar = page.locator(
    '[data-fixture="calendar"] [data-example="Default"] .calendar'
  );
  await expect(calendar).toHaveAttribute("data-month", "2026-02");
  await calendar.locator("[data-slot='next']").click();
  await expect(calendar).toHaveAttribute("data-month", "2026-02");

  const carousel = page.locator(
    '[data-fixture="carousel"] [data-example="Default"] .carousel'
  );
  const viewport = carousel.locator(".carousel-viewport");
  expect(await viewport.evaluate((element) => element.scrollLeft)).toBe(0);
  await carousel.getByRole("button", { name: "Next slide" }).click();
  expect(await viewport.evaluate((element) => element.scrollLeft)).toBe(0);

  const questionnaire = page.locator(
    '[data-fixture="questionnaire"] [data-example="Steps"] .questionnaire'
  );
  await expect(questionnaire.locator("[data-slot='item']").first()).toBeVisible();
  await expect(questionnaire.locator("[data-slot='item']").nth(1)).toBeHidden();

  const jump = page.locator(
    '[data-fixture="message-scroller"] [data-slot="jump"]'
  );
  await expect(jump).toBeVisible();

  const tooltip = page.locator(
    '[data-fixture="tooltip"] [data-example="Default"] .tooltip'
  );
  await tooltip.getByRole("button", { name: "Hover" }).hover();
  await expect(tooltip.locator("[data-slot='content']")).toBeVisible();

  const hoverCard = page.locator(
    '[data-fixture="hover-card"] [data-example="Default"] .hover-card'
  );
  await hoverCard.getByRole("link", { name: "@loseta" }).hover();
  await expect(hoverCard.locator("[data-popover]")).toBeVisible();
});
