import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("resizable drags a handle and dispatches change", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"] [data-example="Default"]');
  const root = fixture.locator(".resizable");
  const handle = root.locator("[data-slot='handle']");
  const first = root.locator(".resizable-panel").first();

  await root.evaluate((element) => {
    (window as any).__resizeChange = null;
    element.addEventListener("change", (event) => {
      (window as any).__resizeChange = (event as CustomEvent).detail;
    });
  });

  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  if (!box) throw new Error("missing resizable handle");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2);
  await page.mouse.up();

  await expect(handle).not.toHaveAttribute("aria-valuenow", "50");
  const value = await first.evaluate((element) =>
    Number.parseFloat(
      getComputedStyle(element).getPropertyValue("--panel-size")
    )
  );
  expect(value).toBeGreaterThan(50);

  const detail = await page.evaluate(() => (window as any).__resizeChange);
  expect(detail.sizes[0]).toBeGreaterThan(50);
  expect(detail.sizes[0] + detail.sizes[1]).toBeCloseTo(100, 1);
});

test("resizable keyboard arrows, Home and End stay in sync", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"] [data-example="Default"]');
  const root = fixture.locator(".resizable");
  const handle = root.locator("[data-slot='handle']");

  await handle.focus();
  await page.keyboard.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "51");

  await page.keyboard.press("Home");
  await expect(handle).toHaveAttribute("aria-valuenow", "0");

  await page.keyboard.press("End");
  await expect(handle).toHaveAttribute("aria-valuenow", "100");

  await page.keyboard.press("ArrowLeft");
  await expect(handle).toHaveAttribute("aria-valuenow", "99");
});

test("vertical resizable responds to ArrowDown and ArrowUp", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"] [data-example="Vertical"]');
  const root = fixture.locator(".resizable");
  const handle = root.locator("[data-slot='handle']");

  await handle.focus();
  await page.keyboard.press("ArrowDown");
  await expect(handle).toHaveAttribute("aria-valuenow", "51");

  await page.keyboard.press("ArrowUp");
  await expect(handle).toHaveAttribute("aria-valuenow", "50");
});
