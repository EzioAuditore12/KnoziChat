import { Redirect, Stack } from 'expo-router';

import { initializeSyncEngine } from '@/db/sync';
import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';

import { useSocketState } from '@/store/socket';
import { useReceiveMessageEvent } from '@/features/realtime/events/receive-message.event';

export default function MainScreensLayout() {
  const { user } = useAuthStore((state) => state);
  const { socket, connectSocket, disconnectSocket } = useSocketState();

  useReceiveMessageEvent(socket);

  useEffect(() => {
    if (user) {
      initializeSyncEngine();
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, connectSocket, disconnectSocket]);

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
    </Stack>
  );
}
