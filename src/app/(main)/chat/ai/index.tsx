import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Activity } from 'react';

import AiHeader from '@/features/ai/components/header';
import { AiChatInput } from '@/features/ai/components/input';
import { AiChatList } from '@/features/ai/components/list';

import { useGetLiveGroups } from '@/features/ai/hooks/database/use-live-get-users';
import { useChatWithAi } from '@/features/ai/hooks/mutations/use-chat-with-ai';
import { useLiveQuery } from '@/db/hooks/use-live-query';
import { db } from '@/db';
import { aiTable } from '@/db/tables/ai.table';

export default function AiPage() {
  const safeAreaInsets = useSafeAreaInsets();

  const { data: groups, isLoading: isGroupsLoading } = useGetLiveGroups();

  const { mutate, isPending } = useChatWithAi();

  const { data } = useLiveQuery(db.select().from(aiTable));

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AiHeader style={{ paddingTop: safeAreaInsets.top }} />,
        }}
      />
      <View className="flex-1">
        <AiChatList data={data} />
        <Activity mode={isPending ? 'visible' : 'hidden'}>
          <View className="border-t border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
            <Text className="text-sm text-gray-500 italic">Knozi Ai is thinking...</Text>
          </View>
        </Activity>
        <AiChatInput
          groups={groups}
          isLoadingGroups={isGroupsLoading}
          handleMutation={mutate}
          isMutationPending={isPending}
        />
      </View>
    </>
  );
}
