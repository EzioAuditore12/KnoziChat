import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { X } from "lucide-react-native";
import { Pressable, PressableProps, View } from "react-native";

export interface UserCardProps extends PressableProps {
	firstName: string;
	phoneNumber: string;
	profilePicture: string | null;
	onPress?: () => void;
	showClose?: boolean;
	onClose?: () => void;
}

export function UserCard({
	firstName,
	phoneNumber,
	profilePicture,
	onPress,
	showClose = false,
	onClose,
	className,
	...props
}: UserCardProps) {
	return (
		<Pressable
			onPress={onPress}
			disabled={!onPress}
			className={cn(className)}
			{...props}
		>
			<View className="flex-row items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mx-2 my-2">
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
				<View>
					<H3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
						{firstName}
					</H3>
					<Text className="text-gray-500 dark:text-gray-300 mt-1">
						{phoneNumber}
					</Text>
				</View>
				{showClose && (
					<Pressable onPress={onClose} hitSlop={10}>
						<View className="bg-red-500 rounded-full p-1 ml-2">
							<X size={18} color="white" />
						</View>
					</Pressable>
				)}
			</View>
		</Pressable>
	);
}
