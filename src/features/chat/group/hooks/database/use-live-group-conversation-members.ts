import { desc, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';
import { conversationGroupMemberTable } from '@/db/tables/conversation-group-member.table';
import { userTable } from '@/db/tables/user.table';

export type GroupConversationMember = {
  id: string;
  name: string;
  isAdmin: boolean;
  isMe: boolean;
};

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
        id: conversationGroupMemberTable.id,
        name: userTable.firstName,
        isAdmin: conversationGroupMemberTable.isAdmin,
        isMe: sql<boolean>`${conversationGroupMemberTable.userId} = ${currentUserId}`.as('isMe'),
      })
      .from(conversationGroupMemberTable)
      .innerJoin(userTable, eq(conversationGroupMemberTable.userId, userTable.id))
      .where(eq(conversationGroupMemberTable.groupId, id))
      .orderBy(desc(conversationGroupMemberTable.isAdmin), userTable.firstName),
    pageSize,
  });
}
