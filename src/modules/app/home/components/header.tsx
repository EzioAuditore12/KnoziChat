import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { Plus, Search } from "lucide-react-native";
import { Pressable, View } from "react-native";

export function Header() {
	return (
		<View className="flex-row px-4 justify-between items-center py-2">
			<Text className="font-semibold text-4xl">Knozichat</Text>

			<Pressable className="ml-auto mr-2 rounded-full bg-gray-400 p-2">
				<Plus size={30} color={"white"} />
			</Pressable>

			<Pressable
				className="rounded-full bg-gray-400 p-2"
				onPress={() => router.navigate("/(features)/search")}
			>
				<Search size={30} color={"white"} />
			</Pressable>
		</View>
	);
}
