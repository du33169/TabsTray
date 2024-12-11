const META = {
	EXT_NAME: "Tabs Tray" as string,

}
const KEY = {
	IN_PAGE_CONTAINER_ID: (META.EXT_NAME.replaceAll(" ", "_") + "_in_page_container") as string,
}
const ASSET = {
	PAGE: {
		OPTIONS: "/pages/options.html",
		TRAY_TAB: "/pages/tray/tab.html",
		TRAY_POPUP: "/pages/tray/popup.html",
	},
	JS: {
		OPTIONS: "/pages/options/options.js",
		TRAY_INDEX: "/pages/tray/index.js",
		TRAY_IN_PAGE: "/pages/tray/tray_in_page.js"
	}
}

export { META, KEY, ASSET }