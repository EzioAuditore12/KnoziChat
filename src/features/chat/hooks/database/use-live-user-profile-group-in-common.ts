import { and, sql } from 'drizzle-orm';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { conversationGroupTable } from '@/db/tables/conversation-group.table';

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
          sql`EXISTS (
            SELECT 1
            FROM json_each(${conversationGroupTable.participantIds})
            WHERE value = ${id}
          )`,
          sql`EXISTS (
            SELECT 1
            FROM json_each(${conversationGroupTable.participantIds})
            WHERE value = ${currentUserId}
          )`
        )
      )
      .orderBy(sql`${conversationGroupTable.updatedAt} DESC`),

    pageSize: 10,
  });
}
