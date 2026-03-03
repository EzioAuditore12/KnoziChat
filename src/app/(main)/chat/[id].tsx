import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { desc, eq } from 'drizzle-orm';

import { ChatOneToOneList } from '@/features/chat/components/one-to-one/list';
import { SendOneToOneMessage } from '@/features/chat/components/one-to-one/send-one-to-one-message';
import { ChatterInfo } from '@/features/chat/components/one-to-one/chatter-info';

import { db } from '@/db';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';
import { chatOneToOneTable } from '@/db/tables/chat-one-to-one.table';

import { chatOneToOneRepository } from '@/db/repositories/chat-one-to-one.repository';
import { conversationOneToOneRepository } from '@/db/repositories/conversation-one-to-one.repository';

const sendMessage = async (data: { conversationId: string; text: string }) => {
  const { text, conversationId } = data;

  const chat = await chatOneToOneRepository.create({
    text,
    status: 'SENT',
    conversationId,
    mode: 'SENT',
  });

  await conversationOneToOneRepository.updateTime(chat.conversationId, chat.createdAt);
};

export default function ChattingScreen() {
  const { id, userId } = useLocalSearchParams() as unknown as {
    id: string;
    userId: string;
  };

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
        <SendOneToOneMessage conversationId={id} handleSubmit={sendMessage} />
      </View>
    </>
  );
}
