import { updateIcon } from "@/action/action_icon"
import { launch_tray } from "@/pages/tray/launch_tray"
import { tabChangeEvents } from "@/utils";
import {get_options} from "@/pages/options/options_schema"
console.log("Background script running");

// Update popup action based on options
async function update_action_popup() {
	const options = await get_options();
	browser.action.setPopup({ popup: options.default_launch_mode === "popup" ? browser.runtime.getURL("/pages/tray.html") : "" });
}
update_action_popup();
browser.storage.onChanged.addListener(update_action_popup);

// Launch tray on action click
browser.action.onClicked.addListener(launch_tray);
browser.action.onClicked.addListener(() => console.log("action clicked"))

// Update icon on tab change
tabChangeEvents.forEach(event => { event.addListener(updateIcon) });
browser.theme.onUpdated.addListener(updateIcon);
updateIcon();


