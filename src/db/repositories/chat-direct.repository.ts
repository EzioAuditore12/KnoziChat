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
import { and, eq, inArray, ne } from 'drizzle-orm';

export class ChatDirectRepository {
  private readonly database: DbType;
  private readonly table = chatDirectTable;
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
    await this.database.update(this.table).set({ status }).where(eq(this.table.id, id));
  }

  public async markConversationAsSeen(conversationId: string): Promise<void> {
    await this.database
      .update(this.table)
      .set({
        status: 'SEEN',
      })
      .where(
        and(
          eq(this.table.conversationId, conversationId),

          eq(this.table.mode, 'SENT'),

          ne(this.table.status, 'SEEN')
        )
      );
  }

  public async markMessagesAsSeen(messageIds: string[]): Promise<void> {
    if (!messageIds || messageIds.length === 0) return;
    await this.database
      .update(this.table)
      .set({
        status: 'SEEN',
      })
      .where(and(inArray(this.table.id, messageIds), ne(this.table.status, 'SEEN')));
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
