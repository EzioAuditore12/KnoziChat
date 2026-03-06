import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { chatGroupTable, type ChatGroup, type InsertChatGroup } from '../tables/chat-group.table';

export class ChatGroupRepository {
  private readonly database = db;
  private readonly table = chatGroupTable;

  public async create(insertChatGroup: InsertChatGroup): Promise<ChatGroup> {
    return await this.database.insert(this.table).values(insertChatGroup).returning().get();
  }

  public async findOne(id: string): Promise<ChatGroup | undefined> {
    return await this.database.select().from(this.table).where(eq(this.table.id, id)).get();
  }
}

export const chatGroupRepository = new ChatGroupRepository();
