import { db } from '@/db';
import { useLiveQuery } from '@/db/hooks/use-live-query';
import { userTable } from '@/db/tables/user.table';
import { eq } from 'drizzle-orm';

export function useLiveUserDetails(id: string) {
  return useLiveQuery(db.select().from(userTable).where(eq(userTable.id, id)));
}
