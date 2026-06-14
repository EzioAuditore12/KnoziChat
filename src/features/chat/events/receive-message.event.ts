import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';
import type { ReceiveMessage } from '@/lib/socket-io/schemas/receive-message.schema';

import { getUserApi } from '@/features/common/api/get-user.api';
import { useSocketState } from '@/store/socket';

import { db } from '@/db';

import { UserRepository } from '@/db/repositories/user.repository';
import { ConversationDirectRepository } from '@/db/repositories/conversation-direct.repository';
import { ChatDirectRepository } from '@/db/repositories/chat-direct.repository';

const handleReceiveMessage = async (message: ReceiveMessage) => {
  const {
    id,
    conversationId,
    createdAt,
    content,
    status,
    contentType,
    attachmentUrl,
    deletedAt,
    updatedAt,
    senderId,
  } = message;

  await db.transaction(async (transaction) => {
    const userRepository = new UserRepository(transaction);
    const conversationDirectRepository = new ConversationDirectRepository(transaction);
    const chatDirectRepository = new ChatDirectRepository(transaction);

    const isExistingConversation =
      await conversationDirectRepository.isExistingConversationWithUser(senderId);

    if (!isExistingConversation) {
      console.log('started new chat');

      const isExistingUser = await userRepository.isExisting(senderId);

      if (!isExistingUser) {
        const { createdAt, updatedAt, ...rest } = await getUserApi(senderId);

        await userRepository.create({
          ...rest,
          createdAt: new Date(createdAt).getTime(),
          updatedAt: new Date(updatedAt).getTime(),
        });
      }

      await conversationDirectRepository.create({
        userId: senderId,
        id: conversationId,
      });


    }

    const saveDirectChat = await chatDirectRepository.create({
      id: id,
      conversationId,
      mode: 'RECEIVED',
      content,
      contentType,
      deletedAt: deletedAt !== null ? new Date(deletedAt).getTime() : null,
      status,
      createdAt: new Date(createdAt).getTime(),
      updatedAt: new Date(updatedAt).getTime(),
    });

    if (attachmentUrl)
      await chatDirectRepository.createAttachment({
        id: saveDirectChat.id,
        remoteUrl: attachmentUrl,
        transferStatus: 'PENDING',
        transferType: 'DOWNLOAD',
      });

    await conversationDirectRepository.updateTime(
      saveDirectChat.conversationId,
      new Date(createdAt).getTime()
    );

    const { activeConversationId, socket } = useSocketState.getState();
    if (activeConversationId === conversationId && socket?.connected) {
      socket.emit('message:seen', { conversationId });
    }
  });
};

export function useReceiveMessageEvent(socket: Socket | null) {
  useEffect(() => {
    if (!socket) return;

    socket.on('message:receive', handleReceiveMessage);

    return () => {
      socket.off('message:receive', handleReceiveMessage);
    };
  }, [socket]);
}
