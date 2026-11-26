import { expect, test, type Locator, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

function command(page: Page, title: string) {
  return page.locator(`[data-fixture="command"] [data-example="${title}"]`);
}

function option(fixture: Locator, label: string) {
  return fixture.locator("[role='option']").filter({ hasText: label });
}

async function openCommand(page: Page, title: string) {
  const fixture = command(page, title);
  await fixture.locator("button[data-open-dialog]").click();
  const dialog = fixture.locator("dialog");
  await expect(dialog).toHaveJSProperty("open", true);
  const input = fixture.locator("[role='combobox']");
  await expect(input).toBeFocused();
  return { fixture, dialog, input };
}

test("command links its input and skips disabled options without wrapping", async ({
  page
}) => {
  const fixture = command(page, "Default");
  const input = fixture.locator("[role='combobox']");
  const calendar = option(fixture, "Calendar");
  const searchEmoji = option(fixture, "Search Emoji");
  const calculator = option(fixture, "Calculator");
  const profile = option(fixture, "Profile");
  const settings = option(fixture, "Settings");

  await expect(input).toHaveAttribute("aria-controls", "demo-command-listbox-1");
  await expect(input).toHaveAttribute("aria-expanded", "true");
  await expect(input).toHaveAttribute("aria-autocomplete", "list");

  await input.focus();
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await expect(input).toHaveAttribute(
    "aria-activedescendant",
    (await calendar.getAttribute("id")) ?? ""
  );
  await expect(calendar).not.toHaveAttribute("aria-selected");

  await page.keyboard.press("ArrowDown");
  await expect(searchEmoji).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("ArrowDown");
  await expect(profile).toHaveAttribute("data-highlighted", "");
  await expect(calculator).toHaveAttribute("aria-disabled", "true");
  await expect(calculator).not.toHaveAttribute("data-highlighted");

  await calculator.dispatchEvent("pointermove");
  await expect(profile).toHaveAttribute("data-highlighted", "");
  await expect(calculator).not.toHaveAttribute("data-highlighted");

  await page.keyboard.press("End");
  await expect(settings).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("ArrowDown");
  await expect(settings).toHaveAttribute("data-highlighted", "");

  await page.keyboard.press("Home");
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("ArrowUp");
  await expect(calendar).toHaveAttribute("data-highlighted", "");
});

test("command fuzzy ranks label matches and restores authored order and hidden state", async ({
  page
}) => {
  const { fixture, input } = await openCommand(page, "Scrollable");
  const listbox = fixture.locator("[role='listbox']");
  const documents = option(fixture, "Documents");
  const deleteItem = option(fixture, "Delete");
  const separator = listbox.locator("[role='separator']").first();
  const empty = listbox.locator("[data-slot='empty']");

  await documents.evaluate((element) => element.setAttribute("hidden", ""));
  await separator.evaluate((element) => element.setAttribute("hidden", ""));

  const readOrder = () =>
    listbox.evaluate((element) => ({
      groups: [...element.querySelectorAll("[role='group']")].map(
        (group) => group.querySelector("[data-slot='label']")?.textContent?.trim() ?? ""
      ),
      options: [...element.querySelectorAll("[role='option']")].map(
        (item) => item.querySelector("[data-slot='text']")?.textContent?.trim() ?? ""
      )
    }));
  const originalOrder = await readOrder();

  await input.fill("de");

  await expect(deleteItem).toBeVisible();
  await expect(deleteItem).toHaveAttribute("data-highlighted", "");
  await expect(documents).toBeVisible();
  await expect(
    listbox.locator("[role='option']:visible").first().locator("[data-slot='text']")
  ).toHaveText("Delete");
  await expect(listbox.locator("[role='group']:visible").first()).toContainText("Actions");
  await expect(listbox.locator("[role='separator']:visible")).toHaveCount(0);
  await expect(empty).toHaveJSProperty("hidden", true);

  await input.fill("");

  expect(await readOrder()).toEqual(originalOrder);
  await expect(documents).toHaveJSProperty("hidden", true);
  await expect(separator).toHaveJSProperty("hidden", true);
  await expect(listbox.locator("[role='separator']").nth(1)).toHaveJSProperty(
    "hidden",
    false
  );
  await expect(empty).toHaveJSProperty("hidden", true);

  const home = option(fixture, "Home");
  const inbox = option(fixture, "Inbox");
  await expect(home).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("ArrowDown");
  await expect(inbox).toHaveAttribute("data-highlighted", "");
});

test("command hides separators during search and shows empty only for zero matches", async ({
  page
}) => {
  const fixture = command(page, "Default");
  const input = fixture.locator("[role='combobox']");
  const listbox = fixture.locator("[role='listbox']");
  const calendar = option(fixture, "Calendar");
  const calculator = option(fixture, "Calculator");
  const separator = listbox.locator("[role='separator']");
  const empty = listbox.locator("[data-slot='empty']");

  await input.focus();
  await input.fill("cal");

  await expect(calendar).toBeVisible();
  await expect(calculator).toBeVisible();
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await expect(separator).toHaveJSProperty("hidden", true);
  await expect(empty).toHaveJSProperty("hidden", true);

  await input.fill("calc");
  await expect(calculator).toBeVisible();
  await expect(calendar).toHaveJSProperty("hidden", true);
  await expect(empty).toHaveJSProperty("hidden", true);
  await expect(listbox.locator("[data-highlighted]")).toHaveCount(0);
  await expect(input).not.toHaveAttribute("aria-activedescendant");

  await page.evaluate(() => {
    (window as any).__commandDisabledClicks = 0;
  });
  await calculator.evaluate((element) => {
    element.addEventListener("click", () => {
      (window as any).__commandDisabledClicks += 1;
    });
  });
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => (window as any).__commandDisabledClicks)).toBe(0);

  await input.fill("zzzz");
  await expect(fixture.locator("[role='option']:visible")).toHaveCount(0);
  await expect(empty).toBeVisible();
  await expect(listbox.locator("[data-highlighted]")).toHaveCount(0);
  await expect(input).not.toHaveAttribute("aria-activedescendant");

  await input.fill("");
  await expect(calendar).toBeVisible();
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await expect(calculator).toBeVisible();
  await expect(separator).toHaveJSProperty("hidden", false);
  await expect(empty).toHaveJSProperty("hidden", true);
});

test("command supports group and Meta or Control navigation without wrapping", async ({
  page
}) => {
  const { input } = await openCommand(page, "Groups");
  const fixture = command(page, "Groups");
  const calendar = option(fixture, "Calendar");
  const profile = option(fixture, "Profile");
  const settings = option(fixture, "Settings");

  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Alt+ArrowDown");
  await expect(profile).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Alt+ArrowDown");
  await expect(profile).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Alt+ArrowUp");
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Alt+ArrowUp");
  await expect(calendar).toHaveAttribute("data-highlighted", "");

  await page.keyboard.press("Control+ArrowDown");
  await expect(settings).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Control+ArrowUp");
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Meta+ArrowDown");
  await expect(settings).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Meta+ArrowUp");
  await expect(calendar).toHaveAttribute("data-highlighted", "");

  await page.keyboard.press("End");
  await expect(settings).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Home");
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await expect(input).toHaveAttribute(
    "aria-activedescendant",
    (await calendar.getAttribute("id")) ?? ""
  );
});

test("command Enter clicks the highlighted option and leaves selection and closing to the app", async ({
  page
}) => {
  const { fixture, dialog, input } = await openCommand(page, "Basic");
  const calendar = option(fixture, "Calendar");
  const calculator = option(fixture, "Calculator");

  await page.evaluate(() => {
    (window as any).__commandClicks = [];
  });
  for (const item of [calendar, calculator]) {
    await item.evaluate((element) => {
      element.addEventListener("click", () => {
        const label = element.querySelector("[data-slot='text']")?.textContent?.trim();
        (window as any).__commandClicks.push(label);
      });
    });
  }

  await input.fill("cal");
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Enter");

  expect(await page.evaluate(() => (window as any).__commandClicks)).toEqual(["Calendar"]);
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(input).toHaveValue("cal");
  await expect(calendar).not.toHaveAttribute("aria-selected");

  await page.keyboard.press("ArrowDown");
  await expect(calculator).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => (window as any).__commandClicks)).toEqual([
    "Calendar",
    "Calculator"
  ]);
  await expect(dialog).toHaveJSProperty("open", true);
});

test("command matches option labels rather than shortcut text", async ({ page }) => {
  const { fixture, input } = await openCommand(page, "Shortcuts");
  const listbox = fixture.locator("[role='listbox']");
  const profile = option(fixture, "Profile");
  const empty = listbox.locator("[data-slot='empty']");

  await input.fill("⌘p");
  await expect(fixture.locator("[role='option']:visible")).toHaveCount(0);
  await expect(empty).toBeVisible();

  await input.fill("pro");
  await expect(profile).toBeVisible();
  await expect(profile).toHaveAttribute("data-highlighted", "");
  await expect(empty).toHaveJSProperty("hidden", true);
});

test("command excludes natively disabled options from navigation and pointer highlighting", async ({
  page
}) => {
  const { fixture, input } = await openCommand(page, "Basic");
  const calendar = option(fixture, "Calendar");
  const searchEmoji = option(fixture, "Search Emoji");
  const calculator = option(fixture, "Calculator");

  await searchEmoji.evaluate((element) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "option");
    button.disabled = true;
    button.innerHTML = element.innerHTML;
    element.replaceWith(button);
  });
  const disabled = fixture.locator("button[role='option']");

  await input.focus();
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("ArrowDown");
  await expect(calculator).toHaveAttribute("data-highlighted", "");
  await expect(disabled).not.toHaveAttribute("data-highlighted");

  await page.keyboard.press("Home");
  await disabled.dispatchEvent("pointermove");
  await expect(calendar).toHaveAttribute("data-highlighted", "");
  await expect(disabled).not.toHaveAttribute("data-highlighted");

  await page.keyboard.press("End");
  await expect(calculator).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("ArrowDown");
  await expect(calculator).toHaveAttribute("data-highlighted", "");
});
