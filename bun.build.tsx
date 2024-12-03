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

const commonBuildConfig: BuildConfig = {
	root: './src',
	entrypoints:[],
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
const extScript_BuildConfig: BuildConfig = {
	...commonBuildConfig,
	entrypoints: [
		"./src/pages/tray/index.tsx",
		"./src/pages/options/options.tsx",
		"./src/background.tsx"
	],
}
const contentScript_BuildConfig: BuildConfig = {
	...commonBuildConfig,
	entrypoints: [
		"./src/pages/tray/tray_in_page.tsx",
	],
	format: "iife"
}
const buildConfigs = {
	"Extension Script": extScript_BuildConfig,
	"Content Script": contentScript_BuildConfig,
}
//
function clean_build_folder() {
	console.log("Cleaning build folder...");
	fs.rmdirSync(buildDir, { recursive: true });
	fs.mkdirSync(buildDir);
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

	function merge_mainfest(base: object|Array<any>, source:object|Array<any> ) {
		if (Array.isArray(base)) {
			return base.concat(source);
		} else if (typeof base === "object") {
			const result = {...base};
			for (const key in source) {
				if (key in base) {//@ts-ignore
					result[key] = merge_mainfest(base[key], source[key]);
				} else {//@ts-ignore
					result[key] = source[key];
				}
			}
			return result;
		} else {
			console.error("Unsupported manifest type");
			process.exit(1);
			return null;
		}
	
	}
	const manifest = merge_mainfest(baseManifest, isFirefox ? firefoxManifest : chromeManifest);
	fs.writeFileSync(path.join(buildDir, "manifest.json"), JSON.stringify(manifest, null, 4));
}
// 
async function build_extension() {
	console.log("Building extension...");
	Object.entries(buildConfigs).forEach(async ([name, config]) => {
		console.log(`Building ${name}...`);
		const result = await Bun.build(config);
		if (!result.success) {
			console.error(`Build ${name} failed`);
			for (const message of result.logs) {
				// Bun will pretty print the message object
				console.error(message);
			}
		}
		console.log(`Build ${name} successful`);
	});
}

async function main() {
	clean_build_folder();
	await build_extension();
	copy_extension_files();
	gererate_manifest();
}

await main();