import { z } from 'zod';
import OptionsSync from 'webext-options-sync';

// Define the Zod Schema

const OptionsSchema = z.object({
	launch_mode: z.enum(['tab', 'popup', 'drawer']),
	pin_tray_tab: z.boolean(),
	show_thumbnails: z.boolean(),
});

// Create TypeScript type from schema
type Options = z.infer<typeof OptionsSchema>;

// Default values
const defaultValues: Options = {
	launch_mode: "drawer",
	pin_tray_tab: true,
	//@ts-ignore
	show_thumbnails: IS_FIREFOX ? true: false,
};

const optionText2Label: Record<string, string> = {
	"launch_mode": "Launch Mode",
	"tab": "Standalone Tab",
	"popup": "Extension Button Popup",
	"drawer": "In-Page Drawer",
	"pin_tray_tab": "Pin Tabs Tray (Tab Mode Only)",
	"show_thumbnails": "Show Tab Thumbnails By Default",
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
