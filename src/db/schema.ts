import { DrizzleAppSchema } from '@powersync/drizzle-driver';

import { chatGroupTable } from './tables/chat-group.table';
import { chatDirectTable } from './tables/chat-direct.table';
import { conversationGroupTable } from './tables/conversation-group.table';
import { conversationDirectTable } from './tables/conversation-direct.table';

import { userTable } from './tables/user.table';

import {
  chatGroupRelationWithConversationGroup,
  conversationGroupRelationWithChatGroup,
} from './relations/one-to-many/conversation-group-to-chat-group.relation';
import {
  chatDirectRelationWithConversationDirect,
  conversationDirectRelationWithChatDirect,
} from './relations/one-to-many/conversation-direct-to-chat-direct.relation';
import { conversationDirectRelationWithUser } from './relations/one-to-one/conversation-direct-to-user.relation';
import { conversationGroupMemberTable } from './tables/conversation-group-member.table';
import { chatAttachmentTable } from './tables/chat-attachment.table';
import { aiTable } from './tables/ai.table';

export const drizzleSchema = {
  aiTable,
  userTable,
  conversationDirectTable,
  chatDirectTable,
  conversationGroupTable,
  conversationGroupMemberTable,
  chatGroupTable,
  chatAttachmentTable,
  conversationDirectRelationWithUser,
  conversationDirectRelationWithChatDirect,
  chatDirectRelationWithConversationDirect,
  conversationGroupRelationWithChatGroup,
  chatGroupRelationWithConversationGroup,
};

export const AppSchema = new DrizzleAppSchema(drizzleSchema);
