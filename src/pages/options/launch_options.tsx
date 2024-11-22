import { open_page_singleton } from "@/utils";
export async function launch_options() {
	// check if there is an existing tab with the URL of "pages/index.html"
	const extensionPagePath = "/pages/options.html"; // Relative path to your extension page
	await open_page_singleton(extensionPagePath); // Open the extension page in a new tab if it doesn't exist
}