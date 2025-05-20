import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ChannelList, Channel, MessageList, MessageInput } from 'stream-chat-expo'
import type { Channel as ChannelType } from 'stream-chat'
import { router } from 'expo-router'
import { useAuth } from '@/providers/AuthProvider'

const Index = () => {
  const {user}=useAuth()
  return (
    <ChannelList
      filters={{ members: { $in: user?.id ? [user.id] : [] } }}
      onSelect={(channel) => router.push({ pathname: "/(app)/(channel)/[cid]", params: { cid: channel.cid } })}
    />
  )
}

export default Index