import { conversationOneToOneTable } from '@/db/tables/conversation-one-to-one.table';
import { userTable } from '@/db/tables/user.table';
import { relations } from 'drizzle-orm';

export const conversationOneToOneRelationWithUser = relations(
  conversationOneToOneTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [conversationOneToOneTable.userId],
      references: [userTable.id],
    }),
  })
);
