import { chatDirectRepository } from '@/db/repositories/chat-direct.repository';
import { conversationDirectRepository } from '@/db/repositories/conversation-direct.repository';
import type { SendMessageEvent } from './index';

export const handleTextMessage = async ({
  conversationId,
  content,
  receiverId,
  socket,
  deletedAt,
}: SendMessageEvent) => {
  const directChat = await chatDirectRepository.create({
    conversationId,
    status: 'PENDING',
    mode: 'SENT',
    content,
    contentType: 'text',
  });

  await conversationDirectRepository.updateTime(directChat.conversationId, Date.now());

  socket.emit(
    'message:send',
    {
      id: directChat.id,
      conversationId: directChat.conversationId,
      receiverId,
      content: directChat.content,
      attachmentUrl: null,
      deletedAt,
      contentType: directChat.contentType,
      createdAt: new Date(directChat.createdAt),
      updatedAt: new Date(directChat.updatedAt),
    },
    async (response) => {
      if (!response.success) {
        await chatDirectRepository.updateStatus(directChat.id, 'FAILED');
        return;
      }
      await chatDirectRepository.updateStatus(directChat.id, 'DELIVERED');
    }
  );
};
