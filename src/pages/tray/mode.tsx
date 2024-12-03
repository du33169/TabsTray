import { ASSET } from "@/strings"

const enum TrayMode {//current mode of the tray
	TAB = "tab", POPUP = "popup", IN_PAGE = "in-page"
}

// fetch expandAble from current tab status
async function fetchTrayMode(): Promise<TrayMode> {
	if (window.location.href === browser.runtime.getURL(ASSET.PAGE.TRAY_TAB)) {
		return (TrayMode.TAB);
	}
	else if (window.location.href === browser.runtime.getURL(ASSET.PAGE.TRAY_POPUP)) {
		return (TrayMode.POPUP);
	}
	else {
		return (TrayMode.IN_PAGE);
	}
}

export { TrayMode,fetchTrayMode };