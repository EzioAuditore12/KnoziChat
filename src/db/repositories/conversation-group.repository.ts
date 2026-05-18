import { eq } from 'drizzle-orm';

import { db, DbType } from '@/db';
import {
  conversationGroupTable,
  UpdateConversationGroup,
  type ConversationGroup,
  type InsertConversationGroup,
} from '../tables/conversation-group.table';
import {
  conversationGroupMemberTable,
  InsertConversationGroupMember,
} from '../tables/conversation-group-member.table';

export class ConversationGroupRepository {
  private readonly database: DbType;
  private readonly table = conversationGroupTable;
  private readonly memberTable = conversationGroupMemberTable;

  constructor(database: DbType = db) {
    this.database = database;
  }

  public async create(
    insertConversationGroup: InsertConversationGroup
  ): Promise<ConversationGroup> {
    return await this.database.insert(this.table).values(insertConversationGroup).returning().get();
  }

  public async createMultiple(insertConversationGroup: InsertConversationGroup[]): Promise<void> {
    await this.database.insert(this.table).values(insertConversationGroup);
  }

  public async findOne(id: string): Promise<ConversationGroup | undefined> {
    return await this.database.select().from(this.table).where(eq(this.table.id, id)).get();
  }

  public async update(id: string, updateConversationGroup: Omit<UpdateConversationGroup, 'id'>) {
    await this.database
      .update(this.table)
      .set(updateConversationGroup)
      .where(eq(this.table.id, id));
  }

  public async isExisting(id: string): Promise<boolean> {
    const result = await this.database
      .select({ id: this.table.id })
      .from(this.table)
      .where(eq(this.table.id, id))
      .get();

    if (!result) return false;

    return true;
  }

  public async insertMultipleMembers(
    insertGroupMembers: InsertConversationGroupMember[]
  ): Promise<void> {
    if (insertGroupMembers.length === 0) return;
    await this.database.insert(this.memberTable).values(insertGroupMembers);
  }
}

export const conversationGroupRepository = new ConversationGroupRepository();
