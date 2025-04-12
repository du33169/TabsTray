import { Box, Center, HStack, Link } from "@chakra-ui/react";
import Markdown from "react-markdown";
import { Prose } from "@/components/ui/prose";
import { ASSET, META } from "@/strings";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MdRocketLaunch,MdSettings } from "react-icons/md";

import { launch_tray } from "../tray/launch_tray";


export function Usage() {
	const usageUrl = browser.runtime.getURL(ASSET.DOCS.USAGE);
	const [fileContent, setFileContent] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadFileContent = async () => {
			try {
				const response = await fetch(usageUrl);
				if (!response.ok) {
					throw new Error("Failed to fetch usage.md");
				}
				const text = await response.text(); // 你可以根据需要使用 response.json() 等方法
				setFileContent(text);
			} catch (err) {
				console.error(err);
				setFileContent(`Failed to load usage.md: ${err as string}`);
			} finally {
				setLoading(false);
			}
		};

		loadFileContent();
	}, [usageUrl]);
	return (
		<Box width="100%" maxWidth="100%">
		<Prose width="100%" maxWidth="100%" color={"var(--chakra-colors-fg)"}>
			<Markdown>
				{loading ? "loading..." : fileContent}
			</Markdown>
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
                browser.tabs.create({ url: `${optionPage}#changelog` }); // 
                break;
            default:
                break;
        }
    }
    browser.runtime.onInstalled.addListener(open_welcome_page);
}