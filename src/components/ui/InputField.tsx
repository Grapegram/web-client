import type { Control, FieldValues, Path } from "react-hook-form";

import { Input } from "@/components/ui";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { cn } from "@/core/utils/shadcn-utils";

interface InputFieldProps<T extends FieldValues>
	extends React.InputHTMLAttributes<HTMLInputElement> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	type: string;
}

export const InputField = <T extends FieldValues>({
	control,
	name,
	label,
	type,
	...props
}: InputFieldProps<T>) => (
	<FormField
		control={control}
		name={name}
		render={({ field, fieldState }) => (
			<FormItem>
				<FormLabel htmlFor={name}>{label}</FormLabel>
				<FormControl>
					<Input
						type={type}
						id={name}
						className={cn(fieldState.invalid && "border-2 border-destructive")}
						{...props}
						{...field}
					/>
				</FormControl>
				<FormMessage className="w-full break-words" />
			</FormItem>
		)}
	/>
);
