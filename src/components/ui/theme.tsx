// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme#colors

import { color } from "bun";
// commented some colors because they might be null
const FIREFOX_COLORS = {
	// not in doc but returned by theme
	button_primary: "button_primary",
	button_primary_active: "button_primary_active",
	button_primary_color: "button_primary_color",
	button_primary_hover: "button_primary_hover",

	// bookmark_text:"bookmark_text",
	// button_background_active:"button_background_active",
	// button_background_hover:"button_background_hover",
	icons:"icons",
	// icons_attention:"icons_attention",
	frame:"frame",
	frame_inactive:"frame_inactive",
	ntp_background:"ntp_background",
	ntp_card_background:"ntp_card_background",
	ntp_text:"ntp_text",
	popup:"popup",
	popup_border:"popup_border",
	popup_highlight:"popup_highlight",
	// popup_highlight_text:"popup_highlight_text",
	popup_text:"popup_text",
	sidebar:"sidebar",
	sidebar_border:"sidebar_border",
	// sidebar_highlight:"sidebar_highlight",
	// sidebar_highlight_text:"sidebar_highlight_text",
	sidebar_text:"sidebar_text",
	tab_background_text:"tab_background_text",
	tab_line:"tab_line",
	tab_loading:"tab_loading",
	tab_selected:"tab_selected",
	tab_text:"tab_text",
	toolbar:"toolbar",
	toolbar_bottom_separator:"toolbar_bottom_separator",
	toolbar_field:"toolbar_field",
	toolbar_field_border:"toolbar_field_border",
	// toolbar_field_border_focus:"toolbar_field_border_focus",
	toolbar_field_focus:"toolbar_field_focus",
	// toolbar_field_highlight:"toolbar_field_highlight",
	toolbar_field_highlight_text:"toolbar_field_highlight_text",
	toolbar_field_text:"toolbar_field_text",
	toolbar_field_text_focus:"toolbar_field_text_focus",
	toolbar_text:"toolbar_text",
	toolbar_top_separator:"toolbar_top_separator",
	// toolbar_vertical_separator:"toolbar_vertical_separator",
}
interface TrayColors{
	global_background: string,
	container_background: string,
	container_border: string,
	container_shadow: string,
	global_foreground: string,
	container_hover: string,
	accent: string
}

const TRAY_COLORS_FIREFOX: TrayColors = {
	global_background: FIREFOX_COLORS.frame,
	container_background: FIREFOX_COLORS.popup,
	container_border: FIREFOX_COLORS.popup_border,
	container_shadow: FIREFOX_COLORS.popup_highlight,
	global_foreground: FIREFOX_COLORS.popup_text,
	container_hover: FIREFOX_COLORS.popup_border,
	accent: FIREFOX_COLORS.button_primary
}

const BRAND_PALETTE_FIREFOX = {
	solid: { value: `{colors.${FIREFOX_COLORS.button_primary}}` },
	contrast: { value: `{colors.${FIREFOX_COLORS.button_primary_color}}` },
	fg: { value: `{colors.${TRAY_COLORS_FIREFOX.global_foreground}}` },
	muted: { value: `{colors.${TRAY_COLORS_FIREFOX.container_background}}` },
	subtle: { value: `{colors.${TRAY_COLORS_FIREFOX.container_hover}}` },
	emphasized: { value: `${FIREFOX_COLORS.button_primary_active}` },
	focusRing: { value: `{colors.${FIREFOX_COLORS.button_primary_hover}` },
}
const TRAY_COLORS = TRAY_COLORS_FIREFOX;


//@ts-ignore CURRENT_BROWSER defined in build script
const BRAND_PALETTE = BRAND_PALETTE_FIREFOX;//CURRENT_BROWSER === "firefox" ? FIREFOX_COLORS_FIREFOX : FIREFOX_COLORS_CHROME;


async function get_fg_color(browserApiProvider: typeof browser=browser) {
	// @ts-ignore
	if (IS_FIREFOX) {
		return (await browserApiProvider.theme.getCurrent()).colors!.icons!
	}
	else return '#000000';//window.matchMedia('(prefers-color-scheme: dark)').matches? '#ffffff' : '#000000';
}
export {TRAY_COLORS, BRAND_PALETTE, get_fg_color}