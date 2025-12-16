import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth';

export default function AppScreensLayout() {
  const { user } = useAuthStore((state) => state);

  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{ headerShown: false, animation: 'slide_from_left' }}
      />
    </Stack>
  );
}
