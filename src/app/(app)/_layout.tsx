import SocketProvider from "@/providers/socket-provider";
import { authStore } from "@/store";
import { Redirect, Stack } from "expo-router";

export default function AppRootLayout() {
	const { user } = authStore();

	if (!user) {
		return <Redirect href={"/(auth)/login"} />;
	}
	return (
		<SocketProvider>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</SocketProvider>
	);
}
