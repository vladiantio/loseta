// The docs preview runs the shipped behavior modules directly.
import "../../../../packages/loseta/registry/behaviors/dialog.js";
import "../../../../packages/loseta/registry/behaviors/popover.js";
import "../../../../packages/loseta/registry/behaviors/menu.js";
import "../../../../packages/loseta/registry/behaviors/tabs.js";
import "../../../../packages/loseta/registry/behaviors/select.js";
import "../../../../packages/loseta/registry/behaviors/combobox.js";
import "../../../../packages/loseta/registry/behaviors/command.js";
import "../../../../packages/loseta/registry/behaviors/toast.js";
import "../../../../packages/loseta/registry/behaviors/code-block.js";
import "../../../../packages/loseta/registry/behaviors/calendar.js";
import "../../../../packages/loseta/registry/behaviors/carousel.js";
import "../../../../packages/loseta/registry/behaviors/resizable.js";
import "../../../../packages/loseta/registry/behaviors/questionnaire.js";
import { mount as mountMessageScrollers } from "../../../../packages/loseta/registry/behaviors/message-scroller.js";
import "../../../../packages/loseta/registry/behaviors/hover-overlay.js";

if (typeof document !== "undefined") {
  document.addEventListener("astro:page-load", () => {
    mountMessageScrollers(document);
  });
}
