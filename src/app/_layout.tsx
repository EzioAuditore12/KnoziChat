import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import "react-native-reanimated";

// Providers
import TanstackReactQueryProvider from "@/providers/query-client-provider";
import ThemeProvider from "@/providers/theme-provider";

export default function RootLayout() {
	return (
		<ThemeProvider>
			<TanstackReactQueryProvider>
				<Stack initialRouteName="(tabs)">
					<Stack.Screen name="(auth)" options={{ headerShown: false }} />
					<Stack.Screen
						name="(tabs)"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
				<PortalHost />
			</TanstackReactQueryProvider>
		</ThemeProvider>
	);
}
