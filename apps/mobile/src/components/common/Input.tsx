import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";
import {
	type KeyboardTypeOptions,
	Text,
	TextInput,
	type TextInputProps,
	View,
} from "react-native";
import { ComponentSize, InputType } from "@/types/components";
import { cn } from "@/utils/cn";

interface InputProps<T extends FieldValues>
	extends Omit<TextInputProps, "onChange" | "onBlur" | "value"> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	placeholder?: string;
	error?: string;
	type?: InputType;
	size?: ComponentSize;
}

const getKeyboardTypeFromInputType = (type: InputType): KeyboardTypeOptions => {
	const keyboardTypeMap: Record<InputType, KeyboardTypeOptions> = {
		[InputType.Email]: "email-address",
		[InputType.Number]: "numeric",
		[InputType.Text]: "default",
		[InputType.Password]: "default",
	};

	return keyboardTypeMap[type];
};

const getAutoCompleteType = (type: InputType): "email" | "password" | "off" => {
	if (type === InputType.Email) return "email";
	if (type === InputType.Password) return "password";
	return "off";
};

export const Input = <T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	error,
	type = InputType.Text,
	size = ComponentSize.Medium,
	className,
	...props
}: InputProps<T>) => {
	return (
		<View className="mb-4">
			<Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						className={cn(
							"bg-white border rounded-xl",
							size === ComponentSize.Small && "px-3 py-2 text-sm",
							size === ComponentSize.Medium && "px-4 py-3 text-base",
							size === ComponentSize.Large && "px-5 py-4 text-lg",
							error
								? "border-red-500"
								: "border-gray-200 focus:border-primary-500",
							className,
						)}
						placeholder={placeholder}
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						secureTextEntry={type === InputType.Password}
						keyboardType={getKeyboardTypeFromInputType(type)}
						autoCapitalize={type === InputType.Email ? "none" : "sentences"}
						autoComplete={getAutoCompleteType(type)}
						{...props}
					/>
				)}
			/>
			{error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
		</View>
	);
};
