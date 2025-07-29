import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, View } from "react-native";

export default function Test() {
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
					aria-labelledby="Password"
					autoCapitalize="none"
					autoCorrect={false}
					textContentType="newPassword"
					enablesReturnKeyAutomatically
					secureTextEntry={passwordVisibility}
					onChangeText={setPassword}
					value={password}
					className="pr-12"
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
