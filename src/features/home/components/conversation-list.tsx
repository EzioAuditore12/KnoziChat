import { FlashList, type FlashListProps } from '@shopify/flash-list';
import { router } from 'expo-router';

import { ConversationCard } from './conversation-card';
import type { ConversationOneToOneJoinWithUser } from '@/db/tables/conversation-one-to-one.table';
import { Description } from 'heroui-native/description';

interface ConversationListProps extends Omit<
  FlashListProps<ConversationOneToOneJoinWithUser>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> {
  data: ConversationOneToOneJoinWithUser[];
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
  if (isLoading) return <Description className="mt-2">Loading all your chats</Description>;

  return (
    <>
      <FlashList
        data={data}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.conversation_one_to_one.id}
        renderItem={({ item }) => (
          <ConversationCard
            data={item}
            className="mb-3"
            onPress={() => {
              router.push({
                pathname: '/chat/[id]',
                params: {
                  id: item.conversation_one_to_one.id,
                  userId: item.conversation_one_to_one.userId,
                },
              });
            }}
          />
        )}
        {...props}
      />
    </>
  );
}
