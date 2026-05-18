import { Socket } from '@/lib/socket-io';

import { SendGroupMessage } from '@/lib/socket-io/schemas/send-group-message.schema';
import { chatGroupRepository } from '@/db/repositories/chat-group.repository';
import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';

export type SendGroupMessageEvent = Omit<
  SendGroupMessage,
  'id' | 'createdAt' | 'updatedAt' | 'status'
> & {
  senderId: string;
  socket: Socket;
};

export const sendGroupMessageEvent = async ({
  senderId,
  conversationId,
  attachmentUrl,
  content,
  contentType,
  deletedAt,
  deletedBy,
  socket,
}: SendGroupMessageEvent) => {
  const savedGroupChat = await chatGroupRepository.create({
    senderId,
    conversationId,
    content,
    contentType,
  });

  await conversationGroupRepository.update(savedGroupChat.conversationId, {
    updatedAt: savedGroupChat.createdAt,
  });

  socket.emit('message-group:send', {
    id: savedGroupChat.id,
    conversationId: savedGroupChat.conversationId,
    content: savedGroupChat.content,
    contentType: savedGroupChat.contentType,
    attachmentUrl,
    deletedAt,
    deletedBy,
    createdAt: new Date(savedGroupChat.createdAt),
    updatedAt: new Date(savedGroupChat.updatedAt),
  });
};
