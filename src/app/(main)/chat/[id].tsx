import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { EnhancedDirectChatList } from '@/features/chat/components/direct-chat-list';
import { SendDirectMessage } from '@/features/chat/components/send-direct-message';

import { EnhancedUserInfo } from '@/features/common/components/user-info';

import { useSocketState } from '@/store/socket';
import syncEngine from '@/db/sync';
import { database } from '@/db';
import { useOptimisticUpdate } from '@/db/hooks/use-optimistic-update';
import { Socket } from '@/lib/socket-io';
import { sendMessageEvent } from '@/features/realtime/events/send-message.event';

export default function ChattingScreen() {
  const { id, userId } = useLocalSearchParams() as unknown as {
    id: string;
    userId: string;
  };

  const { socket, connectSocket } = useSocketState();

  useEffect(() => {
    connectSocket();

    socket?.emit('conversation:join', id);

    return () => {
      socket?.emit('conversation:leave', id);
    };
  }, [connectSocket, socket, id]);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <EnhancedUserInfo id={userId} />,
        }}
      />
      <View className="flex-1">
        <EnhancedDirectChatList conversationId={id} />
        <SendDirectMessage
          socket={socket as Socket}
          conversationId={id}
          className="items-center"
          handleSubmit={sendMessageEvent}
        />
      </View>
    </>
  );
}
