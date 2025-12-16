import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { useAuthStore } from '@/store/auth';

import { EnhancedConversationList } from '@/features/home/components/conversation-list';

export default function HomeScreen() {
  const { logout } = useAuthStore((state) => state);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerLeft: () => (
            <Link href={'/search'} className="dark:text-white">
              Search
            </Link>
          ),
          headerRight: () => (
            <>
              <Link href={'/settings'} className="mr-2">
                Settings
              </Link>
              <Button variant={'destructive'} onPress={logout}>
                <Text>Logout</Text>
              </Button>
            </>
          ),
        }}
      />
      <View className="flex-1 gap-y-2 p-1">
        <EnhancedConversationList />
      </View>
    </>
  );
}
