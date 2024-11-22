import { z } from 'zod';
import OptionsSync from 'webext-options-sync';

// Define the Zod Schema

const OptionsSchema = z.object({
	default_launch_mode: z.enum(['tab', 'popup', 'drawer']),
});

// Create TypeScript type from schema
type Options = z.infer<typeof OptionsSchema>;

// Default values
const defaultValues: Options = {
	default_launch_mode: "tab",
};

const optionText2Label: Record<string, string> = {
	"default_launch_mode": "Default launch mode",
	"tab": "Tab",
	"popup": "Popup",
	"drawer": "Drawer"
};
const optionsStorage = new OptionsSync({ defaults: defaultValues });

var localOptions:Options=defaultValues;

async function update_local_options(options: Options | null = null) {
	console.log(`update_local_options called from`, localOptions, 'to', options);
	if (options) {//direct update
		localOptions = options;
	} else {
		const rawOptions = await optionsStorage.getAll();
		const parsedOptions = OptionsSchema.parse(rawOptions);
		
		localOptions = parsedOptions;
	}
	browser.action.setPopup({ popup: localOptions.default_launch_mode === "popup" ? browser.runtime.getURL("/pages/tray.html") : "" });
	console.log("localOptions updated", localOptions);
}
function set_options(options: Options) {
	optionsStorage.set(options);
	update_local_options(options);
}
function get_options(): Options{
	console.log("get_options called", localOptions);
	return localOptions;
}
export { OptionsSchema, defaultValues, optionText2Label,set_options, get_options, update_local_options};
export type { Options };
