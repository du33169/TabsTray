import { ASSET, META } from "@/strings"
import { open_page_singleton } from "@/utils"

//define a menu item type
type MenuItemType = browser.menus._CreateCreateProperties
const ACTION_MENUS: MenuItemType[] = []
const menu_actionOpenTabMode: MenuItemType = {
	id: "action-launch-tab",
	title: `Open ${META.EXT_NAME} in Tab Mode`,
	contexts: ["action"],
}
const menu_actionOpenOptions: MenuItemType = {
	id: "action-options",
	title: `Open ${META.EXT_NAME} Options`,
	contexts: ["action"],
}
ACTION_MENUS.push(
	menu_actionOpenTabMode,
	menu_actionOpenOptions
)
function handle_menu_click(info: browser.menus.OnClickData, tab?: browser.tabs.Tab) {
	console.log("on menu click", info.menuItemId)
	switch (info.menuItemId) {
		case menu_actionOpenTabMode.id:
			open_page_singleton(ASSET.PAGE.TRAY_TAB);
			break;
		case menu_actionOpenOptions.id:
			open_page_singleton(ASSET.PAGE.OPTIONS);
			break;
		default:
			console.error("unknown menu item clicked", info.menuItemId)
			break;
	}
}

export { ACTION_MENUS, handle_menu_click }