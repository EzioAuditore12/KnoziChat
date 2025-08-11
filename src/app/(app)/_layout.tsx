import { Redirect, Tabs } from "expo-router";
import { Home } from "lucide-react-native";
import React from "react";
import { useAuthStore } from "@/store";

export default function TabLayout() {
	const user = useAuthStore((state) => state.user);

	if (!user) {
		return <Redirect href={"/login"} />;
	}

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <Home size={28} color={color} />,
				}}
			/>
		</Tabs>
	);
}
