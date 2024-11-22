import { useEffect } from "react";
import ReactDOM from "react-dom/client";

import OptionsForm from "./options_form"
import { Provider } from "@/components/ui/provider"
import { Center } from "@chakra-ui/react";
// import { Button } from "../components/ui/button";

function App() {
    useEffect(() => {

    }, []);

    return (
		<Provider>
			<Center >
				<OptionsForm />
			</Center>
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
