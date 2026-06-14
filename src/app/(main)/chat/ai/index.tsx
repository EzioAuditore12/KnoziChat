import { useState } from 'react';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { EditIcon } from '@/components/ui/icon';
import { FloatingActionButton } from '@/components/ui/floating-action-button';

import { AiHeader } from '@/features/ai/components/header';
import { AiConversationListEmpty } from '@/features/ai/components/list/empty';
import { ConversationList } from '@/features/home/components/list/conversation';
import { useLiveAiConversationDetails } from '@/features/ai/hooks/database/use-live-ai-conversation-details';
import { useAuthStore } from '@/store/auth';
import { syncDatabase } from '@/db/sync';

import { ChatPickerModal } from '@/features/ai/components/input/chat-picker-modal';
import {
  useGetLiveGroups,
  useGetLiveDirectChats,
} from '@/features/ai/hooks/database/use-live-get-users';
import type { ChatOption } from '@/features/ai/components/input/types';
import { handleCreateAiChat } from '@/features/ai/utils/create-ai-chat';

export default function AiPage() {
  const safeAreaInsets = useSafeAreaInsets();
  const currentUserId = useAuthStore((state) => state.user?.id!);

  const { data, isFetching, isLoading, fetchNextPage, error } =
    useLiveAiConversationDetails(currentUserId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (error) {
    console.error('LIVE QUERY ERROR:', error);
  }

  const { data: groups, isLoading: isGroupsLoading } = useGetLiveGroups();
  const { data: directChats, isLoading: isDirectChatsLoading } = useGetLiveDirectChats();

  const chats: ChatOption[] = [
    ...(groups?.map((g) => ({ ...g, type: 'group' as const })) || []),
    ...(directChats?.map((d) => ({ ...d, type: 'direct' as const })) || []),
  ];

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <AiHeader style={{ paddingTop: safeAreaInsets.top }} />,
        }}
      />
      <Box
        className="relative flex-1 bg-white p-1 dark:bg-black"
        style={{ paddingBottom: safeAreaInsets.bottom }}>
        <ConversationList
          data={data}
          onEndReached={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetching}
          onRefresh={() => syncDatabase.pullChanges()}
          ListEmptyComponent={
            <AiConversationListEmpty onPressAnalyze={() => setIsModalOpen(true)} />
          }
          onPressChat={(item) => {
            router.push({
              pathname: '/(main)/chat/ai/[id]',
              params: {
                id: item.id,
                name: item.name || 'Chat',
                isGroup: item.type === 'group' ? 'true' : 'false',
                avatar: item.avatar || '',
              },
            });
          }}
        />

        <FloatingActionButton
          icon={EditIcon}
          accessibilityHint="New Ai Chat"
          onPress={() => setIsModalOpen(true)}
        />

        <ChatPickerModal
          chats={chats}
          isLoadingChats={isGroupsLoading || isDirectChatsLoading}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectChat={(chat) => handleCreateAiChat(chat, () => setIsModalOpen(false))}
        />
      </Box>
    </>
  );
}
