import path from "path";
import type {BuildConfig} from "bun"
async function build_extension(srcDir: string, buildDir: string, isFirefox: boolean, versionSuffix: string, dev: boolean) {
	const defaultDefines = {
		"_VERSION_SUFFIX": `"${versionSuffix}"` // must wrap in double quotes to be a string literal as we directly replace source code
	}
	const commonBuildConfig: BuildConfig = {
		root: srcDir,
		entrypoints:[],
		outdir: buildDir,
		define: isFirefox ? {
			// "browser" namespace is used in sourcecode
			"_IS_FIREFOX": "true",
			"_IS_CHROME": "",
			...defaultDefines,
		}:{ 
			"browser": "chrome",//use chrome api namespace
			"_IS_CHROME": "true",
			"_IS_FIREFOX": "",
			...defaultDefines,
		},
		sourcemap: dev? "linked":"none",
		// minify: !dev,
	}
	const extScript_BuildConfig: BuildConfig = {
		...commonBuildConfig,
		entrypoints: [
			path.join(srcDir, "pages/tray/index.tsx"),
			path.join(srcDir, "pages/options/options.tsx"),
			path.join(srcDir, "background.tsx")
		],
	}
	const contentScript_BuildConfig: BuildConfig = {
		...commonBuildConfig,
		entrypoints: [
			path.join(srcDir, "pages/tray/tray_in_page.tsx"),
		],
		format: "iife"
	}
	const buildConfigs = {
		"Extension Script": extScript_BuildConfig,
		"Content Script": contentScript_BuildConfig,
	}
	console.log("Building extension...");
	const buildPromises = Object.entries(buildConfigs).map(async ([name, config]) => {
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
	await Promise.all(buildPromises);
}

export {build_extension}