import fs from "fs-extra";
import path from "path";
function workaround_fix_next_themes_html_class(buildDir: string) {
	console.log("Workaround for next-themes...");
	const target = path.join(buildDir, "/pages/tray/tray_in_page.js");
	const targetStr = "P = document.documentElement";
	const replaceStr = `P = document.getElementById("Tabs_Tray_in_page_container")`;
	const content = fs.readFileSync(target, "utf-8");
	const newContent = content.replace(targetStr, replaceStr);
	fs.writeFileSync(target, newContent);
	console.log("Workaround for next-themes fixed");
}
export { workaround_fix_next_themes_html_class }