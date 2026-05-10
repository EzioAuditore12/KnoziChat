import { useMemo } from 'react';

import { desc, eq } from 'drizzle-orm';

import { differenceInDays, format, isToday, isYesterday } from 'date-fns';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { chatOneToOneTable } from '@/db/tables/chat-one-to-one.table';

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

export function useLiveOneToOneChats({ id, pageSize = 20 }: UseLiveOneToOneChatsOptions) {
  const query = useLiveInfiniteQuery({
    query: db
      .select()
      .from(chatOneToOneTable)
      .where(eq(chatOneToOneTable.conversationId, id))
      .orderBy(desc(chatOneToOneTable.createdAt)),

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
  }, [query.data]);

  return {
    ...query,
    groupedMessages,
  };
}
