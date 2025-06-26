import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
	const { isSignedIn } = useUser();

	if (isSignedIn) {
		return <Redirect href={"/(chat)"} />;
	}
	return (
		<Stack initialRouteName="sign-in">
			<Stack.Screen name="sign-in" />
			<Stack.Screen name="sign-up" />
		</Stack>
	);
}
