import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { ChatMember } from "@/modules/app/features/api/chat-details";
import { Pressable, type PressableProps, View } from "react-native";

interface ChatMemberCardProps extends PressableProps {
	member: ChatMember;
}

export function ChatMemberCard({
	member,
	className,
	...props
}: ChatMemberCardProps) {
	return (
		<Pressable
			className={cn(
				"flex-row items-center gap-x-2 p-4 border-b border-gray-200 dark:border-gray-700",
				className,
			)}
			{...props}
		>
			<Avatar alt="chat-member-image" className="size-20">
				<AvatarImage source={{ uri: member.avatar! }} />
				<AvatarFallback>
					<Text>RS</Text>
				</AvatarFallback>
			</Avatar>
			<View className="flex-1">
				<Text className="text-2xl font-medium text-gray-900 dark:text-gray-100">
					{member.name}
				</Text>
				<Text className="text-sm text-gray-500 dark:text-gray-400">
					{member.phoneNumber}
				</Text>
			</View>
		</Pressable>
	);
}
