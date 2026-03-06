import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useEffect } from 'react';

import { GroupInfo } from '@/features/chat/components/group/group-info';
import { SendGroupMessage } from '@/features/chat/components/group/send-group-message';

import { useAuthStore } from '@/store/auth';

import { useLiveGroupConversationChats } from '@/features/chat/hooks/database/use-live-group-conversation-chats';

import { ChatGroupList } from '@/features/chat/components/group/list';
import { useSocketState } from '@/store/socket';
import { sendGroupMessageEvent } from '@/features/chat/events/send-group-message.event';
import { Socket } from '@/lib/socket-io';

export default function ChattingGroupScreen() {
  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { user } = useAuthStore((state) => state);

  const { socket } = useSocketState();

  useEffect(() => {
    if (socket?.connected) {
      socket.emit('conversation-group:join', id);
    }

    return () => {
      if (socket?.connected) {
        socket.emit('conversation-group:leave', id);
      }
    };
  }, [socket, id, socket?.connected]);

  const { data: chats, fetchNextPage: fetchNextChats } = useLiveGroupConversationChats({
    id,
    currentUserId: user?.id as string,
  });

  const reversedChats = chats.flat().reverse();

  return (
    <>
      <Stack.Screen options={{ header: () => <GroupInfo id={id} /> }} />
      <View className="flex-1 p-2">
        <ChatGroupList data={reversedChats} onStartReached={fetchNextChats} />
        <SendGroupMessage
          className="items-center"
          id={id}
          senderId={user?.id as string}
          socket={socket as Socket}
          handleSubmit={sendGroupMessageEvent}
        />
      </View>
    </>
  );
}
