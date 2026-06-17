import { db } from '@/db';
import {
  chatDirectRepository,
  ChatDirectRepository,
} from '@/db/repositories/chat-direct.repository';
import { conversationDirectRepository } from '@/db/repositories/conversation-direct.repository';
import { SnowFlakeId } from '@/lib/snowflake';

import { chunkedUploadService } from '@/features/uploads/services/chunked-upload.service';
import { activeUploadControllers, savedUploadSessions } from '@/lib/upload-manager';

import type { SendMessageEvent } from './index';

export const handleFileMessage = async ({
  conversationId,
  content,
  receiverId,
  socket,
  file,
  deletedAt,
  isResume,
  messageId,
}: SendMessageEvent) => {
  if (!file) {
    throw new Error('File is required for handleFileMessage');
  }

  const targetMessageId = messageId ?? new SnowFlakeId(1).generate().toString();

  // 1. Create or Update local Database records
  if (!isResume) {
    await db.transaction(async (transaction) => {
      const txRepo = new ChatDirectRepository(transaction);

      await txRepo.create({
        id: targetMessageId,
        conversationId,
        status: 'PENDING',
        mode: 'SENT',
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

    await conversationDirectRepository.updateTime(conversationId, Date.now());
  } else {
    await chatDirectRepository.updateAttachmentStatus(targetMessageId, 'UPLOADING');
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
          await chatDirectRepository.updateAttachmentProgress(
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
    await chatDirectRepository.updateAttachmentStatus(
      targetMessageId,
      'COMPLETED',
      uploadResult.url
    );

    // 5. Emit Socket Event with the new URL
    socket.emit(
      'message:send',
      {
        id: targetMessageId,
        conversationId: conversationId,
        receiverId,
        content: content,
        attachmentUrl: uploadResult.url,
        deletedAt,
        contentType: file.contentType,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      async (response) => {
        if (!response.success) {
          await chatDirectRepository.updateStatus(targetMessageId, 'FAILED');
          return;
        }
        await chatDirectRepository.updateStatus(targetMessageId, 'DELIVERED');
      }
    );
  } catch (error) {
    // Clean up controller on failure or pause
    activeUploadControllers.delete(targetMessageId);

    if ((error as Error).message === 'UPLOAD_PAUSED' || (error as Error).name === 'AbortError') {
      await chatDirectRepository.updateAttachmentStatus(targetMessageId, 'PAUSED');
    } else {
      await chatDirectRepository.updateAttachmentStatus(targetMessageId, 'FAILED');
      await chatDirectRepository.updateStatus(targetMessageId, 'FAILED');
    }
  }
};
