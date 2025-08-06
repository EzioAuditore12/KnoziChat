import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Input } from "@/components/ui/input";
import { H3 } from "@/components/ui/typography";
import { VirtualizedList } from "@/components/virtual-list";
import { useDebounce } from "@/hooks/user-debounce";
import type { User } from "@/modules/app/features/api/search-user";
import { CreateGroupDialog } from "@/modules/app/features/components/create-group-button";
import { SelectedUsers } from "@/modules/app/features/components/selectable-users.";
import { UserCard } from "@/modules/app/features/components/user-card";
import { createGroupChat } from "@/modules/app/features/hooks/create-group";
import { getUsers } from "@/modules/app/features/hooks/search-user";
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function CreateGroupScreen() {
	const [search, setSearch] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

	const debouncedSearch = useDebounce(search, 500);

	const { data, fetchNextPage, isFetchingNextPage } = getUsers({
		name: debouncedSearch,
		limit: 10,
	});

	const { mutate } = createGroupChat();

	// Add user to selectedUsers if not already present
	const handleSelectUser = (user: User) => {
		setSelectedUsers((prev) =>
			prev.some((u) => u.id === user.id) ? prev : [...prev, user],
		);
	};

	// Remove user from selectedUsers
	const handleRemoveUser = (userId: string) => {
		setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
	};

	// Handle group creation
	const handleCreateGroup = (groupName: string, userIds: string[]) => {
		mutate({
			name: groupName,
			chatMembers: userIds,
			groupChat: true,
		});
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: "Create Group",
					headerRight: () => (
						<CreateGroupDialog
							selectedUsers={selectedUsers}
							onCreateGroup={handleCreateGroup}
							disabled={selectedUsers.length < 2}
						/>
					),
				}}
			/>
			<View className="w-full px-4 mt-4 mb-2 gap-y-2">
				<Input
					placeholder="Search Friends ..."
					className="max-w-fit"
					value={search}
					onChangeText={setSearch}
				/>

				<SelectedUsers users={selectedUsers} onRemove={handleRemoveUser} />
			</View>

			<H3 className="ml-4">Searcher Results</H3>
			<VirtualizedList<User>
				pages={data?.pages}
				keyExtractor={(item) => item.id}
				renderItem={(item) => (
					<UserCard
						firstName={item.firstName}
						phoneNumber={item.phoneNumber}
						profilePicture={item.profilePicture}
						onPress={() => handleSelectUser(item)}
					/>
				)}
				onEndReached={() => fetchNextPage()}
				showsVerticalScrollIndicator={false}
			/>
			{isFetchingNextPage && <ActivityIndicator />}
		</>
	);
}
