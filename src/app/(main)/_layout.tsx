import { Redirect, Stack } from 'expo-router';

import { initializeSyncEngine } from '@/db/sync';
import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';

export default function MainScreensLayout() {
  const { user } = useAuthStore((state) => state);

  useEffect(() => {
    if (user) initializeSyncEngine();
  }, [user]);

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
