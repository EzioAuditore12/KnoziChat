import { router } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store";

const Index = () => {
	const user = useAuthStore((state) => state.user);
	const setUserDetails = useAuthStore((state) => state.setUser);
	return (
		<View className="flex-1 justify-center items-center gap-y-3">
			<Button onPress={() => router.push("/(auth)/login")}>
				<Text>
					{Platform.OS === "web" ? "Website Button" : "Android Button"}
				</Text>
			</Button>

			<Text>{user ? `User name is ${user.firstName}` : "Not defined"}</Text>

			<Button
				onPress={() => {
					setUserDetails({
						firstName: "daksh",
						email: "dakshpurohit2005@gmail.com",
						id: "1234",
						lastName: "Hello",
						profilePicture: null,
					});
				}}
			>
				<Text>Set User Details</Text>
			</Button>
		</View>
	);
};

export default Index;
