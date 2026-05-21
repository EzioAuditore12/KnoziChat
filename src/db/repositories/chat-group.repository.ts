import { eq } from 'drizzle-orm';

import { db, DbType } from '@/db';
import { chatGroupTable, type ChatGroup, type InsertChatGroup } from '../tables/chat-group.table';
import { userTable } from '../tables/user.table';
import {
  ChatAttachment,
  chatAttachmentTable,
  InsertChatAttachment,
} from '../tables/chat-attachment.table';

export class ChatGroupRepository {
  private readonly database: DbType;
  private readonly table = chatGroupTable;
  private readonly userTable = userTable;
  private readonly attachmentTable = chatAttachmentTable;

  constructor(database: DbType = db) {
    this.database = database;
  }

  public async create(insertChatGroup: InsertChatGroup): Promise<ChatGroup> {
    return await this.database.insert(this.table).values(insertChatGroup).returning().get();
  }

  public async createMultiple(insertChatGroup: InsertChatGroup[]): Promise<void> {
    await this.database.insert(this.table).values(insertChatGroup);
  }

  public async findOne(id: string): Promise<ChatGroup | undefined> {
    return await this.database.select().from(this.table).where(eq(this.table.id, id)).get();
  }

  async createAttachment(insertChatAttachment: InsertChatAttachment): Promise<ChatAttachment> {
    return await this.database
      .insert(this.attachmentTable)
      .values(insertChatAttachment)
      .returning()
      .get();
  }

  public async getAllWithUser(
    groupId: string
  ): Promise<(ChatGroup & { user: { firstName: string; lastName: string } | null })[]> {
    return await this.database
      .select({
        id: this.table.id,
        conversationId: this.table.conversationId,
        senderId: this.table.senderId,
        content: this.table.content,
        contentType: this.table.contentType,
        status: this.table.status,
        systemEventType: this.table.systemEventType,
        metadata: this.table.metadata,
        deletedAt: this.table.deletedAt,
        deletedBy: this.table.deletedBy,
        createdAt: this.table.createdAt,
        updatedAt: this.table.updatedAt,
        user: {
          firstName: this.userTable.firstName,
          lastName: this.userTable.lastName,
        },
      })
      .from(chatGroupTable)
      .leftJoin(userTable, eq(chatGroupTable.senderId, userTable.id))
      .where(eq(chatGroupTable.conversationId, groupId));
  }

  public async updateAttachmentProgress(
    id: string,
    transferredBytes: number,
    totalBytes: number
  ): Promise<void> {
    await this.database
      .update(this.attachmentTable)
      .set({ transferredBytes })
      .where(eq(this.attachmentTable.id, id));
  }

  public async updateAttachmentStatus(
    id: string,
    status: ChatAttachment['transferStatus'],
    remoteUrl?: string
  ): Promise<void> {
    const updateData: Partial<ChatAttachment> = { transferStatus: status };
    if (remoteUrl) updateData.remoteUrl = remoteUrl;

    await this.database
      .update(this.attachmentTable)
      .set(updateData)
      .where(eq(this.attachmentTable.id, id));
  }

  public async updateStatus(id: string, status: ChatGroup['status']): Promise<void> {
    await this.database.update(this.table).set({ status }).where(eq(this.table.id, id));
  }
}

export const chatGroupRepository = new ChatGroupRepository();
