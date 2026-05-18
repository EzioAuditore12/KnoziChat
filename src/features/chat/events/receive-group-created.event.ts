import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';

import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';
import { ReceiveGroupCreated } from '@/lib/socket-io/schemas/receive-group-created.schema';
import { userRepository } from '@/db/repositories/user.repository';

import { getMultipleUsersApi } from '@/features/common/api/get-multiple-users.api';
import { getGroupMembersApi } from '../api/get-group-members.api';
import { ConversationGroupMember } from '@/db/tables/conversation-group-member.table';

const handleReceiveGroupCreated = async (message: ReceiveGroupCreated) => {
  const { id, avatar, name, participantIds, createdAt, updatedAt } = message;

  console.log(message);

  const isExisting = await conversationGroupRepository.isExisting(id);

  if (isExisting) return;

  const foundIds = await userRepository.areExistingManyById(participantIds);
  const missingIds = participantIds.filter((id) => !foundIds.includes(id));

  if (missingIds.length > 0) {
    const missingUsers = await getMultipleUsersApi({ participants: missingIds });

    if (missingUsers.length > 0) {
      await userRepository.createMany(
        missingUsers.map((c) => ({
          id: c.id,
          email: c.email,
          firstName: c.firstName,
          lastName: c.lastName,
          middleName: c.middleName,
          phoneNumber: c.phoneNumber,
          avatar: c.avatar,
          createdAt: new Date(c.createdAt).getTime(),
          updatedAt: new Date(c.updatedAt).getTime(),
        }))
      );
    }
  }

  await conversationGroupRepository.create({
    id,
    name,
    avatar: avatar,
    createdAt: new Date(createdAt).getTime(),
    updatedAt: new Date(updatedAt).getTime(),
  });

  const members = await getGroupMembersApi(id);

  const mappedMembers: ConversationGroupMember[] = members.map((m) => ({
    id: m.id,
    groupId: m.groupId,
    userId: m.userId,
    isAdmin: m.isAdmin,
    joinedAt: new Date(m.joinedAt).getTime(),
  }));

  if (mappedMembers.length > 0) {
    await conversationGroupRepository.insertMultipleMembers(mappedMembers);
  }
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
