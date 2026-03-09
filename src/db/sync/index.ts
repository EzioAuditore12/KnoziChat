import { eq, inArray } from 'drizzle-orm';
import type { SQLiteTable, AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

import { db } from '@/db';

import { pullChangesApi } from '@/features/sync/api/pull-changes.api';
import { useDeviceConfigStore } from '@/store/device';

import { userTable } from '@/db/tables/user.table';
import { conversationOneToOneTable } from '@/db/tables/conversation-one-to-one.table';
import { chatOneToOneTable } from '@/db/tables/chat-one-to-one.table';
import { conversationGroupTable } from '../tables/conversation-group.table';
import { chatGroupTable } from '../tables/chat-group.table';
import { PullChangesResponse } from '@/features/sync/schemas/pull-changes/response.schema';

type TransactionType = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class SyncDatabase {
  private readonly database = db;
  private readonly userTable = userTable;
  private readonly conversationOneToOneTable = conversationOneToOneTable;
  private readonly conversationGroupTable = conversationGroupTable;
  private readonly chatOneToOneTable = chatOneToOneTable;
  private readonly chatGroupTable = chatGroupTable;

  public async pullChanges() {
    const lastSyncedAt = this.getLastSyncedAt();

    const { changes, timestamp } = await this.pullChangesRequestApi(lastSyncedAt);

    await this.database.transaction(async (transaction) => {
      await this.synchronizeRecords(transaction, this.userTable, changes.user);

      await this.synchronizeRecords(
        transaction,
        this.conversationOneToOneTable,
        changes.conversationOneToOne
      );

      await this.synchronizeRecords(
        transaction,
        this.conversationGroupTable,
        changes.conversationGroup
      );

      await this.synchronizeRecords(transaction, this.chatOneToOneTable, changes.chatsOneToOne);

      await this.synchronizeRecords(transaction, this.chatGroupTable, changes.chatsGroup);

      this.updateLastSyncedAt(timestamp);
    });
  }

  private async pullChangesRequestApi(lastSyncedAt: number): Promise<PullChangesResponse> {
    return await pullChangesApi({
      lastSyncedAt,
      tableNames: [
        'CHAT-ONE-TO-ONE',
        'CONVERSATION-ONE-TO-ONE',
        'USER',
        'CONVERSATION-GROUP',
        'CHAT-GROUP',
      ],
    });
  }

  private async synchronizeRecords<
    TTable extends SQLiteTable & { id: AnySQLiteColumn<{ data: string }> },
  >(
    transaction: TransactionType,
    table: TTable,
    data: { created: any[]; updated: any[]; deleted: string[] }
  ): Promise<void> {
    await this.insertNewRecords(transaction, table, data.created);
    await this.updateExistingRecords(transaction, table, data.updated);
  }

  private async insertNewRecords<
    TTable extends SQLiteTable & { id: AnySQLiteColumn<{ data: string }> },
  >(transaction: TransactionType, table: TTable, data: any[]): Promise<void> {
    if (!this.isArrayEmpty(data)) {
      const existingRecords = await this.findExistingIds(
        transaction,
        table,
        data.map((d) => d.id)
      );

      const existingIds = new Set(existingRecords.map((u) => u.id));

      const newData = data.filter((u) => !existingIds.has(u.id));

      if (!this.isArrayEmpty(newData)) await transaction.insert(table).values(newData);
    }
  }

  private async updateExistingRecords<
    TTable extends SQLiteTable & { id: AnySQLiteColumn<{ data: string }> },
  >(transaction: TransactionType, table: TTable, data: any[]): Promise<void> {
    if (data.length > 0) {
      for (const record of data) {
        await transaction.update(table).set(record).where(eq(table.id, record.id));
      }
    }
  }

  private async findExistingIds<
    TTable extends SQLiteTable & { id: AnySQLiteColumn<{ data: string }> },
  >(transaction: TransactionType, table: TTable, ids: string[]) {
    if (ids.length === 0) return [];

    return await transaction.select({ id: table.id }).from(table).where(inArray(table.id, ids));
  }

  private getLastSyncedAt(): number {
    return useDeviceConfigStore.getState().lastSyncedAt;
  }

  private updateLastSyncedAt(timestamp: number): void {
    useDeviceConfigStore.getState().updateLastSynedAt(timestamp);
  }

  private isArrayEmpty(data: any[]): boolean {
    if (data.length > 0) return false;
    return true;
  }
}

export const syncDatabase = new SyncDatabase();
