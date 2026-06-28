import { toCompilableQuery, type DrizzleQuery } from '@powersync/drizzle-driver';
import { useSuspenseQuery } from '@powersync/react';

export function useLiveSuspenseQuery<T>(query: DrizzleQuery<T>) {
  return useSuspenseQuery(toCompilableQuery(query));
}
