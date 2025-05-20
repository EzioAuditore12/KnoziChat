import { useEffect,PropsWithChildren,useState } from "react";
import { ActivityIndicator } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";

// this is not secret key
const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY ?? "")


export default function ChatProvider({children}:PropsWithChildren){
    const [isReady,setIsReady]=useState(false)
    
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
      setIsReady(true)
    } catch (err) {
      console.error("StreamChat connection error:", err);
    }
  };
  connect();

  return ()=>{
    client.disconnectUser();
    setIsReady(false)
  }
},[]); // <– Empty array means “run once on mount” :contentReference[oaicite:3]{index=3}

if(!isReady){
    return(
        <ActivityIndicator/>
    )
}

return(
     <OverlayProvider>
        <Chat client={client}>
            {children}
        </Chat>
    </OverlayProvider>
)
}