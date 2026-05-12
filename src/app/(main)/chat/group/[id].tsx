import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

import { GroupInfo } from '@/features/chat/components/group/details/info';

import { SendGroupMessage } from '@/features/chat/components/group/send-message';

import { ChatGroupList } from '@/features/chat/components/group/list';

import { useLiveGroupConversationChats } from '@/features/chat/hooks/database/use-live-group-conversation-chats';

import { sendGroupMessageEvent } from '@/features/chat/events/send-group-message.event';

import { useAuthStore } from '@/store/auth';

import { useSocketState } from '@/store/socket';

import { useLiveGroupInfo } from '@/features/chat/hooks/database/use-live-group-info';
import { Socket } from '@/lib/socket-io';

export default function ChattingGroupScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const { id } = useLocalSearchParams() as {
    id: string;
  };

  const { user } = useAuthStore((state) => state);

  const { socket } = useSocketState();

  const { data: groupInfo, isLoading: isGroupInfoLoading } = useLiveGroupInfo(id);

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
                <Text>Loading group info</Text>
              </View>
            ),
          }}
        />

        <View className="flex-1 items-center justify-center">
          <Text>Loading all the chats</Text>
        </View>
      </>
    );

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <GroupInfo
              data={groupInfo}
              isLoading={isGroupInfoLoading}
              style={{ paddingTop: safeAreaInsets.top }}
              id={id}
            />
          ),
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
