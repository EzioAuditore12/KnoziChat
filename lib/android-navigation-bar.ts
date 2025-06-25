import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export async function setAndroidNavigationBar(theme: "light" | "dark") {
	if (Platform.OS !== "android") return;
	await NavigationBar.setButtonStyleAsync(theme === "dark" ? "light" : "dark");
	// Note: setBackgroundColorAsync is not supported with edge-to-edge enabled
	// The navigation bar will be transparent in edge-to-edge mode
}
