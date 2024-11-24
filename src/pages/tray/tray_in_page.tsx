import { useState } from "react";
import ReactDOM from "react-dom/client";
import { ShadowProvider } from "@/components/ui/shadow-provider"
// import { ContainedProvider } from "@/components/ui/contained-provider"
import {
	DrawerBackdrop,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerRoot,
	DrawerTitle,
} from "@/components/ui/drawer"
import { Center } from "@chakra-ui/react";
import { browserApi,browserEvent,client_install } from "@/browserProxy/client";
import { Tray } from "./tray";
import {META} from "@/strings"

function TrayDrawer({ onClose }: { onClose: () => void }) {
	// const [isOpen, setIsOpen] = useState(true);

	const [isOpen, setIsOpen] = useState(true);
	console.log("render Drawer");
	return (
		<DrawerRoot open={isOpen} placement={"bottom"} onOpenChange={(e) => setIsOpen(e.open)} onExitComplete={onClose} unmountOnExit={true}>
			<DrawerBackdrop />
			<DrawerContent portalled={false}>
				<DrawerHeader>
					
					<DrawerTitle><Center>{META.EXT_NAME}</Center></DrawerTitle>
				</DrawerHeader>
				<DrawerBody>
					<Tray browserApiProvider={browserApi} browserEventProvider={browserEvent}/>
				</DrawerBody>
				{/* <DrawerFooter>
					<DrawerActionTrigger asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerActionTrigger>
					<Button>Save</Button>
				</DrawerFooter>
				<DrawerCloseTrigger /> */}
			</DrawerContent>
		</DrawerRoot>
	)
}

function App({ onClose }: { onClose: () => void }) {
	return (
		<ShadowProvider>
			<TrayDrawer onClose={onClose} />
		</ShadowProvider>
		// <ContainedProvider>
		// 	<TrayDrawer onClose={onClose} />
		// </ContainedProvider>
	)
}

console.log("launch Tray in Drawer");
client_install("tray-in-drawer");
function getRootContainerElement() {
	const container = document.createElement("div");
	container.id = "tray-container";
	document.body.appendChild(container);
	return container;
}
const rootElement = getRootContainerElement();
const root = ReactDOM.createRoot(rootElement);
function onClose() {
	const containerNow = document.getElementById("tray-container");
	console.log("onClose");
	containerNow!.remove();
}
root.render(
	<App onClose={onClose} />
);