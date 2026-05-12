import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { type InsertUser, type User, userTable } from '../tables/user.table';

export class UserRepository {
  private readonly database = db;
  private readonly table = userTable;

  public async create(insertUser: InsertUser): Promise<User> {
    return await this.database.insert(this.table).values(insertUser).returning().get();
  }

  public async get(id: string): Promise<User | undefined> {
    return await this.database.select().from(this.table).where(eq(this.table.id, id)).get();
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
}

export const userRepository = new UserRepository();
