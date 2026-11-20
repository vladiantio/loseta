import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("questionnaire moves steps, progress and focus", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="questionnaire"] [data-example="Steps"]'
  );
  const root = fixture.locator(".questionnaire");
  const label = root.locator("[data-slot='progress-label']");
  const progress = root.locator("progress");
  const steps = root.locator("[data-slot='item']");
  const previous = root.getByRole("button", { name: "Previous" });
  const next = root.getByRole("button", { name: "Next" });

  await root.evaluate((element) => {
    (window as any).__questionnaireChange = null;
    element.addEventListener("change", (event) => {
      (window as any).__questionnaireChange = (event as CustomEvent).detail;
    });
  });

  await expect(label).toHaveText("Question 1 of 2");
  await expect(previous).toBeDisabled();
  await expect(steps.first()).toBeVisible();

  await next.click();
  await expect(label).toHaveText("Question 2 of 2");
  await expect(progress).toHaveJSProperty("value", 2);
  await expect(progress).toHaveText("2 of 2");
  await expect(steps.first()).toBeHidden();
  await expect(steps.nth(1)).toBeVisible();
  await expect(next).toBeDisabled();
  await expect(previous).toBeEnabled();
  await expect(steps.nth(1).locator("input").first()).toBeFocused();
  expect(await page.evaluate(() => (window as any).__questionnaireChange)).toEqual({
    step: 2,
    total: 2
  });

  await previous.click();
  await expect(label).toHaveText("Question 1 of 2");
  await expect(progress).toHaveJSProperty("value", 1);
  await expect(steps.first()).toBeVisible();
  await expect(previous).toBeDisabled();
  await expect(steps.first().locator("input").first()).toBeFocused();
  expect(await page.evaluate(() => (window as any).__questionnaireChange)).toEqual({
    step: 1,
    total: 2
  });
});
