// NOTE: this entry should be built as IIFE to avoid polluting global namespace
// otherwise it will fail on second launch if the user closed the previous instance without refreshing the page
import { useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "@/components/ui/provider";
import {
	DrawerBackdrop,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerRoot,
	DrawerTitle,
	DrawerCloseTrigger,
} from "@/components/ui/drawer"
import { Center } from "@chakra-ui/react";
import { browserApi, browserEvent, client_install, client_uninstall } from "@/browserProxy/client";
import { Tray } from "./tray";
import { META } from "@/strings"
import { TRAY_COLORS } from "@/components/ui/theme";
function TrayDrawer({ onClose }: { onClose: () => void }) {

	const [isOpen, setIsOpen] = useState(true);
	console.log("render Drawer");
	return (// why disable model: otherwise action bar cannot be clicked
		<DrawerRoot
			open={isOpen}
			modal={false}
			placement={"bottom"}
			onOpenChange={(e) => setIsOpen(e.open)}
			onExitComplete={onClose}
			unmountOnExit={true}
			closeOnInteractOutside={false}//NOTE: setting to true will cause immediate close if click anything even inside the drawer (on focus outside, only in IIFE)
			// onFocusOutside={(e) => { console.log("focus outside", e); }}
			// onInteractOutside={(e) => { console.log("interact outside", e); }}
			onPointerDownOutside={(e) => { console.log("pointer down outside", e); setIsOpen(false)}}
		>
			<DrawerBackdrop />
			<DrawerContent
				portalled={false} colorPalette="brand" 
				backgroundColor={TRAY_COLORS.global_background} color={TRAY_COLORS.global_foreground}
				roundedTop={"2xl"}
				maxH={"90vh"}
			>
				<DrawerHeader borderColor={TRAY_COLORS.container_border}>
					<DrawerTitle><Center>{META.EXT_NAME}</Center></DrawerTitle>
				</DrawerHeader>
				<DrawerBody>
					{ /*@ts-ignore */}
					<Tray browserApiProvider={browserApi} browserEventProvider={browserEvent} />
				</DrawerBody>
				<DrawerCloseTrigger rounded={"xl"}/>
			</DrawerContent>
		</DrawerRoot>
	)
}

function App({ onClose }: { onClose: () => void }) {
	return (//@ts-ignore
		<Provider enableShadow={true} browserApiProvider={browserApi} browserEventProvider={browserEvent}>
			<TrayDrawer onClose={onClose} />
		</Provider>
	)
}

function launch_tray_in_page() {
	console.log("launch Tray in Drawer");
	client_install();
	function getRootContainerElement() {
		const container = document.createElement("div");
		container.id = "tray-container";
		document.body.appendChild(container);
		return container;
	}
	const rootElement = getRootContainerElement();
	const root = ReactDOM.createRoot(rootElement);
	function onClose() {
		client_uninstall();
		const containerNow = document.getElementById("tray-container");
		console.log("onClose");
		containerNow!.remove();

	}
	root.render(
		<App onClose={onClose} />
	);
}
launch_tray_in_page();