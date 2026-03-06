import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';

import { ReceiveGroupMessage } from '@/lib/socket-io/schemas/receive-group-message.schema';
import { chatGroupRepository } from '@/db/repositories/chat-group.repository';
import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';

const handleReceiveGroupMessage = async (
  message: Omit<ReceiveGroupMessage, 'deliveredTo' | 'seenBy'>
) => {
  const { id, conversationId, senderId, createdAt, text, updatedAt } = message;

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
