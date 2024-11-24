import { useEffect, useState } from "react";
import { MdOpenInFull, MdAdd, MdSettings } from "react-icons/md";
import {
    ActionBarContent,
    ActionBarRoot,
} from "@/components/ui/action-bar"
// import { Button } from "../components/ui/button";
import { IconButton, Grid, GridItem, Box } from "@chakra-ui/react";

import { get_tabChangeEvents, open_page_singleton } from "@/utils"
import Tab from "./tab"
import { ASSET } from "@/strings"

const enum TrayMode{//current mode of the tray
    TAB,POPUP,IN_PAGE
}
function Tray({ browserApiProvider = browser, browserEventProvider = browser }: { browserApiProvider?: typeof browser, browserEventProvider?: typeof browser }) {
    const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);
    const [mode, setMode] = useState<TrayMode>(TrayMode.TAB);
    useEffect(() => {
        // fetch tabs
        async function fetchTabs() {
            const tabs = await browserApiProvider.tabs.query({ currentWindow: true });
            setTabs(tabs);
        }
        fetchTabs();
        const onTabChanged = () => fetchTabs();//for event listener idenfitying

        // fetch expandAble from current tab status
        async function fetchTrayMode() {
            if (window.location.href === browser.runtime.getURL(ASSET.PAGE.TRAY_TAB)) {
                setMode(TrayMode.TAB);
            }
            else if (window.location.href === browser.runtime.getURL(ASSET.PAGE.TRAY_POPUP)) {
                setMode(TrayMode.POPUP);
            }
            else {
                setMode(TrayMode.IN_PAGE);
            }
            console.log(window.location.href, mode);
        }
        fetchTrayMode();

        // add event listeners
        get_tabChangeEvents(browserEventProvider).forEach(event => event.addListener(onTabChanged));
        // clean up
        return () => {
            get_tabChangeEvents(browserEventProvider).forEach(event => event.removeListener(onTabChanged));
        }

    }, []);

    const leaveAction = mode === TrayMode.POPUP? window.close : () => { };
    function on_expand() {
        open_page_singleton(ASSET.PAGE.TRAY_TAB, browserApiProvider).then(
            leaveAction
        )
    }
    function on_new() {
        browserApiProvider.tabs.create({}).then(
            leaveAction
        )
    }
    function on_settings() {
        open_page_singleton(ASSET.PAGE.OPTIONS, browserApiProvider).then(
            leaveAction
        )
    }
    return (
        <Box minWidth={"700px"} minHeight={"600px"}>
            {/* 800x600 is the maximal size of the popup window */}
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap="10px" padding="20px">
                {tabs.map((tab) => (
                    <GridItem key={tab.id}><Tab tab={tab} browserApiProvider={browserApiProvider} /></GridItem>
                ))}
            </Grid>

            <ActionBarRoot open={true}>
                <ActionBarContent portalled={false}>
                    {mode !== TrayMode.TAB &&
                        (
                            <IconButton variant={"ghost"} onClick={on_expand} >
                                <MdOpenInFull />
                            </IconButton>
                        )
                    }

                    <IconButton size={'lg'} onClick={on_new}>
                        <MdAdd />
                    </IconButton>
                    <IconButton variant={"ghost"} onClick={on_settings}>
                        <MdSettings />
                    </IconButton>
                </ActionBarContent>
            </ActionBarRoot>
        </Box>
    );
}

export { Tray };
