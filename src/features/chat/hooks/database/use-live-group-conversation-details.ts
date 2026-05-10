import { eq } from 'drizzle-orm';

import { useLiveQuery } from '@/db/hooks/use-live-query';

import { db } from '@/db';
import { conversationGroupTable } from '@/db/tables/conversation-group.table';

export function useLiveGroupConversationDetails(id: string) {
  return useLiveQuery(
    db
      .select({
        id: conversationGroupTable.id,
        name: conversationGroupTable.name,
        avatar: conversationGroupTable.avatar,
        createdAt: conversationGroupTable.createdAt,
        updatedAt: conversationGroupTable.updatedAt,
      })
      .from(conversationGroupTable)
      .where(eq(conversationGroupTable.id, id))
      .limit(1)
  );
}
