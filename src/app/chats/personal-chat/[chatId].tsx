import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function PrivateChatScreen() {
	const { chatId } = useLocalSearchParams() as unknown as { chatId: string };

	return (
		<View className="flex-1 bg-red-500 justify-center items-center">
			<Text>{chatId}</Text>
		</View>
	);
}
