import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { MdHome, MdSettings, MdInfo } from "react-icons/md";
import { Usage } from "./usage";
import OptionsForm from "./options_form"
import About from "./about";
import { Provider } from "@/components/ui/provider"
import { Center, AbsoluteCenter, Tabs, Text, Box, Bleed, Icon, Image, Heading, HStack, VStack, Link } from "@chakra-ui/react";
// import { Button } from "../components/ui/button";
import { TRAY_COLOR_TOKENS } from "@/theme/tray_color";
import { ASSET, META } from "@/strings";

//data
interface OPTION_TAB {
    id: string,
    label: string,
    icon: React.ReactNode,
    title: string,
    content: React.ReactNode
}
const TAB_USAGE: OPTION_TAB = {
    id: "usage", label: "Usage", icon: <MdHome />,
    title: "",//`Getting Started with ${META.EXT_NAME}`,
    content: <Usage />
};
const TAB_OPTIONS: OPTION_TAB = {
    id: "options", label: "Options", icon: <MdSettings />,
    title: `${META.EXT_NAME} Options`,
    content: <OptionsForm />
};
const TAB_ABOUT: OPTION_TAB = {
    id: "about", label: "About", icon: <MdInfo />,
    title: `About ${META.EXT_NAME}`,
    content: <About />
};

const OPTION_TABS = [TAB_USAGE, TAB_OPTIONS, TAB_ABOUT];

function NatigationBar({ curTabId, setCurTabId }: { curTabId: string, setCurTabId: (tabId: string) => void }) {
    return (<Box
        display={"flex"}
        position={"sticky"} top={0} width="100%" zIndex={1000}
        backgroundColor={TRAY_COLOR_TOKENS.container_background}
        shadow={"md"} shadowColor={TRAY_COLOR_TOKENS.container_shadow}
        justifyContent={"center"}
    >
        {/* navigation content */}
        <HStack alignItems={"center"} justifyContent={"space-between"} gap={3} padding={3} width="min(800px,100%)" >
            <HStack alignItems={"center"} gap={3}>
                <Icon size={"xl"}><Image src={ASSET.ICON.EXT}></Image></Icon>
                {/* title and version */}
                <HStack alignItems={"baseline"} justifyContent={"center"} gap={3}>
                    <Heading fontSize={"2xl"}>{META.EXT_NAME}</Heading>
                    <Text>v{META.VERSION}{META.VERSION_SUFFIX}</Text>
                </HStack>
            </HStack>
            {/* navigation button */}
            <Tabs.Root value={curTabId} variant={"plain"} size={"lg"} onValueChange={(valueDetails) => setCurTabId(valueDetails.value)} >
                <Tabs.List>
                    {OPTION_TABS.map((tab) =>
                    (<Tabs.Trigger value={tab.id} asChild>
                        {/* use link to add url navigation parameter */}
                        <Link unstyled href={`#${tab.id}`}>
                            {tab.icon} {tab.label}
                        </Link>

                    </Tabs.Trigger>)
                    )}
                </Tabs.List>
            </Tabs.Root>

        </HStack>
    </Box>
    );
}
// scaffolding
function App() {
    // get default tab id from url hash
    const hash = window.location.hash.slice(1);
    const defaultTabId = hash || TAB_OPTIONS.id;
    // set current tab id
    const [curTabId, setCurTabId] = useState(defaultTabId);

    // update url hash when tab id changes
    useEffect(() => {
        window.location.hash = curTabId;
    }, [curTabId]);
    // switch tab when url hash changes
    useEffect(() => {
        function handleHashChange() {
            const newTabId = window.location.hash.slice(1); // remove hash symbol '#'
            // check if new tab id is valid
            if (OPTION_TABS.some((tab) => tab.id === newTabId)) {
                setCurTabId(newTabId);
            } else {
                // fallback to default tab id
                setCurTabId(defaultTabId);
            }
        }
        window.addEventListener("hashchange", handleHashChange);
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    return (
        <Provider>
            <Box backgroundColor={TRAY_COLOR_TOKENS.global_background} minHeight={"100vh"} colorPalette="brand">
                <NatigationBar curTabId={curTabId} setCurTabId={setCurTabId} />
                
                {/* tab container, controlled */}
                <Tabs.Root value={curTabId} variant={"outline"} size={"lg"}
                    width={"100%"} maxWidth={"min(700px,100%)"} padding="1rem" margin={"0 auto"}
                >
                    <VStack width={"100%"} alignItems={"stretch"}>
                        <Heading size={"lg"} textAlign={"center"}>
                            {OPTION_TABS.find((tab) => tab.id === curTabId)?.title}
                        </Heading>
                        {
                            OPTION_TABS.map((tab) => (
                                    <Tabs.Content value={tab.id} width={"100%"}>
                                        {tab.content}
                                    </Tabs.Content>
                                )
                            )
                        }
                    </VStack>
                </Tabs.Root>
            </Box>
        </Provider>
    );
}


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
