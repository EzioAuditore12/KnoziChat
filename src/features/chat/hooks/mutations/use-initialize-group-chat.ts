import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { initializeGroupChatApi } from '../../api/initialize-group-chat.api';
import { getMultipleUsersApi } from '@/features/common/api/get-multiple-users.api';

import { db } from '@/db';

import { ConversationGroupMember } from '@/db/tables/conversation-group-member.table';
import { UserRepository } from '@/db/repositories/user.repository';
import { ConversationGroupRepository } from '@/db/repositories/conversation-group.repository';

export function useInitializeGroupChat() {
  return useMutation({
    mutationFn: initializeGroupChatApi,
    onSuccess: async (data) => {
      await db.transaction(async (transaction) => {
        const userRepository = new UserRepository(transaction);
        const conversationGroupRepository = new ConversationGroupRepository(transaction);

        const existingUsers = await userRepository.areExistingManyById(data.participantIds);

        const existingUserIds = new Set(existingUsers);

        const newUserIds = data.participantIds.filter((id) => !existingUserIds.has(id));

        if (newUserIds.length > 0) {
          const newUsersDetails = await getMultipleUsersApi({ participants: newUserIds });

          const mappedNewUserDetails = newUsersDetails.map((u) => ({
            ...u,
            createdAt: new Date(u.createdAt).getTime(),
            updatedAt: new Date(u.updatedAt).getTime(),
          }));

          await userRepository.createMany(mappedNewUserDetails);
        }

        await conversationGroupRepository.create({
          id: data.id,
          name: data.name,
          avatar: data.avatar,
          createdAt: new Date(data.createdAt).getTime(),
          updatedAt: new Date(data.updatedAt).getTime(),
        });

        const mappedConversationGroupMembers: ConversationGroupMember[] = data.participantIds.map(
          (userId) => ({
            id: `${data.id}:${userId}`,

            groupId: data.id,

            userId,

            isAdmin: data.adminIds.includes(userId),

            joinedAt: new Date(data.createdAt).getTime(),
          })
        );

        await conversationGroupRepository.insertMultipleMembers(mappedConversationGroupMembers);
      });

      router.replace({
        pathname: '/(main)/chat/group/[id]',
        params: { id: data.id },
      });
    },
    onError: (error) => {
      console.log(error);
      alert(error);
    },
  });
}
