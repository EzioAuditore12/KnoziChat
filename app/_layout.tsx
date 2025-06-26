import "@/global.css";

import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { passkeys } from "@clerk/expo-passkeys";
import {
	DarkTheme,
	DefaultTheme,
	Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { tokenCache } from "@/utils/cache";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
	const { isDarkColorScheme } = useColorScheme();
	const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

	if (!publishableKey) {
		throw new Error("Missing Publishable Key");
	}

	return (
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
			<ClerkProvider
				publishableKey={publishableKey}
				tokenCache={tokenCache}
				__experimental_passkeys={passkeys}
			>
				<ClerkLoaded>
					<Slot />
				</ClerkLoaded>
			</ClerkProvider>
			<PortalHost />
		</ThemeProvider>
	);
}
