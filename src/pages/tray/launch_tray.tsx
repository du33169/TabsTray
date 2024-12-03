import { open_page_singleton } from "@/utils";
import { OptionsSchema, get_options } from "@/pages/options/options_schema";
import { ASSET } from "@/strings"

export async function launch_tray(tab: browser.tabs.Tab) {
	console.log("Launching tray");
	const options = await get_options();
	
	switch (options.launch_mode) {
		case OptionsSchema.shape.launch_mode.enum.tab:
			// check if there is an existing tab with the URL of "pages/index.html"
			console.log("Tab mode");
			await open_page_singleton(ASSET.PAGE.TRAY_TAB,browser,{pinned:options.pin_tray_tab});
			break;
		case OptionsSchema.shape.launch_mode.enum.popup:
			// Open the extension popup
			console.error("Should not be here. browser should open popup by default if the url is set.")
			// console.log("Popup mode");
			// browser.action.openPopup().then(console.log).catch(console.error);
			break;
		case OptionsSchema.shape.launch_mode.enum.drawer:
			console.log("Drawer mode");
			try {
				const result = await browser.scripting.executeScript(
					{
						target: { tabId: tab.id! },
						// func: launch_tray_in_page,
						files: [ASSET.JS.TRAY_IN_PAGE],
						injectImmediately: true,
					}
				)
				console.log(result);
				if (result.length == 1 && result[0] == undefined) {
					console.warn("Cannot open tray in drawer mode on this tab.")
				}
				else {
					for (const r of result) {
						if (r.error) {
							console.error(r.error);
						}
					}
				}
			} catch (e) {
				console.error(e);
			}
			break;
		default:
			console.error("Invalid default launch mode", options.launch_mode);
			break;
	}

}