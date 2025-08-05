import { authStore } from "@/store";
import { Redirect, Stack } from "expo-router";

export default function AuthenticationScreens() {
	const { user } = authStore();

	if (user) {
		return <Redirect href={"/"} />;
	}

	return (
		<Stack initialRouteName="login">
			<Stack.Screen name="login" options={{ headerShown: false }} />
			<Stack.Screen name="register" options={{ headerShown: false }} />
			<Stack.Screen name="forget-password" options={{ headerShown: false }} />
		</Stack>
	);
}
