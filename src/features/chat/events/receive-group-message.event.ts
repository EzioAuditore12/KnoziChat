import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';

import { ReceiveGroupMessage } from '@/lib/socket-io/schemas/receive-group-message.schema';
import { chatGroupRepository } from '@/db/repositories/chat-group.repository';
import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';
import { getGroupDetailsApi } from '../api/get-group-details.api';
import { getMultipleUsersApi } from '@/features/common/api/get-multiple-users.api';
import { userRepository } from '@/db/repositories/user.repository';

const handleReceiveGroupMessage = async (
  message: Omit<ReceiveGroupMessage, 'deliveredTo' | 'seenBy'>
) => {
  const { id, conversationId, senderId, createdAt, text, updatedAt } = message;

  const isExisting = await conversationGroupRepository.isExisting(id);

  if (!isExisting) {
    const groupDetails = await getGroupDetailsApi(conversationId);

    const foundIds = await userRepository.areExistingManyById(groupDetails.participants);
    const missingIds = groupDetails.participants.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      const missingUsers = await getMultipleUsersApi({ participants: missingIds });

      await userRepository.createMany(
        missingUsers.map((c) => {
          const { createdAt, updatedAt, ...rest } = c;

          return {
            ...rest,
            createdAt: new Date(createdAt).getTime(),
            updatedAt: new Date(updatedAt).getTime(),
          };
        })
      );

      await conversationGroupRepository.create({
        id: groupDetails.id,
        name: groupDetails.name,
        adminIds: groupDetails.admins,
        participantIds: groupDetails.participants,
        avatar: groupDetails.avatar,
        createdAt: new Date(groupDetails.createdAt).getTime(),
        updatedAt: new Date(groupDetails.updatedAt).getTime(),
      });
    }
  }
  const savedGroupChat = await chatGroupRepository.create({
    id,
    conversationId,
    senderId,
    text,
    createdAt: new Date(createdAt).getTime(),
    updatedAt: new Date(updatedAt).getTime(),
  });

  await conversationGroupRepository.update(savedGroupChat.conversationId, {
    updatedAt: savedGroupChat.createdAt,
  });
};

export function useReceiveGroupMessageEvent(socket: Socket | null) {
  useEffect(() => {
    if (!socket) return;

    socket.on('message-group:receive', handleReceiveGroupMessage);

    return () => {
      // Fix: Unregister the correct event name
      socket.off('message-group:receive', handleReceiveGroupMessage);
    };
  }, [socket]);
}
