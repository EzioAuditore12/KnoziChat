import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { getUserApi } from '@/features/common/api/get-user.api';
import { initializeDirectChatApi } from '../../api/initialize-direct-chat.api';

import { db } from '@/db';

import { UserRepository } from '@/db/repositories/user.repository';
import { ConversationDirectRepository } from '@/db/repositories/conversation-direct.repository';
import { ChatDirectRepository } from '@/db/repositories/chat-direct.repository';

export const useInitializeDirectChat = () => {
  return useMutation({
    mutationFn: initializeDirectChatApi,
    onSuccess: async (data) => {
      await db.transaction(async (transaction) => {
        const userRepository = new UserRepository(transaction);
        const conversationDirectRepository = new ConversationDirectRepository(transaction);
        const chatDirectRepository = new ChatDirectRepository(transaction);

        const isExistingUser = await userRepository.isExisting(data.receiverId);

        if (!isExistingUser) {
          const userDetails = await getUserApi(data.receiverId);

          await userRepository.create({
            ...userDetails,
            createdAt: new Date(userDetails.createdAt).getTime(),
            updatedAt: new Date(userDetails.updatedAt).getTime(),
          });
        }

        await conversationDirectRepository.create({
          id: data.conversationId,
          userId: data.receiverId,
          createdAt: new Date(data.createdAt).getTime(),
          updatedAt: new Date(data.updatedAt).getTime(),
        });

        await chatDirectRepository.create({
          id: data.id,
          conversationId: data.conversationId,
          mode: 'SENT',
          status: 'DELIVERED',
          content: data.content,
          contentType: data.contentType,
          deletedAt: data.deletedAt === null ? null : new Date(data.deletedAt).getTime(),
          createdAt: new Date(data.createdAt).getTime(),
          updatedAt: new Date(data.updatedAt).getTime(),
        });
      });

      router.replace({
        pathname: '/(main)/chat/direct/[id]',
        params: { id: data.conversationId, userId: data.receiverId },
      });
    },
    onError: (error) => {
      alert(`${error.message}`);
    },
  });
};
