export type ChatGroupWithUserDetails = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  text: string;
  contentType: 'text' | 'image' | 'video' | 'file' | 'system';
  systemEventType:
    | 'member_left'
    | 'member_joined'
    | 'admin_changed'
    | 'group_name_changed'
    | 'group_avatar_changed'
    | 'group_created'
    | null;
  mode: 'SENT' | 'RECEIVED';
  createdAt: number;
  updatedAt: number;
};
