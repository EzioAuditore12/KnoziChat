import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/auth';

import { useSyncEngine } from '@/db/sync/hook';

import { useSocketState } from '@/store/socket';

import { useReceiveGroupMessageEvent } from '@/features/chat/events/receive-group-message.event';
import { useReceiveMessageEvent } from '@/features/chat/events/receive-message.event';
import { useReceiveGroupCreatedEvent } from '@/features/chat/events/receive-group-created.event';
import { useMessageSeenUpdateEvent } from '@/features/chat/events/message-seen-update.event';

export default function MainLayoutScreens() {
  const { user } = useAuthStore((state) => state);

  useSyncEngine();

  const { socket, connectSocket, disconnectSocket } = useSocketState();

  useEffect(() => {
    if (user) connectSocket();

    return () => disconnectSocket();
  }, [user, connectSocket, disconnectSocket]);

  useReceiveMessageEvent(socket);
  useReceiveGroupMessageEvent(socket);
  useReceiveGroupCreatedEvent(socket);
  useMessageSeenUpdateEvent(socket);

  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="setting" />

      <Stack.Screen name="user/[id]" options={{ headerShown: false }} />

      <Stack.Screen name="search/chat" options={{ headerShown: false }} />
      <Stack.Screen name="search/user" options={{ headerShown: false }} />

      <Stack.Screen name="chat/direct/[id]" />
      <Stack.Screen name="chat/direct/profile/[id]" options={{ headerShown: false }} />

      <Stack.Screen name="chat/group/[id]" />
      <Stack.Screen name="chat/group/details/[id]" options={{ headerShown: false }} />

      <Stack.Screen name="chat/new/direct/[id]" />
      <Stack.Screen name="chat/new/group/index" />

      <Stack.Screen name="test/index" options={{ headerShown: false }} />
      <Stack.Screen name="test/chunked-download" options={{ headerShown: false }} />
    </Stack>
  );
}
