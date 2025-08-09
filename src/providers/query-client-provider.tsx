import { useAppState } from "@/lib/query/useAppState";
import { useOnlineManager } from "@/lib/query/useOnlineManager";
import {
	QueryClient,
	QueryClientProvider,
	focusManager,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { type AppStateStatus, Platform } from "react-native";

function onAppStateChange(status: AppStateStatus) {
	// React Query already supports in web browser refetch on window focus by default
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

const queryClient = new QueryClient();

export default function TanstackReactQueryProvider({
	children,
}: { children: ReactNode }) {
	useAppState(onAppStateChange);
	useOnlineManager();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
