import { router, Stack } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from 'heroui-native/avatar';
import { desc, eq } from 'drizzle-orm';

import { Link } from '@/components/link';

import { useAuthStore } from '@/store/auth';

import { ConversationList } from '@/features/home/components/conversation-list';

import { ThrottledTouchable } from '@/components/throttled-touchable';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { db } from '@/db';
import { conversationOneToOneTable } from '@/db/tables/conversation-one-to-one.table';
import { userTable } from '@/db/tables/user.table';
import { Button } from 'heroui-native';
import { pullChanges } from '@/db/sync';

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { user } = useAuthStore((state) => state);

  const { data, isLoading, fetchNextPage, isFetching } = useLiveInfiniteQuery({
    query: db
      .select()
      .from(conversationOneToOneTable)
      .leftJoin(userTable, eq(conversationOneToOneTable.userId, userTable.id))
      .orderBy(desc(conversationOneToOneTable.updatedAt)),
    pageSize: 10,
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerLeft: () => (
            <>
              <Link href={'/search'}>Search</Link>
              <Button className="ml-2" onPress={pullChanges}>
                Sync
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
        <ConversationList
          data={data}
          onEndReached={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetching}
        />
      </View>
    </>
  );
}
