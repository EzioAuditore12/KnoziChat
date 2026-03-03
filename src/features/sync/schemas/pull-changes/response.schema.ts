import { type } from 'arktype';
import { createChangesSchema } from '../create-change.schema';
import { selectUserSchema } from '@/db/tables/user.table';
import { selectConversationOneToOneSchema } from '@/db/tables/conversation-one-to-one.table';
import { selectChatOneToOneSchema } from '@/db/tables/chat-one-to-one.table';

const userChangeSchema = createChangesSchema(selectUserSchema);

const conversationOneToOneChangeSchema = createChangesSchema(selectConversationOneToOneSchema);

const chatOneToOneChangeSchema = createChangesSchema(selectChatOneToOneSchema);

export const pullChangesResponseSchema = type({
  timestamp: 'number',
  changes: {
    user: userChangeSchema,
    conversationOneToOne: conversationOneToOneChangeSchema,
    chatsOneToOne: chatOneToOneChangeSchema,
  },
});

export type PullChangesResponse = typeof pullChangesResponseSchema.infer;
