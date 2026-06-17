import { chatGroupRepository } from '@/db/repositories/chat-group.repository';
import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';

import type { SendGroupMessageEvent } from './index';

export const handleTextMessage = async ({
  conversationId,
  content,
  senderId,
  socket,
}: SendGroupMessageEvent) => {
  const savedGroupChat = await chatGroupRepository.create({
    senderId,
    conversationId,
    content,
    status: 'PENDING',
    contentType: 'text',
  });

  await conversationGroupRepository.update(savedGroupChat.conversationId, {
    updatedAt: savedGroupChat.createdAt,
  });

  if (savedGroupChat.contentType === 'system')
    throw new Error('User not allowed to send system messages');

  socket.emit(
    'message-group:send',
    {
      id: savedGroupChat.id,
      conversationId: savedGroupChat.conversationId,
      content: savedGroupChat.content,
      contentType: savedGroupChat.contentType,
      attachmentUrl: null,
      deletedAt: undefined,
      deletedBy: null,
      createdAt: new Date(savedGroupChat.createdAt),
      updatedAt: new Date(savedGroupChat.updatedAt),
    },
    async (response) => {
      if (!response.success) {
        await chatGroupRepository.updateStatus(savedGroupChat.id, 'FAILED');
        return;
      }
      await chatGroupRepository.updateStatus(savedGroupChat.id, 'DELIVERED');
    }
  );
};
