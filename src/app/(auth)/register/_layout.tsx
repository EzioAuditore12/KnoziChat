import { Stack } from 'expo-router';

export default function RegisterScreensLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="verify-register" options={{ headerShown: false }} />
    </Stack>
  );
}
