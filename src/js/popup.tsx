import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
    const [tabs, setTabs] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTabs() {
            const tabs = await browser.tabs.query({});
            setTabs(tabs);
        }
        fetchTabs();
    }, []);

    return (
        <div className="tab-grid">
            {tabs.map((tab) => (
                <div key={tab.id} className="tab-card">
                    <img
                        src={tab.favIconUrl || "default-thumbnail.png"}
                        alt={tab.title}
                        className="tab-thumbnail"
                    />
                    <p className="tab-title">{tab.title}</p>
                </div>
            ))}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
