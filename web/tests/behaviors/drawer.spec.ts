import { expect, test, type Locator, type Page } from "@playwright/test";

type PointerType = "mouse" | "pen" | "touch";

interface PointerDispatch {
  type: string;
  time: number;
  pointerId: number;
  pointerType: PointerType;
  x?: number;
  y?: number;
  buttons?: number;
  button?: number;
  isPrimary?: boolean;
}

interface DrawerHandles {
  drawer: Locator;
  trigger: Locator;
  panel: Locator;
  handle: Locator;
}

function handleSelector(id: string) {
  return `#${id} > [data-slot='drawer-content'] > [data-slot='handle']`;
}

function panelSelector(id: string) {
  return `#${id} > [data-slot='drawer-content']`;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

async function openDrawer(page: Page, id: string): Promise<DrawerHandles> {
  const trigger = page.locator(`[data-open-dialog="${id}"]`);
  const drawer = page.locator(`#${id}`);
  await trigger.click();
  await expect(drawer).toHaveJSProperty("open", true);
  await expect
    .poll(
      () =>
        drawer.evaluate((element) => {
          const panel = element.querySelector("[data-slot='drawer-content']");
          if (!(panel instanceof HTMLElement)) return false;
          const transform = getComputedStyle(panel).transform;
          if (!transform || transform === "none") return true;
          const matrix = new DOMMatrixReadOnly(transform);
          return Math.abs(matrix.m41) < 0.5 && Math.abs(matrix.m42) < 0.5;
        }),
      { timeout: 3000 }
    )
    .toBe(true);
  return {
    drawer,
    trigger,
    panel: drawer.locator(":scope > [data-slot='drawer-content']"),
    handle: drawer.locator(":scope > [data-slot='drawer-content'] > [data-slot='handle']")
  };
}

async function ensureHandle(page: Page, id: string, position: "first" | "last" = "first") {
  await page.locator(`#${id}`).evaluate((element, handlePosition) => {
    const panel = element.querySelector("[data-slot='drawer-content']");
    if (!(panel instanceof HTMLElement)) throw new Error("missing drawer panel");
    if (panel.querySelector(":scope > [data-slot='handle']")) return;
    const handle = document.createElement("span");
    handle.dataset.slot = "handle";
    handle.setAttribute("aria-hidden", "true");
    if (handlePosition === "last") panel.append(handle);
    else panel.prepend(handle);
  }, position);
}

async function dispatchPointer(page: Page, selector: string, options: PointerDispatch) {
  return page.locator(selector).evaluate((target, pointer) => {
    const event = new PointerEvent(pointer.type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: pointer.pointerId,
      pointerType: pointer.pointerType,
      isPrimary: pointer.isPrimary ?? true,
      button: pointer.button ?? 0,
      buttons:
        pointer.buttons ??
        (pointer.type === "pointerdown" || pointer.type === "pointermove" ? 1 : 0),
      clientX: pointer.x ?? 100,
      clientY: pointer.y ?? 100
    });
    Object.defineProperty(event, "timeStamp", { value: pointer.time });
    target.dispatchEvent(event);
    return event.defaultPrevented;
  }, options);
}

async function startDrag(
  page: Page,
  id: string,
  delta: { x: number; y: number },
  elapsed = 240,
  pointerType: PointerType = "mouse",
  pointerId = 41
) {
  const selector = handleSelector(id);
  const time = await page.evaluate(() => performance.now());
  await dispatchPointer(page, selector, {
    type: "pointerdown",
    time,
    pointerId,
    pointerType
  });
  await dispatchPointer(page, selector, {
    type: "pointermove",
    time: time + elapsed,
    pointerId,
    pointerType,
    x: 100 + delta.x,
    y: 100 + delta.y
  });
  return { time: time + elapsed, pointerId, x: 100 + delta.x, y: 100 + delta.y };
}

async function releaseDrag(
  page: Page,
  id: string,
  drag: Awaited<ReturnType<typeof startDrag>>,
  pointerType: PointerType = "mouse"
) {
  await dispatchPointer(page, handleSelector(id), {
    type: "pointerup",
    time: drag.time + 16,
    pointerId: drag.pointerId,
    pointerType,
    x: drag.x,
    y: drag.y
  });
}

async function swipe(
  page: Page,
  id: string,
  delta: { x: number; y: number },
  elapsed = 240,
  pointerType: PointerType = "mouse"
) {
  const drag = await startDrag(page, id, delta, elapsed, pointerType);
  await releaseDrag(page, id, drag, pointerType);
}

async function axisSize(page: Page, id: string) {
  return page.locator(`#${id}`).evaluate((element) => {
    const panel = element.querySelector("[data-slot='drawer-content']");
    if (!(panel instanceof HTMLElement)) throw new Error("missing drawer panel");
    const side = element.getAttribute("data-side");
    return side === "inline-start" || side === "inline-end"
      ? panel.offsetWidth
      : panel.offsetHeight;
  });
}

async function outwardDelta(page: Page, id: string, distance: number) {
  return page.locator(`#${id}`).evaluate((element, amount) => {
    const side = element.getAttribute("data-side");
    const horizontal = side === "inline-start" || side === "inline-end";
    const rtl = getComputedStyle(element).direction === "rtl";
    let direction = 1;
    if (side === "block-start") direction = -1;
    if (side === "inline-start") direction = rtl ? 1 : -1;
    if (side === "inline-end") direction = rtl ? -1 : 1;
    return {
      x: horizontal ? amount * direction : 0,
      y: horizontal ? 0 : amount * direction
    };
  }, distance);
}

async function runtime(drawer: Locator) {
  return drawer.evaluate((element) => {
    const panel = element.querySelector("[data-slot='drawer-content']");
    if (!(panel instanceof HTMLElement)) throw new Error("missing drawer panel");
    const style = getComputedStyle(panel);
    const transform = style.transform;
    let x = 0;
    let y = 0;
    if (transform && transform !== "none") {
      const matrix = new DOMMatrixReadOnly(transform);
      x = matrix.m41;
      y = matrix.m42;
    }
    return {
      duration: element.style.getPropertyValue("--drawer-gesture-duration"),
      progress: element.style.getPropertyValue("--drawer-swipe-progress"),
      transform: panel.style.getPropertyValue("--drawer-swipe-transform"),
      transitionDuration: style.transitionDuration,
      backdropOpacity: Number.parseFloat(getComputedStyle(element, "::backdrop").opacity),
      x,
      y
    };
  });
}

async function expectRuntimeClean(drawer: Locator) {
  await expect
    .poll(() =>
      drawer.evaluate((element) => {
        const panel = element.querySelector("[data-slot='drawer-content']");
        if (!(panel instanceof HTMLElement)) return false;
        return (
          element.style.getPropertyValue("--drawer-gesture-duration") === "" &&
          element.style.getPropertyValue("--drawer-swipe-progress") === "" &&
          panel.style.getPropertyValue("--drawer-swipe-transform") === ""
        );
      })
    )
    .toBe(true);
  if (await drawer.evaluate((element) => (element as HTMLDialogElement).open)) {
    await expect
      .poll(async () => {
        const state = await runtime(drawer);
        return Math.abs(state.x) < 0.5 && Math.abs(state.y) < 0.5;
      })
      .toBe(true);
  }
}

async function countDismissals(drawer: Locator, key = "__drawerDismissals") {
  await drawer.evaluate((element, counterKey) => {
    (window as any)[counterKey] = 0;
    element.addEventListener("dismiss", (event) => {
      if (event.target === element) (window as any)[counterKey] += 1;
    });
  }, key);
}

test("plain handle click stays decorative and does not start a gesture", async ({ page }) => {
  const { drawer, handle } = await openDrawer(page, "demo-drawer-default");
  await handle.evaluate((element) => {
    (window as any).__drawerHandleClicks = 0;
    element.addEventListener("click", () => {
      (window as any).__drawerHandleClicks += 1;
    });
  });
  await countDismissals(drawer);

  await handle.click();

  await expect(drawer).toHaveJSProperty("open", true);
  await expect(handle).toHaveAttribute("aria-hidden", "true");
  await expect(handle).not.toHaveAttribute("tabindex");
  await expect(handle).not.toHaveAttribute("role");
  expect(await page.evaluate(() => (window as any).__drawerHandleClicks)).toBe(1);
  expect(await page.evaluate(() => (window as any).__drawerDismissals)).toBe(0);
  await expectRuntimeClean(drawer);
});

test("handle container spans the swipe axis and draws a style-owned bar", async ({ page }) => {
  const vertical = await openDrawer(page, "demo-drawer-default");
  const verticalPanelBox = await vertical.panel.boundingBox();
  const verticalHandleBox = await vertical.handle.boundingBox();
  expect(verticalPanelBox).not.toBeNull();
  expect(verticalHandleBox).not.toBeNull();
  expect(verticalHandleBox!.width).toBeCloseTo(verticalPanelBox!.width, 0);
  expect(verticalHandleBox!.height).toBeCloseTo(12, 0);
  expect(
    await vertical.handle.evaluate((element) => {
      const style = getComputedStyle(element, "::after");
      return { width: style.inlineSize, height: style.blockSize };
    })
  ).toEqual({ width: "96px", height: "4px" });
  await page.keyboard.press("Escape");
  await expect(vertical.drawer).toHaveJSProperty("open", false);

  const horizontal = await openDrawer(page, "demo-drawer-side-inline-start");
  await ensureHandle(page, "demo-drawer-side-inline-start");
  const horizontalPanelBox = await horizontal.panel.boundingBox();
  const horizontalHandleBox = await horizontal.handle.boundingBox();
  expect(horizontalPanelBox).not.toBeNull();
  expect(horizontalHandleBox).not.toBeNull();
  expect(horizontalHandleBox!.width).toBeCloseTo(12, 0);
  expect(horizontalHandleBox!.height).toBeCloseTo(horizontalPanelBox!.height, 0);
  expect(
    await horizontal.handle.evaluate((element) => {
      const style = getComputedStyle(element, "::after");
      return { width: style.inlineSize, height: style.blockSize };
    })
  ).toEqual({ width: "4px", height: "96px" });
});

test("short slow drag exposes runtime state, then snaps back and cleans up", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  const distance = Math.max(10, Math.min(40, (await axisSize(page, id)) * 0.25));
  const delta = await outwardDelta(page, id, distance);
  const drag = await startDrag(page, id, delta, 240);

  const during = await runtime(drawer);
  expect(during.duration).toBe("0s");
  expect(Number(during.progress)).toBeGreaterThan(0);
  expect(Number(during.progress)).toBeLessThan(1);
  expect(during.transform).toContain("translate3d(");
  expect(during.transitionDuration).toBe("0s");
  expect(during.backdropOpacity).toBeGreaterThan(0);
  expect(during.backdropOpacity).toBeLessThan(1);
  expect(Math.abs(during.x)).toBeCloseTo(Math.abs(delta.x), 0);
  expect(Math.abs(during.y)).toBeCloseTo(Math.abs(delta.y), 0);

  await releaseDrag(page, id, drag);
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);
  await expect.poll(async () => (await runtime(drawer)).backdropOpacity).toBe(1);
  expect((await runtime(drawer)).transitionDuration).not.toBe("0s");
});

test("long drag closes once with dismiss, toggle, ARIA and focus ordering", async ({ page }) => {
  const id = "demo-drawer-default";
  const drawer = page.locator(`#${id}`);
  const trigger = page.locator(`[data-open-dialog="${id}"]`);
  await drawer.evaluate((element) => {
    const state = {
      events: [] as string[],
      dismissals: [] as Array<{ open: boolean; cancelable: boolean; reason: string }>,
      closeCalls: 0,
      expandedAtToggle: [] as boolean[]
    };
    (window as any).__drawerOrder = state;
    element.addEventListener("toggle", (event) => {
      const detail = (event as CustomEvent<{ open: boolean }>).detail;
      state.events.push(`toggle:${detail.open}`);
      const opener = document.querySelector(
        `[data-open-dialog="${element.id}"]`
      );
      state.expandedAtToggle.push(opener?.getAttribute("aria-expanded") === "true");
    });
    element.addEventListener("dismiss", (event) => {
      state.events.push("dismiss");
      state.dismissals.push({
        open: (element as HTMLDialogElement).open,
        cancelable: event.cancelable,
        reason: (event as CustomEvent<{ reason: string }>).detail.reason
      });
    });
    element.addEventListener("close", () => {
      state.events.push("close");
    });
    const close = (element as HTMLDialogElement).close.bind(element);
    Object.defineProperty(element, "close", {
      value: () => {
        state.closeCalls += 1;
        close();
      }
    });
  });
  await openDrawer(page, id);

  const distance = (await axisSize(page, id)) * 2;
  const delta = await outwardDelta(page, id, distance);
  const drag = await startDrag(page, id, delta, 240);
  const clamped = await runtime(drawer);
  expect(clamped.progress).toBe("0");
  expect(Math.max(Math.abs(clamped.x), Math.abs(clamped.y))).toBeCloseTo(
    (await axisSize(page, id)) + 2,
    0
  );
  await releaseDrag(page, id, drag);

  const settling = await runtime(drawer);
  expect(Number.parseFloat(settling.duration)).toBeGreaterThanOrEqual(80);
  expect(Number.parseFloat(settling.duration)).toBeLessThanOrEqual(360);
  expect(settling.progress).toBe("0");
  expect(settling.transform).toContain("translate3d(");

  await expect(drawer).toHaveJSProperty("open", false);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await expectRuntimeClean(drawer);

  const order = await page.evaluate(() => (window as any).__drawerOrder);
  expect(order.events).toEqual(["toggle:true", "dismiss", "close", "toggle:false"]);
  expect(order.expandedAtToggle).toEqual([true, false]);
  expect(order.dismissals).toEqual([{ open: true, cancelable: false, reason: "swipe" }]);
  expect(order.closeCalls).toBe(1);
});

test("fast outward flick closes below the distance threshold", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  expect(await axisSize(page, id)).toBeGreaterThan(40);
  const delta = await outwardDelta(page, id, 20);
  const drag = await startDrag(page, id, delta, 32);
  await dispatchPointer(page, handleSelector(id), {
    type: "pointermove",
    time: drag.time + 8,
    pointerId: drag.pointerId,
    pointerType: "mouse",
    x: drag.x,
    y: drag.y
  });
  await releaseDrag(page, id, drag);

  await expect(drawer).toHaveJSProperty("open", false);
  await expectRuntimeClean(drawer);
});

test("wrong-axis, inward and reversed drags never close", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  await countDismissals(drawer);

  await swipe(page, id, { x: 80, y: 0 }, 240);
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);

  await swipe(page, id, { x: 0, y: -60 }, 240);
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);

  const selector = handleSelector(id);
  const time = await page.evaluate(() => performance.now());
  await dispatchPointer(page, selector, {
    type: "pointerdown",
    time,
    pointerId: 41,
    pointerType: "mouse"
  });
  await dispatchPointer(page, selector, {
    type: "pointermove",
    time: time + 100,
    pointerId: 41,
    pointerType: "mouse",
    y: 109
  });
  expect((await runtime(drawer)).transform).toBe("");
  await dispatchPointer(page, selector, {
    type: "pointermove",
    time: time + 200,
    pointerId: 41,
    pointerType: "mouse",
    y: 110
  });
  expect((await runtime(drawer)).duration).toBe("0s");
  await dispatchPointer(page, selector, {
    type: "pointermove",
    time: time + 216,
    pointerId: 41,
    pointerType: "mouse",
    y: 100
  });
  await dispatchPointer(page, selector, {
    type: "pointerup",
    time: time + 232,
    pointerId: 41,
    pointerType: "mouse",
    y: 100
  });

  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);
  expect(await page.evaluate(() => (window as any).__drawerDismissals)).toBe(0);
});

test("pointer capture waits for attributed movement and pointercancel snaps back", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer, handle } = await openDrawer(page, id);
  await handle.evaluate((element) => {
    (window as any).__drawerPointerId = null;
    element.addEventListener(
      "pointerdown",
      (event) => {
        (window as any).__drawerPointerId = (event as PointerEvent).pointerId;
      },
      { once: true }
    );
  });
  const box = await handle.boundingBox();
  if (!box) throw new Error("missing drawer handle");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + 9);
  expect((await runtime(drawer)).transform).toBe("");
  expect(
    await handle.evaluate(
      (element, pointerId) => element.hasPointerCapture(pointerId),
      await page.evaluate(() => (window as any).__drawerPointerId)
    )
  ).toBe(false);

  await page.mouse.move(x, y + 10);
  const pointerId = await page.evaluate(() => (window as any).__drawerPointerId);
  await expect
    .poll(() => handle.evaluate((element, id) => element.hasPointerCapture(id), pointerId))
    .toBe(true);
  expect((await runtime(drawer)).duration).toBe("0s");

  await dispatchPointer(page, handleSelector(id), {
    type: "pointercancel",
    time: await page.evaluate(() => performance.now()),
    pointerId,
    pointerType: "mouse",
    x,
    y: y + 10
  });
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);
  await page.mouse.up();
});

test("pointercancel, lost capture and missed release settle from the last valid movement", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  await countDismissals(drawer);
  const short = await outwardDelta(page, id, 20);

  let drag = await startDrag(page, id, short, 240);
  await dispatchPointer(page, handleSelector(id), {
    type: "pointercancel",
    time: drag.time + 8,
    pointerId: drag.pointerId,
    pointerType: "mouse",
    x: drag.x,
    y: drag.y
  });
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);

  drag = await startDrag(page, id, short, 240);
  await dispatchPointer(page, handleSelector(id), {
    type: "lostpointercapture",
    time: drag.time + 8,
    pointerId: drag.pointerId,
    pointerType: "mouse",
    x: drag.x,
    y: drag.y
  });
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);

  drag = await startDrag(page, id, short, 240);
  await dispatchPointer(page, handleSelector(id), {
    type: "pointermove",
    time: drag.time + 16,
    pointerId: drag.pointerId,
    pointerType: "mouse",
    x: drag.x,
    y: 1200,
    buttons: 0
  });
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);
  await releaseDrag(page, id, drag);
  expect(await page.evaluate(() => (window as any).__drawerDismissals)).toBe(0);
});

test("secondary button and context menu interruptions never dismiss", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  await countDismissals(drawer);
  const delta = await outwardDelta(page, id, 40);

  let drag = await startDrag(page, id, delta, 240);
  await dispatchPointer(page, handleSelector(id), {
    type: "pointerdown",
    time: drag.time + 8,
    pointerId: drag.pointerId,
    pointerType: "mouse",
    button: 2,
    buttons: 2,
    x: drag.x,
    y: drag.y
  });
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);

  drag = await startDrag(page, id, delta, 240);
  await page.locator(handleSelector(id)).evaluate((target, time) => {
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 140
    });
    Object.defineProperty(event, "timeStamp", { value: time });
    target.dispatchEvent(event);
  }, drag.time + 8);
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);
  expect(await page.evaluate(() => (window as any).__drawerDismissals)).toBe(0);
});

test("prevented, non-primary and secondary presses cannot hijack a gesture", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  const selector = handleSelector(id);
  const delta = await outwardDelta(page, id, 40);
  const time = await page.evaluate(() => performance.now());

  await dispatchPointer(page, selector, {
    type: "pointerdown",
    time,
    pointerId: 50,
    pointerType: "touch",
    isPrimary: false
  });
  await dispatchPointer(page, selector, {
    type: "pointermove",
    time: time + 16,
    pointerId: 50,
    pointerType: "touch",
    isPrimary: false,
    x: 100 + delta.x,
    y: 100 + delta.y
  });
  await dispatchPointer(page, selector, {
    type: "pointerup",
    time: time + 32,
    pointerId: 50,
    pointerType: "touch",
    isPrimary: false,
    x: 100 + delta.x,
    y: 100 + delta.y
  });
  await expectRuntimeClean(drawer);

  await dispatchPointer(page, selector, {
    type: "pointerdown",
    time: time + 40,
    pointerId: 51,
    pointerType: "mouse",
    button: 2,
    buttons: 2
  });
  await expectRuntimeClean(drawer);

  await page.evaluate(() => {
    window.addEventListener(
      "pointerdown",
      (event) => event.preventDefault(),
      { capture: true, once: true }
    );
  });
  await dispatchPointer(page, selector, {
    type: "pointerdown",
    time: time + 48,
    pointerId: 52,
    pointerType: "mouse"
  });
  await dispatchPointer(page, selector, {
    type: "pointermove",
    time: time + 64,
    pointerId: 52,
    pointerType: "mouse",
    x: 100 + delta.x,
    y: 100 + delta.y
  });
  await dispatchPointer(page, selector, {
    type: "pointerup",
    time: time + 80,
    pointerId: 52,
    pointerType: "mouse",
    x: 100 + delta.x,
    y: 100 + delta.y
  });
  await expectRuntimeClean(drawer);

  const primary = await startDrag(page, id, delta, 240, "touch", 53);
  await dispatchPointer(page, selector, {
    type: "pointerdown",
    time: primary.time + 4,
    pointerId: 54,
    pointerType: "touch",
    isPrimary: false
  });
  await dispatchPointer(page, selector, {
    type: "pointermove",
    time: primary.time + 8,
    pointerId: 54,
    pointerType: "touch",
    isPrimary: false,
    x: 100 + delta.x * 4,
    y: 100 + delta.y * 4
  });
  await releaseDrag(page, id, primary, "touch");
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);
});

test("release-click guard blocks one backdrop click and preserves assistive activation", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  const distance = (await axisSize(page, id)) * 0.45;
  const delta = await outwardDelta(page, id, distance);
  await swipe(page, id, delta, 240);
  expect((await runtime(drawer)).duration).not.toBe("");

  const prevented = await drawer.evaluate((element) => {
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      detail: 1
    });
    element.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(prevented).toBe(true);
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);

  await page.mouse.click(2, 2);
  await expect(drawer).toHaveJSProperty("open", false);

  const reopened = await openDrawer(page, id);
  await swipe(page, id, delta, 240);
  expect((await runtime(reopened.drawer)).duration).not.toBe("");
  const assistiveClosed = await reopened.drawer.evaluate((element) => {
    const close = element.querySelector("[data-close-dialog]");
    if (!(close instanceof HTMLElement)) throw new Error("missing close control");
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      detail: 0
    });
    close.dispatchEvent(event);
    return !(element as HTMLDialogElement).open;
  });
  expect(assistiveClosed).toBe(true);
  await expect(reopened.drawer).toHaveJSProperty("open", false);
});

test("all four sides and both RTL inline directions swipe outward", async ({ page }) => {
  const cases = [
    { id: "demo-drawer-side-inline-start", direction: "ltr" },
    { id: "demo-drawer-side-inline-end", direction: "ltr" },
    { id: "demo-drawer-side-block-start", direction: "ltr" },
    { id: "demo-drawer-side-block-end", direction: "ltr" },
    { id: "demo-drawer-side-inline-start", direction: "rtl" },
    { id: "demo-drawer-rtl", direction: "rtl" }
  ] as const;

  for (const entry of cases) {
    await ensureHandle(page, entry.id, entry.id.includes("block-start") ? "last" : "first");
    await page.locator(`#${entry.id}`).evaluate((element, direction) => {
      if (direction === "rtl") element.setAttribute("dir", "rtl");
    }, entry.direction);
    const { drawer } = await openDrawer(page, entry.id);
    const distance = (await axisSize(page, entry.id)) * 0.75;
    const delta = await outwardDelta(page, entry.id, distance);
    const drag = await startDrag(page, entry.id, delta, 240);
    const during = await runtime(drawer);
    expect(Math.sign(during.x)).toBe(Math.sign(delta.x));
    expect(Math.sign(during.y)).toBe(Math.sign(delta.y));
    expect(Math.max(Math.abs(during.x), Math.abs(during.y))).toBeCloseTo(distance, 0);
    await releaseDrag(page, entry.id, drag);
    await expect(drawer).toHaveJSProperty("open", false);
    await expectRuntimeClean(drawer);
  }
});

for (const pointerType of ["touch", "pen"] as const) {
  test(`primary ${pointerType} drag closes the drawer`, async ({ page }) => {
    const id = "demo-drawer-default";
    const { drawer } = await openDrawer(page, id);
    const delta = await outwardDelta(page, id, (await axisSize(page, id)) * 0.75);
    await swipe(page, id, delta, 240, pointerType);
    await expect(drawer).toHaveJSProperty("open", false);
    await expectRuntimeClean(drawer);
  });
}

test("nested drawer swipe affects only the child", async ({ page }) => {
  const parentId = "demo-drawer-nested";
  const childId = "demo-drawer-nested-child";
  const parent = await openDrawer(page, parentId);
  await countDismissals(parent.drawer, "__parentDrawerDismissals");
  const child = await openDrawer(page, childId);
  await countDismissals(child.drawer);

  const delta = await outwardDelta(page, childId, (await axisSize(page, childId)) * 0.75);
  await swipe(page, childId, delta, 240);

  await expect(child.drawer).toHaveJSProperty("open", false);
  await expect(parent.drawer).toHaveJSProperty("open", true);
  await expect(parent.trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(`[data-open-dialog="${childId}"]`)).toBeFocused();
  expect(await page.evaluate(() => (window as any).__drawerDismissals)).toBe(1);
  expect(await page.evaluate(() => (window as any).__parentDrawerDismissals)).toBe(0);
  await expectRuntimeClean(parent.drawer);
  await expectRuntimeClean(child.drawer);
});

test("dynamic handles opt in while panel drags and interactive descendants do not", async ({ page }) => {
  const id = "demo-drawer-side-inline-start";
  const initial = await openDrawer(page, id);
  const panelSelectorValue = panelSelector(id);
  const time = await page.evaluate(() => performance.now());
  const distance = (await axisSize(page, id)) * 0.75;
  const delta = await outwardDelta(page, id, distance);
  await dispatchPointer(page, panelSelectorValue, {
    type: "pointerdown",
    time,
    pointerId: 61,
    pointerType: "mouse"
  });
  await dispatchPointer(page, panelSelectorValue, {
    type: "pointermove",
    time: time + 240,
    pointerId: 61,
    pointerType: "mouse",
    x: 100 + delta.x,
    y: 100 + delta.y
  });
  await dispatchPointer(page, panelSelectorValue, {
    type: "pointerup",
    time: time + 256,
    pointerId: 61,
    pointerType: "mouse",
    x: 100 + delta.x,
    y: 100 + delta.y
  });
  await expect(initial.drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(initial.drawer);
  await page.keyboard.press("Escape");
  await expect(initial.drawer).toHaveJSProperty("open", false);

  await initial.panel.evaluate((panel) => {
    const handle = document.createElement("span");
    handle.dataset.slot = "handle";
    handle.setAttribute("aria-hidden", "true");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Custom action";
    button.addEventListener("click", () => {
      (window as any).__drawerCustomClicks = ((window as any).__drawerCustomClicks ?? 0) + 1;
    });
    handle.append(button);
    panel.prepend(handle);
  });

  const reopened = await openDrawer(page, id);
  const button = reopened.handle.locator("button");
  const childSelector = `${handleSelector(id)} > button`;
  const childTime = await page.evaluate(() => performance.now());
  await dispatchPointer(page, childSelector, {
    type: "pointerdown",
    time: childTime,
    pointerId: 62,
    pointerType: "mouse"
  });
  await dispatchPointer(page, childSelector, {
    type: "pointermove",
    time: childTime + 240,
    pointerId: 62,
    pointerType: "mouse",
    x: 100 + delta.x,
    y: 100 + delta.y
  });
  await dispatchPointer(page, childSelector, {
    type: "pointerup",
    time: childTime + 256,
    pointerId: 62,
    pointerType: "mouse",
    x: 100 + delta.x,
    y: 100 + delta.y
  });
  await expect(reopened.drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(reopened.drawer);
  await button.evaluate((element) => (element as HTMLButtonElement).click());
  expect(await page.evaluate(() => (window as any).__drawerCustomClicks)).toBe(1);

  await swipe(page, id, delta, 240);
  await expect(reopened.drawer).toHaveJSProperty("open", false);
  await expectRuntimeClean(reopened.drawer);
  await expect(reopened.handle).toHaveAttribute("aria-hidden", "true");
  await expect(reopened.handle).not.toHaveAttribute("tabindex");
});

test("external close and removed dialogs clean up without swipe dismiss", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  await countDismissals(drawer);
  const delta = await outwardDelta(page, id, (await axisSize(page, id)) * 0.75);
  await startDrag(page, id, delta, 240);
  await drawer.evaluate((element) => (element as HTMLDialogElement).close());
  await expect(drawer).toHaveJSProperty("open", false);
  await expectRuntimeClean(drawer);
  expect(await page.evaluate(() => (window as any).__drawerDismissals)).toBe(0);

  const reopened = await openDrawer(page, id);
  await startDrag(page, id, delta, 240);
  await reopened.drawer.evaluate((element) => {
    (window as any).__removedDrawer = element;
    element.remove();
  });
  await expect
    .poll(() =>
      page.evaluate(() => {
        const element = (window as any).__removedDrawer as HTMLElement;
        const panel = element.querySelector("[data-slot='drawer-content']") as HTMLElement;
        return (
          element.style.getPropertyValue("--drawer-gesture-duration") === "" &&
          element.style.getPropertyValue("--drawer-swipe-progress") === "" &&
          panel.style.getPropertyValue("--drawer-swipe-transform") === ""
        );
      })
    )
    .toBe(true);
  expect(await page.evaluate(() => (window as any).__drawerDismissals)).toBe(0);

  const nextId = "demo-drawer-side-inline-end";
  await ensureHandle(page, nextId);
  const next = await openDrawer(page, nextId);
  const nextDelta = await outwardDelta(page, nextId, (await axisSize(page, nextId)) * 0.75);
  await swipe(page, nextId, nextDelta, 240);
  await expect(next.drawer).toHaveJSProperty("open", false);
});

test("re-grab during snap-back continues from the computed transform", async ({ page }) => {
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  const distance = (await axisSize(page, id)) * 0.45;
  const result = await drawer.evaluate(async (element, amount) => {
    const panel = element.querySelector("[data-slot='drawer-content']");
    const handle = panel?.querySelector(":scope > [data-slot='handle']");
    if (!(panel instanceof HTMLElement) || !(handle instanceof HTMLElement)) {
      throw new Error("missing drawer parts");
    }
    const fire = (type: string, time: number, y: number) => {
      const event = new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId: 71,
        pointerType: "mouse",
        isPrimary: true,
        button: 0,
        buttons: type === "pointerup" ? 0 : 1,
        clientX: 100,
        clientY: y
      });
      Object.defineProperty(event, "timeStamp", { value: time });
      handle.dispatchEvent(event);
    };
    const base = performance.now();
    fire("pointerdown", base, 100);
    fire("pointermove", base + 240, 100 + amount);
    fire("pointerup", base + 256, 100 + amount);
    // Freeze a representative mid-snap transform so the assertion does not
    // depend on each engine's transition pacing.
    const snapDistance = Math.max(20, amount * 0.5);
    element.style.setProperty("--drawer-gesture-duration", "0s");
    panel.style.setProperty(
      "--drawer-swipe-transform",
      `translate3d(0, ${snapDistance}px, 0)`
    );
    const before = new DOMMatrixReadOnly(getComputedStyle(panel).transform).m42;
    const regrab = performance.now();
    fire("pointerdown", regrab, 100);
    fire("pointermove", regrab + 16, 110);
    const after = new DOMMatrixReadOnly(getComputedStyle(panel).transform).m42;
    return { before, after, time: regrab + 16 };
  }, distance);

  expect(result.before).toBeGreaterThan(0);
  expect(result.after).toBeGreaterThan(result.before + 5);
  await dispatchPointer(page, handleSelector(id), {
    type: "pointerup",
    time: result.time + 16,
    pointerId: 71,
    pointerType: "mouse",
    y: 110
  });
  await expect(drawer).toHaveJSProperty("open", true);
  await expectRuntimeClean(drawer);
});

test("reduced motion keeps swipe closing without adding motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const id = "demo-drawer-default";
  const { drawer } = await openDrawer(page, id);
  const delta = await outwardDelta(page, id, (await axisSize(page, id)) * 0.75);
  const drag = await startDrag(page, id, delta, 240);
  await releaseDrag(page, id, drag);
  expect((await runtime(drawer)).transitionDuration).toBe("0s");
  await expect(drawer).toHaveJSProperty("open", false);
  await expectRuntimeClean(drawer);
});
