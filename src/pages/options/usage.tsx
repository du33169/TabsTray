import { Box, Center, HStack, Link, Collapsible, IconButton, Text, Heading } from "@chakra-ui/react";
import { Prose } from "@/components/ui/prose";
import { ASSET, META } from "@/strings";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MdRocketLaunch,MdSettings, MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

import { launch_tray } from "../tray/launch_tray";
import { MarkdownFileLoader } from "./markdownFileLoader";
import Markdown from "react-markdown";

function Changelog({ initExpand }: { initExpand: boolean }) {
	const [expand, setExpand] = useState(initExpand);

	const changelogUrl = browser.runtime.getURL(ASSET.DOCS.CHANGELOG);
	return (
		<Collapsible.Root open={expand} onOpenChange={e=>setExpand(e.open)} width="100%">
			<Collapsible.Trigger asChild>
				<HStack justifyContent={"space-between"} alignItems={"baseline"} width="100%">
					<Heading size="md">{expand ? `${META.EXT_NAME} has been updated to ${META.VERSION}${META.VERSION_SUFFIX}!`:  "Changelog"}</Heading>
					<IconButton variant={'plain'}>
						{expand? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
					</IconButton>
				</HStack>
			</Collapsible.Trigger>
			<Collapsible.Content width="100%">
				<MarkdownFileLoader url={changelogUrl} />
			</Collapsible.Content>
		</Collapsible.Root>
	)
}
export function Usage() {
	const usageUrl = browser.runtime.getURL(ASSET.DOCS.USAGE);
	// change if url has param update=1
	const isUpdate=new URLSearchParams(window.location.search).get("update")=="1";
	return (
		<Box width="100%" maxWidth="100%">
			<Prose width="100%" maxWidth="100%" color={"var(--chakra-colors-fg)"}>
				<Changelog initExpand={isUpdate} />
				<Markdown>---</Markdown>
				<MarkdownFileLoader url={usageUrl} />
			</Prose>
			<Center>
				<HStack>
					<Button onClick={() => browser.tabs.getCurrent().then(tab => launch_tray(tab!))}>
						<MdRocketLaunch />
						Launch {META.EXT_NAME}
					</Button>

					<Button variant={"subtle"} asChild>
						<Link unstyled href="#options" >
							<MdSettings />
							View Options
						</Link>
					</Button>
				</HStack>

			</Center>
		</Box>
	);
}

export function welcome_page_install() {// NOTE: this function cannot be put to options.tsx as it will cause a circular dependency
    function open_welcome_page(details: browser.runtime._OnInstalledDetails) {
        const optionPage = browser.runtime.getURL(ASSET.PAGE.OPTIONS);
        switch (details.reason) {
            case "install":
                browser.tabs.create({ url: `${optionPage}#usage` });
                break;
            case "update":
                browser.tabs.create({ url: `${optionPage}?update=1#usage` }); // 
                break;
            default:
                break;
        }
    }
    browser.runtime.onInstalled.addListener(open_welcome_page);
}