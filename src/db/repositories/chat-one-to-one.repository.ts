import { db } from '@/db';
import {
  type ChatOneToOne,
  chatOneToOneTable,
  type InsertChatOneToOne,
} from '../tables/chat-one-to-one.table';

export class ChatOneToOneRepository {
  private readonly database = db;
  private readonly table = chatOneToOneTable;

  async create(insertChatOneToOne: InsertChatOneToOne): Promise<ChatOneToOne> {
    return await this.database.insert(this.table).values(insertChatOneToOne).returning().get();
  }
}

export const chatOneToOneRepository = new ChatOneToOneRepository();
