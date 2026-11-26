import { isCancel, text } from "../../src/prompts.js";

const beforeRaw = Boolean(process.stdin.isRaw);
const answer = await text({
  message: "PTY fixture prompt",
  defaultValue: "default value"
});
const afterRaw = Boolean(process.stdin.isRaw);

console.log(
  `PTY_RESULT=${JSON.stringify({
    cancelled: isCancel(answer),
    value: isCancel(answer) ? null : answer,
    beforeRaw,
    afterRaw
  })}`
);
