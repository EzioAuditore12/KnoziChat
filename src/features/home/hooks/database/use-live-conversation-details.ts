import { desc, eq, sql } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/sqlite-core';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { conversationOneToOneTable } from '@/db/tables/conversation-one-to-one.table';
import { userTable } from '@/db/tables/user.table';
import { conversationGroupTable } from '@/db/tables/conversation-group.table';

import type { ConversationType } from '../../../chat/types/conversation.type';

const direct = db
  .select({
    id: conversationOneToOneTable.id,
    name: userTable.firstName,
    updatedAt: conversationOneToOneTable.updatedAt,
    type: sql<ConversationType>`'direct'`.as('type'),
    userId: conversationOneToOneTable.userId,
  })
  .from(conversationOneToOneTable)
  .innerJoin(userTable, eq(conversationOneToOneTable.userId, userTable.id));

const group = db
  .select({
    id: conversationGroupTable.id,
    name: conversationGroupTable.name,
    updatedAt: conversationGroupTable.updatedAt,
    type: sql<ConversationType>`'group'`.as('type'),
    userId: sql<string>`NULL`.as('userId'), // userId is null for group
  })
  .from(conversationGroupTable);

const query = db
  .select()
  .from(unionAll(direct, group).as('conversations'))
  .orderBy(desc(sql`updated_at`));

export function useLiveConversationDetails(pageSize: number = 20) {
  return useLiveInfiniteQuery({
    query,
    pageSize,
  });
}
