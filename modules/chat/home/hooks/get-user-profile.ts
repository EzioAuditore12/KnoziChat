import { useUser } from "@clerk/clerk-expo";

export function getUserDetails(){
    const {user}=useUser()

    return{
        userProfile:user?.imageUrl
    }
}