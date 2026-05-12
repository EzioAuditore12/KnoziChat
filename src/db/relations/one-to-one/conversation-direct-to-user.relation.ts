import { relations } from 'drizzle-orm';

import { conversationDirectTable } from '@/db/tables/conversation-direct.table';
import { userTable } from '@/db/tables/user.table';

export const conversationDirectRelationWithUser = relations(conversationDirectTable, ({ one }) => ({
  user: one(userTable, {
    fields: [conversationDirectTable.userId],
    references: [userTable.id],
  }),
}));
