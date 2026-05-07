import { chatOneToOneTable } from '@/db/tables/chat-one-to-one.table';
import { conversationOneToOneTable } from '@/db/tables/conversation-one-to-one.table';
import { relations } from 'drizzle-orm';

export const conversationOneToOneRelationWithChatOneToOne = relations(
  conversationOneToOneTable,
  ({ many }) => ({
    chatsOneToOne: many(chatOneToOneTable),
  })
);

export const chatOneToOneRelationWithConversationOneToOne = relations(
  chatOneToOneTable,
  ({ one }) => ({
    conversation: one(conversationOneToOneTable, {
      fields: [chatOneToOneTable.conversationId],
      references: [conversationOneToOneTable.id],
    }),
  })
);
