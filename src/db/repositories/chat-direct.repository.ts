import { db, DbType } from '@/db';

import {
  chatDirectTable,
  type ChatDirect,
  type InsertChatDirect,
} from '../tables/chat-direct.table';
import {
  ChatAttachment,
  chatAttachmentTable,
  InsertChatAttachment,
} from '../tables/chat-attachment.table';
import { and, eq, lte, ne } from 'drizzle-orm';
import { conversationDirectTable } from '../tables/conversation-direct.table';

export class ChatDirectRepository {
  private readonly database: DbType;
  private readonly table = chatDirectTable;
  private readonly conversationTable = conversationDirectTable;
  private readonly attachmentTable = chatAttachmentTable;

  constructor(database: DbType = db) {
    this.database = database;
  }

  public async create(insertChatOneToOne: InsertChatDirect): Promise<ChatDirect> {
    return await this.database.insert(this.table).values(insertChatOneToOne).returning().get();
  }

  public async createMultiple(insertChatOneToOne: InsertChatDirect[]): Promise<void> {
    await this.database.insert(this.table).values(insertChatOneToOne);
  }

  public async updateStatus(id: string, status: ChatDirect['status']): Promise<void> {
    const condition =
      status === 'DELIVERED'
        ? and(eq(this.table.id, id), ne(this.table.status, 'SEEN'))
        : eq(this.table.id, id);

    await this.database.update(this.table).set({ status }).where(condition);
  }

  // in chat-direct.repository.ts
  public async updateConversationWatermark(
    conversationId: string,
    currentUserId: string,
    readUserId: string,
    lastSeenAt: number
  ): Promise<void> {
    const columnToUpdate =
      currentUserId === readUserId ? { myLastSeenAt: lastSeenAt } : { theirLastSeenAt: lastSeenAt };

    await this.database
      .update(this.conversationTable)
      .set(columnToUpdate)
      .where(eq(this.conversationTable.id, conversationId));

    if (currentUserId === readUserId) {
      await this.database
        .update(this.table)
        .set({ status: 'SEEN' })
        .where(
          and(
            eq(this.table.conversationId, conversationId),
            eq(this.table.mode, 'RECEIVED'),
            ne(this.table.status, 'SEEN'),
            lte(this.table.createdAt, lastSeenAt)
          )
        );
      return;
    }

    // Only update local "SEEN" status for messages we sent when the other person reads them.
    if (currentUserId !== readUserId) {
      await this.database
        .update(this.table)
        .set({ status: 'SEEN' })
        .where(
          and(
            eq(this.table.conversationId, conversationId),
            eq(this.table.mode, 'SENT'),
            ne(this.table.status, 'SEEN'),
            lte(this.table.createdAt, lastSeenAt)
          )
        );
    }
  }

  public async createAttachment(
    insertChatAttachment: InsertChatAttachment
  ): Promise<ChatAttachment> {
    return await this.database
      .insert(this.attachmentTable)
      .values(insertChatAttachment)
      .returning()
      .get();
  }
}

export const chatDirectRepository = new ChatDirectRepository();
