import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { GroupInfo } from '@/features/chat/components/group/group-info';
import { SendGroupMessage } from '@/features/chat/components/group/send-group-message';
import { chatGroupRepository } from '@/db/repositories/chat-group.repository';
import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';
import { useAuthStore } from '@/store/auth';

import { useLiveGroupConversationChats } from '@/features/chat/hooks/database/use-live-group-conversation-chats';

import { ChatGroupList } from '@/features/chat/components/group/list';

const sendGroupMessage = async (data: { id: string; senderId: string; text: string }) => {
  const { id: conversationId, senderId, text: messageText } = data;
  const chat = await chatGroupRepository.create({
    conversationId,
    senderId,
    text: messageText,
  });

  await conversationGroupRepository.update(chat.conversationId, {
    updatedAt: chat.createdAt,
  });
};

export default function ChattingGroupScreen() {
  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { user } = useAuthStore((state) => state);

  const { data: chats, fetchNextPage: fetchNextChats } = useLiveGroupConversationChats({
    id,
    currentUserId: user?.id as string,
  });

  const reversedChats = chats.flat().reverse();

  console.log(reversedChats);

  return (
    <>
      <Stack.Screen options={{ header: () => <GroupInfo id={id} /> }} />
      <View className="flex-1 p-2">
        <ChatGroupList data={reversedChats} onStartReached={fetchNextChats} />
        <SendGroupMessage
          className="items-center"
          id={id}
          senderId={user?.id as string}
          handleSubmit={sendGroupMessage}
        />
      </View>
    </>
  );
}
