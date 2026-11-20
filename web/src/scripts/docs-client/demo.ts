const announce = (message: string): void => {
  let region = document.querySelector("[data-copy-status]");
  if (!region) {
    region = document.createElement("span");
    region.setAttribute("data-copy-status", "");
    region.setAttribute("role", "status");
    region.className = "sr-only";
    document.body.append(region);
  }
  region.textContent = "";
  requestAnimationFrame(() => {
    region.textContent = message;
  });
};

const questionnaireStep = (button: Element): void => {
  const root = button.closest(".questionnaire");
  if (!(root instanceof HTMLElement)) return;

  const steps = [...root.querySelectorAll<HTMLElement>("[data-slot='item']")];
  if (steps.length === 0) return;

  const current = Math.max(
    0,
    steps.findIndex((step) => step.getAttribute("aria-current") === "step")
  );
  const next = button.hasAttribute("data-demo-questionnaire-prev")
    ? current - 1
    : current + 1;
  if (next < 0 || next >= steps.length) return;

  steps.forEach((step, index) => {
    step.hidden = index !== next;
    if (index === next) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });

  const progress = root.querySelector<HTMLProgressElement>("progress");
  if (progress) {
    progress.value = next + 1;
    progress.textContent = `${next + 1} of ${steps.length}`;
  }

  const label = root.querySelector<HTMLElement>("[data-slot='progress-label']");
  if (label) label.textContent = `Question ${next + 1} of ${steps.length}`;

  const previous = root.querySelector<HTMLButtonElement>(
    "[data-demo-questionnaire-prev]"
  );
  if (previous) previous.disabled = next === 0;

  const forward = root.querySelector<HTMLButtonElement>(
    "[data-demo-questionnaire-next]"
  );
  if (forward) forward.disabled = next === steps.length - 1;

  steps[next]
    .querySelector<HTMLElement>("input, button, select, textarea")
    ?.focus();
};

const updateMessageScroller = (scroller: Element): void => {
  const viewport = scroller.querySelector<HTMLElement>(
    ".message-scroller-viewport"
  );
  const jump = scroller.querySelector<HTMLElement>("[data-slot='jump']");
  if (!viewport || !jump) return;

  const distance =
    viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
  jump.hidden = distance < 24;
};

const refreshMessageScrollers = (): void => {
  document
    .querySelectorAll<HTMLElement>("[data-demo='message-scroller']")
    .forEach(updateMessageScroller);
};

const refreshIndeterminateCheckboxes = (): void => {
  document
    .querySelectorAll<HTMLInputElement>("[data-demo-indeterminate]")
    .forEach((input) => {
      input.indeterminate = true;
    });
};

const onClick = async (event: MouseEvent): Promise<void> => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const copy = target.closest("[data-copy]");
  if (copy) {
    const block = copy.closest(".code-block, .install-command");
    const manager = document.documentElement.dataset.packageManager ?? "pnpm";
    const code =
      block?.querySelector(`[data-package-manager-panel="${manager}"] code`) ??
      block?.querySelector("code");
    if (code) {
      try {
        const lines = code.querySelectorAll("[data-slot='line']");
        const text =
          lines.length > 0
            ? Array.from(lines, (line) => line.textContent ?? "").join("\n")
            : code instanceof HTMLElement
              ? code.innerText
              : (code.textContent ?? "");
        await navigator.clipboard.writeText(text);
        const iconCopy =
          copy.hasAttribute("data-copy-icon") || Boolean(copy.querySelector("svg"));
        const previousText = copy.textContent;
        const previousLabel = copy.getAttribute("aria-label");
        if (iconCopy) {
          copy.setAttribute("data-copied", "true");
          copy.setAttribute("aria-label", "Copied");
        } else {
          copy.textContent = "Copied";
        }
        announce("Copied");
        setTimeout(() => {
          if (iconCopy) {
            copy.removeAttribute("data-copied");
            if (previousLabel) copy.setAttribute("aria-label", previousLabel);
          } else {
            copy.textContent = previousText;
          }
        }, 1500);
      } catch {
        announce("Copy failed");
      }
    }
    return;
  }

  const toggle = target.closest("[data-demo-toggle]");
  if (toggle instanceof HTMLButtonElement) {
    if (toggle.disabled) return;
    const pressed = toggle.getAttribute("aria-pressed") === "true";
    toggle.setAttribute("aria-pressed", String(!pressed));
    return;
  }

  const carouselButton = target.closest(
    "[data-demo-carousel-prev], [data-demo-carousel-next]"
  );
  if (carouselButton) {
    const carousel = carouselButton.closest(".carousel");
    const viewport = carousel?.querySelector<HTMLElement>(".carousel-viewport");
    if (viewport) {
      const vertical = carousel?.getAttribute("data-orientation") === "vertical";
      const direction = carouselButton.hasAttribute("data-demo-carousel-next") ? 1 : -1;
      viewport.scrollBy({
        left: vertical ? 0 : direction * viewport.clientWidth,
        top: vertical ? direction * viewport.clientHeight : 0,
        behavior: "smooth"
      });
    }
    return;
  }

  const carouselGo = target.closest("[data-demo-carousel-go]");
  if (carouselGo) {
    const carousel = carouselGo.closest(".carousel");
    const viewport = carousel?.querySelector<HTMLElement>(".carousel-viewport");
    const items = viewport?.querySelectorAll<HTMLElement>(".carousel-item");
    const index = Number(carouselGo.getAttribute("data-demo-carousel-go"));
    const item = items?.[index];
    if (viewport && item) {
      viewport.scrollTo({
        left: item.offsetLeft,
        top: item.offsetTop,
        behavior: "smooth"
      });
      carousel
        ?.querySelectorAll("[data-demo-carousel-go]")
        .forEach((dot) =>
          dot.setAttribute(
            "aria-current",
            dot === carouselGo ? "true" : "false"
          )
        );
    }
    return;
  }

  const questionnaire = target.closest(
    "[data-demo-questionnaire-next], [data-demo-questionnaire-prev]"
  );
  if (questionnaire) {
    questionnaireStep(questionnaire);
    return;
  }

  const scrollEnd = target.closest("[data-demo-scroll-end]");
  if (scrollEnd) {
    const scroller = scrollEnd.closest(".message-scroller");
    const viewport = scroller?.querySelector<HTMLElement>(
      ".message-scroller-viewport"
    );
    if (scroller && viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      updateMessageScroller(scroller);
    }
  }
};

const onScroll = (event: Event): void => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const scroller = target.closest("[data-demo='message-scroller']");
  if (scroller) updateMessageScroller(scroller);
};

let mounted = false;

/** Demo-only interactions. Registered once; the docs client never re-mounts it. */
export function mountDemo(): void {
  if (mounted) return;
  mounted = true;
  document.addEventListener("click", onClick);
  document.addEventListener("scroll", onScroll, true);
  document.addEventListener("astro:page-load", () => {
    refreshMessageScrollers();
    refreshIndeterminateCheckboxes();
  });
  refreshMessageScrollers();
  refreshIndeterminateCheckboxes();
}
