import ChatProvider from "@/providers/ChatProvider"
import { Redirect, Stack } from "expo-router"
import { useAuth } from "@/providers/AuthProvider"
const Layout = () => {
  const {user}=useAuth()
 
   if(!user){
     return <Redirect href={"/(auth)"}/>
   }
   console.log(user)
  return (
    <ChatProvider>
    <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
        <Stack.Screen name="(channel)" options={{headerShown:false}}/>
    </Stack>
    </ChatProvider>
  
  )
}

export default Layout