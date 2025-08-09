import { Text } from "@/components/ui/text";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";

export default function GroupChatScreen() {
	const { groupId, groupName } = useLocalSearchParams() as unknown as {
		groupId: string;
		groupName: string;
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: () => (
						<Pressable
							onPress={() =>
								router.push({
									pathname: "/chats/group-chat/group-info",
									params: {
										groupChatId: groupId,
									},
								})
							}
						>
							<Text className="text-lg font-bold">{groupName}</Text>
						</Pressable>
					),
					headerTitleAlign: "center",
				}}
			/>
			<View className="flex-1 bg-red-500 justify-center items-center">
				<Text>{groupId}</Text>
				<Text>This is group screen</Text>
			</View>
		</>
	);
}
