import { Stack } from "expo-router"
import { useEffect } from "react";
import { StreamChat } from "stream-chat";
 import { Chat, OverlayProvider } from "stream-chat-expo";

// this is not secret key
const client = StreamChat.getInstance("sxhhvdzn5xx4");


const Layout = () => {

    useEffect(() => {
  const connect = async () => {
    try {
      await client.connectUser(
        { id: "jlahey", name: "Jim Lahey", image: "https://i.imgur.com/fR9Jz14.png" },
        client.devToken("jlahey")
      );
      {/*
      const channel = client.channel("messaging", "the_park", { name: "The Park" });
      await channel.watch();
      */}
    } catch (err) {
      console.error("StreamChat connection error:", err);
    }
  };
  connect();
}); // <– Empty array means “run once on mount” :contentReference[oaicite:3]{index=3}

  return (
    <OverlayProvider>
        <Chat client={client}>
    <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
        <Stack.Screen name="(channel)" options={{headerShown:false}}/>
    </Stack>
    </Chat>
    </OverlayProvider>
  )
}

export default Layout