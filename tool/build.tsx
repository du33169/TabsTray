import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { build_extension } from "./bun_build_ext";
import { gererate_manifest } from "./gen_manifest";
import { workaround_fix_next_themes_html_class } from "./workaround_next_themes_html";
import { generate_license_data } from "./export_license";
import { generate_changelog } from "./gen_changelog";
import { get_version } from "./gen_version";
import { pack_src } from "./pack";
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

const dev = argv.dev;
const versionPackage = get_version();
const browserTarget = argv.browser;
if (!dev && versionPackage.suffix !== "") {
	console.error("Cannot build in release mode with a nightly build version", versionPackage.scmVersion);
	process.exit(1);
}
console.log("Building version " + versionPackage.scmVersion + " for " + browserTarget + " in " + (dev ? "development" : "production") + " mode...");

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
	await build_extension(srcDir, buildDir, isFirefox, versionPackage.suffix, dev);
	generate_changelog();
	copy_extension_files();
	workaround_fix_next_themes_html_class(buildDir);
	gererate_manifest(manifestDir, buildDir, versionPackage.version, isFirefox); // manifest version should not contain "v" prefix
	generate_license_data(projDir, buildDir);
	!dev && pack_src(projDir, distDir, versionPackage.version);
}

await main();