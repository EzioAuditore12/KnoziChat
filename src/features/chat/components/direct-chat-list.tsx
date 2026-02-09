import { DirectChat } from '@/db/models/direct-chat.model';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { Q } from '@nozbe/watermelondb';
import { useMemo, useState } from 'react';
import { cn } from 'tailwind-variants';

import { ChatText } from './chat-text';
import { DIRECT_CHAT_TABLE_NAME } from '@/db/schemas/direct-chat-table.schema';
import { database } from '@/db';
import { useWatermelonModelsPage } from '@/db/hooks/use-watermelondb-pages';

interface DirectChatListProps extends Omit<FlashListProps<DirectChat>, 'data' | 'renderItem'> {
  conversationId: string;
}

export function DirectChatList({ className, conversationId, ...props }: DirectChatListProps) {
  const [data, setData] = useState<DirectChat[]>([]);

  // Create a reversed set callback because we want the UI list to be [Oldest ... Newest],
  // but we query [Newest ... Oldest] to get the latest messages efficiently.
  const handleDataChange = (items: DirectChat[]) => {
    // Reverse logic implies strictly copying array to avoid mutating WatermelonDB internals if shared
    setData([...items].reverse());
  };

  const query = useMemo(
    () => [Q.where('conversation_id', conversationId), Q.sortBy('created_at', Q.desc)],
    [conversationId]
  );

  const { next } = useWatermelonModelsPage({
    collection: DIRECT_CHAT_TABLE_NAME,
    database,
    query,
    onChange: handleDataChange,
  });

  return (
    <FlashList
      data={data}
      className={cn('p-2', className)}
      maintainVisibleContentPosition={{
        autoscrollToBottomThreshold: 0.2,
        startRenderingFromBottom: true,
      }}
      // Trigger next page when scrolling to current top (start of list in this context)
      onStartReached={next}
      onStartReachedThreshold={0.5}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatText data={item} />}
      contentContainerStyle={{ paddingBottom: 20 }}
      {...props}
    />
  );
}

// Export as EnhancedDirectChatList for backward compatibility if needed,
// though now it's just the plain component.
export const EnhancedDirectChatList = DirectChatList;
