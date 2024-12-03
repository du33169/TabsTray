import ReactDOM from "react-dom/client";
import { Provider } from "@/components/ui/provider"
import { Tray } from "./tray";
import React from "react";

function App() {
	return (
		<React.StrictMode>
			<Provider>
				<Tray /> 
			</Provider>
		</React.StrictMode>
	);
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);