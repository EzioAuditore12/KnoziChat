import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { VirtualizedList } from "@/components/virtual-list";
import type { Chat } from "@/modules/app/home/api/get-my-chats";
import { Header } from "@/modules/app/home/components/header";
import { getMyChats } from "@/modules/app/home/hooks/get-my-chats";
import { router } from "expo-router";
import { View } from "react-native";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const { data, fetchNextPage, isFetchingNextPage, isLoading } = getMyChats({
		limit: 10,
	});
	return (
		<SafeAreaView className="flex-1">
			<Header />
			{isLoading ? (
				<ActivityIndicator />
			) : (
				<>
					<VirtualizedList<Chat>
						items={data?.pages?.flatMap((page) => page.chats) ?? []}
						keyExtractor={(item) => item.id}
						renderItem={(item) => (
							<Pressable
								key={item.id}
								className="bg-white mx-4 my-2 rounded-xl p-5 flex-row items-center shadow-sm gap-x-2"
								style={{
									elevation: 2,
								}}
								onPress={() => {
									if (item.groupChat) {
										router.push({
											pathname: "/(app)/chats/group-chat/[groupId]",
											params: {
												groupId: item.id,
												groupName: item.name,
											},
										});
									} else {
										router.push({
											pathname: "/chats/personal-chat/[chatId]",
											params: {
												chatId: item.id,
												userName: item.members[1].name,
											},
										});
									}
								}}
							>
								<Avatar alt="Image">
									<AvatarImage source={{ uri: item.avatar! }} />
									<AvatarFallback>
										<Text>RS</Text>
									</AvatarFallback>
								</Avatar>
								<View>
									<Text className="text-base font-semibold text-[#222]">
										{item.name}
									</Text>
									<Text className="text-gray-400">
										{item.members.length > 2
											? `${item.members.length} members`
											: "Personal Chat"}
									</Text>
								</View>
							</Pressable>
						)}
						onEndReached={() => fetchNextPage()}
					/>
					{isFetchingNextPage && <ActivityIndicator />}
				</>
			)}
		</SafeAreaView>
	);
}
