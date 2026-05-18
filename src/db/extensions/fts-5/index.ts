import { PowerSyncSQLiteDatabase } from '@powersync/drizzle-driver';
import { sql } from 'drizzle-orm';

import { CHAT_DIRECT_TABLE_NAME } from '@/db/tables/chat-direct.table';
import { CHAT_GROUP_TABLE_NAME } from '@/db/tables/chat-group.table';

const FTS_DIRECT_TABLE_NAME = 'chat_direct_fts';
const FTS_GROUP_TABLE_NAME = 'chat_group_fts';

export async function setupFts<T extends Record<string, unknown>>(db: PowerSyncSQLiteDatabase<T>) {
  // --- One-to-one FTS Setup ---
  await db.run(
    sql.raw(`
      CREATE VIRTUAL TABLE IF NOT EXISTS ${FTS_DIRECT_TABLE_NAME}
      USING fts5(
        id UNINDEXED,
        content
      );
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_direct_ai
      INSTEAD OF INSERT ON ${CHAT_DIRECT_TABLE_NAME}
      WHEN new.content IS NOT NULL
      BEGIN
        INSERT INTO ${FTS_DIRECT_TABLE_NAME}(id, content)
        VALUES (new.id, new.content);
      END;
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_direct_ad
      INSTEAD OF DELETE ON ${CHAT_DIRECT_TABLE_NAME}
      BEGIN
        DELETE FROM ${FTS_DIRECT_TABLE_NAME} WHERE id = old.id;
      END;
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_direct_au
      INSTEAD OF UPDATE ON ${CHAT_DIRECT_TABLE_NAME}
      BEGIN
        DELETE FROM ${FTS_DIRECT_TABLE_NAME} WHERE id = old.id;
      
        INSERT INTO ${FTS_DIRECT_TABLE_NAME}(id, content) 
        SELECT new.id, new.content 
        WHERE new.content IS NOT NULL;
      END;
    `)
  );

  await db.run(
    sql.raw(`
      INSERT INTO ${FTS_DIRECT_TABLE_NAME}(id, content)
      SELECT id, content
      FROM ${CHAT_DIRECT_TABLE_NAME}
      WHERE content IS NOT NULL AND id NOT IN (
        SELECT id FROM ${FTS_DIRECT_TABLE_NAME}
      );
    `)
  );

  // --- Group FTS Setup ---
  await db.run(
    sql.raw(`
      CREATE VIRTUAL TABLE IF NOT EXISTS ${FTS_GROUP_TABLE_NAME}
      USING fts5(
        id UNINDEXED,
        content
      );
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_group_ai
      INSTEAD OF INSERT ON ${CHAT_GROUP_TABLE_NAME}
      WHEN new.content IS NOT NULL
      BEGIN
        INSERT INTO ${FTS_GROUP_TABLE_NAME}(id, content)
        VALUES (new.id, new.content);
      END;
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_group_ad
      INSTEAD OF DELETE ON ${CHAT_GROUP_TABLE_NAME}
      BEGIN
        DELETE FROM ${FTS_GROUP_TABLE_NAME} WHERE id = old.id;
      END;
    `)
  );

  await db.run(
    sql.raw(`
      CREATE TRIGGER IF NOT EXISTS chat_group_au
      INSTEAD OF UPDATE ON ${CHAT_GROUP_TABLE_NAME}
      BEGIN
        DELETE FROM ${FTS_GROUP_TABLE_NAME} WHERE id = old.id;

        INSERT INTO ${FTS_GROUP_TABLE_NAME}(id, content) 
        SELECT new.id, new.content 
        WHERE new.content IS NOT NULL;
      END;
    `)
  );

  await db.run(
    sql.raw(`
      INSERT INTO ${FTS_GROUP_TABLE_NAME}(id, content)
      SELECT id, content
      FROM ${CHAT_GROUP_TABLE_NAME}
      WHERE content IS NOT NULL AND id NOT IN (
        SELECT id FROM ${FTS_GROUP_TABLE_NAME}
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
          WHEN m.mode = 'SENT' THEN 'You: ' || m.content
          ELSE m.content
        END as lastMessage
      FROM chat_direct m
      INNER JOIN conversation_direct c ON m.conversation_id = c.id
      INNER JOIN user u ON c.user_id = u.id
      WHERE (
        m.id IN (
          SELECT id
          FROM ${sql.raw(FTS_DIRECT_TABLE_NAME)}
          WHERE ${sql.raw(FTS_DIRECT_TABLE_NAME)} MATCH ${search}
        )
        OR u.first_name LIKE '%' || ${search} || '%'
        OR u.last_name LIKE '%' || ${search} || '%'
        OR u.middle_name LIKE '%' || ${search} || '%'
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
          WHEN m.sender_id = ${currentUserId} THEN 'You: ' || m.content
          ELSE IFNULL(u.first_name, 'Unknown') || ': ' || m.content
        END as lastMessage
      FROM chat_group m
      INNER JOIN conversation_group c ON m.conversation_id = c.id
      LEFT JOIN user u ON m.sender_id = u.id
      WHERE (
        m.id IN (
          SELECT id
          FROM ${sql.raw(FTS_GROUP_TABLE_NAME)}
          WHERE ${sql.raw(FTS_GROUP_TABLE_NAME)} MATCH ${search}
        )
        OR c.name LIKE '%' || ${search} || '%'
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
