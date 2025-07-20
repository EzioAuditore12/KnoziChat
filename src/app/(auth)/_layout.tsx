import { Stack } from "expo-router";

export default function AuthenticationScreens() {
	return (
		<Stack initialRouteName="login">
			<Stack.Screen name="login" options={{ headerShown: false }} />
		</Stack>
	);
}
