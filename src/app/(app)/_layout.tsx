import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store';

export default function AppScreensLayout() {
  const { user } = useAuthStore((state) => state);

  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }}></Stack.Screen>
    </Stack>
  );
}
