import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store";

export default function AuthenticationScreensLayout() {
	const user = useAuthStore((state) => state.user);

	if (user) {
		return <Redirect href={"/(app)"} />;
	}
	return (
		<Stack initialRouteName="login">
			<Stack.Screen name="login" options={{ headerShown: false }} />
			<Stack.Screen name="register" options={{ headerShown: false }} />
			<Stack.Screen name="forgot-password" options={{ headerShown: false }} />
		</Stack>
	);
}
