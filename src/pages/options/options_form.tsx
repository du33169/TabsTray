import { useEffect, useState } from 'react';
import { z } from 'zod';
import {
	Button,
	Fieldset,
	Stack,
	HStack,
	Box} from '@chakra-ui/react';
import { toaster,Toaster } from '@/components/ui/toaster';
import {
	RadioCardItem,
	RadioCardLabel,
	RadioCardRoot,
  } from "@/components/ui/radio-card"
import { Switch } from '@/components/ui/switch';
import { Field } from '@/components/ui/field';
import type { Options } from './options_schema';
import { updateIcon } from '@/action/action_icon';
import { defaultValues, OptionsSchema, optionText2Label, set_options, get_options } from './options_schema';
import {META} from "@/strings"
// Utility function to render fields based on Zod schema
const renderField = (
	key: string,
	schemaType: z.ZodTypeAny,
	value: any,
	setValue: (key: string, newValue: any) => void
) => {
	if (schemaType instanceof z.ZodEnum) {
		// Enum type => Use SegmentedControl
		const schemaOptions = schemaType.options;
		return (
			<RadioCardRoot value={value} onValueChange={(e) => { setValue(key, e.value); }}>
				<HStack align="stretch">
					{schemaOptions.map((option: string) => (
						<RadioCardItem key={option} value={option} label={optionText2Label[option]} indicatorPlacement='start'/>
					))}
				</HStack>
			</RadioCardRoot>
		);
	}
	else if (schemaType instanceof z.ZodBoolean) {
		// Boolean type => Use Switch
		return (
			<Switch
				checked={value}
				onCheckedChange={(e) => { setValue(key, e.checked); }}
			/>
		)
	}
	console.error(`Unsupported field type: ${schemaType.constructor.name}`);
	// Add support for other types (e.g., string, number, etc.) if needed
	return null;
};

// Main Component
function OptionsForm() {
	const [formValues, setFormValues] = useState<Options>(defaultValues);

	useEffect(() => {
		async function fetchOptions() {
			const options = await get_options();
			setFormValues(options);
		}
		fetchOptions();
		// update_local_options().then(fetchOptions);
		;
	}, []);

	const handleValueChange = (key: string, newValue: any) => {
		console.log(`Changed ${key} to ${newValue}`);
		setFormValues((prev) => ({ ...prev, [key]: newValue }));
	};
	const handleSave = () => {
		const parsed = OptionsSchema.safeParse(formValues);
		if (parsed.success) {
			set_options(parsed.data);
			console.log('Saving Options:', formValues);
			toaster.success({
				description: 'Settings saved successfully!'
			});
			updateIcon(); // update enable state of icon
		} else {
			toaster.error({ description: 'Validation failed: ' + parsed.error.message });
		}
	};

	return (
		<>
		<Fieldset.Root width="100%" size={"lg"}>
			<Stack>
				{/* <Fieldset.Legend>{META.EXT_NAME} Options</Fieldset.Legend> */}
				<Fieldset.HelperText>
					These options will be synced using the browser's storage API.
				</Fieldset.HelperText>
			</Stack>

			<Fieldset.Content>
				{Object.entries(OptionsSchema.shape).map(([key, schemaType]) =>
					<Box key={key}>
						
						<Field label={optionText2Label[key]} helperText={schemaType.description} > {/*orientation={schemaType instanceof z.ZodBoolean ? 'horizontal' : 'vertical'}*/}
							{renderField(
								key,
								schemaType,
								formValues[key as keyof Options],
								handleValueChange
							)}
						</Field>
					</Box>
				)}
			</Fieldset.Content>
			<Button onClick={handleSave}>
				Save
			</Button>
			</Fieldset.Root>
			<Toaster/>
		</>
	);
};

export default OptionsForm;
