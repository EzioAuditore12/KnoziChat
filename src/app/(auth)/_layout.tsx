import { Stack } from "expo-router";

export default function AuthenticationScreensLayout() {
	return (
		<Stack initialRouteName="login">
			<Stack.Screen name="login" />
		</Stack>
	);
}
