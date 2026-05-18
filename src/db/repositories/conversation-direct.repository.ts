import { db, DbType } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { chatDirectTable } from '../tables/chat-direct.table';
import {
  conversationDirectTable,
  type ConversationDirect,
  type InsertConversationDirect,
} from '../tables/conversation-direct.table';
import { userTable } from '../tables/user.table';

export class ConversationDirectRepository {
  private readonly database: DbType;
  private readonly table = conversationDirectTable;
  private readonly userTable = userTable;

  constructor(database: DbType = db) {
    this.database = database;
  }

  public async create(
    insertConversationOneToOne: InsertConversationDirect
  ): Promise<ConversationDirect> {
    return await this.database
      .insert(this.table)
      .values(insertConversationOneToOne)
      .returning()
      .get();
  }

  public async createMultiple(insertConversationDirect: InsertConversationDirect[]): Promise<void> {
    await this.database.insert(this.table).values(insertConversationDirect);
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

  public async getUsersWithExistingChats(): Promise<string[]> {
    const result = await this.database
      .select({ userId: this.table.userId })
      .from(this.table)
      .innerJoin(chatDirectTable, eq(this.table.id, chatDirectTable.conversationId))
      .groupBy(this.table.userId);
    return result.map((r) => r.userId);
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
