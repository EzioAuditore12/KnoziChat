import { useUser } from "@clerk/clerk-expo";

export function ChatRoomHook(){
    const {user}=useUser()

    return{
        userProfile:user?.imageUrl
    }
}