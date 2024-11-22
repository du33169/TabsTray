export const tabChangeEvents = [browser.tabs.onUpdated, browser.tabs.onRemoved, browser.tabs.onMoved, browser.tabs.onCreated]

export function open_page_singleton(extensionPagePath: string) {
	// Get the full URL of the extension page moz-extension://<extension-internal-id>/<path>
	const extensionURL = browser.runtime.getURL(extensionPagePath);

	browser.tabs.query({ url: extensionURL })
		.then((tabs) => {
			if (tabs.length > 1) {
				console.warn(
					"Multiple tabs with extension page URL found. This should not happen."
				);
			} else if (tabs.length == 1) {
				// If the tab is already open, switch to it
				const existingTab = tabs[0];
				browser.tabs.update(existingTab.id!, { active: true });
			} else {
				// If not, open a new tab with the extension page
				browser.tabs.create({ url: extensionURL });
			}
		})
		.catch((error) => {
			console.error("Error querying tabs:", error);
		});
}
