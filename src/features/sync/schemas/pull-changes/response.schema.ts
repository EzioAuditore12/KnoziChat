import { type } from 'arktype';

import { chatDirectSchema } from '@/db/tables/chat-direct.table';
import { chatGroupSchema } from '@/db/tables/chat-group.table';
import { conversationDirectSchema } from '@/db/tables/conversation-direct.table';
import { conversationGroupSchema } from '@/db/tables/conversation-group.table';
import { selectUserSchema } from '@/db/tables/user.table';

import { createChangesSchema } from '../create-change.schema';

const userChangeSchema = createChangesSchema(selectUserSchema);

const conversationOneToOneChangeSchema = createChangesSchema(conversationDirectSchema);

const conversationGroupChangeSchema = createChangesSchema(conversationGroupSchema);

const chatOneToOneChangeSchema = createChangesSchema(chatDirectSchema);

const chatGroupChangeSchema = createChangesSchema(chatGroupSchema);

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
