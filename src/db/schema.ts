import { DrizzleAppSchema } from '@powersync/drizzle-driver';

import { chatGroupTable } from './tables/chat-group.table';
import { chatOneToOneTable } from './tables/chat-one-to-one.table';
import { conversationGroupTable } from './tables/conversation-group.table';
import { conversationOneToOneTable } from './tables/conversation-one-to-one.table';
import { userTable } from './tables/user.table';

import {
  chatGroupRelationWithConversationGroup,
  conversationGroupRelationWithChatGroup,
} from './relations/one-to-many/conversation-group-to-chat-group.relation';
import {
  chatOneToOneRelationWithConversationOneToOne,
  conversationOneToOneRelationWithChatOneToOne,
} from './relations/one-to-many/conversation-one-to-one-to-chat-one-to-one.relation';
import { conversationOneToOneRelationWithUser } from './relations/one-to-one/conversation-one-to-one-to-user.relation';

export const drizzleSchema = {
  userTable,
  conversationOneToOneTable,
  chatOneToOneTable,
  conversationGroupTable,
  chatGroupTable,
  conversationOneToOneRelationWithUser,
  conversationOneToOneRelationWithChatOneToOne,
  chatOneToOneRelationWithConversationOneToOne,
  conversationGroupRelationWithChatGroup,
  chatGroupRelationWithConversationGroup,
};

export const AppSchema = new DrizzleAppSchema(drizzleSchema);
