import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'heroui-native/button';
import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';

import { Link } from '@/components/link';

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
              <Button onPress={sync} isDisabled={isSyncing} className="ml-2">
                {isSyncing ? 'Syncing...' : `Sync (${pendingChanges} pending)`}
              </Button>
            </>
          ),
          headerRight: () => (
            <>
              <ThrottledTouchable onPress={() => router.push('/settings')} className="mr-2">
                <Avatar className="size-14" alt={user?.firstName ?? ''}>
                  <Avatar.Image source={user?.avatar ? { uri: user.avatar } : undefined} />
                  <Avatar.Fallback>{user?.firstName[0]}</Avatar.Fallback>
                </Avatar>
              </ThrottledTouchable>
            </>
          ),
        }}
      />
      <View className="flex-1 gap-y-2 p-1" style={{ paddingBottom: safeAreaInsets.bottom }}>
        {/* Example: Show online users count */}
        <Description>Online users: {onlineUsers.length}</Description>
        <EnhancedConversationList />
      </View>
    </>
  );
}
