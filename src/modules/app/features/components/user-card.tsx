import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { View } from "react-native";

export interface UserCardProps {
	firstName: string;
	phoneNumber: string;
	profilePicture: string | null;
}

export function UserCard({
	firstName,
	phoneNumber,
	profilePicture,
}: UserCardProps) {
	return (
		<View className="flex-row items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mx-4 my-2">
			<Avatar
				alt="user-details"
				className="w-16 h-16 rounded-full bg-indigo-100 mr-4"
			>
				<AvatarImage source={{ uri: profilePicture! }} />
				<AvatarFallback>
					<Text className="text-indigo-500 font-bold text-xl">
						{firstName[0]}
					</Text>
				</AvatarFallback>
			</Avatar>
			<View className="flex-1">
				<H3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{firstName}
				</H3>
				<Text className="text-gray-500 dark:text-gray-300 mt-1">
					{phoneNumber}
				</Text>
			</View>
		</View>
	);
}
