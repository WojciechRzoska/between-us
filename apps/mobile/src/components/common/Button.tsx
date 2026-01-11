import {
	ActivityIndicator,
	Pressable,
	type PressableProps,
	Text,
} from "react-native";
import { ButtonVariant, ComponentSize } from "@/types/components";
import { cn } from "@/utils/cn";

interface ButtonProps extends Omit<PressableProps, "children"> {
	title: string;
	variant?: ButtonVariant;
	size?: ComponentSize;
	loading?: boolean;
	disabled?: boolean;
	onPress: VoidFunction;
}

export const Button = ({
	title,
	variant = ButtonVariant.Primary,
	size = ComponentSize.Medium,
	loading = false,
	disabled = false,
	onPress,
	className,
	...props
}: ButtonProps) => {
	const isDisabled = disabled || loading;

	return (
		<Pressable
			onPress={onPress}
			disabled={isDisabled}
			className={cn(
				"rounded-xl items-center justify-center flex-row",
				// Size variants
				size === ComponentSize.Small && "px-4 py-2",
				size === ComponentSize.Medium && "px-6 py-4",
				size === ComponentSize.Large && "px-8 py-5",
				// Color variants
				variant === ButtonVariant.Primary &&
					"bg-primary-500 active:bg-primary-600",
				variant === ButtonVariant.Secondary && "bg-gray-100 active:bg-gray-200",
				variant === ButtonVariant.Outline &&
					"border-2 border-primary-500 active:bg-primary-50",
				// Disabled state
				isDisabled && "opacity-50",
				className,
			)}
			{...props}
		>
			{loading && (
				<ActivityIndicator
					size="small"
					color={variant === ButtonVariant.Primary ? "#ffffff" : "#f43f5e"}
					className="mr-2"
				/>
			)}
			<Text
				className={cn(
					"font-semibold",
					size === ComponentSize.Small && "text-sm",
					size === ComponentSize.Medium && "text-base",
					size === ComponentSize.Large && "text-lg",
					variant === ButtonVariant.Primary && "text-white",
					variant === ButtonVariant.Secondary && "text-gray-900",
					variant === ButtonVariant.Outline && "text-primary-500",
				)}
			>
				{title}
			</Text>
		</Pressable>
	);
};
