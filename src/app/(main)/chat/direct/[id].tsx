import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';

import { Socket } from 'socket.io-client';

import { ChatterInfo } from '@/features/chat/components/direct/chatter-info';
import { ChatDirectList } from '@/features/chat/components/direct/list';
import { SendDirectMessage } from '@/features/chat/components/direct/send-message';

import { useSocketState } from '@/store/socket';

import { sendMessageEvent } from '@/features/chat/events/send-message';

import { useLiveChatterInfo } from '@/features/chat/hooks/database/use-live-chatter-info';
import { useLiveDirectChats } from '@/features/chat/hooks/database/use-live-one-to-one-chats';
import { SelectedMessageHeader } from '@/features/chat/components/selected-messages-header';

export default function ChattingScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id, userId } = useLocalSearchParams<{
    id: string;
    userId: string;
  }>();

  const { data: chatterData, isLoading: isLoadingChatterInfo } = useLiveChatterInfo(userId);

  const { socket } = useSocketState();

  useEffect(() => {
    useSocketState.setState({
      activeConversationId: id,
    });

    return () => {
      useSocketState.setState({
        activeConversationId: null,
      });
    };
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const markConversationSeen = () => {
      socket.emit('conversation:join', id);

      socket.emit('message:seen', {
        conversationId: id,
      });
    };

    if (socket.connected) {
      markConversationSeen();
    }

    socket.on('connect', markConversationSeen);

    return () => {
      socket.off('connect', markConversationSeen);

      if (socket?.connected) {
        socket.emit('conversation:leave', id);
      }
    };
  }, [socket, id]);

  const { groupedMessages, fetchNextPage: fetchNextChats } = useLiveDirectChats({
    id,
  });

  const reversedGroupedMessages = useMemo(() => {
    return [...groupedMessages].reverse().map((section) => ({
      ...section,

      data: [...section.data].reverse(),
    }));
  }, [groupedMessages]);

  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  const isSelectionMode = selectedMessageIds.length > 0;

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (payload: { senderId: string; isTyping: boolean }) => {
      if (payload.senderId === userId) {
        setIsTyping(payload.isTyping);
      }
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
    };
  }, [socket, userId]);

  return (
    <>
      <Stack.Screen
        options={{
          header: () =>
            isSelectionMode ? (
              <SelectedMessageHeader
                className="min-h-23"
                style={{
                  paddingTop: safeAreaInsets.top,
                }}
                onPressArrowBack={() => setSelectedMessageIds([])}
                selectedMessagesLength={selectedMessageIds.length}
              />
            ) : (
              <ChatterInfo
                style={{
                  paddingTop: safeAreaInsets.top,
                }}
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
                isTyping={isTyping}
              />
            ),
        }}
      />

      <Box className="flex-1">
        <ChatDirectList
          receiverId={userId}
          data={reversedGroupedMessages}
          onStartReached={fetchNextChats}
          selectedMessageIds={selectedMessageIds}
          onSelectionChange={setSelectedMessageIds}
        />

        <SendDirectMessage
          className="items-center"
          conversationId={id}
          receiverId={userId}
          socket={socket as Socket}
          handleSubmit={sendMessageEvent}
          onFocus={() => {
            if (isSelectionMode) {
              setSelectedMessageIds([]);

              return true;
            }

            return false;
          }}
        />
      </Box>
    </>
  );
}
