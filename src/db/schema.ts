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

export const drizzleSchema = {
  userTable,
  conversationOneToOneTable,
  chatOneToOneTable,
  conversationOneToOneRelationWithUser,
  conversationOneToOneRelationWithChatOneToOne,
  chatOneToOneRelationWithConversationOneToOne,
};

export const AppSchema = new DrizzleAppSchema(drizzleSchema);
