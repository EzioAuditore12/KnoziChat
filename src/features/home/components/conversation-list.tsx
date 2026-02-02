import { Database, Q } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/react';
import { FlashList, type FlashListProps } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { Conversation } from '@/db/models/conversation.model';
import { CONVERSATION_TABLE_NAME } from '@/db/schemas/conversation-table.schema';
import { useWatermelonModelsPage } from '@/db/hooks/use-watermelondb-pages';

import { EnhancedConversationCard } from './conversation-card';

interface ConversationListProps extends Omit<
  FlashListProps<Conversation>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> {
  // Data is now managed internally, but we need the database prop
  database: Database;
  isFetchingNextPage?: boolean;
}

function ConversationList({
  className,
  isFetchingNextPage,
  database, // Database is injected by withDatabase
  ...props
}: ConversationListProps) {
  const [data, setData] = useState<Conversation[]>([]);

  // Sort conversations by newest update first
  const query = useMemo(() => [Q.sortBy('updated_at', Q.desc)], []);

  // Use the pagination hook
  const { next } = useWatermelonModelsPage({
    collection: CONVERSATION_TABLE_NAME,
    database,
    query,
    onChange: setData,
  });

  return (
    <>
      <FlashList
        data={data}
        // Trigger next page when scrolling to bottom
        onEndReached={next}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EnhancedConversationCard
            data={item}
            className="mb-3"
            onPress={() => {
              router.push({
                pathname: '/chat/[id]',
                params: { id: item.id, userId: item._getRaw('user_id') as string },
              });
            }}
          />
        )}
        {...props}
      />
    </>
  );
}

// Only wrap withDatabase now, no need for withObservables
export const EnhancedConversationList = withDatabase(ConversationList);
