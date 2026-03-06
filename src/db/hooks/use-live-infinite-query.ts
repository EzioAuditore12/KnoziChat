import type { DrizzleQuery } from '@powersync/drizzle-driver';
import { useState, useCallback } from 'react';

import { useLiveQuery } from './use-live-query';

// We only need limit now, not offset
export interface PaginatedQueryBuilder<T> {
  limit: (limit: number) => DrizzleQuery<T>;
}

export interface UseLiveInfiniteQueryOptions<T> {
  query: PaginatedQueryBuilder<T>;
  pageSize: number;
}

export function useLiveInfiniteQuery<T>({ query, pageSize }: UseLiveInfiniteQueryOptions<T>) {
  const [page, setPage] = useState<number>(0);

  // Calculate total items to fetch based on the current page
  const currentLimit = (page + 1) * pageSize;

  // Just increase the limit. This keeps all previous items in the live query.
  const paginatedQuery = query.limit(currentLimit);

  const { data, isLoading, error, isFetching, refresh } = useLiveQuery(paginatedQuery);

  const fetchNextPage = useCallback(() => {
    // Guard: Only increment page if we actually filled the current limit.
    // This prevents the infinite loop when there is no more data to load.
    if (data && data.length >= currentLimit) {
      setPage((p) => p + 1);
    }
  }, [data, currentLimit]);

  const fetchPrevPage = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);

  return {
    refresh,
    page,
    data,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    fetchPrevPage,
  };
}
