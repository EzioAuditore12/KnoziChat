import { db } from '@/db';
import { type Ai, AiInsert, aiTable } from '../tables/ai.table';

export class AiRepository {
  private readonly database = db;
  private readonly table = aiTable;

  public async create(data: AiInsert): Promise<Ai> {
    return await this.database.insert(this.table).values(data).returning().get();
  }
}

export const aiRepository = new AiRepository();
