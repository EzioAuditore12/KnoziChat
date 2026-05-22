import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { db } from '@/db';
import { searchChatMessages } from '@/db/extensions/fts-5';
import { useAuthStore } from '@/store/auth';

import type { ChatSearchResult } from '../types';

const PAGE_SIZE = 20;

export function useChatSearch() {
  const currentUserId = useAuthStore((state) => state.user?.id!);

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [results, setResults] = useState<ChatSearchResult[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const resetResults = () => {
    setResults([]);
    setOffset(0);
    setHasMore(true);
  };

  const handleSearchChange = (text: string) => {
    setSearch(text);

    if (!text.trim()) {
      resetResults();
    }
  };

  useEffect(() => {
    const query = debouncedSearch.trim();

    let isMounted = true;

    if (!query) {
      return;
    }

    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const newResults = await searchChatMessages(db, query, currentUserId, PAGE_SIZE, 0);

        if (isMounted) {
          setResults(newResults as ChatSearchResult[]);
          setOffset(PAGE_SIZE);
          setHasMore(newResults.length === PAGE_SIZE);
        }
      } catch (error) {
        console.error('Search error', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitial();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, currentUserId]);

  const loadMore = async () => {
    if (!hasMore || isLoading || !debouncedSearch.trim()) return;

    setIsLoading(true);
    try {
      const newResults = await searchChatMessages(
        db,
        debouncedSearch.trim(),
        currentUserId,
        PAGE_SIZE,
        offset
      );
      setResults((prev) => [...prev, ...(newResults as ChatSearchResult[])]);
      setOffset((prevOffset) => prevOffset + PAGE_SIZE);
      setHasMore(newResults.length === PAGE_SIZE);
    } catch (error) {
      console.error('Search error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search,
    debouncedSearch,
    results,
    hasMore,
    isLoading,
    handleSearchChange,
    loadMore,
    resetResults,
  };
}
