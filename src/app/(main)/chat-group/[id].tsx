import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useEffect, useMemo } from 'react';

import { Description } from 'heroui-native/description';

import { GroupInfo } from '@/features/chat/components/group/group-info';

import { SendGroupMessage } from '@/features/chat/components/group/send-group-message';

import { ChatGroupList } from '@/features/chat/components/group/list';

import { useLiveGroupConversationChats } from '@/features/chat/hooks/database/use-live-group-conversation-chats';

import { sendGroupMessageEvent } from '@/features/chat/events/send-group-message.event';

import { useAuthStore } from '@/store/auth';

import { useSocketState } from '@/store/socket';

import { Socket } from '@/lib/socket-io';

export default function ChattingGroupScreen() {
  const { id } = useLocalSearchParams() as {
    id: string;
  };

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

  const {
    groupedMessages,
    isLoading,
    fetchNextPage: fetchNextChats,
  } = useLiveGroupConversationChats({
    id,
    currentUserId: user?.id as string,
  });

  const reversedGroupedMessages = useMemo(() => {
    return [...groupedMessages].reverse().map((section) => ({
      ...section,
      data: [...section.data].reverse(),
    }));
  }, [groupedMessages]);

  if (isLoading)
    return (
      <>
        <Stack.Screen
          options={{
            header: () => (
              <View className="p-2">
                <Description>Loading group info</Description>
              </View>
            ),
          }}
        />

        <View className="flex-1 items-center justify-center">
          <Description>Loading all the chats</Description>
        </View>
      </>
    );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <GroupInfo id={id} />,
        }}
      />

      <View className="flex-1 p-2">
        <ChatGroupList data={reversedGroupedMessages} onStartReached={fetchNextChats} />

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
