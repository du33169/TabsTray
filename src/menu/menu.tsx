import { ACTION_MENUS, handle_menu_click } from "./menu_items";

function menu_register() {
	browser.menus.removeAll(); //clear all existing menus
	ACTION_MENUS.forEach(menuItem => {
		browser.menus.create(menuItem)
	});

}

function menu_init() {
	browser.runtime.onInstalled.addListener(menu_register)
}



function menu_click_listener_install() {
	browser.menus.onClicked.addListener(handle_menu_click)
}
export { menu_init, menu_click_listener_install }