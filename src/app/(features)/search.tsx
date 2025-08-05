import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/typography";
import { VirtualizedList } from "@/components/virtual-list";
import { useDebounce } from "@/hooks/user-debounce";
import type { User } from "@/modules/app/features/api/search-user";
import { UserCard } from "@/modules/app/features/components/user-card";
import { getUsers } from "@/modules/app/features/hooks/search-user";
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);

	const { data, fetchNextPage, isFetchingNextPage } = getUsers({
		name: debouncedSearch,
		limit: 10,
	});

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<SafeAreaView className="flex-1 px-2 gap-y-3">
				<Input
					placeholder="Search Friends ..."
					value={search}
					onChangeText={setSearch}
				/>
				<VirtualizedList<User>
					pages={data?.pages}
					keyExtractor={(item) => item.id}
					renderItem={(item) => (
						<UserCard
							firstName={item.firstName}
							phoneNumber={item.phoneNumber}
							profilePicture={item.profilePicture}
						/>
					)}
					onEndReached={() => fetchNextPage()}
				/>
				{isFetchingNextPage && <ActivityIndicator />}
			</SafeAreaView>
		</>
	);
}
