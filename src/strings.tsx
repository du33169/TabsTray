const manifest = browser.runtime.getManifest();

const META = {
	EXT_NAME: manifest.name as string,
	HOMEPAGE_URL: manifest.homepage_url as string,
	AUTHOR: manifest.author as string,
	CONTRIBUTORS: [] as string[],
	SPONSORS: [] as string[],
	VERSION: manifest.version as string,
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