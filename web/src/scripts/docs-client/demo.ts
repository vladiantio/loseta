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
  }
};

let mounted = false;

/** Demo-only interactions. Registered once; the docs client never re-mounts it. */
export function mountDemo(): void {
  if (mounted) return;
  mounted = true;
  document.addEventListener("click", onClick);
  document.addEventListener("astro:page-load", () => {
    refreshIndeterminateCheckboxes();
  });
  refreshIndeterminateCheckboxes();
}
