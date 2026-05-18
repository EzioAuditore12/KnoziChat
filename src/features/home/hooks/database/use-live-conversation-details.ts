import { desc, eq, sql } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/sqlite-core';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { conversationDirectTable } from '@/db/tables/conversation-direct.table';
import { conversationGroupTable } from '@/db/tables/conversation-group.table';
import { conversationGroupMemberTable } from '@/db/tables/conversation-group-member.table';

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

      lastMessage: sql<string | null>`(
        SELECT CASE
          WHEN chat_direct.content IS NOT NULL THEN
            CASE
              WHEN chat_direct.mode = 'SENT'
                THEN 'You: ' || substr(chat_direct.content, 1, 100)

              ELSE substr(chat_direct.content, 1, 100)
            END

          WHEN chat_direct.content_type = 'image'
            THEN
              CASE
                WHEN chat_direct.mode = 'SENT'
                  THEN 'You: 📷 Photo'
                ELSE '📷 Photo'
              END

          WHEN chat_direct.content_type = 'video'
            THEN
              CASE
                WHEN chat_direct.mode = 'SENT'
                  THEN 'You: 🎥 Video'
                ELSE '🎥 Video'
              END

          WHEN chat_direct.content_type = 'file'
            THEN
              CASE
                WHEN chat_direct.mode = 'SENT'
                  THEN 'You: 📎 File'
                ELSE '📎 File'
              END

          ELSE NULL
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
    .selectDistinct({
      id: conversationGroupTable.id,
      name: conversationGroupTable.name,
      avatar: conversationGroupTable.avatar,
      updatedAt: conversationGroupTable.updatedAt,
      type: sql<ConversationType>`'group'`.as('type'),
      userId: sql<string>`NULL`.as('userId'),

      lastMessage: sql<string | null>`(
        SELECT CASE
          WHEN chat_group.content IS NOT NULL THEN
            CASE
              WHEN chat_group.sender_id = ${currentUserId}
                THEN 'You: ' || substr(chat_group.content, 1, 100)

              ELSE IFNULL(user.first_name, 'Unknown')
                || ': ' ||
                substr(chat_group.content, 1, 100)
            END

          WHEN chat_group.content_type = 'image'
            THEN
              CASE
                WHEN chat_group.sender_id = ${currentUserId}
                  THEN 'You: 📷 Photo'

                ELSE IFNULL(user.first_name, 'Unknown')
                  || ': 📷 Photo'
              END

          WHEN chat_group.content_type = 'video'
            THEN
              CASE
                WHEN chat_group.sender_id = ${currentUserId}
                  THEN 'You: 🎥 Video'

                ELSE IFNULL(user.first_name, 'Unknown')
                  || ': 🎥 Video'
              END

          WHEN chat_group.content_type = 'file'
            THEN
              CASE
                WHEN chat_group.sender_id = ${currentUserId}
                  THEN 'You: 📎 File'

                ELSE IFNULL(user.first_name, 'Unknown')
                  || ': 📎 File'
              END

          ELSE NULL
        END

        FROM chat_group

        LEFT JOIN user
          ON user.id = chat_group.sender_id

        WHERE chat_group.conversation_id = conversation_group.id

        ORDER BY chat_group.created_at DESC
        LIMIT 1
      )`.as('lastMessage'),
    })
    .from(conversationGroupTable)

    .innerJoin(
      conversationGroupMemberTable,
      eq(conversationGroupMemberTable.groupId, conversationGroupTable.id)
    )

    .where(eq(conversationGroupMemberTable.userId, currentUserId));

  const query = db
    .select()
    .from(unionAll(direct, group).as('conversations'))
    .orderBy(desc(sql`updated_at`));

  return useLiveInfiniteQuery({
    query,
    pageSize,
  });
}
