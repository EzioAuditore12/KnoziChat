import { and, desc, eq, ne } from 'drizzle-orm';

import { db } from '@/db';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { chatAttachmentTable } from '@/db/tables/chat-attachment.table';
import { chatDirectTable } from '@/db/tables/chat-direct.table';

export function useLiveGetDirectChatMedia({
  id,
  pageSize = 10,
}: {
  id: string;
  pageSize?: number;
}) {
  return useLiveInfiniteQuery({
    query: db
      .select({
        id: chatDirectTable.id,
        contentType: chatDirectTable.contentType,
        remoteUrl: chatAttachmentTable.remoteUrl,
        localUri: chatAttachmentTable.localUri,
        thumbnailUri: chatAttachmentTable.thumbnailUri,
        status: chatDirectTable.status,
        transferStatus: chatAttachmentTable.transferStatus,
        createdAt: chatDirectTable.createdAt,
      })
      .from(chatDirectTable)
      .leftJoin(chatAttachmentTable, eq(chatAttachmentTable.id, chatDirectTable.id))
      .where(and(eq(chatDirectTable.conversationId, id), ne(chatDirectTable.contentType, 'text')))
      .orderBy(desc(chatDirectTable.createdAt)),
    pageSize,
  });
}

export type UseLiveGetDirectChatMediaReturn = ReturnType<typeof useLiveGetDirectChatMedia>;
export type DirectChatMediaItem = NonNullable<UseLiveGetDirectChatMediaReturn['data']>[number];
