import { useEffect, useState } from "react";
import { MdOpenInFull, MdAdd, MdSettings, MdNoPhotography, MdPhotoCamera } from "react-icons/md";
import {
    ActionBarContent,
    ActionBarRoot,
} from "@/components/ui/action-bar"
// import { Button } from "../components/ui/button";
import { IconButton, Show } from "@chakra-ui/react";


import { open_page_singleton } from "@/utils"
import { ASSET } from "@/strings"
import { TRAY_COLORS } from "@/components/ui/theme";

const enum TrayMode {//current mode of the tray
    TAB = "tab", POPUP = "popup", IN_PAGE = "in-page"
}

function TrayActionBar(
    { browserApiProvider = browser, showThumbnails, setShowThumbnails }:
    { browserApiProvider?: typeof browser, showThumbnails: boolean, setShowThumbnails: (show: boolean) => void }
) {
    const [mode, setMode] = useState<TrayMode>(TrayMode.TAB);

    useEffect(() => {
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


    }, []);

    const leaveAction = mode === TrayMode.POPUP ? window.close : () => { };
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
    function on_toggle_thumbnails() {
        setShowThumbnails(!showThumbnails);
    }
    return (
        <ActionBarRoot open={true}>
            <ActionBarContent portalled={false} colorPalette="brand" backgroundColor={TRAY_COLORS.container_background} borderColor={TRAY_COLORS.container_border}>

                <Show when={mode !== TrayMode.TAB}>
                    <IconButton variant={"ghost"} onClick={on_expand}
                    >
                        <MdOpenInFull />
                    </IconButton>
                </Show>

                <IconButton variant={"solid"} onClick={on_new}>
                    <MdAdd />
                </IconButton>

                <IconButton variant={"ghost"} onClick={on_toggle_thumbnails} >
                    {showThumbnails ? <MdPhotoCamera /> : <MdNoPhotography />}
                </IconButton>
                <IconButton variant={"ghost"} onClick={on_settings}>
                    <MdSettings />
                </IconButton>

            </ActionBarContent>
        </ActionBarRoot>
    )
}

export default TrayActionBar;