import { db } from '@/db';
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
  private readonly database = db;
  private readonly table = chatDirectTable;
  private readonly attachmentTable = chatAttachmentTable;

  async create(insertChatOneToOne: InsertChatDirect): Promise<ChatDirect> {
    return await this.database.insert(this.table).values(insertChatOneToOne).returning().get();
  }

  async createAttachment(insertChatAttachment: InsertChatAttachment): Promise<ChatAttachment> {
    return await this.database
      .insert(this.attachmentTable)
      .values(insertChatAttachment)
      .returning()
      .get();
  }
}

export const chatDirectRepository = new ChatDirectRepository();
