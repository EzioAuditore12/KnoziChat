import { DirectChat } from '@/db/models/direct-chat.model';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { Q } from '@nozbe/watermelondb';
import { useState } from 'react';
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

  const handleDataChange = (items: DirectChat[]) => {
    // Reverse logic implies strictly copying array to avoid mutating WatermelonDB internals if shared
    setData([...items].reverse());
  };

  // 1. Use DESC so 'take(limit)' grabs the NEWEST messages
  const query = [Q.where('conversation_id', conversationId), Q.sortBy('created_at', Q.desc)];

  // 2. Destructure 'next' to load more items
  const { prev } = useWatermelonModelsPage({
    collection: DIRECT_CHAT_TABLE_NAME,
    database,
    query,
    onChange: handleDataChange,
  });

  return (
    <FlashList
      data={data}
      className={cn('p-2', className)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatText data={item} />}
      maintainVisibleContentPosition={{
        startRenderingFromBottom: true,
      }}
      centerContent
      initialScrollIndex={data.length - 1}
      onStartReached={prev}
      onEndReachedThreshold={0.5}
      {...props}
    />
  );
}

export const EnhancedDirectChatList = DirectChatList;
