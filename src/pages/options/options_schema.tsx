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
	"tab": "Standalone Tab",
	"popup": "Extension Button Popup",
	"drawer": "In-Page Drawer"
};
const optionsStorage = new OptionsSync({ defaults: defaultValues });

function set_options(options: Options) {
	optionsStorage.set(options);
}
async function get_options(): Promise<Options> {
	const options = await optionsStorage.getAll();
	return OptionsSchema.parse(options);
}

export { OptionsSchema, defaultValues, optionText2Label,set_options, get_options};
export type { Options };
