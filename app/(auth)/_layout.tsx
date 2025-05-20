import { useAuth } from "@/providers/AuthProvider"
import { Redirect, Stack } from "expo-router"

const Layout = () => {
  const {user}=useAuth()

  if(user){
    return <Redirect href={"/(app)"}/>
  }

  return (
    <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
    </Stack>
  )
}

export default Layout