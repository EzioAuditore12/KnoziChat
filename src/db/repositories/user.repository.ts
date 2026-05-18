import { db, type DbType } from '@/db';
import { eq, inArray } from 'drizzle-orm';
import { type InsertUser, type User, userTable } from '../tables/user.table';

export class UserRepository {
  private readonly database: DbType;
  private readonly table = userTable;

  constructor(database: DbType = db) {
    this.database = database;
  }

  public async create(insertUser: InsertUser): Promise<User> {
    return await this.database.insert(this.table).values(insertUser).returning().get();
  }

  public async createMultiple(insertUser: InsertUser[]): Promise<void> {
    await this.database.insert(this.table).values(insertUser);
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

  public async getManyById(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return [];
    return await this.database.select().from(this.table).where(inArray(this.table.id, ids)).all();
  }

  public async createMany(users: InsertUser[]): Promise<User[]> {
    if (users.length === 0) return [];
    return await this.database.insert(this.table).values(users).returning().all();
  }

  public async areExistingManyById(ids: string[]): Promise<string[]> {
    if (ids.length === 0) return [];
    const result = await this.database
      .select({ id: this.table.id })
      .from(this.table)
      .where(inArray(this.table.id, ids))
      .all();

    const foundIds = result.map((c) => c.id);

    return foundIds;
  }

  public async getManyNamesById(ids: string[]): Promise<string[]> {
    const result = await this.database
      .select({ name: this.table.firstName })
      .from(this.table)
      .where(inArray(this.table.id, ids))
      .all();

    const foundNames = result.map((c) => c.name);

    return foundNames;
  }
}

export const userRepository = new UserRepository();
