// NOTE: this entry should be built as IIFE to avoid polluting global namespace
// otherwise it will fail on second launch if the user closed the previous instance without refreshing the page
import { useEffect, useState } from "react";
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
import { META, KEY } from "@/strings"
import { TRAY_COLORS } from "@/components/ui/theme";

interface DrawerState {
	exists: boolean;
	send_close: () => void;
}
const DRAWER_STATE_KEY = `__${KEY.IN_PAGE_CONTAINER_ID}_drawer_state__`;
function TrayDrawer({ onClose }: { onClose: () => void }) {

	const [isOpen, setIsOpen] = useState(true);
	console.log("render Drawer");

	function close_self() {
		console.log("close Drawer");
		(window[DRAWER_STATE_KEY as keyof Window] as DrawerState|undefined) = undefined;
		setIsOpen(false);
	}
	useEffect(() => {
		async function register_drawer() {
			console.log("register drawer to ",DRAWER_STATE_KEY);
			const drawerState: DrawerState = {
				exists: true,
				send_close: () => { console.log("received close"); close_self() }
			};
			(window[DRAWER_STATE_KEY as keyof Window] as DrawerState) = drawerState;
		}
		register_drawer();
		return close_self;
	}, []);
	return (// why disable model: otherwise action bar cannot be clicked
		<DrawerRoot
			open={isOpen}
			modal={false}
			placement={"bottom"}
			onOpenChange={(e) => setIsOpen(e.open)}
			onExitComplete={onClose}// invoke onClose when drawer is closed
			unmountOnExit={true}
			closeOnInteractOutside={false}//NOTE: setting to true will cause immediate close if click anything even inside the drawer (on focus outside, only in IIFE)
			// onFocusOutside={(e) => { console.log("focus outside", e); }}
			// onInteractOutside={(e) => { console.log("interact outside", e); }}
			onPointerDownOutside={(e) => { console.log("pointer down outside", e); close_self(); }}
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
				<DrawerCloseTrigger rounded={"xl"} />
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
	const drawerState=window[DRAWER_STATE_KEY as keyof Window] as DrawerState | undefined;
	if (drawerState && drawerState.exists) {// drawer already exists
		console.log("drawer already exists, close it");
		drawerState.send_close();
		return;
	} 
	client_install();
	const rootElement = document.createElement("div");
	rootElement.id = KEY.IN_PAGE_CONTAINER_ID;
	document.body.appendChild(rootElement);
	const root = ReactDOM.createRoot(rootElement);
	function onClose() {
		client_uninstall();
		const containerNow = document.getElementById(KEY.IN_PAGE_CONTAINER_ID);
		console.log("onClose");
		containerNow!.remove();
	}
	root.render(
		<App onClose={onClose} />
	);
}
launch_tray_in_page();