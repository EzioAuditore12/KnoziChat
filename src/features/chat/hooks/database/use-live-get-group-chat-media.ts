import { and, desc, eq, ne } from 'drizzle-orm';

import { db } from '@/db';
import { useLiveInfiniteQuery } from '@/db/hooks/use-live-infinite-query';

import { chatAttachmentTable } from '@/db/tables/chat-attachment.table';
import { chatGroupTable } from '@/db/tables/chat-group.table';

export function useLiveGetGroupChatMedia({ id, pageSize = 10 }: { id: string; pageSize?: number }) {
  return useLiveInfiniteQuery({
    query: db
      .select({
        id: chatGroupTable.id,
        contentType: chatGroupTable.contentType,
        remoteUrl: chatAttachmentTable.remoteUrl,
        localUri: chatAttachmentTable.localUri,
        thumbnailUri: chatAttachmentTable.thumbnailUri,
        status: chatGroupTable.status,
        transferStatus: chatAttachmentTable.transferStatus,
        createdAt: chatGroupTable.createdAt,
      })
      .from(chatGroupTable)
      .leftJoin(chatAttachmentTable, eq(chatAttachmentTable.id, chatGroupTable.id))
      .where(
        and(
          eq(chatGroupTable.conversationId, id),
          ne(chatGroupTable.contentType, 'text'),
          ne(chatGroupTable.contentType, 'system')
        )
      )
      .orderBy(desc(chatGroupTable.createdAt)),
    pageSize,
  });
}

export type UseLiveGetGroupChatMediaReturn = ReturnType<typeof useLiveGetGroupChatMedia>;
export type GroupChatMediaItem = NonNullable<UseLiveGetGroupChatMediaReturn['data']>[number];
