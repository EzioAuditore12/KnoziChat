import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Activity, useState } from 'react';

import AiHeader from '@/features/ai/components/header';
import { AiChatInput } from '@/features/ai/components/input';
import { AiChatList } from '@/features/ai/components/list';
import { FormattedAiText } from '@/features/ai/components/formatted-ai-text';
import { ChatMessagesLoading } from '@/features/chat/components/loading/chat-messages-loading';
import { Spinner } from '@/components/ui/spinner';

import {
  useGetLiveGroups,
  useGetLiveDirectChats,
  useGetLiveUsers,
} from '@/features/ai/hooks/database/use-live-get-users';
import { useChatWithAi } from '@/features/ai/hooks/mutations/use-chat-with-ai';
import { useLiveQuery } from '@/db/hooks/use-live-query';
import { db } from '@/db';
import { aiTable } from '@/db/tables/ai.table';
import type { ChatOption } from '@/features/ai/components/input/types';

export default function AiPage() {
  const safeAreaInsets = useSafeAreaInsets();
  const [streamingText, setStreamingText] = useState('');

  const { data: groups, isLoading: isGroupsLoading } = useGetLiveGroups();
  const { data: directChats, isLoading: isDirectChatsLoading } = useGetLiveDirectChats();
  const { data: allUsers } = useGetLiveUsers();

  const chats: ChatOption[] = [
    ...(groups?.map((g) => ({ ...g, type: 'group' as const })) || []),
    ...(directChats?.map((d) => ({ ...d, type: 'direct' as const })) || []),
  ];

  const { mutate, isPending } = useChatWithAi();

  const { data, isLoading: isChatsLoading } = useLiveQuery(db.select().from(aiTable));

  const handleMutationWrapper = (params: any) => {
    setStreamingText(''); // Reset on new message
    mutate({
      ...params,
      onMessage: (text: string) => {
        setStreamingText((prev) => prev + text);
      },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AiHeader style={{ paddingTop: safeAreaInsets.top }} />,
        }}
      />
      <View className="flex-1">
        {isChatsLoading ? (
          <ChatMessagesLoading />
        ) : (
          <AiChatList data={data} directChats={directChats} allUsers={allUsers} />
        )}
        <Activity mode={isPending ? 'visible' : 'hidden'}>
          <View className="flex-row items-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
            {isPending && !streamingText && <Spinner size="small" />}
            <View className="flex-1">
              {streamingText ? (
                <FormattedAiText
                  text={streamingText}
                  directChats={directChats}
                  allUsers={allUsers}
                  className="text-sm text-gray-500"
                />
              ) : (
                <Text className="text-sm text-gray-500 italic">Knozi Ai is thinking...</Text>
              )}
            </View>
          </View>
        </Activity>
        <AiChatInput
          chats={chats}
          isLoadingChats={isGroupsLoading || isDirectChatsLoading}
          handleMutation={handleMutationWrapper}
          isMutationPending={isPending}
        />
      </View>
    </>
  );
}
