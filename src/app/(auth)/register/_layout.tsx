import { Stack } from "expo-router";

export default function RegisterScreens() {
	return (
		<Stack initialRouteName="index">
			<Stack.Screen name="index" options={{headerShown:false}} />
			<Stack.Screen name="verify-registeration" options={{headerShown:false,animation:"slide_from_right"}} />
		</Stack>
	);
}
