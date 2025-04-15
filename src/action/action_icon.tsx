import ReactDOMServer from 'react-dom/server';
import { get_tabChangeEvents } from "@/utils";
import { get_icon_color } from '@/theme/theme';
import { get_options, OptionsSchema } from '@/pages/options/options_schema';
import { isRestrictedUrl } from '@/utils';
import { MACRO, META } from '@/strings';
async function update_action_enable() {
    const activeTab = await browser.tabs.query({ active: true, currentWindow: true });
    if (activeTab.length !== 1) {
        console.warn("Require exactly one active tab, but found", activeTab.length); 
        return;
    }
    const url = activeTab[0].url!;
    const options = await get_options();
    //only enable in drawer mode
    if (options.launch_mode !== OptionsSchema.shape.launch_mode.enum.drawer) {
        browser.action.enable();
        return;
    }
    const isRestricted = isRestrictedUrl(url);
    console.log("checking url restriction", url, isRestricted)
    if (isRestricted) {
        browser.action.setTitle({ title: META.EXT_NAME+" disabled in this page (content scripts restricted)" ,tabId: activeTab[0].id!});
        return browser.action.disable();
    } else {
        return browser.action.enable();
    }
}

export async function updateIcon() {
    try {
        // Get all tabs in the current window
        const tabs = await browser.tabs.query({currentWindow: true});
        const tabCount = tabs.length;

        const color = await get_icon_color();
        // Update the browser action icon with the SVG
        update_action_enable();
        return browser.action.setIcon({ path: generate_icon_dataUrl(tabCount, color.toString()) });

    } catch (error) {
        console.error("Failed to update icon:", error);
        return Promise.reject(error);
    }
}

export function generate_icon_dataUrl(n: number, color: string) {
    // Generate the SVG string using React
    const svgString = ReactDOMServer.renderToString(<TabIcon n={n} color={color.toString()} />);
    // Convert the SVG string to a Base64-encoded data URL
    const base64String = btoa(unescape(encodeURIComponent(svgString))); // Base64 encoding

    return `data:image/svg+xml;base64,${base64String}`;
}
// React Component to create the SVG
function TabIcon({ n, color }: { n: number, color: string }) {
    const overflow = n > 99;
    const size = 48;
    const lineWeight = size/12;
    const padding = lineWeight/2;
    const borderRadius = size/6;
    const fontSize=overflow? size : size*0.618;//infinity symbol is smaller
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
            <rect x={padding} y={padding} width={size - 2 * padding} height={size - 2 * padding} fill="none" stroke={color} strokeWidth={lineWeight} rx={borderRadius} />
            <text
                x={size / 2}
                y={size / 2+ (overflow? size/8:0)}
                fill={color}
                fontSize={fontSize}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Arial, sans-serif"
            >
                {overflow? "∞" : n}
            </text>
        </svg>
    );
}

export function update_icon_on_theme_install() {
    // Update icon on tab change
    get_tabChangeEvents().forEach(event => { event.addListener(updateIcon) });  
    browser.windows.onFocusChanged.addListener((windowId: number) => {
        windowId !== browser.windows.WINDOW_ID_NONE && updateIcon();
    })
    MACRO.IS_FIREFOX && browser.theme.onUpdated.addListener(updateIcon);
    updateIcon();
}

