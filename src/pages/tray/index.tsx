import ReactDOM from "react-dom/client";
import { Provider } from "@/components/ui/provider"
import { Tray } from "./tray";

function App() {
	return (
		<Provider>
        <Tray />
    </Provider>
	);
}
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);