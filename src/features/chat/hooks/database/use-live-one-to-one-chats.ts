import { useMemo } from 'react';

import { desc, eq } from 'drizzle-orm';

import { differenceInDays, format, isToday, isYesterday } from 'date-fns';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { chatDirectTable } from '@/db/tables/chat-direct.table';

function formatChatDate(timestamp: number) {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  const daysDifference = differenceInDays(new Date(), date);

  if (daysDifference < 7) {
    return format(date, 'EEEE');
  }

  return format(date, 'PPP');
}

interface UseLiveOneToOneChatsOptions {
  id: string;

  pageSize?: number;
}

export function useLiveDirectChats({ id, pageSize = 20 }: UseLiveOneToOneChatsOptions) {
  const query = useLiveInfiniteQuery({
    query: db
      .select()
      .from(chatDirectTable)
      .where(eq(chatDirectTable.conversationId, id))
      .orderBy(desc(chatDirectTable.createdAt)),

    pageSize,
  });

  const groupedMessages = useMemo(() => {
    const groups: Record<string, typeof query.data> = {};

    for (const message of query.data) {
      const date = formatChatDate(message.createdAt);

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(message);
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
