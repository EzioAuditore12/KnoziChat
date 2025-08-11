import {
	focusManager,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { type AppStateStatus, Platform } from "react-native";
import { useAppState } from "@/lib/query-client/use-app-state";
import { useOnlineManager } from "@/lib/query-client/use-online-manager";

function onAppStateChange(status: AppStateStatus) {
	// React Query already supports in web browser refetch on window focus by default
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

const queryClient = new QueryClient();

export default function TanstackReactQueryProvider({
	children,
}: {
	children: ReactNode;
}) {
	useAppState(onAppStateChange);
	useOnlineManager();

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
