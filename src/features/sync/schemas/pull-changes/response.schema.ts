import { type } from 'arktype';

import { createChangesSchema } from '../create-change.schema';

import { userSyncSchema } from '../sync-tables/user-sync.schema';
import { conversationDirectSyncSchema } from '../sync-tables/conversation-direct-sync.schema';
import { conversationGroupSyncSchema } from '../sync-tables/conversation-group-sync.schema';
import { chatDirectSyncSchema } from '../sync-tables/chat-direct-sync.schema';
import { chatGroupSyncSchema } from '../sync-tables/chat-group-sync.schema';
import { chatAttachmentSyncSchema } from '../sync-tables/chat-attachment-sync.schema';
import { conversationGroupMemberSyncSchema } from '../sync-tables/conversation-group-member.schema';

const userChangeSchema = createChangesSchema(userSyncSchema);

const conversationDirectChangeSchema = createChangesSchema(conversationDirectSyncSchema);

const conversationGroupChangeSchema = createChangesSchema(conversationGroupSyncSchema);

const conversationGroupMembersChangeSchema = createChangesSchema(conversationGroupMemberSyncSchema);

const chatDirectChangeSchema = createChangesSchema(chatDirectSyncSchema);

const chatGroupChangeSchema = createChangesSchema(chatGroupSyncSchema);

const chatAttachmentChangeSchema = createChangesSchema(chatAttachmentSyncSchema);

export const pullChangesResponseSchema = type({
  timestamp: 'number',
  changes: {
    user: userChangeSchema,
    conversationDirect: conversationDirectChangeSchema,
    conversationGroup: conversationGroupChangeSchema,
    conversationGroupMembers: conversationGroupMembersChangeSchema,
    chatsDirect: chatDirectChangeSchema,
    chatsGroup: chatGroupChangeSchema,
    chatsAttachments: chatAttachmentChangeSchema,
  },
});

export type PullChangesResponse = typeof pullChangesResponseSchema.infer;
