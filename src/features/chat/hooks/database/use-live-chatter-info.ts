import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { useLiveQuery } from '@/db/hooks/use-live-query';
import { userTable } from '@/db/tables/user.table';

export function useLiveChatterInfo(id: string) {
  const { data, ...rest } = useLiveQuery(
    db.select().from(userTable).where(eq(userTable.id, id)).limit(1)
  );

  return {
    data: data[0],
    ...rest,
  };
}
