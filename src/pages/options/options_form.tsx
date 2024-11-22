import { useEffect, useState } from 'react';
import { set, z } from 'zod';
import {
	Button,
	Fieldset,
	Stack,
	HStack,
	Box
} from '@chakra-ui/react';
import { Radio, RadioGroup } from "@/components/ui/radio"
import { Field } from '@/components/ui/field';
import type { Options } from './options_schema';
import { defaultValues, OptionsSchema, optionText2Label, set_options, get_options } from './options_schema';

// Utility function to render fields based on Zod schema
const renderField = (
	key: string,
	schemaType: z.ZodTypeAny,
	value: string,
	setValue: (key: string, newValue: any) => void
) => {
	if (schemaType instanceof z.ZodEnum) {
		// Enum type => Use SegmentedControl
		const schemaOptions = schemaType.options;
		return (
			<RadioGroup value={value} onValueChange={(e) => { setValue(key, e.value); }}>
				<HStack gap="6">
					{schemaOptions.map((option: string) => (
						<Box key={option}>
							<Radio value={option}>{optionText2Label[option]}</Radio>
						</Box>
					))}
				</HStack>
			</RadioGroup>
		);
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
			console.log('Saved Options:', formValues);
			alert('Settings saved successfully!');
		} else {
			alert('Validation failed: ' + parsed.error.message);
		}
	};

	return (
		<Fieldset.Root size="lg" maxW="md">
			<Stack>
				<Fieldset.Legend>TabsTray Options</Fieldset.Legend>
				<Fieldset.HelperText>
					These options will be synced using the browser's storage API.
				</Fieldset.HelperText>
			</Stack>

			<Fieldset.Content>
				{Object.entries(OptionsSchema.shape).map(([key, schemaType]) =>
					<Box key={key}>
						<Field label={optionText2Label[key]}>
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

	);
};

export default OptionsForm;
