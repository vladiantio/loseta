import type { Example } from "./types";
import {
  circleCheck,
  close,
  info,
  loader,
  octagonX,
  triangleAlert
} from "./icons";

const toastTemplate = `<template data-slot="toast-template">
  <li class="toast">
    <div data-slot="content" role="status" aria-atomic="true">
      <span data-slot="icon" hidden></span>
      <section>
        <p data-slot="title" hidden></p>
        <p data-slot="description" hidden></p>
      </section>
      <button type="button" class="btn" data-variant="outline" data-size="sm" data-slot="action" hidden></button>
      <button type="button" data-slot="close" aria-label="Dismiss">${close}</button>
    </div>
  </li>
</template>`;

const toastIcons = `<template data-toast-icon="success">${circleCheck}</template>
<template data-toast-icon="info">${info}</template>
<template data-toast-icon="warning">${triangleAlert}</template>
<template data-toast-icon="error">${octagonX}</template>
<template data-toast-icon="loading">${loader}</template>`;

const toaster = (id: string) =>
  `<ol id="${id}" class="toaster" data-toast-limit="3" role="list" aria-label="Notifications">
${toastTemplate}
${toastIcons}
</ol>`;

const trigger = (id: string, label: string) =>
  `<button type="button" class="btn" data-variant="outline" id="${id}">${label}</button>`;

const script = (code: string) => `<script>
  (() => {
${code
  .split("\n")
  .map((line) => (line ? `    ${line}` : ""))
  .join("\n")}
  })();
</script>`;

export const toastExamples: Example[] = [
  {
    title: "Default",
    html: `${trigger("demo-toast-default-trigger", "Show toast")}

${toaster("demo-toaster-default")}

${script(`const toaster = document.getElementById("demo-toaster-default");

document.getElementById("demo-toast-default-trigger").addEventListener("click", () => {
  toaster.addToast({
    title: "Event created",
    description: "Sunday, December 3 at 9:00 AM"
  });
});`)}`
  },
  {
    title: "With action",
    html: `${trigger("demo-toast-action-trigger", "Show toast")}

${toaster("demo-toaster-action")}

${script(`const toaster = document.getElementById("demo-toaster-action");

document.getElementById("demo-toast-action-trigger").addEventListener("click", () => {
  const id = toaster.addToast({
    title: "Event created",
    description: "You can undo this action.",
    actionProps: {
      children: "Undo",
      onClick() {
        toaster.closeToast(id);
      }
    }
  });
});`)}`
  },
  {
    title: "Types",
    html: `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center">
  ${trigger("demo-toast-type-success", "Success")}
  ${trigger("demo-toast-type-info", "Info")}
  ${trigger("demo-toast-type-warning", "Warning")}
  ${trigger("demo-toast-type-error", "Error")}
  ${trigger("demo-toast-type-loading", "Loading")}
</div>

${toaster("demo-toaster-types")}

${script(`const toaster = document.getElementById("demo-toaster-types");

document.getElementById("demo-toast-type-success").addEventListener("click", () => {
  toaster.addToast({
    type: "success",
    title: "Success",
    description: "Your changes have been saved."
  });
});

document.getElementById("demo-toast-type-info").addEventListener("click", () => {
  toaster.addToast({
    type: "info",
    title: "Info",
    description: "Your report is ready to view."
  });
});

document.getElementById("demo-toast-type-warning").addEventListener("click", () => {
  toaster.addToast({
    type: "warning",
    title: "Warning",
    description: "This action cannot be undone."
  });
});

document.getElementById("demo-toast-type-error").addEventListener("click", () => {
  toaster.addToast({
    type: "error",
    title: "Error",
    description: "Something went wrong. Try again.",
    priority: "high"
  });
});

document.getElementById("demo-toast-type-loading").addEventListener("click", () => {
  toaster.addToast({
    type: "loading",
    title: "Loading",
    description: "Preparing your export…"
  });
});`)}`
  },
  {
    title: "Stacked",
    html: `${trigger("demo-toast-stacked-trigger", "Show stacked toasts")}

${toaster("demo-toaster-stacked")}

${script(`const toaster = document.getElementById("demo-toaster-stacked");

document.getElementById("demo-toast-stacked-trigger").addEventListener("click", () => {
  toaster.addToast({
    title: "Event created",
    description: "Sunday, December 3 at 9:00 AM.",
    timeout: 0
  });
  toaster.addToast({
    title: "Invite sent",
    description: "Your teammate can now edit this event.",
    timeout: 0
  });
  toaster.addToast({
    title: "Sync complete",
    description: "Everything is up to date.",
    timeout: 0
  });
});`)}`
  },
  {
    title: "Persistent",
    html: `${trigger("demo-toast-persistent-trigger", "Show persistent toast")}

${toaster("demo-toaster-persistent")}

${script(`const toaster = document.getElementById("demo-toaster-persistent");

document.getElementById("demo-toast-persistent-trigger").addEventListener("click", () => {
  toaster.addToast({
    title: "Sync paused",
    description: "Resume when you are back online. This toast stays until dismissed.",
    timeout: 0
  });
});`)}`
  },
  {
    title: "Promise",
    html: `${trigger("demo-toast-promise-trigger", "Create event")}

${toaster("demo-toaster-promise")}

${script(`const toaster = document.getElementById("demo-toaster-promise");

document.getElementById("demo-toast-promise-trigger").addEventListener("click", () => {
  toaster.promiseToast(
    new Promise((resolve) => {
      setTimeout(() => resolve({ name: "Event" }), 2000);
    }),
    {
      loading: "Creating event…",
      success: (data) => \`\${data.name} created.\`,
      error: "Could not create event."
    }
  );
});`)}`
  }
];
