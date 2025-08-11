import { Stack } from "expo-router";

export default function RegisterationScreens() {
	return (
		<Stack initialRouteName="register-form">
			<Stack.Screen name="register-form" options={{ headerShown: false }} />
			<Stack.Screen
				name="verify-registeration"
				options={{ headerShown: false }}
			/>
		</Stack>
	);
}
