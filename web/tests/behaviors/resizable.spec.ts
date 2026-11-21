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
  await expect(handle).not.toBeFocused();
});

test("resizable click focuses the handle without dispatching change", async ({
  page
}) => {
  const fixture = page.locator('[data-fixture="resizable"] [data-example="Default"]');
  const root = fixture.locator(".resizable");
  const handle = root.locator("[data-slot='handle']");

  await root.evaluate((element) => {
    (window as any).__resizeChanges = 0;
    (window as any).__resizeClicks = 0;
    element.addEventListener("change", () => {
      (window as any).__resizeChanges += 1;
    });
    element.querySelector("[data-slot='handle']")?.addEventListener("click", () => {
      (window as any).__resizeClicks += 1;
    });
  });

  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  if (!box) throw new Error("missing resizable handle");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

  await expect(handle).toBeFocused();
  expect(await page.evaluate(() => (window as any).__resizeChanges)).toBe(0);
  expect(await page.evaluate(() => (window as any).__resizeClicks)).toBe(1);
});

test("resizable recovers from a missed pointerup", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"] [data-example="Default"]');
  const root = fixture.locator(".resizable");
  const handle = root.locator("[data-slot='handle']");

  await root.evaluate((element) => {
    (window as any).__resizeChanges = 0;
    (window as any).__resizePointerId = null;
    element.addEventListener("change", () => {
      (window as any).__resizeChanges += 1;
    });
    document.addEventListener(
      "pointerdown",
      (event) => {
        if ((event.target as Element).closest("[data-slot='handle']")) {
          (window as any).__resizePointerId = event.pointerId;
        }
      },
      { capture: true, once: true }
    );
  });

  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  if (!box) throw new Error("missing resizable handle");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2);

  await page.evaluate(() => {
    document
      .querySelector("[data-example='Default'] [data-slot='handle']")
      ?.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          buttons: 0,
          clientX: 10,
          clientY: 10,
          pointerId: (window as any).__resizePointerId,
          pointerType: "mouse"
        })
      );
  });

  await expect(handle).not.toHaveAttribute("aria-valuenow", "50");
  await expect(handle).not.toBeFocused();
  expect(await page.evaluate(() => (window as any).__resizeChanges)).toBe(1);

  await page.mouse.up();
  expect(await page.evaluate(() => (window as any).__resizeChanges)).toBe(1);
});

test("resizable finishes when pointer capture is lost", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"] [data-example="Default"]');
  const root = fixture.locator(".resizable");
  const handle = root.locator("[data-slot='handle']");

  await root.evaluate((element) => {
    (window as any).__resizeChanges = 0;
    (window as any).__resizePointerId = null;
    element.addEventListener("change", () => {
      (window as any).__resizeChanges += 1;
    });
    document.addEventListener(
      "pointerdown",
      (event) => {
        if ((event.target as Element).closest("[data-slot='handle']")) {
          (window as any).__resizePointerId = event.pointerId;
        }
      },
      { capture: true, once: true }
    );
  });

  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  if (!box) throw new Error("missing resizable handle");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2);

  const pointerId = await page.evaluate(
    () => (window as any).__resizePointerId
  );
  await expect
    .poll(() => handle.evaluate((element, id) => element.hasPointerCapture(id), pointerId))
    .toBe(true);

  await handle.evaluate((element, id) => {
    element.dispatchEvent(
      new PointerEvent("lostpointercapture", {
        pointerId: id,
        pointerType: "mouse"
      })
    );
  }, pointerId);

  await expect.poll(() =>
    page.evaluate(() => (window as any).__resizeChanges)
  ).toBe(1);
  await expect(handle).not.toHaveAttribute("aria-valuenow", "50");
  await expect(handle).not.toBeFocused();

  await page.mouse.up();
  expect(await page.evaluate(() => (window as any).__resizeChanges)).toBe(1);
});

test("resizable keyboard arrows, Home and End stay in sync", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"] [data-example="Default"]');
  const root = fixture.locator(".resizable");
  const handle = root.locator("[data-slot='handle']");

  await handle.focus();
  await page.keyboard.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "55");

  await page.keyboard.press("Shift+ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "65");

  await page.keyboard.press("Home");
  await expect(handle).toHaveAttribute("aria-valuenow", "0");

  await page.keyboard.press("End");
  await expect(handle).toHaveAttribute("aria-valuenow", "100");

  await page.keyboard.press("ArrowLeft");
  await expect(handle).toHaveAttribute("aria-valuenow", "95");
});

test("vertical resizable responds to ArrowDown and ArrowUp", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"] [data-example="Vertical"]');
  const root = fixture.locator(".resizable");
  const handle = root.locator("[data-slot='handle']");

  await handle.focus();
  await page.keyboard.press("ArrowDown");
  await expect(handle).toHaveAttribute("aria-valuenow", "30");

  await page.keyboard.press("ArrowUp");
  await expect(handle).toHaveAttribute("aria-valuenow", "25");
});

test("resizable expands its pointer target", async ({ page }) => {
  const horizontal = page.locator(
    '[data-fixture="resizable"] [data-example="Default"] [data-slot=\'handle\']'
  );
  const horizontalTarget = await horizontal.evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return { height: parseFloat(style.height), width: parseFloat(style.width) };
  });
  expect(horizontalTarget.width).toBeGreaterThanOrEqual(9.5);

  const vertical = page.locator(
    '[data-fixture="resizable"] [data-example="Vertical"] [data-slot=\'handle\']'
  );
  const verticalTarget = await vertical.evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return { height: parseFloat(style.height), width: parseFloat(style.width) };
  });
  expect(verticalTarget.height).toBeGreaterThanOrEqual(9.5);
});

test("resizable syncs initial sizes and clamps constraints", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"]');
  const initial = fixture.locator('[data-example="Initial sizes"]');
  const initialHandle = initial.locator("[data-slot='handle']");
  const initialSizes = await initial
    .locator(".resizable > .resizable-panel")
    .evaluateAll((panels) =>
      panels.map((panel) =>
        Number.parseFloat(
          getComputedStyle(panel).getPropertyValue("--panel-size")
        )
      )
    );

  await expect(initialHandle).toHaveAttribute("aria-valuenow", "40");
  expect(initialSizes[0]).toBeCloseTo(40, 0);
  expect(initialSizes[0] + initialSizes[1]).toBeCloseTo(100, 1);

  const constraints = fixture.locator('[data-example="Constraints"]');
  const handle = constraints.locator("[data-slot='handle']");

  await expect(handle).toHaveAttribute("aria-valuenow", "30");
  await handle.focus();
  await page.keyboard.press("Home");
  await expect(handle).toHaveAttribute("aria-valuenow", "20");

  await page.keyboard.press("End");
  await expect(handle).toHaveAttribute("aria-valuenow", "80");

  await page.keyboard.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "80");
});

test("resizable clamps a focus-time split to its range", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"]');
  await fixture.evaluate((element) => {
    const section = document.createElement("section");
    section.dataset.example = "Clamped start";
    section.innerHTML = `
      <div class="resizable" style="height: 8rem">
        <div class="resizable-panel" style="--panel-size: 1"><p>One</p></div>
        <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="Resize clamped panels" aria-valuenow="10" aria-valuemin="20" aria-valuemax="80" tabindex="0"></div>
        <div class="resizable-panel" style="--panel-size: 9"><p>Two</p></div>
      </div>`;
    element.append(section);
  });

  const section = fixture.locator('[data-example="Clamped start"]');
  const handle = section.locator("[data-slot='handle']");
  await handle.focus();
  await expect(handle).toHaveAttribute("aria-valuenow", "20");

  const sizes = await section
    .locator(".resizable > .resizable-panel")
    .evaluateAll((panels) =>
      panels.map((panel) =>
        Number.parseFloat(
          getComputedStyle(panel).getPropertyValue("--panel-size")
        )
      )
    );
  expect(sizes[0]).toBeCloseTo(20, 0);
  expect(sizes[0] + sizes[1]).toBeCloseTo(100, 1);
});

test("resizable arrows follow right-to-left direction", async ({ page }) => {
  const fixture = page.locator(
    '[data-fixture="resizable"] [data-example="Right-to-left"]'
  );
  const handle = fixture.locator("[data-slot='handle']");

  await handle.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(handle).toHaveAttribute("aria-valuenow", "55");

  await page.keyboard.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "50");
});

test("nested resizable groups keep their own panel ratios", async ({ page }) => {
  const fixture = page.locator('[data-fixture="resizable"] [data-example="Nested"]');
  const outer = fixture.locator(".resizable").first();
  const inner = outer.locator(".resizable");
  const outerHandle = outer.locator(":scope > [data-slot='handle']");
  const innerHandle = inner.locator(":scope > [data-slot='handle']");
  const innerSizes = () =>
    inner
      .locator(":scope > .resizable-panel")
      .evaluateAll((panels) =>
        panels.map((panel) =>
          Number.parseFloat(
            getComputedStyle(panel).getPropertyValue("--panel-size")
          )
        )
      );

  await expect(innerHandle).toHaveAttribute("aria-valuenow", "25");
  expect(await innerSizes()).toEqual([25, 75]);

  await outerHandle.scrollIntoViewIfNeeded();
  const outerBox = await outerHandle.boundingBox();
  if (!outerBox) throw new Error("missing outer resizable handle");
  await page.mouse.move(
    outerBox.x + outerBox.width / 2,
    outerBox.y + outerBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    outerBox.x + outerBox.width / 2 + 40,
    outerBox.y + outerBox.height / 2
  );
  await page.mouse.up();

  await expect(outerHandle).not.toHaveAttribute("aria-valuenow", "50");
  await expect(innerHandle).toHaveAttribute("aria-valuenow", "25");
  expect(await innerSizes()).toEqual([25, 75]);

  const innerBox = await innerHandle.boundingBox();
  if (!innerBox) throw new Error("missing inner resizable handle");
  await page.mouse.move(
    innerBox.x + innerBox.width / 2,
    innerBox.y + innerBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    innerBox.x + innerBox.width / 2,
    innerBox.y + innerBox.height / 2 + 30
  );
  await page.mouse.up();

  await expect(innerHandle).not.toHaveAttribute("aria-valuenow", "25");
  const sizes = await innerSizes();
  expect(sizes[0]).toBeGreaterThan(25);
  expect(sizes[0] + sizes[1]).toBeCloseTo(100, 1);
});
