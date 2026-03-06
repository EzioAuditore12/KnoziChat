import { eq, desc, sql } from 'drizzle-orm';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { db } from '@/db';

import { chatGroupTable } from '@/db/tables/chat-group.table';
import { userTable } from '@/db/tables/user.table';

interface UseLiveGroupConversationChatsOptions {
  id: string;
  currentUserId: string;
  pageSize?: number;
}

export function useLiveGroupConversationChats({
  id,
  currentUserId,
  pageSize = 20,
}: UseLiveGroupConversationChatsOptions) {
  return useLiveInfiniteQuery({
    query: db
      .select({
        id: chatGroupTable.id,
        senderId: userTable.id,
        senderName: userTable.firstName,
        senderAvatar: userTable.avatar,
        text: chatGroupTable.text,
        createdAt: chatGroupTable.createdAt,
        updatedAt: chatGroupTable.updatedAt,
        mode: sql<
          'SENT' | 'RECEIVED'
        >`CASE WHEN ${chatGroupTable.senderId} = ${currentUserId} THEN 'SENT' ELSE 'RECEIVED' END`.as(
          'mode'
        ),
      })
      .from(chatGroupTable)
      .where(eq(chatGroupTable.conversationId, id))
      .innerJoin(userTable, eq(chatGroupTable.senderId, userTable.id))
      .orderBy(desc(chatGroupTable.createdAt)),
    pageSize,
  });
}
