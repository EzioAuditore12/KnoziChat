import { relations } from 'drizzle-orm';

import { chatGroupTable } from '@/db/tables/chat-group.table';
import { conversationGroupTable } from '@/db/tables/conversation-group.table';

export const conversationGroupRelationWithChatGroup = relations(
  conversationGroupTable,
  ({ many }) => ({
    chatsGroup: many(chatGroupTable),
  })
);

export const chatGroupRelationWithConversationGroup = relations(chatGroupTable, ({ one }) => ({
  conversation: one(conversationGroupTable, {
    fields: [chatGroupTable.conversationId],
    references: [conversationGroupTable.id],
  }),
}));
