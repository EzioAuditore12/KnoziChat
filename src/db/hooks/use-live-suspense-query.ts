import { useSuspenseQuery } from '@powersync/react-native';
import { toCompilableQuery, type DrizzleQuery } from '@powersync/drizzle-driver';

export function useLiveSuspenseQuery<T>(query: DrizzleQuery<T>) {
  return useSuspenseQuery(toCompilableQuery(query));
}
