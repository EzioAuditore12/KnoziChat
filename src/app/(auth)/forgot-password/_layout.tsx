import { Stack } from "expo-router";

export default function ForgetPasswordRequestScreen() {
	return (
		<Stack initialRouteName="trigger-forget-request">
			<Stack.Screen name="trigger-forget-request" />
		</Stack>
	);
}
