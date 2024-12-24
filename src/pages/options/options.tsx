import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { MdSettings, MdInfo } from "react-icons/md";
import OptionsForm from "./options_form"
import About from "./about";
import { Provider } from "@/components/ui/provider"
import { Center, AbsoluteCenter, Tabs, Text, Box, Bleed, Icon, Image, Heading, HStack, VStack } from "@chakra-ui/react";
// import { Button } from "../components/ui/button";
import { TRAY_COLORS } from "@/components/ui/theme";
import { ASSET, META } from "@/strings";
function App() {
    const [tabValue, setTabValue] = useState("options");
    return (
        <Provider>

            <Box backgroundColor={TRAY_COLORS.global_background} minHeight={"100vh"} colorPalette="brand">
                {/* navigation bar */}
                <Box
                    display={"flex"}
                    position={"sticky"} top={0} width="100vw" zIndex={9999}
                    backgroundColor={TRAY_COLORS.container_background}
                    shadow={"md"} shadowColor={TRAY_COLORS.container_shadow}
                    justifyContent={"center"}
                >
                    {/* navigation content */}
                    <HStack alignItems={"center"} justifyContent={"space-between"} gap={3} padding={3} width="min(800px,100vw)" >
                        <HStack alignItems={"center"} gap={3}>
                            <Icon size={"xl"}><Image src={ASSET.ICON.EXT}></Image></Icon>
                            {/* title and version */}
                            <HStack alignItems={"baseline"} justifyContent={"center"} gap={3}>
                                <Heading fontSize={"2xl"}>{META.EXT_NAME}</Heading>
                                <Text>v{META.VERSION}</Text>
                            </HStack>
                        </HStack>
                        {/* navigation button */}
                        <Tabs.Root defaultValue="options" variant={"plain"} size={"lg"} onValueChange={(valueDetails) => setTabValue(valueDetails.value)} >
                            <Tabs.List>
                                <Tabs.Trigger value="options"> <MdSettings /> Options </Tabs.Trigger>
                                <Tabs.Trigger value="about">   <MdInfo />     About   </Tabs.Trigger>
                            </Tabs.List>
                        </Tabs.Root>

                    </HStack>
                </Box>

                {/* tab container, controlled */}
                <Tabs.Root value={tabValue} variant={"outline"} size={"lg"} 
                    width={"100%"} maxWidth={"min(700px,100vw)"} padding="1rem" margin={"0 auto"}
                >
                    <VStack width={"100%"} alignItems={"stretch"}>
                        <Heading size={"lg"} textAlign={"center"}>{tabValue == "options" ? META.EXT_NAME + " " + "Options" : "About" + " " + META.EXT_NAME}</Heading>
                        <Tabs.Content value="options" width={"100%"}>
                            <OptionsForm />
                        </Tabs.Content>
                        <Tabs.Content value="about" width={"100%"}>
                            <About />
                        </Tabs.Content>
                    </VStack>
                </Tabs.Root>
            </Box>
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
