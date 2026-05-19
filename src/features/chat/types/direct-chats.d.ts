import type { ChatAttachment } from '@/db/tables/chat-attachment.table';
import type { ChatDirect } from '@/db/tables/chat-direct.table';

type DirectChatWithAttachment = ChatDirect & {
  attachment: ChatAttachment | null;
};
