import { useEffect, useState } from "react";
import { MdPushPin } from "react-icons/md";
import { Grid, GridItem, Box, Show, Float } from "@chakra-ui/react";
import { ReactSortable, Sortable } from "react-sortablejs";
import { get_tabChangeEvents } from "@/utils"
import { generate_icon_dataUrl } from "@/action/action_icon";

import Tab from "./tab"
import TrayActionBar from "./tray_action_bar";
import { get_options, set_options } from "../options/options_schema";
import { TRAY_COLORS,get_icon_color } from "@/components/ui/theme";
import { TrayMode,fetchTrayMode } from "./mode";
interface SortableTabData {
    id: number;
    tab: browser.tabs.Tab;
}
function Tray({ browserApiProvider = browser, browserEventProvider = browser }: { browserApiProvider?: typeof browser, browserEventProvider?: typeof browser }) {
    const mode = fetchTrayMode();
    const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);
    const [showThumbnails, setShowThumbnails] = useState<boolean | null>(null);

    const [sortableTabDataList, setSortableTabDataList] = useState<SortableTabData[]>([]);
    useEffect(() => {
        // fetch tabs
        async function fetchTabs() {
            const newTabs = await browserApiProvider.tabs.query({ currentWindow: true });
            setTabs(newTabs);
            const newSortableTabDataList = newTabs.map((tab) => ({ id: tab.id!, tab }));
            setSortableTabDataList(newSortableTabDataList);
            return newTabs;
        }

        async function updateTrayTabIcon(tabcount: number) {
            const iconLink: HTMLLinkElement = documentRoot.querySelector("link[rel*='icon']")!;
            if (iconLink) {
                const color = await get_icon_color(browserApiProvider);
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
            //@ts-ignore
            IS_FIREFOX && mode===TrayMode.TAB && await updateTrayTabIcon(newTabs.length);//for event listener idenfitying
        }
        onTabChanged();

        async function fetchShowThumbnails() {
            const options = await get_options();
            setShowThumbnails(options.show_thumbnails);
        }
        fetchShowThumbnails();

        // add event listeners
        get_tabChangeEvents(browserEventProvider).forEach(event => event.addListener(onTabChanged));
        //@ts-ignore
        IS_FIREFOX && browserEventProvider.theme.onUpdated.addListener(onTabChanged);
        // clean up
        return () => {
            get_tabChangeEvents(browserEventProvider).forEach(event => event.removeListener(onTabChanged));
            //@ts-ignore
            IS_FIREFOX && browserEventProvider.theme.onUpdated.removeListener(onTabChanged);
        }

    }, []);

    //update options when show_thumbnails changed
    async function manual_set_show_thumbnails(newShowThumbnails: boolean) {
        setShowThumbnails(newShowThumbnails);
        const options = await get_options();
        options.show_thumbnails = newShowThumbnails;
        await set_options(options);
    }

    async function move_tab(event: Sortable.SortableEvent) {
        const tabData = sortableTabDataList[event.oldIndex!]
        console.log(event.item, `Moving tab ${tabData.id} from ${event.oldIndex} to ${event.newIndex}`);
        const originalPinned = tabData.tab.pinned;
        if (originalPinned) {
            if (event.newIndex! >= 1 && !sortableTabDataList[event.newIndex! - 1].tab.pinned) {
                // move to unpinned group
                await browserApiProvider.tabs.update(tabData.id, { pinned: false });
                console.log(`Tab ${tabData.id} moved to unpinned group`);
            } else {
                //still in pinned group, do nothing
            }
        } else {//originally unpinned
            if (sortableTabDataList[event.newIndex!].tab.pinned ) {
                //move to pinned group
                await browserApiProvider.tabs.update(tabData.id, { pinned: true });
                console.log(`Tab ${tabData.id} moved to pinned group`);
            } else {// still in unpinned group
                // do nothing
            }
        }
        const result = await browserApiProvider.tabs.move(tabData.id, { index: event.newIndex! });
        console.log('tab move result:',result);
        return result;
    }
    return (
        <Box minWidth={"min(700px,100vw)"} minHeight={mode===TrayMode.TAB? "100vh" : (mode=== TrayMode.POPUP? "600px" : "60vh")} colorPalette="brand" backgroundColor={TRAY_COLORS.global_background}>
            {/* 800x600 is the maximal size of the popup window */}
            <Grid
                templateColumns="repeat(auto-fill, minmax(300px, 1fr))" paddingX="max(40px,1vw)" paddingTop="max(20px,0.5vw)" asChild>
                <ReactSortable
                    list={sortableTabDataList}
                    setList={setSortableTabDataList}
                    animation={150}
                    // swapThreshold={0.5}
                    onEnd={move_tab}
                >
                    {sortableTabDataList.map((tabData) => (
                        <GridItem key={tabData.id}>
                            <Box padding="3%" position="relative"
                                _hover={{
                                    transform: "translateY(-4px)",
                                }}
                                transition="transform 0.2s ease"
                            >
                                <Tab tab={tabData.tab} browserApiProvider={browserApiProvider} showThumbnails={showThumbnails===true} />
                                <Show when={tabData.tab.pinned}>
                                    <Float placement="top-start" transform="rotate(-45deg)" translate="+10% +10%">
                                        <MdPushPin size={"20px"} />
                                    </Float>
                                </Show>
                            </Box>
                        </GridItem>
                    ))}
                </ReactSortable>
            </Grid>
            <TrayActionBar browserApiProvider={browserApiProvider} showThumbnails={showThumbnails} setShowThumbnails={manual_set_show_thumbnails} />
        </Box>
    );
}

export { Tray };
