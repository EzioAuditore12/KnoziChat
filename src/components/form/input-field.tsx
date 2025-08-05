import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { FieldError } from "react-hook-form";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { Input, InputProps } from "../ui/input";
import { P } from "../ui/typography";

export interface InputFieldProps extends InputProps {
	error: FieldError | undefined;
	viewStyle?: StyleProp<ViewStyle>;
}

export const InputField = ({
	viewStyle = {
		width: "100%",
	},
	className,
	onFocus,
	onBlur,
	error,
	...props
}: InputFieldProps) => {
	const [focused, setFocused] = useState(false);
	const { isDarkColorScheme } = useColorScheme();
	return (
		<View style={viewStyle}>
			<Input
				className={cn("rounded-2xl", className)}
				style={{
					borderColor: error
						? "#ef4444"
						: focused
							? isDarkColorScheme
								? "white"
								: "gray"
							: isDarkColorScheme
								? "gray"
								: "purple",
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
			{error ? (
				<P className="text-red-500 min-h-3 ml-3 text-sm">{error.message}</P>
			) : (
				<P className="min-h-3 text-sm" />
			)}
		</View>
	);
};
