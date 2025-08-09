import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useCreatePrivateChat } from "@/modules/app/features/hooks/create-private-chat";
import { useGetUserDetails } from "@/modules/app/features/hooks/user-details";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserDetailsProps {
	firstName: string;
	lastName: string;
	email: string | null;
	avatarUrl: string;
	phoneNumber: string;
	joinedAt: Date | null;
}

function UserDetails({
	firstName,
	lastName,
	avatarUrl,
	email,
	phoneNumber,
	joinedAt,
}: UserDetailsProps) {
	return (
		<View className="justify-center items-center gap-y-4 py-6">
			<Avatar
				alt="User Details"
				className="w-40 h-40 mb-2 shadow-lg border-4 border-gray-200 dark:border-gray-700"
			>
				<AvatarImage source={{ uri: avatarUrl }} />
				<AvatarFallback>
					<Text className="text-lg font-bold text-gray-700 dark:text-gray-300">
						{firstName?.[0] ?? "U"}
						{lastName?.[0] ?? "N"}
					</Text>
				</AvatarFallback>
			</Avatar>
			<Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
				{firstName} {lastName}
			</Text>
			<Text className="text-base text-gray-500 dark:text-gray-400">
				{email ?? "No email"}
			</Text>
			<Text className="text-base text-gray-500 dark:text-gray-400">
				Phone: {phoneNumber ?? "N/A"}
			</Text>
			<Text className="text-sm text-gray-400 dark:text-gray-500">
				Joined:{" "}
				{joinedAt
					? joinedAt instanceof Date
						? joinedAt.toDateString()
						: joinedAt
					: "N/A"}
			</Text>
		</View>
	);
}

export default function UserInfoScreen() {
	const { userId } = useLocalSearchParams() as unknown as { userId: string };

	const { data, isLoading, error } = useGetUserDetails(userId);

	const { mutate, isPending } = useCreatePrivateChat();

	if (isLoading) {
		return (
			<View className="flex-1 bg-red-500 justify-center items-center">
				<ActivityIndicator size={"xxxl"} />
			</View>
		);
	}

	if (error) {
		return <Text>Error: {error.message}</Text>;
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>
			<SafeAreaView className="flex-1 justify-center items-center gap-y-2">
				<UserDetails
					email={data?.email!}
					avatarUrl={data?.profilePicture!}
					firstName={data?.firstName!}
					lastName={data?.lastName!}
					phoneNumber={data?.phoneNumber!}
					joinedAt={data?.joinedAt!}
				/>
				<View className="flex-row gap-x-2 max-w-md">
					<Button
						onPress={() => mutate({ otherUserId: userId })}
						disabled={isPending}
					>
						<Text>{isPending ? "Creating" : "Message"}</Text>
					</Button>

					<Button>
						<Text>Add Friend</Text>
					</Button>
				</View>
			</SafeAreaView>
		</>
	);
}
