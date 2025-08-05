import { Text, TextClassContext } from "@/components/ui/text";
import { H1, H2, H3 } from "@/components/ui/typography";
import { VirtualizedList } from "@/components/virtual-list";
import { Header } from "@/modules/app/home/components/header";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type User = { id: string; name: string };

const users: User[] = [
	{ id: "1", name: "Alice" },
	{ id: "2", name: "Bob" },
	{ id: "3", name: "Charlie" },
	{ id: "4", name: "David" },
	{ id: "5", name: "Eva" },
	{ id: "6", name: "Frank" },
	{ id: "7", name: "Grace" },
	{ id: "8", name: "Helen" },
	{ id: "9", name: "Ivan" },
	{ id: "10", name: "Julia" },
];

export default function HomeScreen() {
	return (
		<SafeAreaView>
			<Header />
			<VirtualizedList<User>
				items={users}
				keyExtractor={(item) => item.id}
				className="w-full"
				renderItem={(item, index) => (
					<View
						key={item.id}
						className="bg-white mx-4 my-2 rounded-xl p-5 flex-row items-center shadow-sm"
						style={{
							elevation: 2, // NativeWind doesn't support shadowOpacity, so keep elevation for Android shadow
						}}
					>
						<View className="w-10 h-10 rounded-full bg-indigo-100 justify-center items-center mr-4">
							<Text className="font-bold text-lg text-indigo-500">
								{item.name[0]}
							</Text>
						</View>
						<View>
							<Text className="text-base font-semibold text-[#222]">
								{item.name}
							</Text>
							<Text className="text-gray-400">User #{index + 1}</Text>
						</View>
					</View>
				)}
			/>
		</SafeAreaView>
	);
}
