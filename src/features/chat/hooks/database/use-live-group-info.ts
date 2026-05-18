import { eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { useLiveQuery } from '@/db/hooks/use-live-query';
import { conversationGroupTable } from '@/db/tables/conversation-group.table';
import { userTable } from '@/db/tables/user.table';
import { conversationGroupMemberTable } from '@/db/tables/conversation-group-member.table';

export function useLiveGroupInfo(id: string, currentUserId: string) {
  const { data, ...rest } = useLiveQuery(
    db
      .select({
        id: conversationGroupTable.id,
        name: conversationGroupTable.name,
        avatar: conversationGroupTable.avatar,

        // Use a CASE statement to swap the current user's name with 'You'
        members: sql<string>`group_concat(
          CASE 
            WHEN ${userTable.id} = ${currentUserId} THEN 'You' 
            ELSE ${userTable.firstName} 
          END, 
          ', '
        )`.as('membersCsv'),

        membersCount: sql<number>`json_array_length(json_group_array(${userTable.firstName}))`.as(
          'membersCount'
        ),
      })
      .from(conversationGroupMemberTable)
      .innerJoin(userTable, eq(conversationGroupMemberTable.userId, userTable.id))
      .innerJoin(
        conversationGroupTable,
        eq(conversationGroupMemberTable.groupId, conversationGroupTable.id)
      )
      .where(eq(conversationGroupMemberTable.groupId, id))
      .groupBy(conversationGroupTable.id, conversationGroupTable.name)
  );

  const groupDetails = data?.[0];

  return {
    data: groupDetails,
    ...rest,
  };
}
