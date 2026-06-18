import { desc, eq, sql, and, exists } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/sqlite-core';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { conversationDirectTable } from '@/db/tables/conversation-direct.table';
import { conversationGroupTable } from '@/db/tables/conversation-group.table';
import { conversationGroupMemberTable } from '@/db/tables/conversation-group-member.table';
import { aiTable } from '@/db/tables/ai.table';

import { userTable } from '@/db/tables/user.table';

import type { ConversationType } from '@/features/home/types/conversation.type';

export function useLiveAiConversationDetails(currentUserId: string, pageSize: number = 20) {
  const direct = db
    .select({
      id: conversationDirectTable.id,
      name: userTable.firstName,
      avatar: userTable.avatar,
      updatedAt: conversationDirectTable.updatedAt,
      type: sql<ConversationType>`'direct'`.as('type'),
      userId: conversationDirectTable.userId,

      lastMessage: sql<string | null>`(
        SELECT CASE
          WHEN ai.text IS NOT NULL THEN
            CASE
              WHEN ai.sender = 'human'
                THEN 'You: ' || substr(ai.text, 1, 100)
              ELSE 'Ai: ' || substr(ai.text, 1, 100)
            END
          ELSE NULL
        END
        FROM ai
        WHERE ai.conversation_id = conversation_direct.id
        ORDER BY ai.created_at DESC
        LIMIT 1
      )`.as('lastMessage'),

      lastMessageAt: sql<number | null>`(
        SELECT ai.created_at
        FROM ai
        WHERE ai.conversation_id = conversation_direct.id
        ORDER BY ai.created_at DESC
        LIMIT 1
      )`.as('lastMessageAt'),

      unreadCount: sql<number>`0`.as('unreadCount'),
    })
    .from(conversationDirectTable)
    .innerJoin(userTable, eq(conversationDirectTable.userId, userTable.id))
    .where(
      exists(
        db.select().from(aiTable).where(eq(aiTable.conversationId, conversationDirectTable.id))
      )
    );

  const group = db
    .selectDistinct({
      id: conversationGroupTable.id,
      name: conversationGroupTable.name,
      avatar: conversationGroupTable.avatar,
      updatedAt: conversationGroupTable.updatedAt,
      type: sql<ConversationType>`'group'`.as('type'),
      userId: sql<string>`NULL`.as('userId'),

      lastMessage: sql<string | null>`(
        SELECT CASE
          WHEN ai.text IS NOT NULL THEN
            CASE
              WHEN ai.sender = 'human'
                THEN 'You: ' || substr(ai.text, 1, 100)
              ELSE 'Ai: ' || substr(ai.text, 1, 100)
            END
          ELSE NULL
        END
        FROM ai
        WHERE ai.conversation_id = conversation_group.id
        ORDER BY ai.created_at DESC
        LIMIT 1
      )`.as('lastMessage'),

      lastMessageAt: sql<number | null>`(
        SELECT ai.created_at
        FROM ai
        WHERE ai.conversation_id = conversation_group.id
        ORDER BY ai.created_at DESC
        LIMIT 1
      )`.as('lastMessageAt'),

      unreadCount: sql<number>`0`.as('unreadCount'),
    })
    .from(conversationGroupTable)
    .innerJoin(
      conversationGroupMemberTable,
      eq(conversationGroupMemberTable.groupId, conversationGroupTable.id)
    )
    .where(
      and(
        eq(conversationGroupMemberTable.userId, currentUserId),
        exists(
          db.select().from(aiTable).where(eq(aiTable.conversationId, conversationGroupTable.id))
        )
      )
    );

  const query = db
    .select()
    .from(unionAll(direct, group).as('conversations'))
    .orderBy(desc(sql`updated_at`));

  return useLiveInfiniteQuery({
    query,
    pageSize,
  });
}
