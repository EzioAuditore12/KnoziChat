import { ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import {Channel as ChannelType} from 'stream-chat'
import { Channel, MessageList, MessageInput, useChatContext } from 'stream-chat-expo'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  const [channel,setChannel]=useState<ChannelType | null>()

   const { cid } = useLocalSearchParams<{ cid: string }>(); 

  const {client} = useChatContext()

  useEffect(()=>{
    const fetchChannel=async()=>{
      const channels=await client.queryChannels({cid})
      setChannel(channels[0])
    }

    fetchChannel()
  },[cid])

  if(!channel){
    return <ActivityIndicator/>
  }


  return (
    <>
    <Stack.Screen options={{headerTitle:"Hi"}}/>
    <Channel channel={channel}>
      <MessageList/>
      <SafeAreaView edges={["bottom"]}>
      <MessageInput/>
      </SafeAreaView>
    </Channel>
    </>
  )
}

export default index