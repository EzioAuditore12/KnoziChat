import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConversationList } from '@/features/home/components/conversation-list';
import { Header } from '@/features/home/components/header';

import { useLiveConversationDetails } from '@/features/home/hooks/database/use-live-conversation-details';

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { data, isFetching, isLoading, fetchNextPage } = useLiveConversationDetails();

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header style={{ paddingTop: safeAreaInsets.top }} />,
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
