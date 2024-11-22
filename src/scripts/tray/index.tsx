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

import { tabChangeEvents } from "@/scripts/utils"
import Tab from "./tab"

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
        <Provider>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap="10px" padding="20px">
                {tabs.map((tab) => (
                    <GridItem asChild><Tab key={tab.id} tab={tab} /></GridItem>
                ))}
            </Grid>
            <ActionBarRoot open={true}>
                <ActionBarContent>
                    <IconButton variant={"ghost"} >
                        <MdOpenInFull />
                    </IconButton>
                    {/* <ActionBarSeparator /> */}
                    <IconButton variant={"outline"} >
                        <MdAdd />
                    </IconButton>
                    {/* <ActionBarSeparator /> */}
                    <IconButton variant={"ghost"} >
                        <MdSettings />
                    </IconButton>
                </ActionBarContent>
            </ActionBarRoot>
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
