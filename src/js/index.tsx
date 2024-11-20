import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import CloseIcon from "@material-icons/svg/svg/close/baseline.svg"
function App() {
    const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);
    useEffect(() => {
        async function fetchTabs() {
            const tabs = await browser.tabs.query({ currentWindow: true });
            setTabs(tabs);
        }
        fetchTabs();
        const onTabChanged = () => fetchTabs();//for event listener idenfitying
        const listenEvents= [browser.tabs.onUpdated, browser.tabs.onRemoved, browser.tabs.onMoved, browser.tabs.onCreated]
        // add event listeners
        listenEvents.forEach(event => event.addListener(onTabChanged));
        // clean up
        return () => {
            listenEvents.forEach(event => event.removeListener(onTabChanged));
        }
        
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

    const switch_to_tab = (e: React.MouseEvent) => {e.preventDefault(); browser.tabs.update(tab.id!, { active: true }) }
    return (
        <a key={tab.id} className="tab-card" href={tab.url} onClick={switch_to_tab}>
            <div className="tab-card-header">
                <img src={tab.favIconUrl} alt={tab.title} className="tab-favicon"/>
                <p className="tab-title">{tab.title}</p>
                <button className="tab-btn" onClick={(e: React.MouseEvent) => {e.stopPropagation(); browser.tabs.remove(tab.id!) }}>
                    <img src={CloseIcon} alt={"Close"}></img>
                </button>
            </div>
            
            
            <img
                src={thumbnailUri || ""}
                alt={"Thumbnail"}
                className="tab-thumbnail"
            />
        </a>
    )
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
