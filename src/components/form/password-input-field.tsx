import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed } from "lucide-react-native";
import { useCallback, useState } from "react";
import type { FieldError } from "react-hook-form";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import { Input, InputProps } from "../ui/input";
import { P } from "../ui/typography";

export interface InputFieldProps extends InputProps {
	error: FieldError | undefined;
	viewStyle?: StyleProp<ViewStyle>;
}

export const PasswordInputField = ({
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
	const [passwordVisibility, setPasswordVisibility] = useState(true);
	const { isDarkColorScheme } = useColorScheme();

	const handlePasswordVisibility = useCallback(() => {
		setPasswordVisibility((prev) => !prev);
	}, []);
	return (
		<View style={viewStyle} className="relative">
			<Input
				className={cn("pr-12", className)}
				secureTextEntry={passwordVisibility}
				style={{
					borderColor: error
						? "#ef4444"
						: focused
							? isDarkColorScheme
								? "#818cf8"
								: "#000"
							: isDarkColorScheme
								? "#e5e7eb"
								: "black",
					borderWidth: 1.5,
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
			<Pressable
				onPress={handlePasswordVisibility}
				className="absolute right-3 top-3"
				accessibilityLabel="Toggle password visibility"
			>
				{passwordVisibility ? (
					<EyeClosed size={24} color="#6b7280" />
				) : (
					<Eye size={24} color="#6b7280" />
				)}
			</Pressable>
			{error ? (
				<P className="text-red-500 min-h-3 ml-3 text-sm">{error.message}</P>
			) : (
				<P className="min-h-3 text-sm" />
			)}
		</View>
	);
};
