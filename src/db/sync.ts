import { eq, inArray } from 'drizzle-orm';

import { db } from '@/db';

import { pullChangesApi } from '@/features/sync/api/pull-changes.api';
import { useDeviceConfigStore } from '@/store/device';

import { userTable } from '@/db/tables/user.table';
import { conversationOneToOneTable } from '@/db/tables/conversation-one-to-one.table';
import { chatOneToOneTable } from '@/db/tables/chat-one-to-one.table';

export async function pullChanges() {
  const lastSyncedAt = useDeviceConfigStore.getState().lastSyncedAt;

  await db.transaction(async (transaction) => {
    const { changes, timestamp } = await pullChangesApi({
      lastSyncedAt,
      tableNames: ['CHAT-ONE-TO-ONE', 'CONVERSATION-ONE-TO-ONE', 'USER'],
    });

    if (changes.user.created.length > 0) {
      // Filter out users that already exist
      const existingUsers = await transaction
        .select({ id: userTable.id })
        .from(userTable)
        .where(
          // Assuming 'inArray' is available in your ORM
          inArray(
            userTable.id,
            changes.user.created.map((u) => u.id)
          )
        );
      const existingIds = new Set(existingUsers.map((u) => u.id));
      const newUsers = changes.user.created.filter((u) => !existingIds.has(u.id));
      if (newUsers.length > 0) {
        await transaction.insert(userTable).values(newUsers);
      }
    }
    if (changes.user.updated.length > 0) {
      for (const user of changes.user.updated) {
        await transaction.update(userTable).set(user).where(eq(userTable.id, user.id));
      }
    }

    if (changes.conversationOneToOne.created.length > 0) {
      // Batch check for existing conversations
      const existingConversations = await transaction
        .select({ id: conversationOneToOneTable.id })
        .from(conversationOneToOneTable)
        .where(
          inArray(
            conversationOneToOneTable.id,
            changes.conversationOneToOne.created.map((c) => c.id)
          )
        );
      const existingConversationIds = new Set(existingConversations.map((c) => c.id));
      const newConversations = changes.conversationOneToOne.created.filter(
        (c) => !existingConversationIds.has(c.id)
      );
      if (newConversations.length > 0) {
        await transaction.insert(conversationOneToOneTable).values(newConversations);
      }
    }

    if (changes.conversationOneToOne.updated.length > 0) {
      for (const conversationOneToOne of changes.conversationOneToOne.updated) {
        await transaction
          .update(conversationOneToOneTable)
          .set(conversationOneToOne)
          .where(eq(conversationOneToOneTable.id, conversationOneToOne.id));
      }
    }

    if (changes.chatsOneToOne.created.length > 0) {
      // Batch check for existing chats
      const existingChats = await transaction
        .select({ id: chatOneToOneTable.id })
        .from(chatOneToOneTable)
        .where(
          inArray(
            chatOneToOneTable.id,
            changes.chatsOneToOne.created.map((c) => c.id)
          )
        );
      const existingChatIds = new Set(existingChats.map((c) => c.id));
      const newChats = changes.chatsOneToOne.created.filter((c) => !existingChatIds.has(c.id));
      if (newChats.length > 0) {
        await transaction.insert(chatOneToOneTable).values(newChats);
      }
    }
    if (changes.chatsOneToOne.updated.length > 0) {
      for (const chatsOneToOne of changes.chatsOneToOne.updated) {
        await transaction
          .update(chatOneToOneTable)
          .set(chatsOneToOne)
          .where(eq(chatOneToOneTable.id, chatsOneToOne.id));
      }
    }

    useDeviceConfigStore.getState().updateLastSynedAt(timestamp);
  });
}
