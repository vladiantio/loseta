import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("carousel controls, indicators, keyboard and offscreen state", async ({
  page
}) => {
  const fixture = page.locator('[data-fixture="carousel"] [data-example="Default"]');
  const carousel = fixture.locator(".carousel");
  const viewport = carousel.locator(".carousel-viewport");
  const indicators = carousel.locator(".carousel-indicator");
  const slides = carousel.locator(".carousel-item");

  await carousel.evaluate((element) => {
    (window as any).__carouselChange = null;
    element.addEventListener("change", (event) => {
      (window as any).__carouselChange = (event as CustomEvent).detail;
    });
  });

  const scrollLeft = () => viewport.evaluate((element) => element.scrollLeft);
  expect(await scrollLeft()).toBe(0);

  await carousel.getByRole("button", { name: "Next slide" }).click();
  await expect.poll(scrollLeft).toBeGreaterThan(0);
  await expect(indicators.nth(1)).toHaveAttribute("aria-current", "true");
  await expect
    .poll(() => slides.nth(0).getAttribute("aria-hidden"))
    .toBe("true");
  await expect
    .poll(() =>
      slides.nth(0).evaluate((element) => element.hasAttribute("inert"))
    )
    .toBe(true);

  await carousel.getByRole("button", { name: "Go to slide 3" }).click();
  await expect(indicators.nth(2)).toHaveAttribute("aria-current", "true");
  expect(await page.evaluate(() => (window as any).__carouselChange)).toEqual({
    index: 2
  });

  await viewport.focus();
  await page.keyboard.press("Home");
  await expect(indicators.nth(0)).toHaveAttribute("aria-current", "true");
  await page.keyboard.press("End");
  await expect(indicators.nth(2)).toHaveAttribute("aria-current", "true");
});

test("vertical carousel uses vertical scrolling and arrows", async ({ page }) => {
  const fixture = page.locator('[data-fixture="carousel"] [data-example="Vertical"]');
  const carousel = fixture.locator(".carousel");
  const viewport = carousel.locator(".carousel-viewport");
  const indicators = carousel.locator(".carousel-indicator");

  const scrollTop = () => viewport.evaluate((element) => element.scrollTop);
  expect(await scrollTop()).toBe(0);

  await carousel.getByRole("button", { name: "Next slide" }).click();
  await expect.poll(scrollTop).toBeGreaterThan(0);
  await expect(indicators.nth(1)).toHaveAttribute("aria-current", "true");

  await viewport.focus();
  await page.keyboard.press("ArrowUp");
  await expect(indicators.nth(0)).toHaveAttribute("aria-current", "true");
  await page.keyboard.press("ArrowDown");
  await expect(indicators.nth(1)).toHaveAttribute("aria-current", "true");
});

test("RTL carousel follows the computed direction", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="carousel"] [data-example="Right-to-left"]'
  );
  const carousel = fixture.locator(".carousel");
  const viewport = carousel.locator(".carousel-viewport");
  const indicators = carousel.locator(".carousel-indicator");

  await carousel.getByRole("button", { name: "الشريحة التالية" }).click();
  await expect(indicators.nth(1)).toHaveAttribute("aria-current", "true");
  await expect
    .poll(() =>
      viewport.evaluate((element) => Math.abs(element.scrollLeft))
    )
    .toBeGreaterThan(0);

  await carousel.getByRole("button", { name: "الشريحة السابقة" }).click();
  await expect(indicators.nth(0)).toHaveAttribute("aria-current", "true");

  await viewport.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(indicators.nth(1)).toHaveAttribute("aria-current", "true");
  await page.keyboard.press("ArrowRight");
  await expect(indicators.nth(0)).toHaveAttribute("aria-current", "true");
});
