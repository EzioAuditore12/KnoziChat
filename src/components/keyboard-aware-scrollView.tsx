import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	type ScrollViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface KeyboardAwareScrollViewProps extends ScrollViewProps {
	children: ReactNode;
}

export function KeyboardAwareScrollView({
	children,
	className,
}: KeyboardAwareScrollViewProps) {
	const safeAreaInsets = useSafeAreaInsets();

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
			style={{
				flex: 1,
				paddingBottom: safeAreaInsets.bottom,
				paddingTop: safeAreaInsets.top,
			}}
		>
			<ScrollView contentContainerClassName={cn("flex-grow", className)}>
				{children}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
