import { type } from 'arktype';
import { createChangesSchema } from '../create-change.schema';
import { selectUserSchema } from '@/db/tables/user.table';
import { selectConversationOneToOneSchema } from '@/db/tables/conversation-one-to-one.table';
import { selectChatOneToOneSchema } from '@/db/tables/chat-one-to-one.table';
import { selectConversationGroupSchema } from '@/db/tables/conversation-group.table';
import { selectChatGroupSchema } from '@/db/tables/chat-group.table';

const userChangeSchema = createChangesSchema(selectUserSchema);

const conversationOneToOneChangeSchema = createChangesSchema(selectConversationOneToOneSchema);

const conversationGroupChangeSchema = createChangesSchema(selectConversationGroupSchema);

const chatOneToOneChangeSchema = createChangesSchema(selectChatOneToOneSchema);

const chatGroupChangeSchema = createChangesSchema(selectChatGroupSchema);

export const pullChangesResponseSchema = type({
  timestamp: 'number',
  changes: {
    user: userChangeSchema,
    conversationOneToOne: conversationOneToOneChangeSchema,
    conversationGroup: conversationGroupChangeSchema,
    chatsOneToOne: chatOneToOneChangeSchema,
    chatsGroup: chatGroupChangeSchema,
  },
});

export type PullChangesResponse = typeof pullChangesResponseSchema.infer;
