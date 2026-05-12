import { db } from '@/db';
import { desc, eq } from 'drizzle-orm';
import {
  conversationDirectTable,
  type ConversationDirect,
  type InsertConversationDirect,
} from '../tables/conversation-direct.table';
import { userTable } from '../tables/user.table';

export class ConversationDirectRepository {
  private readonly database = db;
  private readonly table = conversationDirectTable;
  private readonly userTable = userTable;

  public async create(
    insertConversationOneToOne: InsertConversationDirect
  ): Promise<ConversationDirect> {
    return await this.database
      .insert(this.table)
      .values(insertConversationOneToOne)
      .returning()
      .get();
  }

  public async get(id: string): Promise<ConversationDirect | undefined> {
    return await this.database.select().from(this.table).where(eq(this.table, id)).get();
  }

  public async getByUserId(userId: string): Promise<ConversationDirect | undefined> {
    return await this.database.select().from(this.table).where(eq(this.table.userId, userId)).get();
  }

  public async updateTime(id: string, time: number) {
    await this.database.update(this.table).set({ updatedAt: time }).where(eq(this.table.id, id));
  }

  public async getConversationsWithUser() {
    return await this.database
      .select()
      .from(this.table)
      .leftJoin(userTable, eq(this.table.userId, this.userTable.id))
      .orderBy(desc(this.table.updatedAt));
  }

  public async isExistingConversationWithUser(userId: string): Promise<boolean> {
    const result = await this.database
      .select({ id: this.table.id })
      .from(this.table)
      .where(eq(this.table.userId, userId))
      .get();

    if (!result) return false;

    return true;
  }
}

export const conversationDirectRepository = new ConversationDirectRepository();
