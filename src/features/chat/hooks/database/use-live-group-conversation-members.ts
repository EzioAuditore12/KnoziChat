import { desc, eq, sql } from 'drizzle-orm';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { db } from '@/db';

import { conversationGroupTable } from '@/db/tables/conversation-group.table';
import { userTable } from '@/db/tables/user.table';

interface UseLiveGroupConversationMembersOptions {
  id: string;
  currentUserId: string;
  pageSize?: number;
}

export function useLiveGroupConversationMembers({
  id,
  currentUserId,
  pageSize = 20,
}: UseLiveGroupConversationMembersOptions) {
  return useLiveInfiniteQuery({
    query: db
      .select({
        id: userTable.id,

        name: sql<string>`
          CASE
            WHEN ${userTable.id} = ${currentUserId}
              THEN 'Me'
            ELSE ${userTable.firstName} || ' ' || ${userTable.lastName}
          END
        `.as('name'),

        avatar: userTable.avatar,

        isMe: sql<boolean>`
          CASE
            WHEN ${userTable.id} = ${currentUserId}
              THEN 1
            ELSE 0
          END
        `.as('isMe'),

        isAdmin: sql<boolean>`
          EXISTS (
            SELECT 1
            FROM json_each(${conversationGroupTable.adminIds})
            WHERE json_each.value = ${userTable.id}
          )
        `.as('isAdmin'),
      })
      .from(conversationGroupTable)

      .innerJoin(
        userTable,
        sql`
          EXISTS (
            SELECT 1
            FROM json_each(${conversationGroupTable.participantIds})
            WHERE json_each.value = ${userTable.id}
          )
        `
      )

      .where(eq(conversationGroupTable.id, id))

      .orderBy(
        desc(
          sql`
            CASE
              WHEN ${userTable.id} = ${currentUserId}
                THEN 1
              ELSE 0
            END
          `
        ),

        desc(
          sql`
            EXISTS (
              SELECT 1
              FROM json_each(${conversationGroupTable.adminIds})
              WHERE json_each.value = ${userTable.id}
            )
          `
        ),

        userTable.firstName
      ),

    pageSize,
  });
}
