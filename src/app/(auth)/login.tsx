import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { LoginBanner } from "@/modules/auth/login/components/login-banner";

export default function LoginScreen() {
	return (
		<View className="flex-1 justify-center items-center">
			<LoginBanner />
		</View>
	);
}
