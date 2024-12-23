import {
	Fieldset,
	Link,
	Text,
	Collapsible,
	Box,
	HStack,
	Stack,
	Separator,
	List
} from '@chakra-ui/react';
import { MdOutlineFavorite, MdBugReport } from 'react-icons/md';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { META } from "@/strings"
import { useEffect, useState } from 'react';

// Main Component
function About() {
	const [platformInfo, setPlatformInfo] = useState<browser.runtime.PlatformInfo | null>(null);
	const [browserInfo, setBrowserInfo] = useState<browser.runtime.BrowserInfo | null>(null);
	useEffect(() => {
		browser.runtime.getPlatformInfo().then(info => {
			setPlatformInfo(info);
		});
		browser.runtime.getBrowserInfo().then(info => {
			setBrowserInfo(info);
		});
	}, []);
	return (
		<>
			<Fieldset.Root width="100%" size={"lg"}>
				<Stack>
				{/* <Fieldset.Legend>About {META.EXT_NAME}</Fieldset.Legend> */}
				{/* <Fieldset.HelperText>
					These options will be synced using the browser's storage API.
				</Fieldset.HelperText> */}
				</Stack>

				<Fieldset.Content>
					<Field label={"Version"} orientation={"horizontal"}>
						{META.VERSION}
					</Field>
					<Field label={"Home Page"} orientation={"horizontal"}>
						<Link href={META.HOMEPAGE_URL} >{META.HOMEPAGE_URL}</Link>
					</Field>
					<Field label={"Author"} orientation={"horizontal"}>
						{META.AUTHOR}
					</Field>

					<Field label={"Report Bugs"} >
						<HStack align={"stretch"} justifyContent={"space-between"} width="100%">
							<Box>
								<List.Root>
									<List.Item>Browser: {browserInfo?.vendor} {browserInfo?.name} {browserInfo?.version}</List.Item>
									<List.Item>System: {platformInfo?.os} {platformInfo?.arch}</List.Item>
								</List.Root>
								
								
							</Box>
							<Button asChild>

								<Link href={META.REPORT_BUG_URL} ><MdBugReport />New Issue</Link>
							</Button>

						</HStack>
					</Field>
					<Field label={"Contributors"}>
						{META.CONTRIBUTORS.length > 0 ? META.CONTRIBUTORS.join(", ") : "No contributors yet"}
					</Field>
					<Field label={"Sponsors"}>
						<HStack align={"stretch"} justifyContent={"space-between"} width="100%">
							<Box>
								{META.SPONSORS.length > 0 ? META.SPONSORS.join(", ") : "No sponsors yet"}
							</Box>
							<Button asChild colorPalette={"pink"}>

								<Link href={META.SPONSOR_URL} ><MdOutlineFavorite />Support Us!</Link>
							</Button>
						</HStack>
					</Field>
					
					<Separator />
					<Field label={"License"} >
						<Collapsible.Root>
							<Collapsible.Trigger paddingY="3">View License</Collapsible.Trigger>
							<Collapsible.Content>
								<Box padding="4" borderWidth="1px">
									Lorem Ipsum is simply dummy text of the printing and typesetting
									industry. Lorem Ipsum has been the industry's standard dummy text ever
									since the 1500s, when an unknown printer took a galley of type and
									scrambled it to make a type specimen book.
								</Box>
							</Collapsible.Content>
						</Collapsible.Root>
					</Field>
				</Fieldset.Content>
			</Fieldset.Root>
		</>
	);
};

export default About;
