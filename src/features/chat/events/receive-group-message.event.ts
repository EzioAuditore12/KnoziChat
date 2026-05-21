import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';

import { ReceiveGroupMessage } from '@/lib/socket-io/schemas/receive-group-message.schema';
import { db } from '@/db';
import { UserRepository } from '@/db/repositories/user.repository';
import { ConversationGroupRepository } from '@/db/repositories/conversation-group.repository';
import { ChatGroupRepository } from '@/db/repositories/chat-group.repository';
import { getGroupDetailsApi } from '../api/get-group-details.api';
import { getMultipleUsersApi } from '@/features/common/api/get-multiple-users.api';
import { getGroupMembersApi } from '../api/get-group-members.api';

const handleReceiveGroupMessage = async (message: ReceiveGroupMessage) => {
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
    metadata,
    status,
    systemEventType,
  } = message;

  console.log(message);

  await db.transaction(async (transaction) => {
    const userRepository = new UserRepository(transaction);
    const conversationGroupRepository = new ConversationGroupRepository(transaction);
    const chatGroupRepository = new ChatGroupRepository(transaction);

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
            createdAt: new Date(m.createdAt).getTime(),
            updatedAt: new Date(m.updatedAt).getTime(),
            deletedAt: m.deletedAt ? new Date(m.deletedAt).getTime() : null,
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
      metadata,
      systemEventType,
      status,
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
