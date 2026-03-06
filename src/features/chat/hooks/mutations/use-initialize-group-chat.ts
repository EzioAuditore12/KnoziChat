import { useMutation } from '@tanstack/react-query';
import { inArray } from 'drizzle-orm';
import { router } from 'expo-router';

import { initializeGroupChatApi } from '../../api/initialize-group-chat.api';
import { getMultipleUsersApi } from '@/features/common/api/get-multiple-users.api';

import { db } from '@/db';
import { userTable } from '@/db/tables/user.table';
import { conversationGroupTable } from '@/db/tables/conversation-group.table';

export function useInitializeGroupChat() {
  return useMutation({
    mutationFn: initializeGroupChatApi,
    onSuccess: async (data) => {
      await db.transaction(async (transaction) => {
        const existingUsers = await transaction
          .select({ id: userTable.id })
          .from(userTable)
          .where(inArray(userTable.id, data.participants));

        const existingUserIds = new Set(existingUsers.map((u) => u.id));

        const newUserIds = data.participants.filter((id) => !existingUserIds.has(id));

        if (newUserIds.length > 0) {
          const newUsersDetails = await getMultipleUsersApi({ participants: newUserIds });

          const mappedNewUserDetails = newUsersDetails.map((u) => ({
            ...u,
            createdAt: new Date(u.createdAt).getTime(),
            updatedAt: new Date(u.updatedAt).getTime(),
          }));

          await transaction.insert(userTable).values(mappedNewUserDetails);
        }

        await transaction.insert(conversationGroupTable).values({
          id: data.id,
          name: data.name,
          adminIds: data.admins,
          participantIds: data.participants,
          avatar: data.avatar,
          createdAt: new Date(data.createdAt).getTime(),
          updatedAt: new Date(data.updatedAt).getTime(),
        });
      });

      router.replace({
        pathname: '/(main)/chat-group/[id]',
        params: { id: data.id },
      });
    },
    onError: (error) => {
      console.log(error);
      alert(error);
    },
  });
}
