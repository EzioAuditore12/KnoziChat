import { relations } from 'drizzle-orm';

import { chatDirectTable } from '@/db/tables/chat-direct.table';
import { conversationDirectTable } from '@/db/tables/conversation-direct.table';

export const conversationDirectRelationWithChatDirect = relations(
  conversationDirectTable,
  ({ many }) => ({
    chatsDirect: many(chatDirectTable),
  })
);

export const chatDirectRelationWithConversationDirect = relations(chatDirectTable, ({ one }) => ({
  conversation: one(conversationDirectTable, {
    fields: [chatDirectTable.conversationId],
    references: [conversationDirectTable.id],
  }),
}));
