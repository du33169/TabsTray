import ReactDOMServer from 'react-dom/server';
import { get_tabChangeEvents } from "@/utils";
import { get_fg_color } from '@/components/ui/theme';
export async function updateIcon() {
    try {
        // Get all tabs in the current window
        const tabs = await browser.tabs.query({currentWindow: true});
        const tabCount = tabs.length;

        const color = await get_fg_color();

        // Update the browser action icon with the SVG
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
    //@ts-ignore
    IS_FIREFOX &&browser.theme.onUpdated.addListener(updateIcon);
    updateIcon();
}

