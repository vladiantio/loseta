import assert from "node:assert/strict";
import { test } from "node:test";
import { PromptAgent } from "@topcli/prompts";
import { confirm, isCancel, select, text } from "../src/prompts.js";

const agent = PromptAgent.agent<unknown>();

function resetAgent(t: { after(fn: () => void): void }): void {
  agent.nextAnswers.length = 0;
  t.after(() => {
    agent.nextAnswers.length = 0;
  });
}

test("text returns the entered value", async (t) => {
  resetAgent(t);
  agent.nextAnswer("app/styles");

  assert.equal(
    await text({ message: "Directory", defaultValue: "src/styles/loseta" }),
    "app/styles"
  );
});

test("confirm returns the selected boolean", async (t) => {
  resetAgent(t);
  agent.nextAnswer(true);

  assert.equal(await confirm({ message: "Continue?", initialValue: false }), true);
});

test("select accepts an initial value and style hints", async (t) => {
  resetAgent(t);
  agent.nextAnswer("vega");

  assert.equal(
    await select({
      message: "Style",
      options: [
        { value: "nova", label: "Nova", hint: "Default" },
        { value: "vega", label: "Vega", hint: "Compact" }
      ],
      initialValue: "vega"
    }),
    "vega"
  );
});

test("Ctrl-C cancels a prompt", { timeout: 5_000 }, async (t) => {
  resetAgent(t);
  const pending = text({ message: "Cancel me" });

  process.stdin.emit("keypress", "\u0003", { name: "c", ctrl: true });

  assert.ok(isCancel(await pending));
});

test("ordinary values are not cancellation sentinels", () => {
  assert.equal(isCancel(""), false);
  assert.equal(isCancel(false), false);
  assert.equal(isCancel(undefined), false);
});
