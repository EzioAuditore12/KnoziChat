import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { chatGroupTable, type ChatGroup, type InsertChatGroup } from '../tables/chat-group.table';
import { userTable } from '../tables/user.table';

export class ChatGroupRepository {
  private readonly database = db;
  private readonly table = chatGroupTable;
  private readonly userTable = userTable;

  public async create(insertChatGroup: InsertChatGroup): Promise<ChatGroup> {
    return await this.database.insert(this.table).values(insertChatGroup).returning().get();
  }

  public async findOne(id: string): Promise<ChatGroup | undefined> {
    return await this.database.select().from(this.table).where(eq(this.table.id, id)).get();
  }

  public async getAllWithUser(
    groupId: string
  ): Promise<(ChatGroup & { user: { firstName: string; lastName: string } | null })[]> {
    return await this.database
      .select({
        id: chatGroupTable.id,
        conversationId: chatGroupTable.conversationId,
        senderId: chatGroupTable.senderId,
        text: chatGroupTable.text,
        deliveredTo: chatGroupTable.deliveredTo,
        seenBy: chatGroupTable.seenBy,
        deletedAt: chatGroupTable.deletedAt,
        deletedBy: chatGroupTable.deletedBy,
        createdAt: chatGroupTable.createdAt,
        updatedAt: chatGroupTable.updatedAt,
        user: {
          firstName: this.userTable.firstName,
          lastName: this.userTable.lastName,
        },
      })
      .from(chatGroupTable)
      .leftJoin(userTable, eq(chatGroupTable.senderId, userTable.id))
      .where(eq(chatGroupTable.conversationId, groupId));
  }
}

export const chatGroupRepository = new ChatGroupRepository();
