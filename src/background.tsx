import { updateIcon } from "@/action/action_icon"
import { launch_tray } from "@/pages/tray/launch_tray"
import { get_tabChangeEvents } from "@/utils";
import { get_options } from "@/pages/options/options_schema"
import { server_install } from "./browserProxy/server";
import { ASSET } from "@/strings"

console.log("Background script running");

// Update popup action based on options
async function update_action_popup() {
	const options = await get_options();
	browser.action.setPopup({ popup: options.launch_mode === "popup" ? browser.runtime.getURL(ASSET.PAGE.TRAY_POPUP) : "" });
}
update_action_popup();
browser.storage.onChanged.addListener(update_action_popup);

// Launch tray on action click
browser.action.onClicked.addListener(launch_tray);
browser.action.onClicked.addListener(() => console.log("action clicked"))

// Update icon on tab change
get_tabChangeEvents().forEach(event => { event.addListener(updateIcon) });
browser.theme.onUpdated.addListener(updateIcon);
updateIcon();

server_install();