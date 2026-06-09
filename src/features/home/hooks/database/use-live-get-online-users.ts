import { desc, inArray, sql, ne } from 'drizzle-orm';

import { db } from '@/db';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';
import { userTable } from '@/db/tables/user.table';
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

        isOnline: sql<boolean>`
      CASE
        WHEN ${onlineUsers.length > 0 ? inArray(userTable.id, onlineUsers) : sql`0`}
        THEN true
        ELSE false
      END
    `.as('isOnline'),
      })
      .from(userTable)
      .where(ne(userTable.id, currentUserId))
      .orderBy(desc(sql`isOnline`), desc(userTable.updatedAt)),

    pageSize: 10,
  });
}
