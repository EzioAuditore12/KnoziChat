import { Text } from "@/components/ui/text";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { Pressable, View, type PressableProps } from "react-native";

type Message = {
	isCurrentUser: string | boolean;
	content: string | null;
	createdAt: string;
	senderName?: string; // Optional sender name for group chats
	senderAvatar?: string | null; // Optional sender avatar for group chats
};

interface ChatMessageBubleProps extends PressableProps {
	message: Message;
}

export function ChatMessageBubble({
	message,
	className,
	...props
}: ChatMessageBubleProps) {
	// Handle both string and boolean types
	const isCurrentUser = message.isCurrentUser === true || message.isCurrentUser === "true";
	const { isDarkColorScheme } = useColorScheme();
	
	return (
		<View className={cn("mb-3 flex-row", className)}>
			{/* Avatar for group messages (only for other users) */}
			{message.senderName && !isCurrentUser && (
				<Avatar className="w-8 h-8 mr-2 mt-1" alt={message.senderName || "User"}>
					<AvatarImage 
						source={{ uri: message.senderAvatar || undefined }}
					/>
					<AvatarFallback className="bg-gray-400">
						<Text className="text-white text-sm font-medium">
							{message.senderName?.charAt(0).toUpperCase() || "U"}
						</Text>
					</AvatarFallback>
				</Avatar>
			)}
			
			<View className="flex-1">
				{/* Show sender name for group messages (only for other users) */}
				{message.senderName && !isCurrentUser && (
					<Text className={cn(
						"text-xs mb-1 font-medium ml-1",
						isDarkColorScheme ? "text-gray-400" : "text-gray-600"
					)}>
						{message.senderName}
					</Text>
				)}
				
				<Pressable
					className={cn(
						"relative p-3 py-4 min-w-[110px] max-w-[85%] rounded-2xl",
						isCurrentUser ? "self-end" : "self-start"
					)}
					style={{
						backgroundColor: isCurrentUser 
							? "#007AFF" // iOS blue for sent messages
							: isDarkColorScheme 
								? "#2C2C2E" // Dark mode received messages
								: "#F2F2F7", // Light mode received messages
						borderRadius: 18,
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 1,
						},
						shadowOpacity: 0.1,
						shadowRadius: 2,
						elevation: 2,
					}}
					{...props}
				>
					<Text
						className="text-base leading-5"
						style={{
							color: isCurrentUser 
								? "white" 
								: isDarkColorScheme 
									? "#FFFFFF" 
									: "#000000",
						}}
					>
						{message.content || ""}
					</Text>
					<Text 
						className="absolute bottom-1 right-2 text-xs"
						style={{
							color: isCurrentUser 
								? "rgba(255, 255, 255, 0.7)" 
								: isDarkColorScheme 
									? "rgba(255, 255, 255, 0.6)" 
									: "rgba(0, 0, 0, 0.5)",
						}}
					>
						{new Date(message.createdAt).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Text>
				</Pressable>
			</View>
			
			{/* Spacer for current user messages to push them right */}
			{isCurrentUser && <View className="w-10" />}
		</View>
	);
}
