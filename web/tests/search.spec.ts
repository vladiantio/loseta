import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

function blocking(violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"]) {
  return violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical"
  );
}

test("search index contains rendered pages and headings", async ({ request }) => {
  const response = await request.get("/search-index.json");
  expect(response.ok()).toBe(true);
  const index = await response.json();

  expect(index.version).toBe(1);
  expect(index.pages.length).toBeGreaterThanOrEqual(82);
  expect(index.pages.some((page: { route: string }) => page.route.startsWith("/fixtures"))).toBe(
    false
  );
  expect(index.pages).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ route: "/", title: "loseta" }),
      expect.objectContaining({ route: "/blocks/dashboard-01", title: "Dashboard" })
    ])
  );

  const button = index.pages.find((page: { route: string }) => page.route === "/docs/components/button");
  expect(button.headings).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: "install-contract", text: "Install contract" })])
  );
});

test("search opens with suggestions, fuzzy results and keyboard activation", async ({ page }) => {
  await page.goto("/docs");
  const trigger = page.getByRole("button", { name: "Search..." });
  await expect(trigger).toBeVisible();
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Search documentation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".command")).toBeVisible();
  await expect(dialog.locator(".docs-search-footer")).toBeVisible();
  const input = dialog.getByRole("combobox", { name: "Search documentation" });
  await expect(input).toBeFocused();
  await expect(dialog.getByText("Suggested", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("option")).toHaveCount(8);

  await input.fill("buton");
  const first = dialog.getByRole("option").first();
  await expect(first).toContainText("Button");
  await expect(first).toHaveAttribute("href", "/docs/components/button");
  await expect(first).toHaveAttribute("tabindex", "-1");
  await expect(first).toHaveAttribute("data-highlighted", "");
  await expect(dialog.locator(".docs-search-footer")).toBeVisible();

  const firstId = await input.getAttribute("aria-activedescendant");
  await input.press("ArrowDown");
  await expect(input).not.toHaveAttribute("aria-activedescendant", firstId!);
  await input.press("Home");
  await expect(input).toHaveAttribute("aria-activedescendant", firstId!);

  await input.press("Enter");
  await expect(page).toHaveURL(/\/docs\/components\/button$/);
  await expect(dialog).toBeHidden();
});

test("search shortcuts toggle the palette and ignore editable fields", async ({ page }) => {
  await page.goto("/docs");
  const dialog = page.getByRole("dialog", { name: "Search documentation" });

  await page.keyboard.press("/");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeHidden();

  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole("combobox", { name: "Search documentation" });
  await input.fill("button");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.keyboard.press("/");
  await expect(dialog).toBeVisible();
  await expect(input).toHaveValue("");
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();

  await page.evaluate(() => {
    const input = document.createElement("input");
    input.setAttribute("aria-label", "Temporary editable field");
    document.body.append(input);
    input.focus();
  });
  await page.keyboard.press("/");
  await expect(dialog).toBeHidden();
});

test("search finds heading anchors and clears an empty result state", async ({ page }) => {
  await page.goto("/docs/components/button");
  await page.getByRole("button", { name: "Search..." }).click();
  const dialog = page.getByRole("dialog", { name: "Search documentation" });
  const input = dialog.getByRole("combobox", { name: "Search documentation" });

  await input.fill("installation");
  await expect(dialog.locator('[role="option"][href="/docs/installation"]')).toHaveCount(1);

  await input.fill("rounded button");
  const heading = dialog.getByRole("option", { name: /Rounded/ });
  await expect(heading).toHaveAttribute("href", "/docs/components/button#rounded");
  await heading.click();
  await expect(page).toHaveURL(/\/docs\/components\/button#rounded$/);
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "Search..." }).click();
  await input.fill("zzzz-not-a-result");
  await expect(dialog.getByText(/No results for/)).toBeVisible();
  await dialog.getByRole("button", { name: "Clear search" }).click();
  await expect(input).toHaveValue("");
  await expect(dialog.getByText("Suggested", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("option")).toHaveCount(8);
});

test.describe("mobile search", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("icon trigger opens a contained modal and locks background scroll", async ({ page }) => {
    await page.goto("/docs");
    const trigger = page.getByRole("button", { name: "Search..." });
    await expect(trigger).toBeVisible();
    await expect(trigger.locator(".docs-search-trigger-label")).not.toBeVisible();
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Search documentation" });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThan(0);
    expect(box!.y).toBeGreaterThan(0);
    expect(box!.width).toBeLessThanOrEqual(390);
    expect(box!.height).toBeLessThanOrEqual(844);
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
  });
});

test("axe: open search palette", async ({ page }) => {
  await page.goto("/docs");
  await page.getByRole("button", { name: "Search..." }).click();
  await expect(page.getByRole("dialog", { name: "Search documentation" })).toBeVisible();
  await page.addStyleTag({
    content: "*, *::before, *::after { transition: none !important; animation: none !important; }"
  });

  const results = await new AxeBuilder({ page })
    .include("#docs-search-dialog")
    .withTags(tags)
    .analyze();
  const violations = blocking(results.violations);
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
