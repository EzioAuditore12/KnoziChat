import { useState } from 'react';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { EditIcon } from '@/components/ui/icon';

import AiHeader from '@/features/ai/components/header';
import { ConversationList } from '@/features/home/components/list/conversation';
import { useLiveAiConversationDetails } from '@/features/ai/hooks/database/use-live-ai-conversation-details';
import { useAuthStore } from '@/store/auth';
import { syncDatabase } from '@/db/sync';

import { ChatPickerModal } from '@/features/ai/components/input/chat-picker-modal';
import {
  useGetLiveGroups,
  useGetLiveDirectChats,
} from '@/features/ai/hooks/database/use-live-get-users';
import { aiRepository } from '@/db/repositories/ai.repository';
import type { ChatOption } from '@/features/ai/components/input/types';

export default function AiPage() {
  const safeAreaInsets = useSafeAreaInsets();
  const currentUserId = useAuthStore((state) => state.user?.id!);

  const { data, isFetching, isLoading, fetchNextPage, error } =
    useLiveAiConversationDetails(currentUserId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (error) {
    console.error('LIVE QUERY ERROR:', error);
  }

  // For the picker modal
  const { data: groups, isLoading: isGroupsLoading } = useGetLiveGroups();
  const { data: directChats, isLoading: isDirectChatsLoading } = useGetLiveDirectChats();

  const chats: ChatOption[] = [
    ...(groups?.map((g) => ({ ...g, type: 'group' as const })) || []),
    ...(directChats?.map((d) => ({ ...d, type: 'direct' as const })) || []),
  ];

  const handleCreateAiChat = async (chat: ChatOption) => {
    // Insert a welcome message to seed the conversation and make it show up in the list
    await aiRepository.create({
      text: 'Hi! I am ready to help you analyze this conversation.',
      sender: 'ai',
      conversationId: chat.id,
    });

    setIsModalOpen(false);

    router.push({
      pathname: '/(main)/chat/ai/[id]',
      params: {
        id: chat.id,
        name: chat.name || 'Chat',
        isGroup: chat.type === 'group' ? 'true' : 'false',
        avatar: chat.avatar || '',
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
      <Box
        className="relative flex-1 bg-white p-1 dark:bg-black"
        style={{ paddingBottom: safeAreaInsets.bottom }}>
        <ConversationList
          data={data}
          onEndReached={fetchNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetching}
          onRefresh={() => syncDatabase.pullChanges()}
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

        <Button
          className="absolute right-5"
          size="lg"
          accessibilityHint={'New Ai Chat'}
          style={{
            bottom: safeAreaInsets.bottom + 20,
            backgroundColor: '#8b5cf6',
            borderRadius: 32,
            padding: 16,
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
          onPress={() => setIsModalOpen(true)}>
          <ButtonIcon as={EditIcon} color="#fff" size="lg" />
        </Button>

        <ChatPickerModal
          chats={chats}
          isLoadingChats={isGroupsLoading || isDirectChatsLoading}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectChat={handleCreateAiChat}
        />
      </Box>
    </>
  );
}
