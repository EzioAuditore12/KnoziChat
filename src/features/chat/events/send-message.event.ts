import { Socket } from '@/lib/socket-io';
import type { SendMessage } from '@/lib/socket-io/schemas/send-message.schema';

import { chatDirectRepository } from '@/db/repositories/chat-direct.repository';
import { conversationDirectRepository } from '@/db/repositories/conversation-direct.repository';

export type SendMessageEvent = Omit<SendMessage, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  socket: Socket;
};

export const sendMessageEvent = async ({
  conversationId,
  content,
  contentType,
  receiverId,
  socket,
  attachmentUrl,
  deletedAt,
}: SendMessageEvent) => {
  const saveDirectChat = await chatDirectRepository.create({
    conversationId,
    status: 'SENT',
    mode: 'SENT',
    content,
    contentType,
  });

  // TODO: // Need to implement this later on
  if (attachmentUrl)
    await chatDirectRepository.createAttachment({
      id: saveDirectChat.id,
      remoteUrl: attachmentUrl,
      transferType: 'UPLOAD',
      transferStatus: 'COMPLETED',
    });

  await conversationDirectRepository.updateTime(saveDirectChat.conversationId, Date.now());

  socket.emit('message:send', {
    id: saveDirectChat.id,
    conversationId: saveDirectChat.conversationId,
    status: 'SENT',
    receiverId,
    content: saveDirectChat.content,
    attachmentUrl,
    deletedAt,
    contentType: saveDirectChat.contentType,
    createdAt: new Date(saveDirectChat.createdAt),
    updatedAt: new Date(saveDirectChat.updatedAt),
  });
};
