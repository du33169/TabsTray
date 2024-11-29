import { useEffect } from "react";
import ReactDOM from "react-dom/client";

import OptionsForm from "./options_form"
import { Provider } from "@/components/ui/provider"
import { Center } from "@chakra-ui/react";
// import { Button } from "../components/ui/button";
import { TRAY_COLORS } from "@/components/ui/theme";
function App() {
    useEffect(() => {

    }, []);

    return (
        <Provider>
			<Center backgroundColor={TRAY_COLORS.global_background} minHeight={"100vh"} padding={"max(20px,0.5vw)"} colorPalette="brand">
				<OptionsForm />
                </Center>
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
