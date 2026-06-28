import { Stack } from 'expo-router';

export default function MainScreensLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ title: 'Home Screen' }} />
    </Stack>
  );
}
