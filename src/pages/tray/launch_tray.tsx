import { open_page_singleton } from "@/utils";
import { OptionsSchema, get_options } from "../options/options_schema";

export async function launch_tray_in_tab() {
	const TrayPagePath = "/pages/tray.html"; // Relative path to your extension page
	await open_page_singleton(TrayPagePath); // Open the extension page in a new tab if it doesn't exist
}
export async function launch_tray() {
	console.log("Launching tray");
	const options = await get_options();
	
	switch (options.default_launch_mode) {
		case OptionsSchema.shape.default_launch_mode.enum.tab:
			// check if there is an existing tab with the URL of "pages/index.html"
			console.log("Tab mode");
			await launch_tray_in_tab();
			break;
		case OptionsSchema.shape.default_launch_mode.enum.popup:
			// Open the extension popup
			console.error("Should not be here. browser should open popup by default if the url is set.")
			// console.log("Popup mode");
			// browser.action.openPopup().then(console.log).catch(console.error);
			break;
		case OptionsSchema.shape.default_launch_mode.enum.drawer:
			console.log("Drawer mode");
			console.log("Drawer mode not implemented yet");
			break;
		default:
			console.error("Invalid default launch mode", options.default_launch_mode);
			break;
	}

}