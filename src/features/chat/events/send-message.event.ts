import { Socket } from '@/lib/socket-io';
import type { SendMessage } from '@/lib/socket-io/schemas/send-message.schema';

import { chatOneToOneRepository } from '@/db/repositories/chat-one-to-one.repository';
import { conversationOneToOneRepository } from '@/db/repositories/conversation-one-to-one.repository';

export type SendMessageEvent = Omit<SendMessage, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  socket: Socket;
};

export const sendMessageEvent = async ({
  conversationId,
  text,
  receiverId,
  socket,
}: SendMessageEvent) => {
  const saveDirectChat = await chatOneToOneRepository.create({
    conversationId,
    status: 'SENT',
    mode: 'SENT',
    text,
  });

  await conversationOneToOneRepository.updateTime(saveDirectChat.conversationId, Date.now());

  socket.emit('message:send', {
    id: saveDirectChat.id,
    conversationId: saveDirectChat.conversationId,
    status: 'SENT',
    receiverId,
    text: saveDirectChat.text,
    createdAt: new Date(saveDirectChat.createdAt),
    updatedAt: new Date(saveDirectChat.updatedAt),
  });
};
