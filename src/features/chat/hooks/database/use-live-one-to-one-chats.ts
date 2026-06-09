import { useMemo } from 'react';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/db';

import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { chatDirectTable } from '@/db/tables/chat-direct.table';
import { chatAttachmentTable } from '@/db/tables/chat-attachment.table';

import { formatChatDate } from '@/features/chat/utils/format-chat-date';

interface UseLiveOneToOneChatsOptions {
  id: string;

  pageSize?: number;
}

export function useLiveDirectChats({ id, pageSize = 20 }: UseLiveOneToOneChatsOptions) {
  const query = useLiveInfiniteQuery({
    query: db
      .select({
        id: chatDirectTable.id,
        conversationId: chatDirectTable.conversationId,
        contentType: chatDirectTable.contentType,
        content: chatDirectTable.content,
        mode: chatDirectTable.mode,
        status: chatDirectTable.status,
        createdAt: chatDirectTable.createdAt,
        updatedAt: chatDirectTable.updatedAt,
        deletedAt: chatDirectTable.deletedAt,

        attachment: chatAttachmentTable,
      })
      .from(chatDirectTable)
      .leftJoin(chatAttachmentTable, eq(chatAttachmentTable.id, chatDirectTable.id))
      .where(eq(chatDirectTable.conversationId, id))
      .orderBy(desc(chatDirectTable.createdAt)),

    pageSize,
  });

  const groupedMessages = useMemo(() => {
    const groups: Record<string, typeof query.data> = {};

    for (const item of query.data) {
      const date = formatChatDate(item.createdAt);

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(item);
    }

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      data: messages,
    }));
  }, [query]);

  return {
    ...query,
    groupedMessages,
  };
}
