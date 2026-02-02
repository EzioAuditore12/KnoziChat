import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { Text } from '@/components/ui/text';

import { useSyncEngine } from '@/db/hooks/use-sync-engine';
import syncEngine from '@/db/sync';

import { useAuthStore } from '@/store/auth';

import { EnhancedConversationList } from '@/features/home/components/conversation-list';

import { useSocketState } from '@/store/socket';
import { ThrottledTouchable } from '@/components/throttled-touchable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { sync, pendingChanges, isSyncing } = useSyncEngine(syncEngine);
  const { user } = useAuthStore((state) => state);

  const safeAreaInsets = useSafeAreaInsets();

  const { connectSocket, disconnectSocket, onlineUsers } = useSocketState();

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
      console.log('HomeScreen unmounted, socket disconnected');
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerLeft: () => (
            <>
              <Link href={'/search'}>Search</Link>
              <Button onPress={sync} disabled={isSyncing} className="ml-2">
                <Text> {isSyncing ? 'Syncing...' : `Sync (${pendingChanges} pending)`}</Text>
              </Button>
            </>
          ),
          headerRight: () => (
            <>
              <ThrottledTouchable onPress={() => router.push('/settings')} className="mr-2">
                <Avatar className="size-14" alt={user?.firstName ?? ''}>
                  <AvatarImage source={user?.avatar ? { uri: user.avatar } : undefined} />
                  <AvatarFallback>
                    <Text>{user?.firstName[0]}</Text>
                  </AvatarFallback>
                </Avatar>
              </ThrottledTouchable>
            </>
          ),
        }}
      />
      <View className="flex-1 gap-y-2 p-1" style={{ paddingBottom: safeAreaInsets.bottom }}>
        {/* Example: Show online users count */}
        <Text>Online users: {onlineUsers.length}</Text>
        <EnhancedConversationList />
      </View>
    </>
  );
}
