import { router, Stack } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { Text } from '@/components/ui/text';

import { EnhancedConversationList } from '@/features/home/components/conversation-list';

import { useSyncEngine } from '@/db/hooks/use-sync-engine';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import syncEngine from '@/db/sync';
import { connectWebSocket, type Socket } from '@/lib/socket-io';
import { useAuthStore } from '@/store/auth';
import { useEffect, useRef } from 'react';

export default function HomeScreen() {
  const { sync, pendingChanges, isSyncing } = useSyncEngine(syncEngine);

  const { user } = useAuthStore((state) => state);

  const socket = useRef<Socket>(null);

  useEffect(() => {
    socket.current = connectWebSocket();

    return () => {
      socket.current?.disconnect();
      console.log('HomeScreen unmounted, socket disconnected');
    };
  }, []);

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
              <Pressable onPress={() => router.push('/settings')} className="mr-2">
                <Avatar className='size-14' alt={user?.firstName ?? ''}>
                  <AvatarImage source={user?.avatar ? { uri: user.avatar } : undefined} />
                  <AvatarFallback>
                    <Text>{user?.firstName[0]}</Text>
                  </AvatarFallback>
                </Avatar>
              </Pressable>
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
