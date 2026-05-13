import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';
import type { ReceiveMessage } from '@/lib/socket-io/schemas/receive-message.schema';

import { chatDirectRepository } from '@/db/repositories/chat-direct.repository';
import { conversationDirectRepository } from '@/db/repositories/conversation-direct.repository';
import { userRepository } from '@/db/repositories/user.repository';
import { getUserApi } from '@/features/common/api/get-user.api';
import { useSocketState } from '@/store/socket';

const handleReceiveMessage = async (message: ReceiveMessage) => {
  const { id, conversationId, createdAt, text, updatedAt, senderId } = message;

  console.log(message);

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

    // NEW: Request presence for this new sender
    const socket = useSocketState.getState().socket;

    if (socket?.connected) {
      socket.emit('presence:get', [senderId]);
    }
  }

  const saveDirectChat = await chatDirectRepository.create({
    id: id,
    conversationId,
    mode: 'RECEIVED',
    text,
    status: 'DELIVERED',
    createdAt: new Date(createdAt).getTime(),
    updatedAt: new Date(updatedAt).getTime(),
  });

  await conversationDirectRepository.updateTime(
    saveDirectChat.conversationId,
    new Date(createdAt).getTime()
  );
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
