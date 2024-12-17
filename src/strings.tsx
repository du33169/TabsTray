const META = {
	EXT_NAME: "Tabs Tray" as string,
	HOMEPAGE_URL: "https://github.com/du33169/TabsTray" as string,
	AUTHOR: "Dylan Ulster (@du33169)" as string,
	CONTRIBUTORS: [] as string[],
	SPONSORS: [] as string[],
	VERSION: "1.0.0" as string,
	REPORT_BUG_URL: "https://github.com/du33169/TabsTray/issues/new" as string,
	SPONSOR_URL: "https://github.com/sponsors/du33169" as string,
}
const KEY = {
	IN_PAGE_CONTAINER_ID: (META.EXT_NAME.replaceAll(" ", "_") + "_in_page_container") as string,
}
const ASSET = {
	ICON: {
		EXT: "/icons/icon.svg",
	},
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