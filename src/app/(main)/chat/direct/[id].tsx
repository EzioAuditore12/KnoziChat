import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';

import { Socket } from 'socket.io-client';

import { ChatterInfo } from '@/features/chat/components/direct/chatter-info';
import { ChatDirectList } from '@/features/chat/components/direct/list';
import { SendDirectMessage } from '@/features/chat/components/direct/send-message';

import { useSocketState } from '@/store/socket';

import { sendMessageEvent } from '@/features/chat/events/send-message.event';

import { useLiveChatterInfo } from '@/features/chat/hooks/database/use-live-chatter-info';
import { useLiveDirectChats } from '@/features/chat/hooks/database/use-live-one-to-one-chats';

export default function ChattingScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const { id, userId } = useLocalSearchParams() as {
    id: string;
    userId: string;
  };

  const { data: chatterData, isLoading: isLoadingChatterInfo } = useLiveChatterInfo(userId);

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

  const { groupedMessages, fetchNextPage: fetchNextChats } = useLiveDirectChats({
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
              style={{ paddingTop: safeAreaInsets.top }}
              onPress={() =>
                router.push({
                  pathname: '/(main)/chat/direct/profile/[id]',
                  params: {
                    id: userId,
                  },
                })
              }
              onBack={() => router.back()}
              isLoading={isLoadingChatterInfo}
              data={chatterData}
            />
          ),
        }}
      />

      <Box className="flex-1">
        <ChatDirectList data={reversedGroupedMessages} onStartReached={fetchNextChats} />

        <SendDirectMessage
          className="items-center"
          conversationId={id}
          receiverId={userId}
          socket={socket as Socket}
          handleSubmit={sendMessageEvent}
        />
      </Box>
    </>
  );
}
