type COLOR = browser._manifest.ThemeColor;

interface TrayColors {
	global_background: COLOR,
	container_background: COLOR,
	container_border: COLOR,
	container_shadow: COLOR,
	global_foreground: COLOR,
	container_hover: COLOR,
	accent: COLOR,
	on_accent: COLOR,
	accent_active: COLOR,
}
const TRAY_COLOR_TOKENS = {
	global_background: "tray_global_background",
	container_background: "tray_container_background",
	container_border: "tray_container_border",
	container_shadow: "tray_container_shadow",
	global_foreground: "tray_global_foreground",
	container_hover: "tray_container_hover",
	accent: "tray_accent",
	on_accent: "tray_on_accent",
	accent_active: "tray_accent_active",
}

const FALLBACK_TRAY_COLORS_LIGHT: TrayColors = {
	global_background: "white", 
	container_background: "#dddddd",
	container_border: "rgba(0, 0, 0, 0.2)",
	container_shadow: "black",
	global_foreground: "black",
	container_hover: "rgba(0, 0, 0, 0.1)",
	accent: "black",//"rgba(0, 0, 0, 0.2)",//"#9333ea",
	on_accent: "white",
	accent_active: "rgba(255, 255, 255, 0.8)"//"#a855f7",
}
const FALLBACK_TRAY_COLORS_DARK: TrayColors = {
	global_background: "#111111",
	container_background: "#444444",
	container_border: "rgba(255, 255, 255, 0.4)",
	container_shadow: "white",
	global_foreground: "white",
	container_hover: "rgba(255, 255, 255, 0.2)",
	accent: "white",//"rgba(255, 255, 255, 0.8)",//"#c084fc",
	on_accent: "black",
	accent_active: "rgba(0, 0, 0, 0.2)"//"#a855f7",
}
function get_tray_colors_from_firefox(themeColors: browser._manifest._ThemeTypeColors, dark: boolean): TrayColors {
	const fallbackColors = (dark ? FALLBACK_TRAY_COLORS_DARK : FALLBACK_TRAY_COLORS_LIGHT);

	const global_background_get = () => themeColors.frame || themeColors.frame_inactive;
	const container_background_get = () =>themeColors.toolbar || themeColors.toolbar_field || themeColors.toolbar_field_focus || themeColors.popup || themeColors.sidebar;
	const container_border_get = () => themeColors.toolbar_field_border || themeColors.toolbar_field_border_focus || themeColors.popup_border ||  themeColors.sidebar_border;
	const container_shadow_get = () => themeColors.toolbar_field_highlight || themeColors.popup_highlight ||  themeColors.sidebar_highlight;
	const global_foreground_get = () => themeColors.toolbar_text || themeColors.bookmark_text ||  themeColors.popup_text || themeColors.sidebar_text;
	const container_hover_get = () => null ;
	//@ts-ignore: button_primary is a private property
	const accent_get = () => themeColors.button_primary || themeColors.icons_attention ||  global_foreground_get();
	//@ts-ignore: button_primary is a private property
	const on_accent_get = () => themeColors.button_primary_color || global_background_get() ;
	//@ts-ignore: button_primary is a private property
	const accent_active_get = () => themeColors.button_primary_hover || themeColors.button_primary_active;
	return {
		global_background: global_background_get() || fallbackColors.global_background,
		container_background: container_background_get() || fallbackColors.container_background,
		container_border: container_border_get() || fallbackColors.container_border,
		container_shadow: container_shadow_get() || fallbackColors.container_shadow,
		global_foreground: global_foreground_get() || fallbackColors.global_foreground,
		container_hover: container_hover_get() || fallbackColors.container_hover,
		accent: accent_get() || fallbackColors.accent,
		on_accent: on_accent_get() || fallbackColors.on_accent,
		accent_active: accent_active_get() || fallbackColors.accent_active,
	}
}

const BRAND_PALETTE_FIREFOX = {
	solid: { value: `{colors.${TRAY_COLOR_TOKENS.accent}}` },
	contrast: { value: `{colors.${TRAY_COLOR_TOKENS.on_accent}}` },
	fg: { value: `{colors.${TRAY_COLOR_TOKENS.global_foreground}}` },
	muted: { value: `{colors.${TRAY_COLOR_TOKENS.container_background}}` },
	subtle: { value: `{colors.${TRAY_COLOR_TOKENS.container_hover}}` },
	emphasized: { value: `${TRAY_COLOR_TOKENS.accent_active}` },
	focusRing: { value: `{colors.${TRAY_COLOR_TOKENS.accent_active}` },
}


//@ts-ignore CURRENT_BROWSER defined in build script
const BRAND_PALETTE = BRAND_PALETTE_FIREFOX;//CURRENT_BROWSER === "firefox" ? FIREFOX_COLORS_FIREFOX : FIREFOX_COLORS_CHROME;


export {TRAY_COLOR_TOKENS, BRAND_PALETTE,get_tray_colors_from_firefox}