import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
    const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);
    useEffect(() => {
        async function fetchTabs() {
            const tabs = await browser.tabs.query({ currentWindow: true });
            setTabs(tabs);
        }
        fetchTabs();
    }, []);


    return (
        <div className="tab-grid">
            {tabs.map((tab) => (
                <Tab key={tab.id} tab={tab} />
            ))}
        </div>
    );
}
function Tab({ tab }: { tab: browser.tabs.Tab }) {
    const [thumbnailUri, setThumbnailUri] = useState<string | null>(null); // 创建状态
    useEffect(() => {
        async function fetchThumbnail() {
            const thumbUri = await browser.tabs.captureTab(tab.id!, { scale: 0.25 });
            setThumbnailUri(thumbUri);
        }
        fetchThumbnail();
    }, [tab.id]);

    return (
        <div key={tab.id} className="tab-card">
            <img
                src={tab.favIconUrl}
                alt={tab.title}
                className="tab-favicon"
            />
            <p className="tab-title">{tab.title}</p>
            <img
                src={thumbnailUri || ""}
                alt={"Thumbnail"}
                className="tab-thumbnail"
            />
        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
