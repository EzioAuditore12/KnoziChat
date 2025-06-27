import { View } from "react-native";
import { H1 } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Avatar,AvatarImage,AvatarFallback } from "@/components/ui/avatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "@/components/ui/layout";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";

//hooks
import { useChatScreenData } from "@/modules/chat/home/hooks";
import { useEffect } from "react";

function ChatRoomContent() {
   const { top } = useSafeAreaInsets()
   const { userProfile, chatRooms, loading, error } = useChatScreenData()

	// Handle loading state
	if (loading) {
		return (
			<View className="flex-1" style={{paddingTop:top}}>
				<Text>Loading...</Text>
			</View>
		);
	}

	// Handle error state
	if (error) {
		return (
			<View className="flex-1" style={{paddingTop:top}}>
				<Text>Error: {error}</Text>
			</View>
		);
	}

	// Handle empty state
	if (!chatRooms || chatRooms.length === 0) {
		return (
			<View className="flex-1" style={{paddingTop:top}}>
				<Text>No chat rooms found</Text>
			</View>
		);
	}

	console.log(chatRooms)

	return(
		<View className="flex-1" style={{paddingTop:top}}>
			
			<Stack direction={"horizontal"} justify={"between"} align={"center"}>
			<Stack verticalSpacing={"md"}>
			<Link href={"/profile"}>
				<Avatar alt="Rick Sanchez's Avatar" className="w-16 h-16">
						<AvatarImage source={{ uri: userProfile}} />
						<AvatarFallback>
							<Text>RS</Text>
						</AvatarFallback>
					</Avatar>
			</Link>
			<H1 className="self-start">Chat Rooms</H1>
			</Stack>

			<Link href={"/(chat)/new-room"}>
			<Plus 
			color={"red"} size={25}/>
			</Link>
			
			</Stack>
		</View>
	)
}

export default function ChatRoom(){
	return <ChatRoomContent />;
}