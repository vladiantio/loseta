import "./behaviors";
import { componentPreview } from "./component-preview";
import { controls } from "./controls";
import { mountDemo } from "./demo";
import { startPageLifecycle } from "./lifecycle";
import { navigation } from "./navigation";
import { applyPreferences } from "./preferences";
import { search } from "./search";
import { toc } from "./toc";

mountDemo();

startPageLifecycle({
  behaviors: [navigation, controls, componentPreview, search, toc],
  applyPreferences
});
