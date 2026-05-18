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
