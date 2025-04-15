// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme#colors

import type { SystemConfig } from "@chakra-ui/react";
import {get_tray_colors_from_firefox, TRAY_COLOR_TOKENS, BRAND_PALETTE} from "./tray_color"

// default theme colors exported from manifests of firefox official themes
import defaultLightThemeColor from "./default_light_theme_colors.json"
import defaultDarkThemeColor from "./default_dark_theme_colors.json"
import { MACRO } from "@/strings";


function get_tray_color_tokens_from_firefox(ThemeColors: browser._manifest._ThemeTypeColors) {
	const result: Record<string, any> = {};
	const trayColors_light = get_tray_colors_from_firefox(ThemeColors, false);
	const trayColors_dark = get_tray_colors_from_firefox(ThemeColors, true);
	console.log('finalTrayColors light:', trayColors_light);
	console.log('finalTrayColors dark:', trayColors_dark);
	for (const [name, literal] of Object.entries(TRAY_COLOR_TOKENS)) {
		//@ts-ignore
		const transformedValue = { _light: trayColors_light[name],  _dark: trayColors_dark[name] }
		result[literal] = { value: transformedValue };
	}
	return result;
}

async function get_theme_color_with_fallback(browserApiProvider: typeof browser = browser): Promise<{themeColors:browser._manifest._ThemeTypeColors, colorScheme:string} > {
	const theme = (await browserApiProvider.theme.getCurrent());

	//get current color scheme
	const acquiredColorScheme = theme.properties?.color_scheme;

	//get color scheme from matchMedia
	const mediaColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	const finalColorScheme = acquiredColorScheme || mediaColorScheme;

	const acquiredThemeColors = theme.colors;
	const defaultThemeColors = finalColorScheme === 'dark' ? defaultDarkThemeColor as browser._manifest._ThemeTypeColors : defaultLightThemeColor as browser._manifest._ThemeTypeColors;
	const finalThemeColors = acquiredThemeColors || defaultThemeColors;
	return { themeColors: finalThemeColors, colorScheme: finalColorScheme }
}
async function get_theme_config_content(browserApiProvider: typeof browser = browser): Promise<{ themeConfigContent: SystemConfig, colorScheme: string }> {
	
	const { themeColors, colorScheme } = await get_theme_color_with_fallback(browserApiProvider);

	console.log('browsertheme colors:', themeColors);

	const finalTrayColors = get_tray_color_tokens_from_firefox(themeColors)

	const themeConfigContent = {
		theme: {
			semanticTokens: {//@ts-ignore
				colors: {
					brand: BRAND_PALETTE,
					...finalTrayColors
				}
			},
		}
	};
	return { themeConfigContent, colorScheme }
}
async function get_icon_color(browserApiProvider: typeof browser = browser) {
	// used for non-theme related items like svg icons, etc
	if (MACRO.IS_FIREFOX) {
		const { themeColors, colorScheme } = await get_theme_color_with_fallback(browserApiProvider);
		// vertical mode: action button follow tab_background_text
		// horizontal mode: action button follow toolbar_text
		// default to tab_background_text as mostly display as pinned tab
		return themeColors.icons || themeColors.toolbar_text || themeColors.bookmark_text || themeColors.tab_background_text  || (colorScheme === 'dark' ? '#ffffff' : '#000000');
	}
	else return '#000000';//window.matchMedia('(prefers-color-scheme: dark)').matches? '#ffffff' : '#000000';
}


export { get_icon_color, get_theme_config_content }