import ReactDOMServer from 'react-dom/server';

export async function updateIcon() {
    try {
        // Get all tabs in the current window
        const tabs = await browser.tabs.query({currentWindow: true});
        const tabCount = tabs.length;
        const color= (await browser.theme.getCurrent(browser.windows.WINDOW_ID_CURRENT)).colors!.icons!
        // Generate the SVG string using React
        const svgString = ReactDOMServer.renderToString(<TabIcon n={tabCount} color={color.toString()} />);

        // Update the browser action icon with the SVG
        await browser.action.setIcon({path: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`});
    } catch (error) {
        console.error("Failed to update icon:", error);
    }
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
                dominant-baseline="middle"
                fontFamily="Arial, sans-serif"
            >
                {overflow? "∞" : n}
            </text>
        </svg>
    );
}

