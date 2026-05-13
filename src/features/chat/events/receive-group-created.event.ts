import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';

import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';
import { ReceiveGroupCreated } from '@/lib/socket-io/schemas/receive-group-created.schema';
import { userRepository } from '@/db/repositories/user.repository';

import { getMultipleUsersApi } from '@/features/common/api/get-multiple-users.api';

const handleReceiveGroupCreated = async (message: ReceiveGroupCreated) => {
  const { id, admins, avatar, name, participants, createdAt, updatedAt } = message;

  const isExisting = await conversationGroupRepository.isExisting(id);

  if (isExisting) return;

  const foundIds = await userRepository.areExistingManyById(participants);
  const missingIds = participants.filter((id) => !foundIds.includes(id));

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
  }

  await conversationGroupRepository.create({
    id,
    adminIds: admins,
    participantIds: participants,
    name,
    avatar,
    createdAt: new Date(createdAt).getTime(),
    updatedAt: new Date(updatedAt).getTime(),
  });
};

export function useReceiveGroupCreatedEvent(socket: Socket | null) {
  useEffect(() => {
    if (!socket) return;

    socket.on('conversation-group:created', handleReceiveGroupCreated);

    return () => {
      // Fix: Unregister the correct event name
      socket.off('conversation-group:created', handleReceiveGroupCreated);
    };
  }, [socket]);
}
