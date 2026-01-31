import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase, withObservables } from '@nozbe/watermelondb/react';
import { FlashList, type FlashListProps } from '@shopify/flash-list';
import { router } from 'expo-router';

import { Conversation } from '@/db/models/conversation.model';
import { CONVERSATION_TABLE_NAME } from '@/db/schemas/conversation-table.schema';

import { EnhancedConversationCard } from './conversation-card';

interface ConversationListProps extends Omit<
  FlashListProps<Conversation>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> {
  data: Conversation[];
  isFetchingNextPage?: boolean;
}

function ConversationList({
  className,
  isFetchingNextPage,
  data,
  ...props
}: ConversationListProps) {
  return (
    <>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EnhancedConversationCard
            data={item}
            className="mb-3"
            onPress={() =>
              router.push({
                pathname: '/chat/[id]',
                params: { id: item.id, userId: item._getRaw('user_id') as string },
              })
            }
          />
        )}
        {...props}
      />
    </>
  );
}

export const EnhancedConversationList = withDatabase(
  withObservables([], ({ database }: { database: Database }) => ({
    data: database.collections
      .get<Conversation>(CONVERSATION_TABLE_NAME)
      .query(Q.sortBy('updated_at', Q.desc))
      .observe(),
  }))(ConversationList)
);
