import React, { useEffect, useState } from "react";
import { MdLanguage } from "react-icons/md";
// import { Button } from "../components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import { Card, Image, AspectRatio, Text, HStack, Container, Icon, Center, Collapsible, Show } from "@chakra-ui/react";

import { TRAY_COLOR_TOKENS } from "@/theme/tray_color";
import { MACRO } from "@/strings";

function Tab({ browserApiProvider = browser, tab, showThumbnails }: { browserApiProvider?: typeof browser, tab: browser.tabs.Tab, showThumbnails: boolean }) {
    const [thumbnailUri, setThumbnailUri] = useState<string | null>(null); // 创建状态
    useEffect(() => {
        async function fetchThumbnail() {
            if (MACRO.IS_FIREFOX) {
                const thumbUri = await browserApiProvider.tabs.captureTab(tab.id!, { scale: 0.25 });
                setThumbnailUri(thumbUri);
            }

        }
        fetchThumbnail();
    }, [tab.id]);

    async function switch_to_tab(e: React.MouseEvent) {
        console.log(`switch to tab ${tab.title}`);
        e.preventDefault();
        browserApiProvider.tabs.update(tab.id!, { active: true })
    }
    async function close_tab(e: React.MouseEvent) {
        console.log(`closing tab ${tab.title}`);
        e.preventDefault(); // prevent open a new tab of <a> tag
        e.stopPropagation();
        browserApiProvider.tabs.remove(tab.id!).catch((e) => alert("Failed to close tab" + e));
    }
    return (
        <Card.Root asChild
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            borderRadius="12px" overflow="hidden" textAlign="left"
            backgroundColor={TRAY_COLOR_TOKENS.container_background}
            borderColor={tab.active ? TRAY_COLOR_TOKENS.accent : TRAY_COLOR_TOKENS.container_border}
            borderWidth={tab.active ? "3px" : "1px"}
        >
            <a key={tab.id} href={tab.url} target="_blank" onClick={switch_to_tab} className="tab-card" data-tab-id={tab.id}>
                <Card.Header padding={1.5} minH={showThumbnails ? "auto" : "5rem"} justifyContent={"center"}>
                    <Container fluid padding={0} asChild >
                        <HStack justify="space-between">
                            <Icon size="md" margin={1}>
                                {
                                    tab.favIconUrl ? (<Image src={tab.favIconUrl} />) : (<span><MdLanguage /></span>)
                                    //why using span: https://github.com/chakra-ui/chakra-ui/issues/9108
                                }
                            </Icon>
                            <Center asChild>
                                <Text truncate textStyle="sm" lineClamp={showThumbnails ? 1 : 3} color={TRAY_COLOR_TOKENS.global_foreground} wordBreak={"break-all"}>
                                    {tab.title}
                                </Text>
                            </Center>
                            <CloseButton onClick={close_tab} borderRadius="10px" />
                        </HStack>
                    </Container>
                </Card.Header>
                <Card.Body padding={0} >
                    {/* <Show when={showThumbnails}> */}
                    <Collapsible.Root open={showThumbnails} lazyMount={true} defaultOpen={true}>
                        <Collapsible.Content>
                            <AspectRatio ratio={Math.max(screen.availWidth / screen.availHeight, 4 / 3)}>
                                {
                                    thumbnailUri ?
                                        <Image src={thumbnailUri} alt="Thumbnail" /> :
                                        <Center color={`${TRAY_COLOR_TOKENS.global_foreground}/40`}>
                                            <MdLanguage size={"30%"} title="Thumbnail Unavailable" />
                                        </Center>
                                }
                            </AspectRatio>
                        </Collapsible.Content>
                    </Collapsible.Root>
                        {/* </Show> */}
                </Card.Body>

                {/* <Card.Footer /> */}
            </a>
        </Card.Root>
    )
}
export default Tab