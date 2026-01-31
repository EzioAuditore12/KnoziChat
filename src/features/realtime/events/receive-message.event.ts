import { useEffect } from 'react';

import type { Socket } from '@/lib/socket-io';
import { ReceiveMessageDto } from '@/lib/socket-io/dto/receive-message.dto';

import { DirectChatRepository } from '@/db/repositories/direct-chat';
import { ConversationRepository } from '@/db/repositories/conversation';

const directChatRepository = new DirectChatRepository();
const conversationRepository = new ConversationRepository();

const handleReceiveMessage = async (message: ReceiveMessageDto) => {
  const { _id, conversationId, createdAt, text, updatedAt } = message;

  const saveDirectChat = await directChatRepository.create({
    id: _id,
    conversationId,
    isDelivered: false,
    isSeen: false,
    mode: 'RECEIVED',
    text,
    createdAt: createdAt,
    updatedAt: updatedAt,
  });

  await conversationRepository.updateConversationTime(
    saveDirectChat._getRaw('conversation_id') as string,
    new Date()
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
