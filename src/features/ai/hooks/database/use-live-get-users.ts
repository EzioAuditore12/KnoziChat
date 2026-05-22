import { db } from '@/db';

import { useLiveQuery } from '@/db/hooks/use-live-query';

import { conversationGroupTable } from '@/db/tables/conversation-group.table';

export function useGetLiveGroups() {
  return useLiveQuery(
    db
      .select({
        id: conversationGroupTable.id,
        name: conversationGroupTable.name,
        avatar: conversationGroupTable.avatar,
      })
      .from(conversationGroupTable)
  );
}
