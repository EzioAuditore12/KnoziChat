import { Redirect, Stack } from 'expo-router';

import { useSyncEngine } from '@/db/sync/hook';
import { useReceiveGroupMessageEvent } from '@/features/chat/events/receive-group-message.event';
import { useReceiveMessageEvent } from '@/features/chat/events/receive-message.event';
import { useAuthStore } from '@/store/auth';
import { useSocketState } from '@/store/socket';
import { useEffect } from 'react';

export default function MainScreensLayout() {
  const { user } = useAuthStore((state) => state);

  useSyncEngine();

  const { socket, connectSocket, disconnectSocket } = useSocketState();

  useEffect(() => {
    if (user) connectSocket();

    return () => disconnectSocket();
  }, [user, connectSocket, disconnectSocket]);

  useReceiveMessageEvent(socket);
  useReceiveGroupMessageEvent(socket);

  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{ headerShown: false, animation: 'slide_from_left' }}
      />
      <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="new-chat/[id]" />
      <Stack.Screen name="chat-group/[id]" />
      <Stack.Screen name="new-chat-group/index" />
    </Stack>
  );
}
