export function get_tabChangeEvents(browserEventProvider = browser) {
	return [browserEventProvider.tabs.onActivated, browserEventProvider.tabs.onUpdated, browserEventProvider.tabs.onRemoved, browserEventProvider.tabs.onMoved, browserEventProvider.tabs.onCreated]
}

export async function open_page_singleton(
	extensionPagePath: string,
	browserApiProvider: typeof browser = browser,
	extraArgs: browser.tabs._UpdateUpdateProperties | browser.tabs._CreateCreateProperties = {}
) {
	// Get the full URL of the extension page moz-extension://<extension-internal-id>/<path>
	const extensionURL = browser.runtime.getURL(extensionPagePath); // this api is accesible from content script

	return browserApiProvider.tabs.query({ url: extensionURL })
		.then((tabs) => {
			if (tabs.length > 1) {
				console.warn(
					"Multiple tabs with extension page URL found. This should not happen."
				);
				return Promise.reject(
					"Multiple tabs with extension page URL found. This should not happen."
				);
			} else if (tabs.length == 1) {
				// If the tab is already open, switch to it
				const existingTab = tabs[0];
				return browserApiProvider.tabs.update(existingTab.id!, { active: true, ...extraArgs });
			} else {
				// If not, open a new tab with the extension page
				return browserApiProvider.tabs.create({ url: extensionURL, ...extraArgs });
			}
		})
		.catch((error) => {
			console.error("Error querying tabs:", error);
			return Promise.reject(error);
		});
}

const RESTRICED_URL_PATTERNS_FIREFOX: (string|RegExp)[] = [
    "accounts-static.cdn.mozilla.net",
    "accounts.firefox.com",
    "addons.cdn.mozilla.net",
    "addons.mozilla.org",
    "api.accounts.firefox.com",
    "content.cdn.mozilla.net",
    "discovery.addons.mozilla.org",
    "install.mozilla.org",
    "oauth.accounts.firefox.com",
    "profile.accounts.firefox.com",
    "support.mozilla.org",
	"sync.services.mozilla.com",
	/about:.*/
]

export function isRestrictedUrl(url: string): boolean {
	if (!url) return true;
	return RESTRICED_URL_PATTERNS_FIREFOX.some(pattern => {
		if (typeof pattern === "string") {
			return new URL(url).hostname.includes(pattern);
		} else {
			return pattern.test(url);
		}
	});

}

export function running_in_background_script(): boolean {
	// @ts-ignore
	if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getBackgroundPage) {
		return true;
	}
	return false;
}
export function running_in_content_script(): boolean {
	if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.id) {
		return true;
	}
	return false;
}