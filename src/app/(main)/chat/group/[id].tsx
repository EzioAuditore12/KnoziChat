import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';

import { GroupInfo } from '@/features/chat/components/group/details/info';
import { SendGroupMessage } from '@/features/chat/components/group/send-message';
import { ChatGroupList } from '@/features/chat/components/group/list';
import { SelectedMessageHeader } from '@/features/chat/components/selected-messages-header';
import { GroupScreenLoading } from '@/features/chat/components/group/loading/screen';

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

  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const isSelectionMode = selectedMessageIds.length > 0;

  if (isLoading) return <GroupScreenLoading />;

  return (
    <>
      <Stack.Screen
        options={{
          header: () =>
            isSelectionMode ? (
              <SelectedMessageHeader
                className="min-h-23"
                style={{ paddingTop: safeAreaInsets.top }}
                onPressArrowBack={() => setSelectedMessageIds([])}
                selectedMessagesLength={selectedMessageIds.length}
              />
            ) : (
              <GroupInfo
                className="min-h-23"
                id={id}
                style={{ paddingTop: safeAreaInsets.top }}
                data={groupInfo}
                isLoading={isGroupInfoLoading}
              />
            ),
        }}
      />

      <Box className="flex-1 p-2">
        <ChatGroupList
          data={reversedGroupedMessages}
          onStartReached={fetchNextChats}
          selectedMessageIds={selectedMessageIds}
          onSelectionChange={setSelectedMessageIds}
        />

        <SendGroupMessage
          className="items-center"
          id={id}
          senderId={user?.id as string}
          socket={socket as Socket}
          handleSubmit={sendGroupMessageEvent}
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
