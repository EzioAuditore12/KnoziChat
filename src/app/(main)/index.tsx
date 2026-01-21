import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import { useAuthStore } from '@/store/auth';

import { EnhancedConversationList } from '@/features/home/components/conversation-list';

import { useSyncEngine } from '@/db/hooks/use-sync-engine';

import syncEngine from '@/db/sync';

export default function HomeScreen() {
  const { logout } = useAuthStore((state) => state);

  const { sync, pendingChanges, isSyncing } = useSyncEngine(syncEngine);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerLeft: () => (
            <>
              <Link href={'/search'} className="dark:text-white">
                Search
              </Link>
              <Button onPress={sync} disabled={isSyncing} className="ml-2">
                <Text> {isSyncing ? 'Syncing...' : `Sync (${pendingChanges} pending)`}</Text>
              </Button>
            </>
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
