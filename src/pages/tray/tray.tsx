import { useEffect, useState } from "react";
// import { Button } from "../components/ui/button";
import { Grid, GridItem, Box } from "@chakra-ui/react";

import { get_tabChangeEvents } from "@/utils"
import { generate_icon_dataUrl } from "@/action/action_icon";

import Tab from "./tab"
import TrayActionBar from "./tray_action_bar";
import { get_options,set_options } from "../options/options_schema";

function Tray({ browserApiProvider = browser, browserEventProvider = browser }: { browserApiProvider?: typeof browser, browserEventProvider?: typeof browser }) {
    const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);
    const [showThumbnails, setShowThumbnails] = useState(false);
    useEffect(() => {
        // fetch tabs
        async function fetchTabs() {
            const newTabs = await browserApiProvider.tabs.query({ currentWindow: true });
            setTabs(newTabs);
            return newTabs;
        }

        async function updateIcon(tabcount: number) {
            const iconLink: HTMLLinkElement = document.querySelector("link[rel*='icon']")!;
            if (iconLink) {
                const color = (await browserApiProvider.theme.getCurrent(browserApiProvider.windows.WINDOW_ID_CURRENT)).colors!.icons!
                const iconUrl = generate_icon_dataUrl(tabcount, color.toString());
                iconLink.href = iconUrl;
                return iconUrl;
            } else {
                console.error("No icon link found");
                return Promise.reject("No icon link found");
            }
        }
        async function onTabChanged() {
            const newTabs = await fetchTabs();
            await updateIcon(newTabs.length);//for event listener idenfitying
        }
        onTabChanged();

        async function fetchShowThumbnails() {
            const options = await get_options();
            setShowThumbnails(options.show_thumbnails);
        }
        fetchShowThumbnails();

        // add event listeners
        get_tabChangeEvents(browserEventProvider).forEach(event => event.addListener(onTabChanged));
        // clean up
        return () => {
            get_tabChangeEvents(browserEventProvider).forEach(event => event.removeListener(onTabChanged));
        }

    }, []);

    //update options when show_thumbnails changed
    useEffect(() => {
        async function updateOptions() {
            const options = await get_options();
            options.show_thumbnails = showThumbnails;
            await set_options(options);
        }
        updateOptions();
    }, [showThumbnails]);

    return (
        <Box minWidth={"700px"} minHeight={"600px"}>
            {/* 800x600 is the maximal size of the popup window */}
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap="10px" padding="20px">
                {tabs.map((tab) => (
                    <GridItem key={tab.id}>
                        <Tab tab={tab} browserApiProvider={browserApiProvider} showThumbnails={showThumbnails} />
                    </GridItem>
                ))}
            </Grid>
            <TrayActionBar browserApiProvider={browserApiProvider} showThumbnails={showThumbnails} setShowThumbnails={setShowThumbnails}/>
        </Box>
    );
}

export { Tray };
