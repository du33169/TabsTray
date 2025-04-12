import {
	Fieldset,
	Link,
	Code,
	Box,
	HStack,
	Stack,
	Separator,
	List,
	Flex,
	Text
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
function LicenseDisplayAccordionItem(
	{ name, version, licenseType, licenseText }:
	{ name: string, version: string, licenseType: string, licenseText: string }
) {

	return (
		<AccordionItem value={name}>
			<AccordionItemTrigger>
				<Flex justify="space-between" width={"100%"}>
					<Text>{name}</Text>
					{
					// v{version} // disable to avoid potential security issue
					}
					<Text marginStart={"auto"}>{licenseType}</Text>
				</Flex>
			</AccordionItemTrigger >
			<AccordionItemContent asChild>
				<Box asChild padding="4" borderWidth="1px" fontSize={"sm"} whiteSpace={"pre-wrap"} wordWrap={"break-word"} overflowWrap={"break-word"}>
					<pre>{licenseText}</pre>
				</Box>
			</AccordionItemContent>
		</AccordionItem>)
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
		async function getLicenseText() {
			return fetch(ASSET.LICENSE)
				.then(response => response.text())
				.then(text => { setLicenseText(text);return text; })
				.catch(error => console.error(error));
		}
		async function getLicenseData(TabsTrayLicenseData: LicenseDataItem) {

			return fetch(ASSET.LICENSE_DATA)
				.then(response => response.json())
				.then(data => [TabsTrayLicenseData, ...data]) // add TabsTrayLicenseData to data array front
				.then(data => setLicenseData(data))
				.catch(error => console.error(error));
		}
		getLicenseText().then((licenseText: string | void) => {
			const TabsTrayLicenseData: LicenseDataItem = {
				name: META.EXT_NAME,
				licenseType: META.LICENSE,
				installedVersion: META.VERSION,
				licenseText: licenseText || ""
			}
			getLicenseData(TabsTrayLicenseData);// license data depends on license text
		});
	}, []);
	return (
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
						{licenseData.map((item) => (
							<LicenseDisplayAccordionItem key={item.name} name={item.name} version={item.installedVersion} licenseType={item.licenseType} licenseText={item.licenseText || ""} />
						))}
					</AccordionRoot>
				</Field>
			</Fieldset.Content>
		</Fieldset.Root>
	);
};

export default About;
