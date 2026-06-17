import { Socket } from '@/lib/socket-io';

import { SendGroupMessage } from '@/lib/socket-io/schemas/send-group-message.schema';

import { File } from '@/features/common/schemas/file.schema';
import { handleTextMessage } from './content-text';
import { handleFileMessage } from './content-file';

export type SendGroupMessageEvent = Omit<
  SendGroupMessage,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'contentType' | 'attachmentUrl'
> & {
  senderId: string;
  socket: Socket;
  file: File | undefined;
  isResume?: boolean;
  messageId?: string;
};

export const sendGroupMessageEvent = async (payload: SendGroupMessageEvent) => {
  if (!payload.file) {
    await handleTextMessage(payload);
  } else {
    await handleFileMessage(payload);
  }
};
