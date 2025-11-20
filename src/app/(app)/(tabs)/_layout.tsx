import { Redirect, Tabs } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import { useAuthStore } from '@/store';

export default function AppScreensLayout() {
  const { user } = useAuthStore((state) => state);

  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs initialRouteName="index">
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
