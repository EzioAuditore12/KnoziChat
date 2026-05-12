import { FlashList, type FlashListProps } from '@shopify/flash-list';
import { router } from 'expo-router';

import { Text } from '@/components/ui/text';
import { ConversationCard } from './card';

import type { Conversation } from '@/features/home/types/conversation.type';

interface ConversationListProps extends Omit<
  FlashListProps<Conversation>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> {
  data: Conversation[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
}

export function ConversationList({
  data,
  className,
  isLoading,
  isFetchingNextPage,
  ...props
}: ConversationListProps) {
  if (isLoading) return <Text className="mt-2">Loading all your chats</Text>;

  return (
    <>
      <FlashList
        data={data}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationCard
            data={item}
            className="mx-3 mb-3"
            onPress={() => {
              if (item.type === 'direct') {
                router.push({
                  pathname: '/chat/direct/[id]',
                  params: {
                    id: item.id,
                    userId: item.userId,
                  },
                });
                return;
              }

              router.push({
                pathname: '/(main)/chat/group/[id]',
                params: { id: item.id },
              });
            }}
          />
        )}
        {...props}
      />
    </>
  );
}
