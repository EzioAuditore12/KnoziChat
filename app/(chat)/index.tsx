import { View } from "react-native";
import { H1 } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Avatar,AvatarImage,AvatarFallback } from "@/components/ui/avatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "@/components/ui/layout";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";


//hooks
import { ChatRoomHook } from "@/modules/chat/hooks";

export default function ChatRoom(){
	const {top}=useSafeAreaInsets()
	const {userProfile}=ChatRoomHook()

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