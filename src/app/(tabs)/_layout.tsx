import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	type AvatarProps,
} from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { authStore } from "@/store";
import { AntDesign } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

function UserProfilePhoto({
	className,
	alt,
	uri,
	...props
}: AvatarProps & { uri: string }) {
	return (
		<Avatar alt={alt} className={className} {...props}>
			<AvatarImage source={{ uri: uri }} />
			<AvatarFallback>
				<Text>PS</Text>
			</AvatarFallback>
		</Avatar>
	);
}

export default function TabLayout() {
	const { user } = authStore();

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
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused }) => (
						<UserProfilePhoto
							alt="User Profile Photo"
							uri={user.profilePicture!}
							className="border-2"
							style={{
								borderColor: focused ? "red" : "",
							}}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
