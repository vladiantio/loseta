import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("select opens, navigates and selects with the keyboard", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Default"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-default-panel");
  const options = panel.locator("[role='option']");
  const hidden = fixture.locator("input[data-slot='input']");

  await page.evaluate(() => {
    (window as any).__selectChange = null;
    document
      .querySelector('[data-fixture="select"] [data-example="Default"] .select')
      ?.addEventListener("change", (event) => {
        (window as any).__selectChange = (event as CustomEvent).detail;
      });
  });

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(options.nth(0)).toHaveAttribute("data-highlighted", "");
  await expect(trigger).toHaveAttribute("aria-activedescendant", /.+/);

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Enter");

  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();
  await expect(fixture.locator("[data-slot='value']")).toHaveText("Banana");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(hidden).toHaveValue("banana");
  expect(await page.evaluate(() => (window as any).__selectChange)).toEqual({
    value: "banana"
  });
});

test("select typeahead and dismissal", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Default"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-default-panel");
  const options = panel.locator("[role='option']");

  await trigger.click();
  await page.keyboard.press("p");
  await expect(options.nth(4)).toHaveAttribute("data-highlighted", "");

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(0)).toHaveAttribute("data-highlighted", "");

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.locator('[data-fixture="select"] > h2').click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("select syncs the authored selection on load", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Small, selected"]');
  const trigger = fixture.locator("[role='combobox']");
  const selected = fixture.locator("[role='option'][aria-selected='true']");

  await expect(trigger).not.toHaveAttribute("data-placeholder", "");
  await expect(fixture.locator("[data-slot='value']")).toHaveText("Apple");
  await expect(fixture.locator("input[data-slot='input']")).toHaveValue("apple");
  await expect(selected).toHaveAttribute("data-value", "apple");
});

test("select aligns the selected item with the trigger by default", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Small, selected"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-small-panel");

  await trigger.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  const triggerBox = await trigger.boundingBox();
  const panelBox = await panel.boundingBox();
  const valueCenter = await trigger
    .locator("[data-slot='value']")
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
  const selectedCenter = await fixture
    .locator("[role='option'][aria-selected='true'] [data-slot='text']")
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });

  expect(Math.abs(valueCenter - selectedCenter)).toBeLessThan(2);
  expect(panelBox!.y).toBeLessThanOrEqual(triggerBox!.y + 2);

  await page.keyboard.press("Escape");
  await fixture
    .locator(".select")
    .evaluate((element) => element.setAttribute("data-align-trigger", "false"));
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await expect
    .poll(async () => (await panel.boundingBox())?.y ?? 0)
    .toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height);
});

test("select closes without the panel transition in aligned mode", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Small, selected"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-small-panel");

  await trigger.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  const closing = await panel.evaluate((element) => {
    const option = element.querySelectorAll("[role='option']")[1];
    option.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    return {
      hidden: element.getAttribute("aria-hidden"),
      transition: getComputedStyle(element).transitionDuration,
      visibility: getComputedStyle(element).visibility,
      opacity: getComputedStyle(element).opacity
    };
  });

  expect(closing.hidden).toBe("true");
  expect(closing.transition).toBe("0s");
  expect(closing.visibility).toBe("hidden");
  expect(closing.opacity).toBe("0");
  await expect(trigger.locator("[data-slot='value']")).toHaveText("Banana");
});

test("select aligns the first item when nothing is selected", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Default"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-default-panel");

  await trigger.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  const triggerBox = await trigger.boundingBox();
  const panelBox = await panel.boundingBox();
  const valueCenter = await trigger
    .locator("[data-slot='value']")
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
  const firstCenter = await panel
    .locator("[role='option'] [data-slot='text']")
    .first()
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });

  expect(Math.abs(valueCenter - firstCenter)).toBeLessThan(2);
  expect(panelBox!.y).toBeLessThanOrEqual(triggerBox!.y + 2);
});

test("select keeps the first group label visible when aligning the first row", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Scrollable"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-scrollable-panel");
  const listbox = panel.locator("[role='listbox']");

  await trigger.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  const triggerBox = await trigger.boundingBox();
  const panelBox = await panel.boundingBox();
  const labelBox = await panel.locator("[data-slot='label']").first().boundingBox();
  const valueCenter = await trigger
    .locator("[data-slot='value']")
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
  const firstCenter = await panel
    .locator("[role='option'] [data-slot='text']")
    .first()
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });

  expect(Math.abs(valueCenter - firstCenter)).toBeLessThan(2);
  expect(panelBox!.y).toBeLessThanOrEqual(triggerBox!.y + 2);
  expect(labelBox!.y).toBeGreaterThanOrEqual(panelBox!.y);
  expect(await listbox.evaluate((element) => element.scrollTop)).toBe(0);
  await expect(panel.locator("[data-slot='scroll-up']")).toBeHidden();
});

test("select aligns the last item in a long list", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Scrollable"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-scrollable-panel");
  const listbox = panel.locator("[role='listbox']");

  await trigger.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await panel
    .getByRole("option", { name: "Chile Standard Time", exact: true })
    .click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  const triggerBox = await trigger.boundingBox();
  const panelBox = await panel.boundingBox();
  const valueCenter = await trigger
    .locator("[data-slot='value']")
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
  const selectedCenter = await panel
    .locator("[role='option'][aria-selected='true'] [data-slot='text']")
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });

  expect(Math.abs(valueCenter - selectedCenter)).toBeLessThan(2);
  expect(panelBox!.y).toBeLessThanOrEqual(triggerBox!.y + 2);
  await expect(panel.locator("[data-slot='scroll-up']")).toBeVisible();
  await expect(panel.locator("[data-slot='scroll-down']")).toBeHidden();

  const scroll = await listbox.evaluate((element) => ({
    scrollTop: element.scrollTop,
    max: element.scrollHeight - element.clientHeight
  }));
  expect(scroll.scrollTop).toBe(scroll.max);
});

test("select hides a one-pixel overflow scrollbar in right-to-left content", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Right-to-left"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-rtl-panel");
  const listbox = panel.locator("[role='listbox']");

  await trigger.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  const state = await listbox.evaluate((element) => ({
    overflow: element.scrollHeight - element.clientHeight,
    overflowY: getComputedStyle(element).overflowY
  }));

  expect(state.overflow).toBeLessThanOrEqual(1);
  expect(state.overflowY).toBe("hidden");
});

test("select reveals scroll controls only while scrollable", async ({ page }) => {
  const fixture = page.locator('[data-fixture="select"] [data-example="Scrollable"]');
  const trigger = fixture.locator("[role='combobox']");
  const panel = page.locator("#demo-select-scrollable-panel");
  const listbox = panel.locator("[role='listbox']");
  const up = panel.locator("[data-slot='scroll-up']");
  const down = panel.locator("[data-slot='scroll-down']");

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");

  await listbox.evaluate((element) => {
    element.scrollTop = 0;
  });
  await expect(up).toBeHidden();
  await expect(down).toBeVisible();

  await down.dispatchEvent("click");
  await expect
    .poll(() => listbox.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await expect(up).toBeVisible();

  await listbox.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(down).toBeHidden();
});
