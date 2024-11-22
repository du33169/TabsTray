import { updateIcon } from "@/action/action_icon"
import { launch_tray } from "@/pages/tray/launch_tray"
import { tabChangeEvents } from "@/utils";
import {update_local_options} from "@/pages/options/options_schema"
console.log("Background script running");
update_local_options();
browser.action.onClicked.addListener(launch_tray);
browser.action.onClicked.addListener(()=>console.log("action clicked"))
tabChangeEvents.forEach(event => { event.addListener(updateIcon) });
browser.theme.onUpdated.addListener(updateIcon);
updateIcon();


