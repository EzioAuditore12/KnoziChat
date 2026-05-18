import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';

import { ReceiveGroupMessage } from '@/lib/socket-io/schemas/receive-group-message.schema';
import { chatGroupRepository } from '@/db/repositories/chat-group.repository';
import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';
import { getGroupDetailsApi } from '../api/get-group-details.api';
import { getMultipleUsersApi } from '@/features/common/api/get-multiple-users.api';
import { userRepository } from '@/db/repositories/user.repository';
import { getGroupMembersApi } from '../api/get-group-members.api';

const handleReceiveGroupMessage = async (
  message: Omit<ReceiveGroupMessage, 'deliveredTo' | 'seenBy'>
) => {
  const {
    id,
    conversationId,
    senderId,
    createdAt,
    content,
    contentType,
    attachmentUrl,
    deletedAt,
    deletedBy,
    updatedAt,
  } = message;

  console.log(message);

  const isExisting = await conversationGroupRepository.isExisting(conversationId);

  if (!isExisting) {
    const groupDetails = await getGroupDetailsApi(conversationId);

    const groupMembers = await getGroupMembersApi(groupDetails.id);

    const participantIds = groupMembers.map((c) => c.userId);

    const foundIds = await userRepository.areExistingManyById(participantIds);
    const missingIds = participantIds.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      const missingUsers = await getMultipleUsersApi({ participants: missingIds });

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

      await conversationGroupRepository.create({
        id: groupDetails.id,
        name: groupDetails.name,
        avatar: groupDetails.avatar,
        createdAt: new Date(groupDetails.createdAt).getTime(),
        updatedAt: new Date(groupDetails.updatedAt).getTime(),
      });

      await conversationGroupRepository.insertMultipleMembers(
        groupMembers.map((m) => ({
          id: m.id,
          groupId: m.groupId,
          userId: m.userId,
          isAdmin: Boolean(m.isAdmin),
          joinedAt: new Date(m.joinedAt).getTime(),
        }))
      );
    }
  }
  const savedGroupChat = await chatGroupRepository.create({
    id,
    conversationId,
    senderId,
    content,
    contentType,
    deletedAt: deletedAt != null ? new Date(deletedAt).getTime() : null,
    deletedBy,
    createdAt: new Date(createdAt).getTime(),
    updatedAt: new Date(updatedAt).getTime(),
  });

  if (attachmentUrl)
    await chatGroupRepository.createAttachment({
      id: savedGroupChat.id,
      remoteUrl: attachmentUrl,
      transferStatus: 'PENDING',
      transferType: 'DOWNLOAD',
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
