import { useAuth } from '@/providers/AuthProvider'
import { router } from 'expo-router'
import {View,Text,Pressable} from 'react-native'
import { useChatContext } from 'stream-chat-expo'

const UserListItem=({user})=>{
    const {client}= useChatContext()
    const {user:me}=useAuth()

    const onPress=async()=>{
        const channel=client.channel('messaging',{
            members:[me?.id,user?.id]
        })

        await channel.watch()
        if (channel.id) {
            router.replace({ pathname: "/(app)/(channel)/[cid]", params: { cid: channel.cid } })
        } else {
            // Handle error or fallback
            console.error("Channel ID is undefined");
        }
    }

    return(
        <Pressable
        onPress={()=>{
            onPress()
        }}
        >
        <View className="p-2 bg-white mt-2 rounded-2xl"
        >
            <Text className='font-bold text-2xl'>{user.full_name}</Text>
        </View>
        </Pressable>
    )
}

export default UserListItem