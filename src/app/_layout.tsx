import "@/global.css";

import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import {
	DarkTheme,
	DefaultTheme,
	Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform,type AppStateStatus } from "react-native";

import { QueryClient, QueryClientProvider,focusManager } from "@tanstack/react-query";
import { useAppState } from "@/lib/query/useAppState";
import { useOnlineManager } from "@/lib/query/useOnlineManager";

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

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

const usePlatformSpecificSetup = Platform.select({
	web: useSetWebBackgroundClassName,
	default: noop,
});

const queryClient=new QueryClient()

export default function RootLayout() {
	usePlatformSpecificSetup();
	useAppState(onAppStateChange)
	useOnlineManager()
	const { isDarkColorScheme } = useColorScheme();

	return (
		<QueryClientProvider client={queryClient}>
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
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
		</ThemeProvider>
		</QueryClientProvider>
	);
}

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;

function useSetWebBackgroundClassName() {
	useIsomorphicLayoutEffect(() => {
		// Adds the background color to the html element to prevent white background on overscroll.
		document.documentElement.classList.add("bg-background");
	}, []);
}



function noop() {}
