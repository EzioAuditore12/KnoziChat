import { desc, inArray, sql, ne, and, exists, eq } from 'drizzle-orm';

import { db } from '@/db';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';
import { userTable } from '@/db/tables/user.table';
import { conversationDirectTable } from '@/db/tables/conversation-direct.table';
import { chatDirectTable } from '@/db/tables/chat-direct.table';
import { useSocketState } from '@/store/socket';
import { useAuthStore } from '@/store/auth';

export function useGetOnlineUsers() {
  const { onlineUsers } = useSocketState();

  const currentUserId = useAuthStore((state) => state.user?.id!);

  return useLiveInfiniteQuery({
    query: db
      .select({
        id: userTable.id,
        username: userTable.username,
        phoneNumber: userTable.phoneNumber,
        email: userTable.email,
        avatar: userTable.avatar,
        firstName: userTable.firstName,
        middleName: userTable.middleName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,

        isOnline: sql<boolean>`${onlineUsers.length > 0 ? inArray(userTable.id, onlineUsers) : sql`0`}`.as('isOnline'),
      })
      .from(userTable)
      .where(
        and(
          ne(userTable.id, currentUserId),
          exists(
            db
              .select({ id: conversationDirectTable.id })
              .from(conversationDirectTable)
              .innerJoin(
                chatDirectTable,
                eq(conversationDirectTable.id, chatDirectTable.conversationId)
              )
              .where(eq(conversationDirectTable.userId, userTable.id))
          )
        )
      )
      .orderBy(
        desc(sql`${onlineUsers.length > 0 ? inArray(userTable.id, onlineUsers) : sql`0`}`),
        desc(userTable.updatedAt)
      ),

    pageSize: 10,
  });
}
