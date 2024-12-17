import { ASSET, META } from "@/strings"
import { open_page_singleton } from "@/utils"
const ACTION_MENUS: browser.menus._CreateCreateProperties[] = [
	{
		id: "action-options",
		title: META.EXT_NAME + " " + "Options",
		contexts: ["action"],
	},
]
function handle_menu_click(info: browser.menus.OnClickData, tab?: browser.tabs.Tab) {
	console.log("on menu click", info.menuItemId)
	switch (info.menuItemId) {
		case "action-options":
			open_page_singleton(ASSET.PAGE.OPTIONS);
			break;
		default:
			console.error("unknown menu item clicked", info.menuItemId)
			break;
	}
}

export { ACTION_MENUS, handle_menu_click }