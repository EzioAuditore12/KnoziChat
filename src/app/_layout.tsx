import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { KeyboardProvider } from "react-native-keyboard-controller";
// Providers
import TanstackReactQueryProvider from "@/providers/query-client";
import ThemeProvider from "@/providers/theme";

export default function RootLayout() {
	return (
		<ThemeProvider>
			<KeyboardProvider>
				<TanstackReactQueryProvider>
					<Stack initialRouteName="(app)">
						<Stack.Screen name="(auth)" options={{ headerShown: false }} />
						<Stack.Screen
							name="(app)"
							options={{
								headerShown: false,
							}}
						/>
					</Stack>
					<PortalHost />
				</TanstackReactQueryProvider>
			</KeyboardProvider>
		</ThemeProvider>
	);
}
