import { toCompilableQuery, type DrizzleQuery } from '@powersync/drizzle-driver';
import { useQuery } from '@powersync/react';

export function useLiveQuery<T>(query: DrizzleQuery<T>) {
  return useQuery(toCompilableQuery(query));
}
