import { Stack } from "expo-router";

export default function ForgetPasswordAuthenticationScreens() {
	return (
		<Stack initialRouteName="index">
			<Stack.Screen name="index" options={{ headerShown: false }} />

			<Stack.Screen
				name="forget-password-otp"
				options={{ headerShown: false, animation: "slide_from_right" }}
			/>
			<Stack.Screen
				name="change-password"
				options={{ headerShown: false, animation: "simple_push" }}
			/>
		</Stack>
	);
}
