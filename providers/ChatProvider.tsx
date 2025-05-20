import { useEffect,PropsWithChildren,useState } from "react";
import { ActivityIndicator } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/utils/supabase";

// this is not secret key
const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY ?? "")


export default function ChatProvider({children}:PropsWithChildren){
    const [isReady,setIsReady]=useState(false)
    const {profile}=useAuth()
    useEffect(() => {
      if(!profile){
        return
      }
  const connect = async () => {
    try {
      await client.connectUser(
        { 
          id: profile.id, 
          name: profile.full_name, 
          image: supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl
        },
        client.devToken(profile.id)
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
    if(isReady){
          client.disconnectUser();
    }
    setIsReady(false)
  }
},[profile?.id]); // <– Empty array means “run once on mount” :contentReference[oaicite:3]{index=3}

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