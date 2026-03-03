import { db } from '@/db';
import { type InsertUser, type User, userTable } from '../tables/user.table';
import { eq } from 'drizzle-orm';

export class UserRepository {
  private readonly database = db;
  private readonly table = userTable;

  public async create(insertUser: InsertUser): Promise<User> {
    return await this.database.insert(this.table).values(insertUser).returning().get();
  }

  public async get(id: string): Promise<User | undefined> {
    return await this.database.select().from(this.table).where(eq(this.table.id, id)).get();
  }
}

export const userRepository = new UserRepository();
