import { Link } from "expo-router";
import { View } from "react-native";

export default function NotFoundScreen() {
	return (
		<View className="flex-1 bg-red-500 justify-center items-center">
			<Link href={"/"} className="text-2xl font-bold underline text-white">
				Go to Home Screen
			</Link>
		</View>
	);
}
