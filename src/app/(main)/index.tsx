import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';

import { HomeHeader } from '@/features/home/components/header';
import { ConversationList } from '@/features/home/components/list/conversation';

import { syncDatabase } from '@/db/sync';
import { useLiveConversationDetails } from '@/features/home/hooks/database/use-live-conversation-details';
import { useAuthStore } from '@/store/auth';

import { OnlineUsersList } from '@/features/home/components/list/online-users';
import { useGetOnlineUsers } from '@/features/home/hooks/database/use-live-get-online-users';
import { Button, ButtonIcon } from '@/components/ui/button';
import { MessageCircleIcon } from '@/components/ui/icon';

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const currentUserId = useAuthStore((state) => state.user?.id!);

  const { data, isFetching, isLoading, fetchNextPage } = useLiveConversationDetails(currentUserId);

  const { data: users } = useGetOnlineUsers();

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <HomeHeader style={{ paddingTop: safeAreaInsets.top }} className="w-full" />
          ),
        }}
      />

      <OnlineUsersList users={users} />

      <Heading className="px-4 py-1">Chats</Heading>

      <Box className="relative flex-1 gap-y-2 p-1" style={{ paddingBottom: safeAreaInsets.bottom }}>
        <ConversationList
          data={data}
          onEndReached={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetching}
          onRefresh={() => syncDatabase.pullChanges()}
        />

        <Button
          className="absolute right-5"
          accessibilityHint={'Ai'}
          style={{
            bottom: safeAreaInsets.bottom + 20,
            backgroundColor: '#8b5cf6', // modern purple for AI
            borderRadius: 32,
            padding: 16,
            elevation: 6, // Android shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
          onPress={() => router.push('/(main)/chat/ai')}>
          <ButtonIcon as={MessageCircleIcon} color="#fff" size="lg" />
        </Button>
      </Box>
    </>
  );
}
