import { useMemo } from 'react';
import { desc, eq, sql } from 'drizzle-orm';
import { diffInDays, format, isToday, isYesterday } from '@bernagl/react-native-date';

import { db } from '@/db';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { chatGroupTable } from '@/db/tables/chat-group.table';
import { userTable } from '@/db/tables/user.table';
import { chatAttachmentTable } from '@/db/tables/chat-attachment.table';

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

  const daysDifference = Math.abs(diffInDays(date, new Date()));

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
        // 1. Group Chat specific fields
        id: chatGroupTable.id,
        content: chatGroupTable.content,
        contentType: chatGroupTable.contentType,
        attachment: chatAttachmentTable,
        systemEventType: chatGroupTable.systemEventType,
        metadata: chatGroupTable.metadata,
        senderId: chatGroupTable.senderId,
        createdAt: chatGroupTable.createdAt,
        updatedAt: chatGroupTable.updatedAt,

        // 2. User specific fields mapped to the UI contract
        senderName: userTable.firstName,
        senderAvatar: userTable.avatar,

        // 3. Computed mode field to determine UI placement
        mode: sql<'SENT' | 'RECEIVED'>`
          CASE
            WHEN ${chatGroupTable.senderId} = ${currentUserId}
            THEN 'SENT'
            ELSE 'RECEIVED'
          END
        `.as('mode'),
      })
      .from(chatGroupTable)

      // 4. Using your working innerJoin instead of leftJoin
      .innerJoin(userTable, eq(chatGroupTable.senderId, userTable.id))
      .leftJoin(chatAttachmentTable, eq(chatAttachmentTable.id, chatGroupTable.id))
      // 5. Filter and Order
      .where(eq(chatGroupTable.conversationId, id))
      .orderBy(desc(chatGroupTable.createdAt)),

    pageSize,
  });

  const { data } = query;

  const groupedMessages = useMemo(() => {
    // Return empty array early if data is missing to prevent crashes
    if (!data) return [];

    const groups: Record<string, typeof data> = {};

    for (const message of data) {
      const date = formatChatDate(message.createdAt);

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(message);
    }

    // Convert the dictionary back to an array of objects
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      data: messages.reverse(),
    }));
  }, [data]);

  return {
    ...query,
    data: groupedMessages,
  };
}
