import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { build_extension } from "./bun_build_ext";
import { gererate_manifest } from "./gen_manifest";
import { workaround_fix_next_themes_html_class } from "./workaround_next_themes_html";
import { generate_license_data } from "./export_license";
import { generate_changelog } from "./gen_changelog";

//directories
const projDir = path.resolve(path.join(__dirname, ".."));
console.log("Project directory: " + projDir);
const srcDir = path.join(projDir, "src");
const buildDir = path.join(projDir, "build");
const distDir = path.join(projDir, "dist");
const extDir = path.join(projDir, "ext");
const manifestDir = path.join(projDir, "manifest");

//arguments
const argv = yargs(process.argv)
	.version(false) // disable version of yargs as we use it to set ext version
	.option("version", {
		type: "string",
		description: "Extension version",
		default: "0.0.0",
	})
	.option("dev", {
		type: "boolean",
		description: "Build in development mode",
		default: false,
	}).option("browser", {
		type: "string",
		description: "Target browser",
		choices: ["chrome", "firefox"],
		default: "firefox",
	}).parseSync();

const extVersion = argv.version;
const dev = argv.dev;
const browserTarget = argv.browser;

//version check
if (!dev && extVersion === "0.0.0") {
	console.error("[Error] Production mode with version 0.0.0. Set a valid version.");
	process.exit(1);
}

console.log("Building version " + extVersion + " for " + browserTarget + " in " + (dev ? "development" : "production") + " mode...");

const isFirefox = browserTarget.toLowerCase() === "firefox";

function clean_build_folder() {
	console.log("Cleaning build folder...");
	fs.rmdirSync(buildDir, { recursive: true });
	fs.mkdirSync(buildDir);
}

function copy_extension_files() {
	console.log("Copying extension files to build folder...");
	fs.copy(extDir, buildDir, (err) => { if (err) throw err; });

	const assetsMappingPair = {
		"LICENSE": "LICENSE",
		"CHANGELOG.md": "CHANGELOG.md",
		"README.md": "README.md",
		"assets/docs": "docs",
	}
	Object.entries(assetsMappingPair).forEach(([src, dest]) => {
		fs.copy(path.join(projDir, src), path.join(buildDir, dest), (err) => { if (err) throw err; });
	});
}

async function main() {
	clean_build_folder();
	await build_extension(srcDir, buildDir, isFirefox, dev);
	generate_changelog(extVersion);
	copy_extension_files();
	workaround_fix_next_themes_html_class(buildDir);
	gererate_manifest(manifestDir, buildDir, extVersion, isFirefox);
	generate_license_data(projDir, buildDir);
}

await main();