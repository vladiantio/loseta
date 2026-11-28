import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/fixtures/behaviors");
});

async function mount(page: Page, id: string, html: string) {
  await page.evaluate(
    ({ id, html }) => {
      const host = document.querySelector('[data-fixture="toast"]');
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-test", id);
      wrapper.innerHTML = html;
      host?.append(wrapper);
    },
    { id, html }
  );
}

test("manager toast shows from its trigger and dismisses from close", async ({
  page
}) => {
  const example = page.locator('[data-example="Default"]');
  await page.evaluate(() => {
    const toaster = document.getElementById("demo-toaster-default");
    (window as any).__toastEvents = [];
    toaster?.addEventListener("toggle", (event) => {
      (window as any).__toastEvents.push([
        "toggle",
        (event as unknown as CustomEvent).detail.open
      ]);
    });
    toaster?.addEventListener("dismiss", (event) => {
      (window as any).__toastEvents.push([
        "dismiss",
        (event as CustomEvent).detail.reason
      ]);
    });
  });

  await example.getByRole("button", { name: "Show toast" }).click();
  const toast = example.locator(".toast").first();
  await expect(toast).toHaveRole("listitem");
  await expect(toast).toHaveJSProperty("hidden", false);
  await expect(toast.locator("[data-slot='title']")).toHaveText(
    "Event created"
  );
  await expect(toast.locator("[data-slot='description']")).toHaveText(
    "Sunday, December 3 at 9:00 AM"
  );

  await toast.getByRole("button", { name: "Dismiss" }).click();
  await expect(toast).toHaveJSProperty("hidden", true, { timeout: 2500 });
  expect(await page.evaluate(() => (window as any).__toastEvents)).toEqual([
    ["toggle", true],
    ["toggle", false],
    ["dismiss", "close"]
  ]);
});

test("first toast in an empty toaster animates in", async ({ page }) => {
  const properties = await page.evaluate(async () => {
    document.getElementById("demo-toast-default-trigger")?.click();
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    const toast = document.querySelector(
      "#demo-toaster-default .toast:not([hidden])"
    );
    return toast
      ? toast.getAnimations().map((animation) => {
          const transition = animation as Animation & {
            transitionProperty?: string;
          };
          return transition.transitionProperty ?? "";
        })
      : [];
  });

  expect(properties).toEqual(expect.arrayContaining(["translate", "opacity"]));
  const toast = page.locator("#demo-toaster-default .toast").first();
  await expect(toast).toHaveCSS("opacity", "1");
  await expect(toast).toHaveCSS("translate", "0px");
});

test("manager action closes the toast through closeToast", async ({ page }) => {
  const example = page.locator('[data-example="With action"]');
  await example.getByRole("button", { name: "Show toast" }).click();
  const toast = example.locator(".toast").first();
  await expect(toast).toHaveJSProperty("hidden", false);

  await toast.getByRole("button", { name: "Undo" }).click();
  await expect(toast).toHaveJSProperty("hidden", true, { timeout: 2500 });
});

test("authored markup still dismisses through data-close-toast", async ({
  page
}) => {
  await mount(
    page,
    "authored-close",
    `<div class="toaster" data-test-authored>
  <div class="toast" role="status" data-duration="0">
    <div data-slot="content"><section><p data-slot="title">Authored</p></section><button type="button" data-slot="action" data-close-toast>Close</button></div>
  </div>
</div>`
  );

  const toaster = page.locator('[data-test="authored-close"] .toaster');
  await expect(toaster).toHaveAttribute("data-toast-initialized", "", {
    timeout: 2000
  });
  const toast = toaster.locator(".toast");
  await toast.getByRole("button", { name: "Close" }).click();
  await expect(toast).toHaveJSProperty("hidden", true, { timeout: 2500 });
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

  const auto = page.locator('[data-fixture="toast"] .toast', {
    hasText: "Auto dismiss"
  });
  await expect(auto).toHaveJSProperty("hidden", true, { timeout: 2500 });
  expect(await page.evaluate(() => (window as any).__autoToastReason)).toBe(
    "timeout"
  );

  await page.evaluate(() => {
    const section = document.querySelector('[data-fixture="toast"]');
    if (!section) return;

    const paused = document.createElement("div");
    paused.className = "toast";
    paused.setAttribute("data-duration", "1000");
    paused.setAttribute("role", "status");
    paused.innerHTML =
      '<section><p data-slot="title">Paused toast</p></section>';
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

test("stacking assigns the newest toast to the front and expands on hover", async ({
  page
}) => {
  await mount(
    page,
    "stack",
    `<div class="toaster" data-test-toaster>
  <div class="toast" role="status" data-duration="0">
    <div data-slot="content"><section><p data-slot="title">First</p></section><button type="button" data-slot="close" aria-label="Dismiss first">×</button></div>
  </div>
  <div class="toast" role="status" data-duration="0">
    <div data-slot="content"><section><p data-slot="title">Second</p></section><button type="button" data-slot="close" aria-label="Dismiss second">×</button></div>
  </div>
  <div class="toast" role="status" data-duration="0">
    <div data-slot="content"><section><p data-slot="title">Third</p></section><button type="button" data-slot="close" aria-label="Dismiss third">×</button></div>
  </div>
</div>`
  );

  const toaster = page.locator('[data-test="stack"] .toaster');
  await expect(toaster).toHaveAttribute("data-toast-initialized", "", {
    timeout: 2000
  });
  const toasts = toaster.locator(":scope > .toast");
  await expect(toasts).toHaveCount(3);

  expect(await toasts.nth(0).evaluate((el) => (el as HTMLElement).style.getPropertyValue("--toast-index"))).toBe("2");
  expect(await toasts.nth(1).evaluate((el) => (el as HTMLElement).style.getPropertyValue("--toast-index"))).toBe("1");
  expect(await toasts.nth(2).evaluate((el) => (el as HTMLElement).style.getPropertyValue("--toast-index"))).toBe("0");

  const firstContent = toasts.nth(0).locator(":scope > [data-slot='content']");
  const thirdContent = toasts.nth(2).locator(":scope > [data-slot='content']");
  await expect(firstContent).toHaveAttribute("inert", "");
  await expect(thirdContent).not.toHaveAttribute("inert", "");

  await toasts.nth(2).hover();
  await expect(toaster).toHaveCSS("--toast-expanded", "1");
  await expect(firstContent).not.toHaveAttribute("inert", "");

  await page.mouse.move(5, 5);
  await expect(toaster).toHaveCSS("--toast-expanded", "0", { timeout: 2000 });
  await expect(firstContent).toHaveAttribute("inert", "");
});

test("hovering the stack pauses every visible toast", async ({ page }) => {
  await mount(
    page,
    "pause-stack",
    `<div class="toaster" data-test-pause>
  <div class="toast" role="status" data-duration="1500">
    <div data-slot="content"><section><p data-slot="title">First timer</p></section></div>
  </div>
  <div class="toast" role="status" data-duration="1500">
    <div data-slot="content"><section><p data-slot="title">Second timer</p></section></div>
  </div>
</div>`
  );

  const toaster = page.locator('[data-test="pause-stack"] .toaster');
  await expect(toaster).toHaveAttribute("data-toast-initialized", "", {
    timeout: 2000
  });
  const toasts = toaster.locator(":scope > .toast");
  await expect(toasts).toHaveCount(2);

  await toasts.nth(1).hover();
  await page.waitForTimeout(1800);
  await expect(toasts.nth(0)).toHaveJSProperty("hidden", false);
  await expect(toasts.nth(1)).toHaveJSProperty("hidden", false);

  await page.mouse.move(5, 5);
  await expect(toasts.nth(0)).toHaveJSProperty("hidden", true, {
    timeout: 3000
  });
  await expect(toasts.nth(1)).toHaveJSProperty("hidden", true, {
    timeout: 3000
  });
});

test("data-open-toast accepts several ids and re-arms visible toasts", async ({
  page
}) => {
  await mount(
    page,
    "declarative",
    `<button type="button" data-open-toast="declarative-a declarative-b">Open</button>
<div class="toaster" data-test-declarative>
  <div class="toast" id="declarative-a" role="status" data-duration="0" hidden>
    <div data-slot="content" role="status" aria-atomic="true"><section><p data-slot="title">First</p></section></div>
  </div>
  <div class="toast" id="declarative-b" role="status" data-duration="0" hidden>
    <div data-slot="content" role="status" aria-atomic="true"><section><p data-slot="title">Second</p></section></div>
  </div>
</div>`
  );

  const wrapper = page.locator('[data-test="declarative"]');
  const toaster = wrapper.locator(".toaster");
  const toasts = toaster.locator(":scope > .toast");
  await page.evaluate(() => {
    (window as any).__openToggles = 0;
    document
      .querySelector('[data-test="declarative"] .toaster')
      ?.addEventListener("toggle", (event) => {
        if ((event as unknown as CustomEvent).detail.open) {
          (window as any).__openToggles += 1;
        }
      });
  });

  await wrapper.getByRole("button", { name: "Open" }).click();
  await expect(toasts.nth(0)).toHaveJSProperty("hidden", false);
  await expect(toasts.nth(1)).toHaveJSProperty("hidden", false);
  expect(await page.evaluate(() => (window as any).__openToggles)).toBe(2);

  await expect(toaster).toHaveAttribute("data-toast-initialized", "");
  const indices = await toasts.evaluateAll((items) =>
    items.map((item) =>
      (item as HTMLElement).style.getPropertyValue("--toast-index")
    )
  );
  expect(indices).toEqual(["1", "0"]);

  await wrapper.getByRole("button", { name: "Open" }).click();
  expect(await page.evaluate(() => (window as any).__openToggles)).toBe(4);
  await expect(toasts.nth(1)).toHaveJSProperty("hidden", false);
});

test("manager adds, updates and closes a toast", async ({ page }) => {
  const result = await page.evaluate(() => {
    const toaster = document.getElementById("demo-toaster-default") as any;
    const id = toaster.addToast({
      type: "info",
      title: "API toast",
      description: "From addToast",
      priority: "high",
      timeout: 0
    });
    const toast = document.getElementById(id);
    return {
      id,
      type: toast?.getAttribute("data-type"),
      role: toast?.querySelector("[data-slot='content']")?.getAttribute("role"),
      title: toast?.querySelector("[data-slot='title']")?.textContent,
      description: toast?.querySelector("[data-slot='description']")
        ?.textContent,
      iconHidden: toast
        ?.querySelector("[data-slot='icon']")
        ?.hasAttribute("hidden")
    };
  });

  expect(result).toMatchObject({
    type: "info",
    role: "alert",
    title: "API toast",
    description: "From addToast",
    iconHidden: false
  });

  const toast = page.locator(`#${result.id}`);
  await expect(toast).toBeVisible();

  await page.evaluate((id) => {
    const toaster = document.getElementById("demo-toaster-default") as any;
    toaster.updateToast(id, {
      type: "success",
      title: "Updated",
      description: "New text",
      priority: "low",
      timeout: 0
    });
  }, result.id);
  await expect(toast.locator("[data-slot='title']")).toHaveText("Updated");
  await expect(toast.locator("[data-slot='description']")).toHaveText(
    "New text"
  );
  await expect(toast).toHaveAttribute("data-type", "success");
  await expect(toast.locator("[data-slot='content']")).toHaveAttribute(
    "role",
    "status"
  );
  expect(await toast.getAttribute("data-duration")).toBe("0");

  await page.evaluate((id) => {
    (document.getElementById("demo-toaster-default") as any).closeToast(id);
  }, result.id);
  await expect(toast).toHaveJSProperty("hidden", true, { timeout: 2500 });
});

test("manager upserts by id and runs action callbacks", async ({ page }) => {
  await page.evaluate(() => {
    const toaster = document.getElementById("demo-toaster-default") as any;
    const id = toaster.addToast({
      id: "upsert-toast",
      title: "First",
      timeout: 0,
      actionProps: {
        children: "Undo",
        onClick() {
          toaster.closeToast(id);
        }
      }
    });
    toaster.addToast({ id, description: "Second" });
  });

  const toast = page.locator("#upsert-toast");
  await expect(toast).toHaveCount(1);
  await expect(toast.locator("[data-slot='title']")).toHaveText("First");
  await expect(toast.locator("[data-slot='description']")).toHaveText("Second");

  await toast.getByRole("button", { name: "Undo" }).click();
  await expect(toast).toHaveJSProperty("hidden", true, { timeout: 2500 });
});

test("manager limits the stack and surfaces limited toasts", async ({
  page
}) => {
  await page.evaluate(() => {
    const toaster = document.getElementById("demo-toaster-default") as any;
    for (const id of ["limit-a", "limit-b", "limit-c", "limit-d"]) {
      toaster.addToast({ id, title: id, timeout: 0 });
    }
  });

  const limited = page.locator("#demo-toaster-default .toast[data-limited]");
  const first = page.locator("#limit-a");
  const second = page.locator("#limit-b");
  const fourth = page.locator("#limit-d");
  await expect(limited).toHaveCount(1);
  await expect(first).toHaveAttribute("data-limited", "");
  await expect(first).toHaveAttribute("inert", "");
  await expect(first).toHaveJSProperty("hidden", false);
  await expect(first).toHaveCSS("opacity", "0");
  await expect(fourth).not.toHaveAttribute("data-limited", "");

  await page.evaluate(() => {
    (document.getElementById("demo-toaster-default") as any).closeToast(
      "limit-d"
    );
  });
  await expect(first).not.toHaveAttribute("data-limited", "");
  await expect(fourth).toHaveJSProperty("hidden", false);
  await expect(fourth).toHaveJSProperty("hidden", true, { timeout: 2500 });
  await expect(first).toHaveCSS("opacity", "1");
  await expect(limited).toHaveCount(0);

  await page.evaluate(() => {
    document
      .getElementById("demo-toaster-default")
      ?.setAttribute("data-toast-limit", "0");
  });
  await expect(page.locator("#demo-toaster-default .toast[data-limited]")).toHaveCount(0);

  await page.evaluate(() => {
    document
      .getElementById("demo-toaster-default")
      ?.setAttribute("data-toast-limit", "2");
  });
  await expect(second).not.toHaveAttribute("data-limited", "");
  await expect(first).toHaveAttribute("data-limited", "");
  await expect(limited).toHaveCount(1);
});

test("manager closeToast without an id closes every visible toast", async ({
  page
}) => {
  await page.evaluate(() => {
    const toaster = document.getElementById("demo-toaster-default") as any;
    toaster.addToast({ id: "close-all-a", title: "A", timeout: 0 });
    toaster.addToast({ id: "close-all-b", title: "B", timeout: 0 });
    toaster.closeToast();
  });

  await expect(page.locator("#close-all-a")).toHaveJSProperty("hidden", true, {
    timeout: 2500
  });
  await expect(page.locator("#close-all-b")).toHaveJSProperty("hidden", true, {
    timeout: 2500
  });
});

test("promiseToast follows loading, success and error states", async ({
  page
}) => {
  await page.evaluate(() => {
    const toaster = document.getElementById("demo-toaster-default") as any;
    let resolveSuccess: (value: unknown) => void = () => {};
    let rejectError: (reason?: unknown) => void = () => {};
    const successPromise = new Promise((resolve) => {
      resolveSuccess = resolve;
    });
    const errorPromise = new Promise((_, reject) => {
      rejectError = reject;
    });
    (window as any).__resolveSuccess = resolveSuccess;
    (window as any).__rejectError = rejectError;

    toaster.promiseToast(successPromise, {
      loading: {
        id: "promise-success-toast",
        description: "Creating event…"
      },
      success: (data: { name: string }) => `${data.name} created.`,
      error: "Could not create event."
    });
    toaster
      .promiseToast(errorPromise, {
        loading: {
          id: "promise-error-toast",
          description: "Uploading…"
        },
        success: "Uploaded.",
        error: "Upload failed."
      })
      .catch(() => {});
  });

  const successToast = page.locator("#promise-success-toast");
  const errorToast = page.locator("#promise-error-toast");
  await expect(successToast).toHaveAttribute("data-type", "loading");
  await expect(successToast).toHaveAttribute("data-duration", "0");
  await expect(successToast.locator("[data-slot='description']")).toHaveText(
    "Creating event…"
  );
  await expect(successToast.locator("[data-slot='title']")).toBeHidden();
  await expect(successToast.locator("[data-slot='content']")).toHaveAttribute(
    "aria-busy",
    "true"
  );
  await expect(errorToast).toHaveAttribute("data-type", "loading");

  await page.evaluate(() => (window as any).__resolveSuccess({ name: "Event" }));
  await expect(successToast).toHaveAttribute("data-type", "success");
  await expect(successToast.locator("[data-slot='description']")).toHaveText(
    "Event created."
  );
  await expect(successToast.locator("[data-slot='title']")).toBeHidden();
  await expect(successToast.locator("[data-slot='content']")).not.toHaveAttribute(
    "aria-busy",
    "true"
  );
  expect(await successToast.getAttribute("data-duration")).toBeNull();

  await page.evaluate(() =>
    (window as any).__rejectError(new Error("nope"))
  );
  await expect(errorToast).toHaveAttribute("data-type", "error");
  await expect(errorToast.locator("[data-slot='description']")).toHaveText(
    "Upload failed."
  );
  expect(await errorToast.getAttribute("data-duration")).toBeNull();
  await expect(errorToast.locator("[data-slot='content']")).toHaveAttribute(
    "role",
    "status"
  );
});

test("swipe dismisses a toast with reason swipe", async ({ page }) => {
  await mount(
    page,
    "swipe",
    `<div class="toaster" data-test-swipe>
  <div class="toast" role="status" data-duration="0">
    <div data-slot="content">
      <section><p data-slot="title">Swipe me</p><p data-slot="description">Drag to dismiss.</p></section>
      <button type="button" data-slot="close" aria-label="Dismiss">×</button>
    </div>
  </div>
</div>`
  );

  const toaster = page.locator('[data-test="swipe"] .toaster');
  await expect(toaster).toHaveAttribute("data-toast-initialized", "", {
    timeout: 2000
  });
  const toast = toaster.locator(".toast");
  await page.evaluate(() => {
    document
      .querySelector('[data-test="swipe"] .toast')
      ?.addEventListener("dismiss", (event) => {
        (window as any).__swipeReason = (event as CustomEvent).detail.reason;
      });
  });

  const box = await toast.boundingBox();
  if (!box) throw new Error("toast has no box");
  const startX = box.x + box.width * 0.3;
  const startY = box.y + box.height * 0.5;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + box.width * 0.6, startY, { steps: 8 });
  await page.mouse.up();

  await expect(toast).toHaveJSProperty("hidden", true, { timeout: 3000 });
  expect(await page.evaluate(() => (window as any).__swipeReason)).toBe("swipe");
  await expect(toaster).toHaveCSS("--toast-expanded", "0");
});
