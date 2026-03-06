import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';
import type { ReceiveMessage } from '@/lib/socket-io/schemas/receive-message.schema';

import { chatOneToOneRepository } from '@/db/repositories/chat-one-to-one.repository';
import { conversationOneToOneRepository } from '@/db/repositories/conversation-one-to-one.repository';

const handleReceiveMessage = async (message: ReceiveMessage) => {
  const { id, conversationId, createdAt, text, updatedAt } = message;

  const saveDirectChat = await chatOneToOneRepository.create({
    id: id,
    conversationId,
    mode: 'RECEIVED',
    text,
    status: 'DELIVERED',
    createdAt: new Date(createdAt).getTime(),
    updatedAt: new Date(updatedAt).getTime(),
  });

  await conversationOneToOneRepository.updateTime(
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
