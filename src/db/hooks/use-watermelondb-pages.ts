import { Collection, Database, Model, Q } from '@nozbe/watermelondb';
import { Clause } from '@nozbe/watermelondb/QueryDescription';
import { useCallback, useEffect, useState } from 'react';

interface WatermelonModelsPage<T extends Model> {
  // Pass the name of the table/collection as a string, or the collection object itself
  collection: string | Collection<T>;
  database: Database;
  // The query clauses (e.g. from Q.where)
  query: Clause[];
  // Callback when data changes
  onChange: (items: T[]) => void;
}

export function useWatermelonModelsPage<T extends Model>({
  collection,
  database,
  onChange,
  query,
}: WatermelonModelsPage<T>) {
  const LIMIT = 20; // You can change this back to 1 to test
  const HALF_LIMIT = Math.ceil(LIMIT / 2);
  const [cPage, setCPage] = useState(0);
  // Initialize with -1 to indicate "loading" state
  const [count, setCount] = useState(-1);

  // Helper to get the actual collection object safely
  const getCollection = useCallback(() => {
    return typeof collection === 'string' ? database.get<T>(collection) : collection;
  }, [collection, database]);

  /**
   * Go to next page.
   */
  const next = useCallback(
    function () {
      // If count hasn't loaded yet (-1), optimistically load the next page
      if (count === -1) {
        setCPage((p) => p + 1);
        return;
      }

      const lastPage = Math.ceil(count / HALF_LIMIT);
      if (cPage < lastPage) {
        setCPage((p) => p + 1);
      }
    },
    [count, HALF_LIMIT, cPage]
  );

  /**
   * Go to prev page.
   */
  const prev = useCallback(
    function () {
      if (cPage !== 0) {
        setCPage((p) => p - 1);
      }
    },
    [cPage]
  );

  /**
   * Computes the total count.
   */
  const computeCount = useCallback(
    async function () {
      const current = await getCollection()
        .query(...query)
        .fetchCount();
      setCount(current);
    },
    [getCollection, query]
  );

  /**
   * Computes the page items.
   */
  const computeItems = useCallback(
    function () {
      // Load current page count * limit
      const limitCount = (cPage + 1) * LIMIT;

      const observable = getCollection()
        .query(...query, Q.take(limitCount))
        .observe();

      const subscription = observable.subscribe({
        next: onChange,
        error(err) {
          console.error(err);
        },
        complete() {},
      });

      return () => subscription.unsubscribe();
    },
    [getCollection, onChange, query, cPage]
  );

  useEffect(
    function () {
      computeCount();
      const unsubscribe = computeItems();
      return unsubscribe;
    },
    [computeItems, computeCount]
  );

  return { count, prev, next, cPage };
}
