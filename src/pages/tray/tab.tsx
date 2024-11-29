import React, { useEffect, useState } from "react";
import { MdNoPhotography, MdLanguage } from "react-icons/md";
// import { Button } from "../components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import { Card, Image, AspectRatio, Flex, Text, HStack, Container, Icon, Center, Show } from "@chakra-ui/react";

import { TRAY_COLORS } from "@/components/ui/theme";

function Tab({ browserApiProvider = browser, tab, isActive, showThumbnails }: { browserApiProvider?: typeof browser, tab: browser.tabs.Tab, isActive: boolean, showThumbnails: boolean }) {
    const [thumbnailUri, setThumbnailUri] = useState<string | null>(null); // 创建状态
    useEffect(() => {
        async function fetchThumbnail() {
            const thumbUri = await browserApiProvider.tabs.captureTab(tab.id!, { scale: 0.25 });
            setThumbnailUri(thumbUri);
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
            _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            }}
            transition="transform 0.2s ease, box-shadow 0.2s ease"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)" borderRadius="12px" overflow="hidden" textAlign="left"
            backgroundColor={TRAY_COLORS.container_background}
            borderColor={isActive ? TRAY_COLORS.accent : TRAY_COLORS.container_border}
            borderWidth={isActive ? "3px" : "1px"}
        >
            <a key={tab.id} href={tab.url} target="_blank" onClick={switch_to_tab} >
                <Card.Header paddingX={2} paddingY={1} minH={showThumbnails ? "auto" : "5rem"} justifyContent={"center"}>
                    <Container fluid padding={0} asChild >
                        <HStack justify="space-between">
                            <Icon size="md" margin={1}>
                                {tab.favIconUrl ? (<Image src={tab.favIconUrl} />) : (<MdLanguage />)}
                            </Icon>
                            <Center asChild>
                                <Text truncate textStyle="sm" lineClamp={showThumbnails ? 1 : 3} color={TRAY_COLORS.global_foreground}>
                                    {tab.title}
                                </Text>
                            </Center>
                            <CloseButton onClick={close_tab} />
                        </HStack>
                    </Container>
                </Card.Header>

                <Card.Body padding={0} >
                    <Show when={showThumbnails}>
                        <AspectRatio ratio={Math.max(screen.availWidth / screen.availHeight, 4 / 3)}>
                            {
                                thumbnailUri ?
                                    <Image src={thumbnailUri} alt="Thumbnail" /> :
                                    <Center>
                                        <MdNoPhotography size={"30%"} color={"#AAA"} title="Thumbnail Unavailable" />
                                    </Center>
                            }
                        </AspectRatio>
                    </Show>
                </Card.Body>

                {/* <Card.Footer /> */}
            </a>
        </Card.Root>
    )
}
export default Tab