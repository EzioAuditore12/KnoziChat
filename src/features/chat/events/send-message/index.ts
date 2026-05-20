import { Socket } from '@/lib/socket-io';
import type { SendMessage } from '@/lib/socket-io/schemas/send-message.schema';
import type { File } from '@/features/common/schemas/file.schema';

import { handleTextMessage } from './content-text';
import { handleFileMessage } from './content-file';

export type SendMessageEvent = Omit<
  SendMessage,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'attachmentUrl' | 'contentType'
> & {
  socket: Socket;
  file: File | undefined;
  isResume?: boolean;
  messageId?: string;
};

export const sendMessageEvent = async (payload: SendMessageEvent) => {
  if (!payload.file) {
    await handleTextMessage(payload);
  } else {
    await handleFileMessage(payload);
  }
};
