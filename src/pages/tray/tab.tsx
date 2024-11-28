import React, { useEffect, useState } from "react";
import { MdNoPhotography,MdLanguage } from "react-icons/md";
// import { Button } from "../components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import { Card, Image, AspectRatio, Flex, Text, HStack, Container, Icon, Center, Show } from "@chakra-ui/react";

function Tab({ tab, browserApiProvider = browser, showThumbnails }: { tab: browser.tabs.Tab, browserApiProvider?: typeof browser, showThumbnails: boolean }) {
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
    const tabCss = {
        "border-radius": "12px", /* Rounded corners for modern feel */
        "text-align": "left", /* Align content to the left for better readability */
        "box-shadow": "0 4px 8px rgba(0, 0, 0, 0.1)", /* Elevated shadow for depth */
        "transition": "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
            "transform": "translateY(-4px)", /* Slight lift on hover */
            "box-shadow": "0 6px 12px rgba(0, 0, 0, 0.15)", /* Enhanced shadow */
        }
    }
    return (
        <Card.Root asChild css={tabCss} >
            <a key={tab.id}  href={tab.url} target="_blank" onClick={switch_to_tab} >
                <Card.Header paddingX={2} paddingY={1} minH={showThumbnails ? "auto" : "5rem"} justifyContent={"center"}>
                    <Container fluid padding={0} asChild >
                        <HStack justify="space-between">
                            <Icon size="md" margin={1}>
                                {tab.favIconUrl ? (<Image src={tab.favIconUrl} />) : <MdLanguage />}
                            </Icon>
                            <Center>
                                <Text truncate lineClamp={showThumbnails ? 1 : 3} >{tab.title}</Text>
                            </Center>
                            <CloseButton onClick={close_tab} />
                        </HStack>
                    </Container>
                </Card.Header>

                <Card.Body padding={0}>
                    <Show when={showThumbnails}>
                        <AspectRatio ratio={Math.max(screen.availWidth / screen.availHeight, 4 / 3)}>
                            {
                                thumbnailUri ?
                                    <Image src={thumbnailUri} alt="Thumbnail" /> :
                                    <Center>
                                        <MdNoPhotography size={"30%"} color="#AAA" title="Thumbnail Unavailable" />
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