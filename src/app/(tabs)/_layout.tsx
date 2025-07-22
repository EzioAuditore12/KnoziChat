import { authStore } from "@/store";
import { AntDesign } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

export default function TabLayout() {
	const { user } = authStore.getState();

	if (!user) {
		return <Redirect href={"/(auth)/login"} />;
	}
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<AntDesign size={28} name="home" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ color }) => (
						<AntDesign size={28} name="arrowright" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
