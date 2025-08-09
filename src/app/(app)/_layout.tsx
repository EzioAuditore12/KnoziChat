import { Stack,Redirect } from "expo-router";
import { authStore } from "@/store";
import SocketProvider from "@/providers/socket-provider";

export default function AppRootLayout(){
    const { user } = authStore();
    
        if (!user) {
            return <Redirect href={"/(auth)/login"} />;
        }
    return(
        <SocketProvider>
        <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
        </Stack>
        </SocketProvider>
    )
}