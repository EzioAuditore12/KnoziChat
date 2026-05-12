import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';

import { HomeHeader } from '@/features/home/components/header';
import { ConversationList } from '@/features/home/components/list/conversation';

import { syncDatabase } from '@/db/sync';
import { useLiveConversationDetails } from '@/features/home/hooks/database/use-live-conversation-details';
import { useAuthStore } from '@/store/auth';

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const currentUserId = useAuthStore((state) => state.user?.id!);

  const { data, isFetching, isLoading, fetchNextPage } = useLiveConversationDetails(currentUserId);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <HomeHeader style={{ paddingTop: safeAreaInsets.top }} className="w-full" />
          ),
        }}
      />
      <Box className="relative flex-1 gap-y-2 p-1" style={{ paddingBottom: safeAreaInsets.bottom }}>
        <ConversationList
          data={data}
          onEndReached={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetching}
          onRefresh={() => syncDatabase.pullChanges()}
        />
      </Box>
    </>
  );
}
