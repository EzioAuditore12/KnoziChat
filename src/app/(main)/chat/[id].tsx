import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { desc, eq } from 'drizzle-orm';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

import { ChatOneToOneList } from '@/features/chat/components/one-to-one/list';
import { SendOneToOneMessage } from '@/features/chat/components/one-to-one/send-one-to-one-message';
import { ChatterInfo } from '@/features/chat/components/one-to-one/chatter-info';

import { db } from '@/db';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';
import { chatOneToOneTable } from '@/db/tables/chat-one-to-one.table';

import { useSocketState } from '@/store/socket';

import { sendMessageEvent } from '@/features/chat/events/send-message.event';

export default function ChattingScreen() {
  const { id, userId } = useLocalSearchParams() as unknown as {
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

  const { data: chats, fetchNextPage: fetchNextChats } = useLiveInfiniteQuery({
    query: db
      .select()
      .from(chatOneToOneTable)
      .orderBy(desc(chatOneToOneTable.createdAt))
      .where(eq(chatOneToOneTable.conversationId, id)),
    pageSize: 20,
  });

  const reversedChats = chats.flat().reverse();

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <ChatterInfo userId={userId} />,
        }}
      />
      <View className="flex-1">
        <ChatOneToOneList data={reversedChats} onStartReached={fetchNextChats} />
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
