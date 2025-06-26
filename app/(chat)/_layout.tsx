import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { Spinner } from "@/components/ui/spinner";

export default function ChatLayout() {
	const { isSignedIn, isLoaded } = useUser();

	if (!isLoaded) {
		return (
			<View className="flex-1 justify-center items-center">
				<Spinner size={"xxxl"} />
			</View>
		);
	}

	if (!isSignedIn) {
		return <Redirect href={"/(auth)/sign-in"} />;
	}
	return (
		<Stack>
			<Stack.Screen name="index" options={{headerShown:false}}/>
            <Stack.Screen name="profile" options={{presentation:"formSheet"}}/>
            <Stack.Screen name="new-room" options={{animation:"slide_from_right"}}/>
		</Stack>
	);
}
