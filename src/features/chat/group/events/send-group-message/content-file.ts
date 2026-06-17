import { db } from '@/db';
import { chatGroupRepository, ChatGroupRepository } from '@/db/repositories/chat-group.repository';
import { conversationGroupRepository } from '@/db/repositories/conversation-group.repository';
import { SnowFlakeId } from '@/lib/snowflake';

import { chunkedUploadService } from '@/features/uploads/services/chunked-upload.service';
import { activeUploadControllers, savedUploadSessions } from '@/lib/upload-manager';

import type { SendGroupMessageEvent } from './index';

export const handleFileMessage = async ({
  conversationId,
  content,
  socket,
  isResume,
  messageId,
  file,
  senderId,
}: SendGroupMessageEvent) => {
  if (!file) {
    throw new Error('File is required for handleFileMessage');
  }

  const targetMessageId = messageId ?? new SnowFlakeId(1).generate().toString();

  let savedGroupChat: any = null;

  // 1. Create or Update local Database records
  if (!isResume) {
    await db.transaction(async (transaction) => {
      const txRepo = new ChatGroupRepository(transaction);

      savedGroupChat = await txRepo.create({
        id: targetMessageId,
        conversationId,
        status: 'PENDING',
        senderId,
        content,
        contentType: file.contentType,
      });

      await txRepo.createAttachment({
        id: targetMessageId,
        localUri: file.uri,
        transferType: 'UPLOAD',
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        totalBytes: file.size,
        transferStatus: 'UPLOADING',
      });
    });

    // Update conversation updatedAt to the message createdAt
    if (savedGroupChat) {
      await conversationGroupRepository.update(savedGroupChat.conversationId, {
        updatedAt: savedGroupChat.createdAt,
      });
    }
  } else {
    await chatGroupRepository.updateAttachmentStatus(targetMessageId, 'UPLOADING');
  }

  // 2. Setup Upload Manager Controllers for Pausing
  const abortController = new AbortController();
  activeUploadControllers.set(targetMessageId, abortController);
  const existingSession = savedUploadSessions.get(targetMessageId);

  try {
    // 3. Process Chunked Upload
    const uploadResult = await chunkedUploadService.uploadFile(
      file,
      {
        onProgress: async (p) => {
          await chatGroupRepository.updateAttachmentProgress(
            targetMessageId,
            p.transferredBytes,
            p.totalBytes
          );
        },
        onSessionCreated: (session) => {
          savedUploadSessions.set(targetMessageId, session);
        },
      },
      existingSession,
      abortController.signal
    );

    // 4. Upload Completed - Clean up registries and finalize DB
    activeUploadControllers.delete(targetMessageId);
    savedUploadSessions.delete(targetMessageId);
    await chatGroupRepository.updateAttachmentStatus(
      targetMessageId,
      'COMPLETED',
      uploadResult.url
    );

    // 5. Emit Socket Event with the new URL
    socket.emit(
      'message-group:send',
      {
        id: targetMessageId,
        conversationId,
        content: content,
        contentType: file.contentType,
        attachmentUrl: uploadResult.url,
        deletedAt: undefined,
        deletedBy: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      async (response: { success: boolean; messageId?: string }) => {
        if (!response.success) {
          await chatGroupRepository.updateAttachmentStatus(targetMessageId, 'FAILED');
          await chatGroupRepository.updateStatus(targetMessageId, 'FAILED');
          return;
        }

        // mark message delivered locally
        await chatGroupRepository.updateStatus(targetMessageId, 'DELIVERED');
      }
    );
  } catch (error) {
    // Clean up controller on failure or pause
    activeUploadControllers.delete(targetMessageId);

    if ((error as Error).message === 'UPLOAD_PAUSED' || (error as Error).name === 'AbortError') {
      await chatGroupRepository.updateAttachmentStatus(targetMessageId, 'PAUSED');
    } else {
      await chatGroupRepository.updateAttachmentStatus(targetMessageId, 'FAILED');
      // No status update method for group messages currently
    }
  }
};
