import { db } from '@/db';
import {
  chatDirectTable,
  type ChatDirect,
  type InsertChatDirect,
} from '../tables/chat-direct.table';

export class ChatDirectRepository {
  private readonly database = db;
  private readonly table = chatDirectTable;

  async create(insertChatOneToOne: InsertChatDirect): Promise<ChatDirect> {
    return await this.database.insert(this.table).values(insertChatOneToOne).returning().get();
  }
}

export const chatDirectRepository = new ChatDirectRepository();
