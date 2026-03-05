import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';
import { useSocketState } from '@/store/socket';
import { useReceiveMessageEvent } from '@/features/chat/events/receive-message.event';

export default function MainScreensLayout() {
  const { user } = useAuthStore((state) => state);

  const { socket, connectSocket, disconnectSocket } = useSocketState();

  useEffect(() => {
    if (user) connectSocket();

    return () => disconnectSocket();
  }, [user, connectSocket, disconnectSocket]);

  useReceiveMessageEvent(socket);

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
