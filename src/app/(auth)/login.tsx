import { Text } from "@/components/ui/text";
import env from "@/env";
import { View } from "react-native";

export default function LoginScreen() {
	return (
		<View className="flex-1 justify-center items-center">
			<Text>Hello Login Screen {env.EXPO_PUBLIC_BACKEND_API_URL}</Text>
		</View>
	);
}
