import fs from "fs-extra";
import path from "path";
function gererate_manifest(manifestDir: string, buildDir: string, extVersion: string, isFirefox: boolean) {
	console.log(`Generating manifest.json file for ${isFirefox ? "Firefox" : "Chrome"}...`);
	const baseManifestFile = path.join(manifestDir, "manifest.base.json");
	const firefoxManifestFile = path.join(manifestDir, "manifest.firefox.json");
	const chromeManifestFile = path.join(manifestDir, "manifest.chrome.json");
	const baseManifest = JSON.parse(fs.readFileSync(baseManifestFile, "utf-8"));
	const firefoxManifest = JSON.parse(fs.readFileSync(firefoxManifestFile, "utf-8"));
	const chromeManifest = JSON.parse(fs.readFileSync(chromeManifestFile, "utf-8"));

	function merge_manifest(base: object|Array<any>, source:object|Array<any> ) {
		if (Array.isArray(base)) {
			return base.concat(source);
		} else if (base instanceof Object) {
			const result = {...base};
			for (const key in source) {
				if (key in base) {//@ts-ignore
					result[key] = merge_manifest(base[key], source[key]);
				} else {//@ts-ignore
					result[key] = source[key];
				}
			}
			return result;
		} else {
			console.error("Unsupported manifest type");
			process.exit(1);
		}
	
	}
	const manifest = merge_manifest(baseManifest, isFirefox ? firefoxManifest : chromeManifest);
	//@ts-ignore
	manifest.version = extVersion;
	fs.writeFileSync(path.join(buildDir, "manifest.json"), JSON.stringify(manifest, null, 4));
}

export { gererate_manifest }