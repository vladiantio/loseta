import { expect, test } from "@playwright/test";

function fixture(page: import("@playwright/test").Page, title: string) {
  return page.locator(
    `[data-fixture="resizable"] [data-example="${title}"]`
  );
}

function sizes(locator: import("@playwright/test").Locator) {
  return locator.evaluateAll((panels) =>
    panels.map((panel) =>
      Number.parseFloat(
        getComputedStyle(panel).getPropertyValue("--panel-size")
      )
    )
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

test("resizable drags the active pair and dispatches every size", async ({
  page
}) => {
  const root = fixture(page, "Default").locator(".resizable").first();
  const handle = root.locator(":scope > [data-slot='handle']");
  const panels = root.locator(":scope > .resizable-panel");
  const inner = root.locator(".resizable").last();
  const innerSizes = inner.locator(":scope > .resizable-panel");

  await root.evaluate((element) => {
    (window as any).__resizeChange = null;
    element.addEventListener("change", (event) => {
      if (event.target === element) {
        (window as any).__resizeChange = (event as CustomEvent).detail;
      }
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
  const outerSizes = await sizes(panels);
  expect(outerSizes[0]).toBeGreaterThan(50);
  expect((outerSizes[0] ?? 0) + (outerSizes[1] ?? 0)).toBeCloseTo(100, 1);

  const detail = await page.evaluate(() => (window as any).__resizeChange);
  expect(detail.sizes).toHaveLength(2);
  expect(detail.sizes[0]).toBeGreaterThan(50);
  expect(detail.sizes[0] + detail.sizes[1]).toBeCloseTo(100, 1);
  await expect(handle).not.toBeFocused();

  await expect(inner.locator(":scope > [data-slot='handle']")).toHaveAttribute(
    "aria-valuenow",
    "25"
  );
  expect(await sizes(innerSizes)).toEqual([25, 75]);
});

test("resizable handle follows the pointer", async ({ page }) => {
  const root = fixture(page, "Handle").locator(".resizable");
  const handle = root.locator(":scope > [data-slot='handle']");

  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  if (!box) throw new Error("missing resizable handle");
  const startX = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(startX, y);
  await page.mouse.down();
  for (const distance of [20, 50, 80]) {
    await page.mouse.move(startX + distance, y);
    const moved = await handle.boundingBox();
    if (!moved) throw new Error("missing moved resizable handle");
    const center = moved.x + moved.width / 2;
    expect(Math.abs(center - (startX + distance))).toBeLessThanOrEqual(1);
  }
  await page.mouse.up();

  const verticalRoot = fixture(page, "Vertical").locator(".resizable");
  const verticalHandle = verticalRoot.locator(":scope > [data-slot='handle']");
  await verticalHandle.scrollIntoViewIfNeeded();
  const verticalBox = await verticalHandle.boundingBox();
  if (!verticalBox) throw new Error("missing vertical resizable handle");
  const x = verticalBox.x + verticalBox.width / 2;
  const startY = verticalBox.y + verticalBox.height / 2;

  await page.mouse.move(x, startY);
  await page.mouse.down();
  for (const distance of [15, 30]) {
    await page.mouse.move(x, startY + distance);
    const moved = await verticalHandle.boundingBox();
    if (!moved) throw new Error("missing moved vertical resizable handle");
    const center = moved.y + moved.height / 2;
    expect(Math.abs(center - (startY + distance))).toBeLessThanOrEqual(1);
  }
  await page.mouse.up();
});

test("resizable handle follows the pointer when panels have padding", async ({
  page
}) => {
  await fixture(page, "Handle").evaluate((element) => {
    const section = document.createElement("section");
    section.dataset.example = "Padded panels";
    section.innerHTML = `
      <div class="resizable" style="height: 8rem">
        <div class="resizable-panel" style="--panel-size: 50; padding: 1.5rem"><p>A</p></div>
        <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="Resize padded A and B" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
        <div class="resizable-panel" style="--panel-size: 50; padding: 1.5rem"><p>B</p></div>
      </div>`;
    element.append(section);
  });

  const root = fixture(page, "Padded panels").locator(".resizable");
  const handle = root.locator(":scope > [data-slot='handle']");
  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  if (!box) throw new Error("missing padded resizable handle");
  const startX = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(startX, y);
  await page.mouse.down();
  for (const distance of [20, 50, 80]) {
    await page.mouse.move(startX + distance, y);
    const moved = await handle.boundingBox();
    if (!moved) throw new Error("missing moved padded resizable handle");
    const center = moved.x + moved.width / 2;
    expect(Math.abs(center - (startX + distance))).toBeLessThanOrEqual(1);
  }
  await page.mouse.up();
});

test("resizable click focuses the handle without dispatching change", async ({
  page
}) => {
  const root = fixture(page, "Default").locator(".resizable").first();
  const handle = root.locator(":scope > [data-slot='handle']");

  await root.evaluate((element) => {
    (window as any).__resizeChanges = 0;
    (window as any).__resizeClicks = 0;
    element.addEventListener("change", (event) => {
      if (event.target === element) {
        (window as any).__resizeChanges += 1;
      }
    });
    element.querySelector(":scope > [data-slot='handle']")?.addEventListener(
      "click",
      () => {
        (window as any).__resizeClicks += 1;
      }
    );
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
  const root = fixture(page, "Default").locator(".resizable").first();
  const handle = root.locator(":scope > [data-slot='handle']");

  await root.evaluate((element) => {
    (window as any).__resizeChanges = 0;
    (window as any).__resizePointerId = null;
    element.addEventListener("change", (event) => {
      if (event.target === element) {
        (window as any).__resizeChanges += 1;
      }
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
  const root = fixture(page, "Default").locator(".resizable").first();
  const handle = root.locator(":scope > [data-slot='handle']");

  await root.evaluate((element) => {
    (window as any).__resizeChanges = 0;
    (window as any).__resizePointerId = null;
    element.addEventListener("change", (event) => {
      if (event.target === element) {
        (window as any).__resizeChanges += 1;
      }
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
    .poll(() =>
      handle.evaluate(
        (element, id) => element.hasPointerCapture(id),
        pointerId
      )
    )
    .toBe(true);

  await handle.evaluate((element, id) => {
    element.dispatchEvent(
      new PointerEvent("lostpointercapture", {
        pointerId: id,
        pointerType: "mouse"
      })
    );
  }, pointerId);

  await expect
    .poll(() => page.evaluate(() => (window as any).__resizeChanges))
    .toBe(1);
  await expect(handle).not.toHaveAttribute("aria-valuenow", "50");
  await expect(handle).not.toBeFocused();

  await page.mouse.up();
  expect(await page.evaluate(() => (window as any).__resizeChanges)).toBe(1);
});

test("resizable keyboard moves 5 percent and ignores Shift", async ({
  page
}) => {
  const root = fixture(page, "Default").locator(".resizable").first();
  const handle = root.locator(":scope > [data-slot='handle']");

  await handle.focus();
  await page.keyboard.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "55");

  await page.keyboard.press("Shift+ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "60");

  await page.keyboard.press("Home");
  await expect(handle).toHaveAttribute("aria-valuenow", "0");

  await page.keyboard.press("End");
  await expect(handle).toHaveAttribute("aria-valuenow", "100");

  await page.keyboard.press("ArrowLeft");
  await expect(handle).toHaveAttribute("aria-valuenow", "95");
});

test("vertical resizable responds to ArrowDown and ArrowUp", async ({
  page
}) => {
  const root = fixture(page, "Vertical").locator(".resizable");
  const handle = root.locator(":scope > [data-slot='handle']");

  await handle.focus();
  await page.keyboard.press("ArrowDown");
  await expect(handle).toHaveAttribute("aria-valuenow", "30");

  await page.keyboard.press("ArrowUp");
  await expect(handle).toHaveAttribute("aria-valuenow", "25");
});

test("resizable expands its pointer target", async ({ page }) => {
  const horizontal = fixture(page, "Default").locator(
    ".resizable > [data-slot='handle']"
  );
  const horizontalTarget = await horizontal.first().evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return {
      height: parseFloat(style.height),
      width: parseFloat(style.width),
      handle: parseFloat(getComputedStyle(element).width)
    };
  });
  expect(horizontalTarget.width).toBeGreaterThanOrEqual(9.5);
  expect(horizontalTarget.handle).toBeCloseTo(1, 1);

  const vertical = fixture(page, "Vertical").locator(
    ".resizable > [data-slot='handle']"
  );
  const verticalTarget = await vertical.evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return {
      height: parseFloat(style.height),
      width: parseFloat(style.width),
      handle: parseFloat(getComputedStyle(element).height)
    };
  });
  expect(verticalTarget.height).toBeGreaterThanOrEqual(9.5);
  expect(verticalTarget.handle).toBeCloseTo(1, 1);
});

test("resizable reports the reachable range from both panel limits", async ({
  page
}) => {
  const root = fixture(page, "Constraints").locator(".resizable");
  const handle = root.locator(":scope > [data-slot='handle']");

  await handle.focus();
  await expect(handle).toHaveAttribute("aria-valuenow", "30");
  await expect(handle).toHaveAttribute("aria-valuemin", "20");
  await expect(handle).toHaveAttribute("aria-valuemax", "80");

  await page.keyboard.press("Home");
  await expect(handle).toHaveAttribute("aria-valuenow", "20");

  await page.keyboard.press("End");
  await expect(handle).toHaveAttribute("aria-valuenow", "80");

  await page.keyboard.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "80");

  await fixture(page, "Constraints").evaluate((element) => {
    const section = document.createElement("section");
    section.dataset.example = "Reachable range";
    section.innerHTML = `
      <div class="resizable" style="height: 8rem">
        <div class="resizable-panel" style="--panel-size: 50"><p>A</p></div>
        <div data-slot="handle" role="separator" aria-orientation="vertical" aria-label="Resize A and B" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0"></div>
        <div class="resizable-panel" style="--panel-size: 50; --panel-min: 30; --panel-max: 70"><p>B</p></div>
      </div>`;
    element.append(section);
  });

  const reachable = fixture(page, "Reachable range").locator(
    ".resizable > [data-slot='handle']"
  );
  await reachable.focus();
  await expect(reachable).toHaveAttribute("aria-valuemin", "30");
  await expect(reachable).toHaveAttribute("aria-valuemax", "70");

  await page.keyboard.press("Home");
  await expect(reachable).toHaveAttribute("aria-valuenow", "30");

  await page.keyboard.press("End");
  await expect(reachable).toHaveAttribute("aria-valuenow", "70");
});

test("resizable arrows follow right-to-left direction", async ({ page }) => {
  const root = fixture(page, "Right-to-left").locator(".resizable").first();
  const handle = root.locator(":scope > [data-slot='handle']");

  await handle.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(handle).toHaveAttribute("aria-valuenow", "55");

  await page.keyboard.press("ArrowRight");
  await expect(handle).toHaveAttribute("aria-valuenow", "50");
});

test("nested resizable groups keep their own panel ratios", async ({
  page
}) => {
  const outer = fixture(page, "Default").locator(".resizable").first();
  const inner = outer.locator(".resizable").last();
  const outerHandle = outer.locator(":scope > [data-slot='handle']");
  const innerHandle = inner.locator(":scope > [data-slot='handle']");
  const outerPanels = outer.locator(":scope > .resizable-panel");
  const innerPanels = inner.locator(":scope > .resizable-panel");

  await expect(innerHandle).toHaveAttribute("aria-valuenow", "25");
  expect(await sizes(innerPanels)).toEqual([25, 75]);

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
  expect(await sizes(innerPanels)).toEqual([25, 75]);

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
  const innerValues = await sizes(innerPanels);
  expect(innerValues[0]).toBeGreaterThan(25);
  expect((innerValues[0] ?? 0) + (innerValues[1] ?? 0)).toBeCloseTo(100, 1);

  const outerValues = await sizes(outerPanels);
  expect((outerValues[0] ?? 0) + (outerValues[1] ?? 0)).toBeCloseTo(100, 1);
});

test("three-panel groups resize only the adjacent pair", async ({ page }) => {
  const root = fixture(page, "Three panels").locator(".resizable");
  const handles = root.locator(":scope > [data-slot='handle']");
  const panels = root.locator(":scope > .resizable-panel");
  const first = handles.first();
  const second = handles.nth(1);

  await expect(first).toHaveAttribute("aria-valuenow", "20");
  await expect(first).toHaveAttribute("aria-valuemax", "50");
  await expect(second).toHaveAttribute("aria-valuenow", "30");
  await expect(second).toHaveAttribute("aria-valuemax", "80");
  await expect(first).toHaveAttribute("aria-controls", "demo-resizable-three-one");
  await expect(second).toHaveAttribute("aria-controls", "demo-resizable-three-two");

  await root.evaluate((element) => {
    (window as any).__resizeChange = null;
    element.addEventListener("change", (event) => {
      if (event.target === element) {
        (window as any).__resizeChange = (event as CustomEvent).detail;
      }
    });
  });

  await first.scrollIntoViewIfNeeded();
  const box = await first.boundingBox();
  if (!box) throw new Error("missing first resizable handle");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2);
  await page.mouse.up();

  const values = await sizes(panels);
  expect(values[0]).toBeGreaterThan(20);
  expect(values[1]).toBeLessThan(30);
  expect(values[2]).toBeCloseTo(50, 1);
  expect((values[0] ?? 0) + (values[1] ?? 0) + (values[2] ?? 0)).toBeCloseTo(
    100,
    1
  );

  const detail = await page.evaluate(() => (window as any).__resizeChange);
  expect(detail.sizes).toHaveLength(3);
  expect(detail.sizes[2]).toBeCloseTo(50, 1);
  expect(
    detail.sizes[0] + detail.sizes[1] + detail.sizes[2]
  ).toBeCloseTo(100, 1);

  await expect(first).toHaveAttribute(
    "aria-valuenow",
    String(Math.round(values[0] ?? 0))
  );
  await expect(second).toHaveAttribute(
    "aria-valuenow",
    String(Math.round(values[1] ?? 0))
  );

  const beforeSecond = values.slice();
  const secondBox = await second.boundingBox();
  if (!secondBox) throw new Error("missing second resizable handle");
  await page.mouse.move(
    secondBox.x + secondBox.width / 2,
    secondBox.y + secondBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    secondBox.x + secondBox.width / 2 - 20,
    secondBox.y + secondBox.height / 2
  );
  await page.mouse.up();

  const afterSecond = await sizes(panels);
  expect(afterSecond[0]).toBeCloseTo(beforeSecond[0] ?? 0, 1);
  expect(afterSecond[2]).not.toBeCloseTo(beforeSecond[2] ?? 0, 1);
});

test("resizable double-click restores the adjacent split", async ({ page }) => {
  const root = fixture(page, "Three panels").locator(".resizable");
  const handle = root.locator(":scope > [data-slot='handle']").first();
  const panels = root.locator(":scope > .resizable-panel");

  await root.evaluate((element) => {
    (window as any).__resizeChanges = 0;
    element.addEventListener("change", (event) => {
      if (event.target === element) {
        (window as any).__resizeChanges += 1;
      }
    });
  });

  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  if (!box) throw new Error("missing resizable handle");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2);
  await page.mouse.up();

  const dragged = await sizes(panels);
  expect(dragged[0]).toBeGreaterThan(20);
  expect(await page.evaluate(() => (window as any).__resizeChanges)).toBe(1);

  await handle.dblclick();

  const restored = await sizes(panels);
  expect(restored[0]).toBeCloseTo(20, 1);
  expect(restored[1]).toBeCloseTo(30, 1);
  expect(restored[2]).toBeCloseTo(50, 1);
  await expect(handle).toHaveAttribute("aria-valuenow", "20");
  expect(await page.evaluate(() => (window as any).__resizeChanges)).toBe(2);
});
