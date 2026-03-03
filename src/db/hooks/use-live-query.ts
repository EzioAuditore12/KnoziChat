import { useQuery } from '@powersync/react-native';
import { toCompilableQuery, type DrizzleQuery } from '@powersync/drizzle-driver';

export function useLiveQuery<T>(query: DrizzleQuery<T>) {
  return useQuery(toCompilableQuery(query));
}
