import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { eq } from 'drizzle-orm';

import { getUserApi } from '@/features/common/api/get-user.api';
import { initializeDirectChatApi } from '../../api/initialize-direct-chat.api';

import { db } from '@/db';
import { userTable } from '@/db/tables/user.table';
import { conversationOneToOneTable } from '@/db/tables/conversation-one-to-one.table';
import { chatOneToOneTable } from '@/db/tables/chat-one-to-one.table';

export const useInitializeDirectChat = () => {
  return useMutation({
    mutationFn: initializeDirectChatApi,
    onSuccess: async (data) => {
      await db.transaction(async (transaction) => {
        const isExistingUser = await transaction
          .select({ id: userTable.id })
          .from(userTable)
          .where(eq(userTable.id, data.receiverId))
          .get();

        if (!isExistingUser) {
          const userDetails = await getUserApi(data.receiverId);

          await transaction.insert(userTable).values({
            ...userDetails,
            createdAt: new Date(userDetails.createdAt).getTime(),
            updatedAt: new Date(userDetails.updatedAt).getTime(),
          });
        }

        await transaction.insert(conversationOneToOneTable).values({
          id: data.conversationId,
          userId: data.receiverId,
          createdAt: new Date(data.createdAt).getTime(),
          updatedAt: new Date(data.updatedAt).getTime(),
        });

        await transaction.insert(chatOneToOneTable).values({
          id: data.id,
          conversationId: data.conversationId,
          mode: 'SENT',
          status: 'DELIVERED',
          text: data.text,
          createdAt: new Date(data.createdAt).getTime(),
          updatedAt: new Date(data.updatedAt).getTime(),
        });
      });

      router.replace({
        pathname: '/(main)/chat/[id]',
        params: { id: data.conversationId, userId: data.receiverId },
      });
    },
    onError: (error) => {
      console.log(error.message);
      alert(`${error.message}`);
    },
  });
};
