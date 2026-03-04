import { DrizzleAppSchema } from '@powersync/drizzle-driver';

import { userTable } from './tables/user.table';
import {
  conversationOneToOneRelationWithChatOneToOne,
  conversationOneToOneRelationWithUser,
  conversationOneToOneTable,
} from './tables/conversation-one-to-one.table';
import {
  chatOneToOneRelationWithConversationOneToOne,
  chatOneToOneTable,
} from './tables/chat-one-to-one.table';
import {
  conversationGroupRelationWithChatGroup,
  conversationGroupTable,
} from './tables/conversation-group.table';
import { chatGroupRelationWithConversationGroup, chatGroupTable } from './tables/chat-group.table';

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
