import { authStore } from "@/store";
import { Redirect, Stack } from "expo-router";

export default function AuthenticationScreens() {
	const { user } = authStore.getState();

	if (user) {
		return <Redirect href={"/"} />;
	}

	return (
		<Stack initialRouteName="index">
			<Stack.Screen name="index" options={{ headerShown: false }} />
		</Stack>
	);
}
