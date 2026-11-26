import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("dropdown menu supports roving focus, typeahead and Escape", async ({ page }) => {
  const fixture = page.locator('[data-fixture="dropdown-menu"] [data-example="Default"]');
  const trigger = fixture.locator("button[aria-haspopup='menu']");
  const panel = fixture.locator("[data-popover]");
  const items = panel.locator("[role='menuitem']");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(items.nth(0)).toBeFocused();

  await page.keyboard.press("ArrowDown");
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(items.nth(0)).toBeFocused();

  await page.keyboard.press("b");
  await expect(items.nth(1)).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();
});

test("dropdown submenu opens and closes with horizontal arrows", async ({ page }) => {
  const fixture = page.locator('[data-fixture="dropdown-menu"] [data-example="Submenu"]');
  const trigger = fixture.locator("button[aria-haspopup='menu']").first();
  const rootMenu = fixture.locator("[data-popover]").first();

  await trigger.click();
  await expect(rootMenu.locator("[role='menuitem']").first()).toBeFocused();
  const submenuTrigger = rootMenu.locator("[aria-controls='demo-dropdown-submenu-invite']");
  await submenuTrigger.focus();
  await page.keyboard.press("ArrowRight");

  const submenu = page.locator("#demo-dropdown-submenu-invite");
  await expect(submenu).toHaveAttribute("aria-hidden", "false");
  await expect(submenu.locator("[role='menuitem']").first()).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await expect(submenu).toHaveAttribute("aria-hidden", "true");
  await expect(submenuTrigger).toBeFocused();
});

test("checkable menu items toggle aria-checked and radio clears siblings", async ({ page }) => {
  const checkboxes = page.locator(
    '[data-fixture="dropdown-menu"] [data-example="Checkboxes"]'
  );
  await checkboxes.locator("button[aria-haspopup='menu']").click();
  const unchecked = checkboxes.locator("[role='menuitemcheckbox']").nth(2);
  await expect(unchecked).toHaveAttribute("aria-checked", "false");
  await unchecked.click();
  await expect(unchecked).toHaveAttribute("aria-checked", "true");

  const radio = page.locator(
    '[data-fixture="dropdown-menu"] [data-example="Radio group"]'
  );
  await radio.locator("button[aria-haspopup='menu']").click();
  const people = radio.locator("[role='group']").first();
  const second = people.locator("[role='menuitemradio']").nth(1);
  await second.click();
  await expect(second).toHaveAttribute("aria-checked", "true");
  await expect(people.locator("[role='menuitemradio']").first()).toHaveAttribute(
    "aria-checked",
    "false"
  );
});

test("menubar moves across triggers and switches menus on hover", async ({ page }) => {
  const fixture = page.locator('[data-fixture="menubar"] [data-example="Default"]');
  const menubar = fixture.locator("[role='menubar']");
  const triggers = menubar.locator(".menubar-item > button[aria-haspopup='menu']");
  const panels = menubar.locator(".menubar-item > [data-popover]");

  await triggers.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(triggers.nth(1)).toBeFocused();

  await page.keyboard.press("ArrowDown");
  await expect(panels.nth(1)).toHaveAttribute("aria-hidden", "false");
  await expect(panels.nth(1).locator("[role='menuitem']").first()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(panels.nth(1)).toHaveAttribute("aria-hidden", "true");
  await expect(triggers.nth(1)).toBeFocused();

  await triggers.nth(0).click();
  await expect(panels.nth(0)).toHaveAttribute("aria-hidden", "false");
  await triggers.nth(1).hover();
  await expect(panels.nth(1)).toHaveAttribute("aria-hidden", "false");
  await expect(panels.nth(0)).toHaveAttribute("aria-hidden", "true");
});

test("menubar horizontal arrows follow RTL direction", async ({ page }) => {
  const rtl = page.locator('[data-fixture="menubar"] [data-example="Right-to-left"]');
  const triggers = rtl.locator(".menubar-item > button[aria-haspopup='menu']");
  await triggers.nth(0).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(triggers.nth(1)).toBeFocused();
});

test("menubar submenu Escape cancels a pending hover open", async ({ page }) => {
  const fixture = page.locator('[data-fixture="menubar"] [data-example="Default"]');
  const triggers = fixture.locator(".menubar-item > button[aria-haspopup='menu']");
  const file = fixture.locator("[data-popover]").first();
  const share = file.getByRole("menuitem", { name: "Share", exact: true });
  const submenu = page.locator("#demo-menubar-file-share");

  await triggers.nth(0).click();
  await share.click();
  await expect(submenu).toHaveAttribute("aria-hidden", "false");

  await page.keyboard.press("Escape");
  await expect(submenu).toHaveAttribute("aria-hidden", "true");
  await expect(share).toBeFocused();
  await expect(file).toHaveAttribute("aria-hidden", "false");

  // A hover timer armed before the click must not reopen the submenu.
  await page.waitForTimeout(250);
  await expect(submenu).toHaveAttribute("aria-hidden", "true");

  await page.keyboard.press("Escape");
  await expect(file).toHaveAttribute("aria-hidden", "true");
  await expect(triggers.nth(0)).toBeFocused();
});

test("navigation menu opens with ArrowDown, tabs links and closes on Escape", async ({
  page
}) => {
  const fixture = page.locator(
    '[data-fixture="navigation-menu"] [data-example="Default"]'
  );
  const trigger = fixture.locator("button[aria-controls='demo-nav-starting']");
  const panel = page.locator("#demo-nav-starting");

  await trigger.click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("ArrowDown");
  const links = panel.locator("a");
  await expect(links.nth(0)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(links.nth(1)).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();
});

test("context menu opens on right-click and Shift+F10", async ({ page }) => {
  const fixture = page.locator('[data-fixture="context-menu"] [data-example="Default"]');
  const area = fixture.locator("[aria-haspopup='menu']");
  const menu = page.locator("#demo-context-1");

  await area.click({ button: "right", position: { x: 40, y: 40 } });
  await expect(menu).toHaveAttribute("aria-hidden", "false");
  await expect(menu.locator("[role='menuitem']").first()).toBeFocused();
  await expect
    .poll(() => menu.evaluate((element) => element.style.getPropertyValue("--context-x")))
    .not.toBe("");

  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-hidden", "true");
  await expect(area).toBeFocused();

  await area.focus();
  await page.keyboard.press("Shift+F10");
  await expect(menu).toHaveAttribute("aria-hidden", "false");
});
