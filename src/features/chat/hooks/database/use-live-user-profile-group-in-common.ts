import { and, eq, exists, sql } from 'drizzle-orm';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { conversationGroupTable } from '@/db/tables/conversation-group.table';
import { conversationGroupMemberTable } from '@/db/tables/conversation-group-member.table';

interface UseLiveUserProfileGroupInCommonOptions {
  id: string;
  currentUserId: string;
}

export function useLiveUserProfileGroupInCommon({
  id,
  currentUserId,
}: UseLiveUserProfileGroupInCommonOptions) {
  return useLiveInfiniteQuery({
    query: db
      .select({
        id: conversationGroupTable.id,

        name: conversationGroupTable.name,

        avatar: conversationGroupTable.avatar,
      })
      .from(conversationGroupTable)
      .where(
        and(
          exists(
            db
              .select({ value: sql`1` })
              .from(conversationGroupMemberTable)
              .where(
                and(
                  eq(conversationGroupMemberTable.groupId, conversationGroupTable.id),
                  eq(conversationGroupMemberTable.userId, id)
                )
              )
          ),

          exists(
            db
              .select({ value: sql`1` })
              .from(conversationGroupMemberTable)
              .where(
                and(
                  eq(conversationGroupMemberTable.groupId, conversationGroupTable.id),
                  eq(conversationGroupMemberTable.userId, currentUserId)
                )
              )
          )
        )
      )
      .orderBy(sql`${conversationGroupTable.updatedAt} DESC`),

    pageSize: 10,
  });
}
