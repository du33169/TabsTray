import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { MdClose, MdNoPhotography } from "react-icons/md";
import { tabChangeEvents } from "./utils"
function App() {
    const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);
    useEffect(() => {
        async function fetchTabs() {
            const tabs = await browser.tabs.query({ currentWindow: true });
            setTabs(tabs);
        }
        fetchTabs();
        const onTabChanged = () => fetchTabs();//for event listener idenfitying
        
        // add event listeners
        tabChangeEvents.forEach(event => event.addListener(onTabChanged));
        // clean up
        return () => {
            tabChangeEvents.forEach(event => event.removeListener(onTabChanged));
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

    async function switch_to_tab(e: React.MouseEvent) {
        console.log(`switch to tab ${tab.title}`);
        e.preventDefault();
        browser.tabs.update(tab.id!, { active: true })
    }
    async function close_tab(e: React.MouseEvent) {
        console.log(`closing tab ${tab.title}`);
        e.preventDefault(); // prevent open a new tab of <a> tag
        e.stopPropagation();
        browser.tabs.remove(tab.id!).catch((e)=>alert("Failed to close tab"+e));
    }
    return (
        <a key={tab.id} className="tab-card" href={tab.url} target="_blank" onClick={switch_to_tab} >
            <div className="tab-card-header">
                {tab.favIconUrl && (<img src={tab.favIconUrl} className="tab-favicon" />)}
                <p className="tab-title">{tab.title}</p>
                <button
                    className="tab-btn"
                    onClick={close_tab}
                    // other background styles are set in CSS
                ><MdClose />
                </button> 
            </div>
            <div
                className="tab-thumbnail"
                style={{
                    backgroundImage: `url(${ thumbnailUri || "" })`,
                    aspectRatio: Math.max(screen.availWidth / screen.availHeight , 4/3) ,
                }}
            >{thumbnailUri ? null : <MdNoPhotography size={"30%"} color="#AAA" title="Thumbnail Unavailable" />}</div>
        </a>
    )
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
