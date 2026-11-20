import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("message scroller follows inserted messages and preserves reading position", async ({
  page
}) => {
  const fixture = page.locator(
    '[data-fixture="message-scroller"] [data-example="Default"]'
  );
  const root = fixture.locator(".message-scroller");
  const viewport = root.locator(".message-scroller-viewport");
  const content = root.locator(
    ".message-scroller-viewport > [data-slot='content']"
  );
  const jump = root.getByRole("button", { name: "Jump to latest" });

  await root.evaluate((element) => {
    (window as any).__followingChanges = [];
    element.addEventListener("change", (event) => {
      (window as any).__followingChanges.push((event as CustomEvent).detail);
    });
  });

  await viewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(jump).toBeHidden();
  await expect
    .poll(() =>
      page.evaluate(() => (window as any).__followingChanges.at(-1))
    )
    .toEqual({ following: true });

  await viewport.evaluate((element) => {
    element.scrollTop = 0;
  });
  await expect(jump).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => (window as any).__followingChanges.at(-1))
    )
    .toEqual({ following: false });

  await content.evaluate((element) => {
    const message = document.createElement("div");
    message.className = "message";
    message.setAttribute("data-align", "start");
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const text = document.createElement("div");
    text.setAttribute("data-slot", "content");
    text.textContent = "Inserted while reading";
    bubble.append(text);
    message.append(bubble);
    element.append(message);
  });

  await expect(content).toContainText("Inserted while reading");
  await expect(jump).toBeVisible();
  expect(await viewport.evaluate((element) => element.scrollTop)).toBeLessThan(
    24
  );

  await jump.click();
  await expect(jump).toBeHidden();
  await expect
    .poll(() => viewport.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);

  await content.evaluate((element) => {
    const message = document.createElement("div");
    message.className = "message";
    message.setAttribute("data-align", "end");
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const text = document.createElement("div");
    text.setAttribute("data-slot", "content");
    text.textContent = "Inserted while following";
    bubble.append(text);
    message.append(bubble);
    element.append(message);
  });

  await expect(content).toContainText("Inserted while following");
  await expect
    .poll(() =>
      viewport.evaluate(
        (element) =>
          element.scrollHeight - element.scrollTop - element.clientHeight
      )
    )
    .toBeLessThanOrEqual(24);
  await expect(jump).toBeHidden();
  expect(await page.evaluate(() => (window as any).__followingChanges.at(-1))).toEqual(
    { following: true }
  );
});
