import {
	Fieldset,
	Link,
	Code,
	Box,
	HStack,
	Stack,
	Separator,
	List
} from '@chakra-ui/react';

import {
	AccordionItem,
	AccordionItemContent,
	AccordionItemTrigger,
	AccordionRoot,
} from "@/components/ui/accordion"
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { MdOutlineFavorite, MdBugReport } from 'react-icons/md';

import { META, ASSET } from "@/strings"
import { useEffect, useState } from 'react';

interface LicenseDataItem {
	name: string
	licenseType: string
	installedVersion: string
	licenseText?: string
}

// Main Component
function About() {
	const [platformInfo, setPlatformInfo] = useState<browser.runtime.PlatformInfo | null>(null);
	const [browserInfo, setBrowserInfo] = useState<browser.runtime.BrowserInfo | null>(null);
	const [licenseText, setLicenseText] = useState<string>("");
	const [licenseData, setLicenseData] = useState<LicenseDataItem[]>([]);
	useEffect(() => {
		browser.runtime.getPlatformInfo().then(info => {
			setPlatformInfo(info);
		});
		browser.runtime.getBrowserInfo().then(info => {
			setBrowserInfo(info);
		});
		fetch(ASSET.LICENSE)
			.then(response => response.text())
			.then(text => setLicenseText(text))
			.catch(error => console.error(error));
		fetch(ASSET.LICENSE_DATA)
			.then(response => response.json())
			.then(data => setLicenseData(data))
			.catch(error => console.error(error));
	}, []);
	return (
		<>
			<Fieldset.Root width="100%" fontSize={"md"} >
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
					<Field label={"Homepage"} orientation={"horizontal"}>
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

								<Link href={META.SPONSOR_URL} ><MdOutlineFavorite />Sponsor</Link>
							</Button>
						</HStack>
					</Field>

					<Separator />
					<Field label={"License"}>
						<AccordionRoot collapsible>
							<AccordionItem key={0} value={META.EXT_NAME}>
								<AccordionItemTrigger>{META.EXT_NAME}: {META.LICENSE}</AccordionItemTrigger >
								<AccordionItemContent asChild>
									<Box asChild padding="4" borderWidth="1px" fontSize={"sm"} whiteSpace={"pre-wrap"} wordWrap={"break-word"} overflowWrap={"break-word"}>
										<pre>{licenseText}</pre>
									</Box>
								</AccordionItemContent>
							</AccordionItem>
							{licenseData.map((item, index) => (
								<AccordionItem key={index + 1} value={item.name}>
									<AccordionItemTrigger>{item.name}: {item.licenseType}</AccordionItemTrigger >
									<AccordionItemContent asChild>
										<Box asChild padding="4" borderWidth="1px" fontSize={"sm"} whiteSpace={"pre-wrap"} wordWrap={"break-word"} overflowWrap={"break-word"}>
											<pre>{item.licenseText}</pre>
										</Box>
									</AccordionItemContent>
								</AccordionItem>

							))}
						</AccordionRoot>
					</Field>
				</Fieldset.Content>
			</Fieldset.Root>
		</>
	);
};

export default About;
