import { PowerSyncSQLiteDatabase } from '@powersync/drizzle-driver';
import { sql } from 'drizzle-orm';

import { chatOneToOneTable, CHAT_ONE_TO_ONE_TABLE_NAME } from '@/db/tables/chat-one-to-one.table';
import { chatGroupTable, CHAT_GROUP_TABLE_NAME } from '@/db/tables/chat-group.table';

const FTS_ONE_TO_ONE_TABLE = 'chat_one_to_one_fts';
const FTS_GROUP_TABLE = 'chat_group_fts';

export async function setupFts<T extends Record<string, unknown>>(db: PowerSyncSQLiteDatabase<T>) {
  // --- One-to-one FTS Setup ---
  await db.run(
    sql.raw(`
      CREATE VIRTUAL TABLE IF NOT EXISTS ${FTS_ONE_TO_ONE_TABLE}
      USING fts5(
        id UNINDEXED,
        text
      );
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_one_to_one_ai
      INSTEAD OF INSERT ON ${CHAT_ONE_TO_ONE_TABLE_NAME}
      BEGIN
        INSERT INTO ${FTS_ONE_TO_ONE_TABLE}(id, text)
        VALUES (new.id, new.text);
      END;
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_one_to_one_ad
      INSTEAD OF DELETE ON ${CHAT_ONE_TO_ONE_TABLE_NAME}
      BEGIN
        DELETE FROM ${FTS_ONE_TO_ONE_TABLE} WHERE id = old.id;
      END;
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_one_to_one_au
      INSTEAD OF UPDATE ON ${CHAT_ONE_TO_ONE_TABLE_NAME}
      BEGIN
        UPDATE ${FTS_ONE_TO_ONE_TABLE} SET text = new.text WHERE id = old.id;
      END;
    `)
  );

  await db.run(
    sql.raw(`
      INSERT INTO ${FTS_ONE_TO_ONE_TABLE}(id, text)
      SELECT id, text
      FROM ${CHAT_ONE_TO_ONE_TABLE_NAME}
      WHERE id NOT IN (
        SELECT id FROM ${FTS_ONE_TO_ONE_TABLE}
      );
    `)
  );

  // --- Group FTS Setup ---
  await db.run(
    sql.raw(`
      CREATE VIRTUAL TABLE IF NOT EXISTS ${FTS_GROUP_TABLE}
      USING fts5(
        id UNINDEXED,
        text
      );
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_group_ai
      INSTEAD OF INSERT ON ${CHAT_GROUP_TABLE_NAME}
      BEGIN
        INSERT INTO ${FTS_GROUP_TABLE}(id, text)
        VALUES (new.id, new.text);
      END;
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_group_ad
      INSTEAD OF DELETE ON ${CHAT_GROUP_TABLE_NAME}
      BEGIN
        DELETE FROM ${FTS_GROUP_TABLE} WHERE id = old.id;
      END;
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_group_au
      INSTEAD OF UPDATE ON ${CHAT_GROUP_TABLE_NAME}
      BEGIN
        UPDATE ${FTS_GROUP_TABLE} SET text = new.text WHERE id = old.id;
      END;
    `)
  );

  await db.run(
    sql.raw(`
      INSERT INTO ${FTS_GROUP_TABLE}(id, text)
      SELECT id, text
      FROM ${CHAT_GROUP_TABLE_NAME}
      WHERE id NOT IN (
        SELECT id FROM ${FTS_GROUP_TABLE}
      );
    `)
  );
}

export async function searchChatMessages<T extends Record<string, unknown>>(
  db: PowerSyncSQLiteDatabase<T>,
  search: string,
  currentUserId: string,
  limit: number = 20,
  offset: number = 0
) {
  const result = await db.run(sql`
    WITH direct_matches AS (
      SELECT 
        m.id as id,
        c.id as conversationId,
        u.first_name as name,
        m.created_at as updatedAt,
        'direct' as type,
        u.id as userId,
        CASE 
          WHEN m.mode = 'SENT' THEN 'You: ' || m.text
          ELSE m.text
        END as lastMessage
      FROM chat_one_to_one m
      INNER JOIN conversation_one_to_one c ON m.conversation_id = c.id
      INNER JOIN user u ON c.user_id = u.id
      WHERE m.id IN (
        SELECT id
        FROM ${sql.raw(FTS_ONE_TO_ONE_TABLE)}
        WHERE ${sql.raw(FTS_ONE_TO_ONE_TABLE)} MATCH ${search}
      )
    ),
    group_matches AS (
      SELECT 
        m.id as id,
        c.id as conversationId,
        c.name as name,
        m.created_at as updatedAt,
        'group' as type,
        NULL as userId,
        CASE 
          WHEN m.sender_id = ${currentUserId} THEN 'You: ' || m.text
          ELSE IFNULL(u.first_name, 'Unknown') || ': ' || m.text
        END as lastMessage
      FROM chat_group m
      INNER JOIN conversation_group c ON m.conversation_id = c.id
      LEFT JOIN user u ON m.sender_id = u.id
      WHERE m.id IN (
        SELECT id
        FROM ${sql.raw(FTS_GROUP_TABLE)}
        WHERE ${sql.raw(FTS_GROUP_TABLE)} MATCH ${search}
      )
    )
    SELECT * FROM direct_matches
    UNION ALL
    SELECT * FROM group_matches
    ORDER BY updatedAt DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return result.rows?._array ?? [];
}
