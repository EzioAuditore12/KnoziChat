import { iconWithClassName } from "@/lib/icons/iconWithClassName";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import type { FieldError } from "react-hook-form";
import { View } from "react-native";
import { Input, InputProps } from "../ui/input";
import { P } from "../ui/typography";

export interface InputFieldProps extends InputProps {
	error: FieldError | undefined;
	Icon: LucideIcon;
}

export const InputField = ({
	className,
	Icon,
	onFocus,
	onBlur,
	error,
	...props
}: InputFieldProps) => {
	const [focused, setFocused] = useState(false);
	iconWithClassName(Icon);
	const { isDarkColorScheme } = useColorScheme();
	return (
		<View className="relative">
			<Input
				className={cn(
					"h-16 rounded-3xl bg-gray-200 dark:bg-white text-black pl-16 elevation-md",
					className,
				)}
				style={{
					borderColor: error
						? "#ef4444"
						: focused
							? isDarkColorScheme
								? "#818cf8"
								: "#000"
							: "transparent", // No border when not focused or errored
					borderWidth: 2,
				}}
				onFocus={(e) => {
					setFocused(true);
					if (onFocus) {
						onFocus(e);
					}
				}}
				onBlur={(e) => {
					setFocused(false);
					if (onBlur) {
						onBlur(e);
					}
				}}
				{...props}
			/>
			<Icon className="absolute top-5 left-4" color={"black"} size={20} />
			{error ? (
				<P className="text-red-500 min-h-5 ml-3">{error.message}</P>
			) : (
				<P className="min-h-5" />
			)}
		</View>
	);
};
