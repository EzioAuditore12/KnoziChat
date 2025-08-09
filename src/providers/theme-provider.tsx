import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider as NativeThemeProvider,
	Theme,
} from "@react-navigation/native";
import { type ReactNode, useEffect, useLayoutEffect } from "react";
import { Platform } from "react-native";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? useEffect
		: useLayoutEffect;

function useSetWebBackgroundClassName() {
	useIsomorphicLayoutEffect(() => {
		// Adds the background color to the html element to prevent white background on overscroll.
		document.documentElement.classList.add("bg-background");
	}, []);
}

function noop() {}

const usePlatformSpecificSetup = Platform.select({
	web: useSetWebBackgroundClassName,
	default: noop,
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
	usePlatformSpecificSetup();
	const { isDarkColorScheme } = useColorScheme();

	return (
		<NativeThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			{children}
		</NativeThemeProvider>
	);
}
