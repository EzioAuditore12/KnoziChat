import { router, Stack, useLocalSearchParams } from 'expo-router';

import { View } from 'react-native';

import { useEffect, useMemo } from 'react';

import { Socket } from 'socket.io-client';

import { ChatOneToOneList } from '@/features/chat/components/one-to-one/list';

import { SendOneToOneMessage } from '@/features/chat/components/one-to-one/send-one-to-one-message';

import { ChatterInfo } from '@/features/chat/components/one-to-one/chatter-info';

import { useSocketState } from '@/store/socket';

import { sendMessageEvent } from '@/features/chat/events/send-message.event';

import { useLiveOneToOneChats } from '@/features/chat/hooks/database/use-live-one-to-one-chats';

export default function ChattingScreen() {
  const { id, userId } = useLocalSearchParams() as {
    id: string;
    userId: string;
  };

  const { socket } = useSocketState();

  useEffect(() => {
    if (socket?.connected) {
      socket.emit('conversation:join', id);
    }

    return () => {
      if (socket?.connected) {
        socket.emit('conversation:leave', id);
      }
    };
  }, [socket, id, socket?.connected]);

  const { groupedMessages, fetchNextPage: fetchNextChats } = useLiveOneToOneChats({
    id,
  });

  const reversedGroupedMessages = useMemo(() => {
    return [...groupedMessages].reverse().map((section) => ({
      ...section,

      data: [...section.data].reverse(),
    }));
  }, [groupedMessages]);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <ChatterInfo
              onPress={() =>
                router.push({
                  pathname: '/chat/profile/[id]',

                  params: {
                    id: userId,
                  },
                })
              }
              onBack={() => router.back()}
              userId={userId}
            />
          ),
        }}
      />

      <View className="flex-1">
        <ChatOneToOneList data={reversedGroupedMessages} onStartReached={fetchNextChats} />

        <SendOneToOneMessage
          className="items-center"
          conversationId={id}
          receiverId={userId}
          socket={socket as Socket}
          handleSubmit={sendMessageEvent}
        />
      </View>
    </>
  );
}
