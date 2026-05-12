import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';

import { useLiveQuery } from '@/db/hooks/use-live-query';
import { conversationGroupTable } from '@/db/tables/conversation-group.table';
import { userTable } from '@/db/tables/user.table';

export function useLiveGroupInfo(id: string) {
  const { data, ...rest } = useLiveQuery(
    db
      .select({
        id: conversationGroupTable.id,
        name: conversationGroupTable.name,
        avatar: conversationGroupTable.avatar,

        members: sql<string>`
          (
            SELECT group_concat(${userTable.firstName}, ', ')
            FROM user
            WHERE EXISTS (
              SELECT 1
              FROM json_each(${conversationGroupTable.participantIds})
              WHERE json_each.value = user.id
            )
          )
        `.as('members'),
      })
      .from(conversationGroupTable)
      .where(eq(conversationGroupTable.id, id))
      .limit(1)
  );

  return {
    data: data[0],
    ...rest,
  };
}
