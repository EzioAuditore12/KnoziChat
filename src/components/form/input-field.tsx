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
				className={cn(className)}
				style={{
					borderColor: error
						? "#ef4444"
						: focused
							? isDarkColorScheme
								? "#818cf8"
								: "#000"
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
			{error ? (
				<P className="text-red-500 min-h-3 ml-3 text-sm">{error.message}</P>
			) : (
				<P className="min-h-3 text-sm" />
			)}
		</View>
	);
};

export function PasswordInputField() {
	const [passwordVisibility, setPasswordVisibility] = useState(true);
	const [password, setPassword] = useState("");

	// Toggle password visibility using useCallback for optimization
	const handlePasswordVisibility = useCallback(() => {
		setPasswordVisibility((prev) => !prev);
	}, []);

	return (
		<View className="p-2 flex-1 justify-center items-center">
			<View className="relative w-full max-w-md">
				<Input
					className="pr-12"
					aria-labelledby="Password"
					autoCapitalize="none"
					autoCorrect={false}
					textContentType="newPassword"
					enablesReturnKeyAutomatically
					secureTextEntry={passwordVisibility}
					onChangeText={setPassword}
					value={password}
				/>
				<Pressable
					onPress={handlePasswordVisibility}
					className="absolute right-3 top-1/2 -translate-y-1/2"
					accessibilityLabel="Toggle password visibility"
				>
					{passwordVisibility ? (
						<EyeClosed size={24} color="#6b7280" />
					) : (
						<Eye size={24} color="#6b7280" />
					)}
				</Pressable>
			</View>
		</View>
	);
}
