import { Stack } from "expo-router";

export default function RegisterScreens() {
	return (
		<Stack initialRouteName="index">
			<Stack.Screen name="index" />
		</Stack>
	);
}
