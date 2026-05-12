import { useMemo } from 'react';

import { desc, eq, sql } from 'drizzle-orm';

import { differenceInDays, format, isToday, isYesterday } from 'date-fns';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { chatGroupTable } from '@/db/tables/chat-group.table';

import { userTable } from '@/db/tables/user.table';

interface UseLiveGroupConversationChatsOptions {
  id: string;

  currentUserId: string;

  pageSize?: number;
}

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

export function useLiveGroupConversationChats({
  id,
  currentUserId,
  pageSize = 20,
}: UseLiveGroupConversationChatsOptions) {
  const query = useLiveInfiniteQuery({
    query: db
      .select({
        id: chatGroupTable.id,

        senderId: userTable.id,

        senderName: userTable.firstName,

        senderAvatar: userTable.avatar,

        text: chatGroupTable.text,

        createdAt: chatGroupTable.createdAt,

        updatedAt: chatGroupTable.updatedAt,

        mode: sql<'SENT' | 'RECEIVED'>`
          CASE
            WHEN ${chatGroupTable.senderId} = ${currentUserId}
            THEN 'SENT'
            ELSE 'RECEIVED'
          END
        `.as('mode'),
      })
      .from(chatGroupTable)
      .where(eq(chatGroupTable.conversationId, id))
      .innerJoin(userTable, eq(chatGroupTable.senderId, userTable.id))
      .orderBy(desc(chatGroupTable.createdAt)),

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
