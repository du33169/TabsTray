// delete build folder
import fs from "fs-extra";
import path from "path";
import type {BuildConfig} from "bun"
const buildDir = path.join(__dirname, "build");
const extDir = path.join(__dirname, "ext");
const manifestDir = path.join(__dirname, "manifest");
var browserTarget: string = process.argv[2]
if (browserTarget !== "chrome" && browserTarget !== "firefox") {
	console.error("Please specify the browser target: chrome or firefox, got: " + browserTarget);
	process.exit(1);
}
const isFirefox = browserTarget.toLowerCase() === "firefox";
const buildConfig: BuildConfig = {
	root: './src',
	entrypoints: [
		"./src/pages/tray/index.tsx",
		"./src/pages/tray/tray_in_page.tsx",
		"./src/pages/options/options.tsx",
		"./src/background.tsx"
	],
	outdir: "./build",
	sourcemap: "linked",
	define: isFirefox ? {
		"IS_FIREFOX": "true",
		"IS_CHROME": ""
	}:{ //use firefox api namespace
		"browser": "chrome",
		"IS_CHROME": "true",
		"IS_FIREFOX": ""
	} 
	// sourcemap: "none",
	// minify: true,
}
//
function clean_build_folder() {
	console.log("Cleaning build folder...");
	fs.rmdirSync(buildDir, { recursive: true });
}
//
function copy_extension_files() {
	console.log("Copying extension files to build folder...");
	fs.copy(extDir, buildDir, (err) => { if (err) throw err; });
}
function gererate_manifest() {
	console.log(`Generating manifest.json file for ${browserTarget}...`);
	const baseManifestFile = path.join(manifestDir, "manifest.base.json");
	const firefoxManifestFile = path.join(manifestDir, "manifest.firefox.json");
	const chromeManifestFile = path.join(manifestDir, "manifest.chrome.json");
	const baseManifest = JSON.parse(fs.readFileSync(baseManifestFile, "utf-8"));
	const firefoxManifest = JSON.parse(fs.readFileSync(firefoxManifestFile, "utf-8"));
	const chromeManifest = JSON.parse(fs.readFileSync(chromeManifestFile, "utf-8"));
	const manifest = {
		...baseManifest,
		...(isFirefox ? firefoxManifest : chromeManifest)
	};
	fs.writeFileSync(path.join(buildDir, "manifest.json"), JSON.stringify(manifest, null, 4));
}
// 
async function build_extension() {
	console.log("Building extension...");
	const result = await Bun.build(buildConfig);
	if (!result.success) {
		console.error("Build failed");
		for (const message of result.logs) {
			// Bun will pretty print the message object
			console.error(message);
		}
	}
	console.log("Build successful");
}

async function main() {
	clean_build_folder();
	await build_extension();
	copy_extension_files();
	gererate_manifest();
}

await main();