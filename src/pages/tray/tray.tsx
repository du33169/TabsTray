import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { MdOpenInFull, MdAdd, MdSettings } from "react-icons/md";
import { Provider } from "@/components/ui/provider"
import {
    ActionBarContent,
    ActionBarRoot,
} from "@/components/ui/action-bar"
// import { Button } from "../components/ui/button";
import { IconButton, Grid, GridItem } from "@chakra-ui/react";

import { tabChangeEvents } from "@/utils"
import Tab from "./tab"
import { launch_options } from "../options/launch_options";
import { launch_tray_in_tab } from "./launch_tray";
function App() {
    const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);
    const [expandAble, setExpandAble] = useState(false);
    useEffect(() => {
        // fetch tabs
        async function fetchTabs() {
            const tabs = await browser.tabs.query({ currentWindow: true });
            setTabs(tabs);
        }
        fetchTabs();
        const onTabChanged = () => fetchTabs();//for event listener idenfitying

        // fetch expandAble from current tab status
        async function fetchExpandAble() {
            const curtab = await browser.tabs.getCurrent()
            setExpandAble(curtab==undefined)
        }
        fetchExpandAble();

        // add event listeners
        tabChangeEvents.forEach(event => event.addListener(onTabChanged));
        // clean up
        return () => {
            tabChangeEvents.forEach(event => event.removeListener(onTabChanged));
        }

    }, []);

    async function new_tab() {// new empty tab

    }
    return (
        <Provider>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap="10px" padding="20px">
                {tabs.map((tab) => (
                    <GridItem key={tab.id}><Tab tab={tab} /></GridItem>
                ))}
            </Grid>
            <ActionBarRoot open={true}>
                <ActionBarContent>
                    {expandAble &&
                        <IconButton variant={"ghost"} onClick={() => { launch_tray_in_tab().then(window.close) }} >
                            <MdOpenInFull />
                        </IconButton>
                    }
                    {/* <ActionBarSeparator /> */}
                    <IconButton variant={"outline"} onClick={() => { browser.tabs.create({}).then(window.close) }}>
                        <MdAdd />
                    </IconButton>
                    {/* <ActionBarSeparator /> */}
                    <IconButton variant={"ghost"} onClick={() => { launch_options().then(window.close) }}>
                        <MdSettings />
                    </IconButton>
                </ActionBarContent>
            </ActionBarRoot>
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
