const manifest = browser.runtime.getManifest();

const MACRO = {
	// @ts-ignore predefined VERSION_SUFFIX
	VERSION_SUFFIX: _VERSION_SUFFIX,
	// @ts-ignore predefined IS_FIREFOX
	IS_FIREFOX: _IS_FIREFOX,
	// @ts-ignore predefined IS_CHROME
	IS_CHROME: _IS_CHROME,
}
const META = {
	EXT_NAME: manifest.name as string,
	HOMEPAGE_URL: manifest.homepage_url as string,
	AUTHOR: manifest.author as string,
	CONTRIBUTORS: [] as string[],
	SPONSORS: [] as string[],
	VERSION: manifest.version as string,
	//@ts-ignore predefined VERSION_SUFFIX
	VERSION_SUFFIX: MACRO.VERSION_SUFFIX,
	REPORT_BUG_URL: "https://github.com/du33169/TabsTray/issues/new" as string,
	SPONSOR_URL: "https://github.com/sponsors/du33169" as string,
	LICENSE: "GPL-3.0" as string
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
	},
	LICENSE: "/LICENSE" as string,
	LICENSE_DATA: "/pages/options/about/license_data.json",
	DOCS: {
		USAGE: "/docs/usage.md",
		CHANGELOG: "/CHANGELOG.md",
		README: "/README.md",
	}
}

export { MACRO, META, KEY, ASSET }