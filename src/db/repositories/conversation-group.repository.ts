import { eq } from 'drizzle-orm';

import { db } from '@/db';
import {
  conversationGroupTable,
  type ConversationGroup,
  type InsertConversationGroup,
} from '../tables/conversation-group.table';

export class ConversationGroupRepository {
  private readonly database = db;
  private readonly table = conversationGroupTable;

  public async create(
    insertConversationGroup: InsertConversationGroup
  ): Promise<ConversationGroup> {
    return await this.database.insert(this.table).values(insertConversationGroup).returning().get();
  }

  public async findOne(id: string): Promise<ConversationGroup | undefined> {
    return await this.database.select().from(this.table).where(eq(this.table.id, id)).get();
  }
}

export const conversationGroupRepository = new ConversationGroupRepository();
