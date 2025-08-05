import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useGetUserDetails } from "@/modules/app/profile/hooks/useGetUserDetails";
import React from "react";
import { View } from "react-native";

const Explore = () => {
	const { data, error, isLoading, isRefetchingByUser, refetchByUser } =
		useGetUserDetails();

	console.log(data);

	if (isLoading) {
		return (
			<View className="flex-1 bg-gradient-to-br from-blue-400 to-purple-500 justify-center items-center">
				<Text className="text-lg font-bold text-white">
					Loading user details...
				</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 bg-gradient-to-br from-red-400 to-pink-500 justify-center items-center">
				<Text className="text-lg font-bold text-white">{String(error)}</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-gradient-to-br from-gray-100 to-blue-100 justify-center items-center px-4">
			<View className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 items-center">
				<Avatar alt="Profile Image" className="w-24 h-24">
					<AvatarImage source={{ uri: data?.profilePicture }} />
				</Avatar>
				<Text className="text-xl font-semibold text-gray-800 mb-1">
					{data?.firstName} {data?.lastName}
				</Text>
				<Text className="text-base text-gray-500 mb-2">{data?.email}</Text>
				<Text className="text-xs text-gray-400 mb-4">ID: {data?.id}</Text>

				{isRefetchingByUser && (
					<Text className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full mb-2">
						Refreshing...
					</Text>
				)}

				<Button
					className="bg-blue-600 px-6 py-2 rounded-full mt-2"
					onPress={refetchByUser}
				>
					<Text className="text-white font-semibold">Refresh</Text>
				</Button>
			</View>
		</View>
	);
};

export default Explore;
