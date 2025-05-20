import { ChannelList,} from 'stream-chat-expo'
import { Link, router, Stack } from 'expo-router'
import { useAuth } from '@/providers/AuthProvider'
import {FontAwesome5} from '@expo/vector-icons'
const Index = () => {
  const {user}=useAuth()
  return (
    <>
    <Stack.Screen options={{
      headerRight:()=>{
        return(
          <Link href={"/(app)/users"} style={{marginHorizontal:15}}>
        <FontAwesome5 name="users" size={22} color="blue" />
        </Link>
        )
    }}}/>
    <ChannelList
      filters={{ members: { $in: user?.id ? [user.id] : [] } }}
      onSelect={(channel) => router.push({ pathname: "/(app)/(channel)/[cid]", params: { cid: channel.cid } })}
    />
    </>
  )
}

export default Index