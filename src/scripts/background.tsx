import { updateIcon } from "./action/action_icon"
import { action_onclick } from "./action/action_click"
import { tabChangeEvents } from "./utils";
browser.action.onClicked.addListener(action_onclick);
tabChangeEvents.forEach(event => { event.addListener(updateIcon) });
browser.theme.onUpdated.addListener(updateIcon);
updateIcon();

