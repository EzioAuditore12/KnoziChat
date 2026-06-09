import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';

import { GroupInfo } from '@/features/chat/components/group/details/info';
import { SendGroupMessage } from '@/features/chat/components/group/send-message';
import { ChatGroupList } from '@/features/chat/components/group/list';
import { SelectedMessageHeader } from '@/features/chat/components/selected-messages-header';
import { ChatMessagesLoading } from '@/features/chat/components/loading/chat-messages-loading';

import { useLiveGroupConversationChats } from '@/features/chat/hooks/database/use-live-group-conversation-chats';

import { useAuthStore } from '@/store/auth';

import { useSocketState } from '@/store/socket';

import { useLiveGroupInfo } from '@/features/chat/hooks/database/use-live-group-info';
import { Socket } from '@/lib/socket-io';
import { sendGroupMessageEvent } from '@/features/chat/events/send-group-message';

export default function GroupChatScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const { id } = useLocalSearchParams() as {
    id: string;
  };
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const isSelectionMode = selectedMessageIds.length > 0;

  const currentUserId = useAuthStore((state) => state.user?.id!);

  const { data: groupInfo, isLoading: isGroupInfoLoading } = useLiveGroupInfo(id, currentUserId);
  const {
    data: groupedMessages,
    isLoading: isGroupMessagesLoading,
    fetchNextPage: fetchNextChats,
  } = useLiveGroupConversationChats({
    currentUserId,
    id,
    pageSize: 10,
  });

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
        {isGroupMessagesLoading ? (
          <ChatMessagesLoading />
        ) : (
          <ChatGroupList
            data={groupedMessages}
            onStartReached={fetchNextChats}
            selectedMessageIds={selectedMessageIds}
            onSelectionChange={setSelectedMessageIds}
          />
        )}
        <SendGroupMessage
          className="items-center"
          id={id}
          senderId={currentUserId}
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
