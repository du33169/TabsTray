import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
function promiseWithTimeout(promise, timeout, defaultValue) {
    return Promise.race([
        promise,
        new Promise((resolve) =>
            setTimeout(() => resolve(defaultValue), timeout)
        )
    ]);
}


class TabHandle {
    tab: any;
    thumnailUri: string;
    constructor(tab: any, thumnailUri: string) {
        this.tab = tab;
        this.thumnailUri = thumnailUri;
    }
}
function App() {
    const [tabHandles, setTabHandles] = useState<TabHandle[]>([]);
    useEffect(() => {
        async function fetchTabs() {
            const tabs = await browser.tabs.query({ currentWindow: true });
            console.log(tabs);
            const tabHandles = await Promise.all(
                tabs.map(async (tab) => {  // 在这里使用 async
                    const capturePromise = browser.tabs.captureTab(tab.id, { scale: 0.25 })
                    const thumbUri = await promiseWithTimeout(capturePromise, 500, "empty") ;
                    // console.log(tab.title,thumbUri);
                    return new TabHandle(tab, thumbUri);
                })
            );
            setTabHandles(tabHandles);
            console.log("fetchTabs done");
        }
        fetchTabs();
    }, []);


    return (
        <div className="tab-grid">
            {tabHandles.map((tabH) => Tab(tabH))}
        </div>
    );
}
function Tab(tabH: TabHandle) {

    return (
        <div key={tabH.tab.id} className="tab-card">
            <img
                src={tabH.tab.favIconUrl}
                alt={tabH.tab.title}
                className="tab-favicon"
            />
            <p className="tab-title">{tabH.tab.title}</p>
            <img
                src={tabH.thumnailUri}
                alt={"Thumbnail"}
                className="tab-thumbnail"
            />
        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
