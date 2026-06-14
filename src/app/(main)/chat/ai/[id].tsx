import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';

import { AiHeader } from '@/features/ai/components/header';
import { AiChatInput } from '@/features/ai/components/input';
import { AiChatList } from '@/features/ai/components/list';
import { AiStreamingIndicator } from '@/features/ai/components/streaming-indicator';
import { ChatMessagesLoading } from '@/features/chat/components/loading/chat-messages-loading';

import {
  useGetLiveDirectChats,
  useGetLiveUsers,
} from '@/features/ai/hooks/database/use-live-get-users';
import { useChatWithAi } from '@/features/ai/hooks/mutations/use-chat-with-ai';
import { useLiveAiMessages } from '@/features/ai/hooks/database/use-live-ai-messages';
import { createAiMutationHandler } from '@/features/ai/utils/mutation-handler';

export default function AiChatPage() {
  const { id, isGroup, name, avatar } = useLocalSearchParams<{
    id: string;
    isGroup: string;
    name: string;
    avatar: string;
  }>();
  const safeAreaInsets = useSafeAreaInsets();
  const [streamingText, setStreamingText] = useState('');

  const { data: directChats } = useGetLiveDirectChats();
  const { data: allUsers } = useGetLiveUsers();

  const { mutate, isPending } = useChatWithAi();
  const {
    groupedMessages,
    fetchNextPage: fetchNextChats,
    isLoading: isChatsLoading,
  } = useLiveAiMessages({ id });

  const reversedGroupedMessages = useMemo(() => {
    return [...groupedMessages].reverse().map((section) => ({
      ...section,
      data: [...section.data].reverse(),
    }));
  }, [groupedMessages]);

  const handleMutationWrapper = createAiMutationHandler({
    mutate,
    setStreamingText,
    id,
    name,
    isGroup,
  });

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <AiHeader style={{ paddingTop: safeAreaInsets.top }} name={name} avatar={avatar} />
          ),
        }}
      />
      <View className="flex-1 bg-white dark:bg-black">
        {isChatsLoading ? (
          <ChatMessagesLoading />
        ) : (
          <AiChatList
            data={reversedGroupedMessages}
            directChats={directChats}
            allUsers={allUsers}
            onStartReached={fetchNextChats}
          />
        )}

        <AiStreamingIndicator
          isPending={isPending}
          streamingText={streamingText}
          directChats={directChats}
          allUsers={allUsers}
        />

        <AiChatInput handleMutation={handleMutationWrapper} isMutationPending={isPending} />
      </View>
    </>
  );
}
