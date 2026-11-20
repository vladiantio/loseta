import type { Example } from "./types";

export const questionnaireExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="questionnaire">
  <div data-slot="progress">
    <span data-slot="progress-label" id="questionnaire-default-progress" aria-live="polite">Question 1 of 1</span>
    <progress aria-labelledby="questionnaire-default-progress" value="1" max="1">1 of 1</progress>
  </div>
  <fieldset data-slot="item" aria-current="step">
    <legend>What should the agent build next?</legend>
    <p data-slot="description">Choose a direction or describe another task.</p>
    <div data-slot="choices">
      <label class="questionnaire-choice">
        <input type="radio" name="questionnaire-default" value="timeline" checked>
        <span data-slot="text">
          <span data-slot="label">Tool call timeline</span>
          <span data-slot="description">Show what the agent ran and what came back.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="radio" name="questionnaire-default" value="checkpoints">
        <span data-slot="text">
          <span data-slot="label">Approval checkpoints</span>
          <span data-slot="description">Ask before sensitive or destructive actions.</span>
        </span>
      </label>
      <input type="text" data-slot="input" name="questionnaire-default-other" aria-label="Another answer" placeholder="Type another answer…">
    </div>
  </fieldset>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="outline">Skip</button>
    <button type="button" class="btn">Submit</button>
  </div>
</div>`
    },
    {
      title: "Steps",
      html: `<div class="questionnaire">
  <div data-slot="progress">
    <span data-slot="progress-label" id="questionnaire-progress" aria-live="polite">Question 1 of 2</span>
    <progress aria-labelledby="questionnaire-progress" value="1" max="2">1 of 2</progress>
  </div>
  <fieldset data-slot="item" aria-current="step">
    <legend>What should the agent build next?</legend>
    <p data-slot="description">Choose a direction or describe another task.</p>
    <div data-slot="choices">
      <label class="questionnaire-choice">
        <input type="radio" name="direction" value="timeline" checked>
        <span data-slot="text">
          <span data-slot="label">Tool call timeline</span>
          <span data-slot="description">Show what the agent ran and what came back.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="radio" name="direction" value="checkpoints">
        <span data-slot="text">
          <span data-slot="label">Approval checkpoints</span>
          <span data-slot="description">Ask before sensitive or destructive actions.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="radio" name="direction" value="handoffs">
        <span data-slot="text">
          <span data-slot="label">Sub-agent handoffs</span>
          <span data-slot="description">Make delegated work and results easier to follow.</span>
        </span>
      </label>
      <input type="text" data-slot="input" name="other" aria-label="Another answer" placeholder="Type another answer…">
    </div>
  </fieldset>
  <fieldset data-slot="item" hidden>
    <legend>What context should the agent inspect?</legend>
    <p data-slot="description">Select every source that may affect the implementation.</p>
    <div data-slot="choices">
      <label class="questionnaire-choice">
        <input type="checkbox" name="context" value="files">
        <span data-slot="text">
          <span data-slot="label">Relevant source files</span>
          <span data-slot="description">Components, styles and tests touched by the change.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="checkbox" name="context" value="tests" checked>
        <span data-slot="text">
          <span data-slot="label">Existing tests</span>
          <span data-slot="description">Unit and browser coverage for the affected area.</span>
        </span>
      </label>
      <label class="questionnaire-choice">
        <input type="checkbox" name="context" value="history">
        <span data-slot="text">
          <span data-slot="label">Recent commit history</span>
          <span data-slot="description">Changes that explain the current behavior.</span>
        </span>
      </label>
    </div>
  </fieldset>
  <div data-slot="actions">
    <button type="button" class="btn" data-variant="outline" data-slot="previous" disabled>Previous</button>
    <button type="button" class="btn" data-slot="next">Next</button>
  </div>
</div>`
    }
];
