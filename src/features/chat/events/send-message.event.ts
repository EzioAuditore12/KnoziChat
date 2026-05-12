import { Socket } from '@/lib/socket-io';
import type { SendMessage } from '@/lib/socket-io/schemas/send-message.schema';

import { chatDirectRepository } from '@/db/repositories/chat-direct.repository';
import { conversationDirectRepository } from '@/db/repositories/conversation-direct.repository';

export type SendMessageEvent = Omit<SendMessage, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  socket: Socket;
};

export const sendMessageEvent = async ({
  conversationId,
  text,
  receiverId,
  socket,
}: SendMessageEvent) => {
  const saveDirectChat = await chatDirectRepository.create({
    conversationId,
    status: 'SENT',
    mode: 'SENT',
    text,
  });

  await conversationDirectRepository.updateTime(saveDirectChat.conversationId, Date.now());

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
