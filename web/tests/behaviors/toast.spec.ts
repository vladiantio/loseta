import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("toast dismisses from its close control", async ({ page }) => {
  const toast = page.locator('[data-fixture="toast"] .toast').first();
  await page.evaluate(() => {
    (window as any).__toastDismiss = null;
    document
      .querySelector('[data-fixture="toast"] .toast')
      ?.addEventListener("dismiss", (event) => {
        (window as any).__toastDismiss = (event as CustomEvent).detail;
      });
  });

  await toast.locator("[data-slot='close']").click();
  await expect(toast).toHaveJSProperty("hidden", true);
  expect(await page.evaluate(() => (window as any).__toastDismiss)).toEqual({
    reason: "close"
  });
});

test("inserted toasts arm their timer and pause on hover", async ({ page }) => {
  await page.evaluate(() => {
    const section = document.querySelector('[data-fixture="toast"]');
    if (!section) return;

    const auto = document.createElement("div");
    auto.className = "toast";
    auto.setAttribute("data-duration", "300");
    auto.setAttribute("role", "status");
    auto.innerHTML = '<section><p data-slot="title">Auto dismiss</p></section>';
    section.append(auto);
    auto.addEventListener("dismiss", (event) => {
      (window as any).__autoToastReason = (event as CustomEvent).detail.reason;
    });
  });

  const auto = page.locator('[data-fixture="toast"] .toast', { hasText: "Auto dismiss" });
  await expect(auto).toHaveJSProperty("hidden", true, { timeout: 2000 });
  expect(await page.evaluate(() => (window as any).__autoToastReason)).toBe("timeout");

  await page.evaluate(() => {
    const section = document.querySelector('[data-fixture="toast"]');
    if (!section) return;

    const paused = document.createElement("div");
    paused.className = "toast";
    paused.setAttribute("data-duration", "1000");
    paused.setAttribute("role", "status");
    paused.innerHTML = '<section><p data-slot="title">Paused toast</p></section>';
    section.append(paused);
  });

  const paused = page.locator('[data-fixture="toast"] .toast', {
    hasText: "Paused toast"
  });
  await paused.hover();
  await page.waitForTimeout(1200);
  await expect(paused).toHaveJSProperty("hidden", false);

  await page.mouse.move(0, 0);
  await expect(paused).toHaveJSProperty("hidden", true, { timeout: 2500 });
});
