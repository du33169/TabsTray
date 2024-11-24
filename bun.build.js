// delete build folder
const fs = require("fs-extra");
const path = require("path");
//
console.log("Cleaning build folder...");
const buildDir = path.join(__dirname, "build");
const extDir= path.join(__dirname, "ext");
fs.rmdirSync(buildDir, { recursive: true });

//
console.log("Copying extension files to build folder...");
fs.copy(extDir, buildDir, { recursive: true }, (err) => { if (err) throw err; });

// 
console.log("Building extension...");
const result = await Bun.build({
	root: './src',
	entrypoints: [
		"./src/pages/tray/index.tsx",
		"./src/pages/tray/tray_in_page.tsx",
		"./src/pages/options/options.tsx",
		"./src/background.tsx"
	],
	outdir: "./build",
	sourcemap: "linked"
});
if (!result.success) {
	console.error("Build failed");
	for (const message of result.logs) {
	  // Bun will pretty print the message object
	  console.error(message);
	}
}
console.log("Build successful");

