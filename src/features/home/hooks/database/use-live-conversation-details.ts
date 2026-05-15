import { desc, eq, sql } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/sqlite-core';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { conversationDirectTable } from '@/db/tables/conversation-direct.table';
import { conversationGroupTable } from '@/db/tables/conversation-group.table';
import { userTable } from '@/db/tables/user.table';

import type { ConversationType } from '../../types/conversation.type';

export function useLiveConversationDetails(currentUserId: string, pageSize: number = 20) {
  const direct = db
    .select({
      id: conversationDirectTable.id,
      name: userTable.firstName,
      avatar: userTable.avatar,
      updatedAt: conversationDirectTable.updatedAt,
      type: sql<ConversationType>`'direct'`.as('type'),
      userId: conversationDirectTable.userId,
      // Use raw table strings instead of Drizzle variables
      lastMessage: sql<string | null>`(
        SELECT CASE 
          WHEN chat_direct.mode = 'SENT' THEN 'You: ' || substr(chat_direct.text, 1, 100)
          ELSE substr(chat_direct.text, 1, 100)
        END
        FROM chat_direct 
        WHERE chat_direct.conversation_id = conversation_direct.id 
        ORDER BY chat_direct.created_at DESC 
        LIMIT 1
      )`.as('lastMessage'),
    })
    .from(conversationDirectTable)
    .innerJoin(userTable, eq(conversationDirectTable.userId, userTable.id));

  const group = db
    .select({
      id: conversationGroupTable.id,
      name: conversationGroupTable.name,
      avatar: conversationGroupTable.avatar,
      updatedAt: conversationGroupTable.updatedAt,
      type: sql<ConversationType>`'group'`.as('type'),
      userId: sql<string>`NULL`.as('userId'),
      // Use raw table strings instead of Drizzle variables
      lastMessage: sql<string | null>`(
        SELECT CASE 
          WHEN chat_group.sender_id = ${currentUserId} THEN 'You: ' || substr(chat_group.text, 1, 100)
          ELSE IFNULL(user.first_name, 'Unknown') || ': ' || substr(chat_group.text, 1, 100)
        END
        FROM chat_group 
        LEFT JOIN user ON user.id = chat_group.sender_id
        WHERE chat_group.conversation_id = conversation_group.id 
        ORDER BY chat_group.created_at DESC 
        LIMIT 1
      )`.as('lastMessage'),
    })
    .from(conversationGroupTable);

  const query = db
    .select()
    .from(unionAll(direct, group).as('conversations'))
    .orderBy(desc(sql`updated_at`));

  return useLiveInfiniteQuery({
    query,
    pageSize,
  });
}
