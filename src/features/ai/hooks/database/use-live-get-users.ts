import { db } from '@/db';
import { eq } from 'drizzle-orm';

import { useLiveQuery } from '@/db/hooks/use-live-query';

import { conversationGroupTable } from '@/db/tables/conversation-group.table';
import { conversationDirectTable } from '@/db/tables/conversation-direct.table';
import { userTable } from '@/db/tables/user.table';

export function useGetLiveGroups() {
  return useLiveQuery(
    db
      .select({
        id: conversationGroupTable.id,
        name: conversationGroupTable.name,
        avatar: conversationGroupTable.avatar,
      })
      .from(conversationGroupTable)
  );
}

export function useGetLiveDirectChats() {
  return useLiveQuery(
    db
      .select({
        id: conversationDirectTable.id,
        name: userTable.firstName,
        avatar: userTable.avatar,
        userId: userTable.id,
        username: userTable.username,
      })
      .from(conversationDirectTable)
      .innerJoin(userTable, eq(conversationDirectTable.userId, userTable.id))
  );
}

export function useGetLiveUsers() {
  return useLiveQuery(db.select().from(userTable));
}
