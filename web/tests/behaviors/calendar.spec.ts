import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("calendar selects a day and dispatches change", async ({ page }) => {
  const fixture = page.locator('[data-fixture="calendar"] [data-example="Default"]');
  const calendar = fixture.locator(".calendar");

  await calendar.evaluate((element) => {
    (window as any).__calendarChange = null;
    element.addEventListener("change", (event) => {
      (window as any).__calendarChange = (event as CustomEvent).detail;
    });
  });

  await calendar.getByRole("button", { name: "February 20, 2026" }).click();

  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(1);
  await expect(
    calendar.getByRole("button", { name: "February 20, 2026" })
  ).toBeFocused();
  await expect(calendar.locator("button[tabindex='0']")).toHaveCount(1);
  expect(await page.evaluate(() => (window as any).__calendarChange)).toEqual({
    value: "2026-02-20",
    values: ["2026-02-20"],
    range: null
  });
});

test("calendar moves focus with arrows and selects with Enter", async ({ page }) => {
  const fixture = page.locator('[data-fixture="calendar"] [data-example="Default"]');
  const calendar = fixture.locator(".calendar");
  const selected = calendar.getByRole("button", { name: "February 14, 2026" });

  await selected.click();
  await page.keyboard.press("ArrowRight");

  const next = calendar.getByRole("button", { name: "February 15, 2026" });
  await expect(next).toBeFocused();
  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(1);

  await page.keyboard.press("Enter");
  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(1);
  await expect(next).toBeFocused();
  await expect(
    calendar.locator('td[aria-selected="true"] button[data-date="2026-02-15"]')
  ).toHaveCount(1);
});

test("calendar range uses two clicks and Shift extends", async ({ page }) => {
  const fixture = page.locator('[data-fixture="calendar"] [data-example="Range"]');
  const calendar = fixture.locator(".calendar").first();

  await calendar.evaluate((element) => {
    (window as any).__calendarChange = null;
    element.addEventListener("change", (event) => {
      (window as any).__calendarChange = (event as CustomEvent).detail;
    });
  });

  await calendar.getByRole("button", { name: "January 5, 2026" }).click();
  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(1);
  expect(await page.evaluate(() => (window as any).__calendarChange)).toEqual({
    value: "2026-01-05",
    values: ["2026-01-05"],
    range: null
  });

  await calendar.getByRole("button", { name: "January 10, 2026" }).click();
  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(6);
  expect(await page.evaluate(() => (window as any).__calendarChange)).toEqual({
    value: "2026-01-05",
    values: ["2026-01-05", "2026-01-10"],
    range: { start: "2026-01-05", end: "2026-01-10" }
  });

  await calendar
    .getByRole("button", { name: "January 15, 2026" })
    .click({ modifiers: ["Shift"] });
  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(11);
  expect(await page.evaluate(() => (window as any).__calendarChange)).toEqual({
    value: "2026-01-05",
    values: ["2026-01-05", "2026-01-15"],
    range: { start: "2026-01-05", end: "2026-01-15" }
  });
});

test("calendar multiple mode toggles dates", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="calendar"] [data-example="Multiple"]'
  );
  const calendar = fixture.locator(".calendar");

  await calendar.evaluate((element) => {
    (window as any).__calendarChange = null;
    element.addEventListener("change", (event) => {
      (window as any).__calendarChange = (event as CustomEvent).detail;
    });
  });

  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(3);

  await calendar.getByRole("button", { name: "February 10, 2026" }).click();
  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(2);
  expect(await page.evaluate(() => (window as any).__calendarChange)).toEqual({
    value: null,
    values: ["2026-02-03", "2026-02-17"],
    range: null
  });

  await calendar.getByRole("button", { name: "February 20, 2026" }).click();
  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(3);
  expect(await page.evaluate(() => (window as any).__calendarChange)).toEqual({
    value: null,
    values: ["2026-02-03", "2026-02-17", "2026-02-20"],
    range: null
  });
});

test("calendar moves months with the header and month selectors", async ({
  page
}) => {
  const defaultFixture = page.locator(
    '[data-fixture="calendar"] [data-example="Default"]'
  );
  const defaultCalendar = defaultFixture.locator(".calendar");
  await defaultCalendar.locator("[data-slot='next']").click();
  await expect(defaultCalendar).toHaveAttribute("data-month", "2026-03");
  await expect(
    defaultCalendar.getByRole("button", { name: "March 1, 2026" })
  ).toBeVisible();
  await expect(
    defaultCalendar.locator("[data-slot='title']")
  ).toHaveText("March 2026");

  const selectorFixture = page.locator(
    '[data-fixture="calendar"] [data-example="Month and year selector"]'
  );
  const selectorCalendar = selectorFixture.locator(".calendar");
  await selectorCalendar
    .getByRole("combobox", { name: "Month" })
    .selectOption("3");
  await expect(selectorCalendar).toHaveAttribute("data-month", "2026-03");
  await expect(
    selectorCalendar.getByRole("combobox", { name: "Month" })
  ).toHaveValue("3");
});

test("calendar ignores unavailable days", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="calendar"] [data-example="Unavailable dates"]'
  );
  const calendar = fixture.locator(".calendar");

  await calendar.evaluate((element) => {
    (window as any).__calendarChange = null;
    element.addEventListener("change", (event) => {
      (window as any).__calendarChange = (event as CustomEvent).detail;
    });
  });

  await calendar
    .getByRole("button", { name: "March 15, 2026" })
    .evaluate((element) => (element as HTMLButtonElement).click());

  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(1);
  expect(await page.evaluate(() => (window as any).__calendarChange)).toBeNull();
});

test("calendar with custom day content stays untouched", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="calendar"] [data-example="Default"]'
  );
  const calendar = fixture.locator(".calendar");
  const custom = calendar.getByRole("button", { name: "February 20, 2026" });

  await custom.evaluate((button) => {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "20";
    button.replaceChildren(badge);
  });

  await custom.click();
  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(1);

  await calendar.getByRole("button", { name: "February 21, 2026" }).click();
  await expect(calendar.locator('td[aria-selected="true"]')).toHaveCount(1);
});

test("calendar horizontal arrows follow RTL direction", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="calendar"] [data-example="Right-to-left"]'
  );
  const calendar = fixture.locator(".calendar");

  await calendar.getByRole("button", { name: "14 فبراير 2026" }).click();
  await page.keyboard.press("ArrowRight");

  await expect(
    calendar.getByRole("button", { name: "13 فبراير 2026" })
  ).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await expect(
    calendar.getByRole("button", { name: "14 فبراير 2026" })
  ).toBeFocused();
});
