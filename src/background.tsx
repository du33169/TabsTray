import { update_icon_on_theme_install } from "@/action/action_icon"
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

//@ts-ignore
update_icon_on_theme_install();


server_install([
	{ api: 'tabs', event: 'onUpdated' },
	{ api: 'tabs', event: 'onActivated' },
	{ api: 'tabs', event: 'onRemoved' },
	{ api: 'tabs', event: 'onMoved' },
	{ api: 'tabs', event: 'onCreated' },
	{ api: 'theme', event: 'onUpdated' }
]);