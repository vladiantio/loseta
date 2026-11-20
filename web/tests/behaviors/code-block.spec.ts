import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as any).__copied = text;
        }
      }
    });
  });
  await page.goto("/fixtures/behaviors");
});

test("copy writes the code and restores its label", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="code-block"] [data-example="Header and actions"]'
  );
  const button = fixture.locator("[data-slot='copy']");

  await button.click();
  await expect(button).toHaveAttribute("data-copied", "");
  await expect(button).toHaveAttribute("aria-label", "Copied");
  expect(await page.evaluate(() => (window as any).__copied)).toContain("streamText");

  await expect(button).not.toHaveAttribute("data-copied", "", { timeout: 2500 });
  await expect(button).toHaveAttribute("aria-label", "Copy code");
});

test("copy joins line content without line numbers", async ({ page }) => {
  const fixture = page.locator('[data-fixture="code-block"] [data-example="Line numbers"]');
  await fixture.locator("[data-slot='copy']").click();

  const copied = await page.evaluate(() => (window as any).__copied as string);
  expect(copied).toContain("if (!session) {");
  expect(copied).toContain("redirect(\"/login\");");
  expect(copied.startsWith("12")).toBe(false);
});

test("wrap toggles data-wrap and aria-pressed", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="code-block"] [data-example="Small, wrapped and destructive"]'
  );
  const button = fixture.locator("[data-slot='wrap']");
  const pre = fixture.locator("pre");

  await expect(pre).toHaveAttribute("data-wrap", "");
  await expect(button).toHaveAttribute("aria-pressed", "true");

  await button.click();
  await expect(pre).not.toHaveAttribute("data-wrap", "");
  await expect(button).toHaveAttribute("aria-pressed", "false");

  await button.click();
  await expect(pre).toHaveAttribute("data-wrap", "");
  await expect(button).toHaveAttribute("aria-pressed", "true");
});
