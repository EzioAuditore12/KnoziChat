import { Socket } from '@/lib/socket-io';
import type { SendMessage } from '@/lib/socket-io/schemas/send-message.schema';

import {
  chatDirectRepository,
  ChatDirectRepository,
} from '@/db/repositories/chat-direct.repository';
import { conversationDirectRepository } from '@/db/repositories/conversation-direct.repository';

import type { File } from '@/features/common/schemas/file.schema';
import { ChatDirect } from '@/db/tables/chat-direct.table';
import { db } from '@/db';

export type SendMessageEvent = Omit<
  SendMessage,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'attachmentUrl' | 'contentType'
> & {
  socket: Socket;
  file: File | undefined;
};

export const sendMessageEvent = async ({
  conversationId,
  content,
  receiverId,
  socket,
  file,
  deletedAt,
}: SendMessageEvent) => {
  let directChat: ChatDirect;

  if (!file) {
    directChat = await chatDirectRepository.create({
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
  } else {
    await db.transaction(async (transaction) => {
      const chatDirectRepository = new ChatDirectRepository(transaction);

      directChat = await chatDirectRepository.create({
        conversationId,
        status: 'DELIVERED',
        mode: 'SENT',
        content,
        contentType: file.contentType,
      });

      await chatDirectRepository.createAttachment({
        id: directChat.id,
        localUri: file.uri,
        transferType: 'UPLOAD',
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        transferStatus: 'UPLOADING',
      });
    });
  }
};
