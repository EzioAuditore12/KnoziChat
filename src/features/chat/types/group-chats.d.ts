import { ChatAttachment } from '@/db/tables/chat-attachment.table';

export type ChatGroupWithUserDetails = {
  id: string;
  senderId: string;
  senderName: string | null;
  senderAvatar: string | null;
  content: string | null;
  attachment: ChatAttachment | null;
  contentType: 'text' | 'image' | 'video' | 'file' | 'system';
  systemEventType:
    | 'member_left'
    | 'member_joined'
    | 'admin_changed'
    | 'group_name_changed'
    | 'group_avatar_changed'
    | 'group_created'
    | null;
  metadata: Record<string, unknown> | null;
  createdAt: number;
  updatedAt: number;
  mode: 'SENT' | 'RECEIVED';
};
