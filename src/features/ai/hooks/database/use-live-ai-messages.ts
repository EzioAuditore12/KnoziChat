import { useMemo } from 'react';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { aiTable } from '@/db/tables/ai.table';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';
import { formatChatDate } from '@/features/chat/utils/format-chat-date';

interface UseLiveAiMessagesOptions {
  id: string;
  pageSize?: number;
}

export function useLiveAiMessages({ id, pageSize = 20 }: UseLiveAiMessagesOptions) {
  const query = useLiveInfiniteQuery({
    query: db
      .select()
      .from(aiTable)
      .where(eq(aiTable.conversationId, id))
      .orderBy(desc(aiTable.createdAt)),
    pageSize,
  });

  const groupedMessages = useMemo(() => {
    const groups: Record<string, typeof query.data> = {};

    for (const item of query.data) {
      const date = formatChatDate(item.createdAt);

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(item);
    }

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      data: messages,
    }));
  }, [query]);

  return {
    ...query,
    groupedMessages,
  };
}
