
import { useEffect, useRef, useState } from 'react';
import { running_in_background_script, running_in_content_script } from '@/utils';
import {
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverRoot,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Alert, Flex, Text, Em, Link, PopoverAnchor } from "@chakra-ui/react"
import { CloseButton } from "@/components/ui/close-button"
import { browserApiTest } from "@/browserProxy/client";

export function ThumbnailApiChecker(
	{ children, browserApiProvider = browser, enableChecking }:
		{ children: any, browserApiProvider?: typeof browser, enableChecking: boolean }
) {
	const [open, setOpen] = useState(false)
	useEffect(() => {
		async function check_captureTab_available(): Promise<boolean> {
			console.log("check_captureTab_availability");
			if (running_in_background_script()) {
				console.log("current script is background script, captureTab:", browserApiProvider.tabs.captureTab !== undefined);
				return browserApiProvider.tabs.captureTab !== undefined;
			} else if (running_in_content_script()) {
				try {
					// @ts-ignore
					const captureTabAvailable: boolean = (await browserApiTest.tabs.captureTab) as boolean;//will return boolean
					console.log("captureTabAvailable in content script", captureTabAvailable);
					return captureTabAvailable;
				}
				catch (e) {
					console.log("error in content script, set captureTab to false", e);
					return false;
				}
			}
			else {
				throw new Error("Cannot determine whether captureTab is available in this context");
				return false;
			}
			return false;
		}
		console.log("enableChecking", enableChecking)
		if (enableChecking) check_captureTab_available().then(captureTabAvailable => {
			console.log("captureTabAvailable result", captureTabAvailable);
			setOpen(!captureTabAvailable);
		});
		else setOpen(false);
	}, [enableChecking]);

	const linkRef = useRef<HTMLAnchorElement>(null)

	return (
		<PopoverRoot
			open={enableChecking && open}
			onOpenChange={(e) => setOpen(e.open)}
			lazyMount unmountOnExit
			positioning={{ placement: "top" }}
			initialFocusEl={() => linkRef.current}
		>
			<PopoverAnchor asChild >
				{
					//NOTE: use PopoverAnchor instead of PopoverTrigger to avoid the open state change when clicking on children
				}
				{children}
			</PopoverAnchor>
			<PopoverContent css={{ "--popover-bg": "colors.red.subtle" }} minW={"md"}>
				<PopoverArrow />
				<PopoverBody asChild >
					<Alert.Root status="error">
						<Alert.Indicator />
						<Alert.Content>
							<Alert.Title fontWeight={"bold"}>Cannot Fetch Thumbnails</Alert.Title>
							<Flex direction={"row"} justify={"space-between"}>
								<Alert.Description>
									{/* <Text>"browser.tabs.captureTab" API is not available </Text> */}
									<Text>
										Permission required:
									</Text>
									<Em>Access your data for all websites</Em>
									<Text>
										(Grant it via <Link variant="underline" onClick={() => { browserApiProvider.runtime.openOptionsPage(); }} ref={linkRef}>
											Manage Extension
										</Link>
										-&gt;Permissions)
									</Text>
								</Alert.Description>
							</Flex>
						</Alert.Content>
						<CloseButton pos="relative" top="-2" insetEnd={"-2"} onClick={() => setOpen(false)} />
					</Alert.Root>
				</PopoverBody>
			</PopoverContent>
		</PopoverRoot>
	)

}