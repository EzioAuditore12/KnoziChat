import { View, Text } from 'react-native';
import { useDebounce } from 'use-debounce';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchField } from 'heroui-native/search-field';
import { FlashList } from '@shopify/flash-list';
import { searchChatMessages } from '@/db/extensions/fts-5';
import { db } from '@/db';
import { useAuthStore } from '@/store/auth';

export type ChatSearchResult = {
  id: string; // the actual message id
  conversationId: string; // the conversation the message belongs to
  name: string; // user or group name
  updatedAt: number;
  type: 'direct' | 'group';
  userId: string | null;
  lastMessage: string | null;
};

// Helper component to highlight the matched text
function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim() || !text) {
    return <Text>{text}</Text>;
  }
  // Split on highlight term, case-insensitive
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);

  return (
    <Text>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <Text key={i} className="bg-amber-400 font-semibold text-black">
            {part}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        )
      )}
    </Text>
  );
}

export default function SearchThroughChatsScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const currentUserId = useAuthStore((state) => state.user?.id!);

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [results, setResults] = useState<ChatSearchResult[]>([]);

  // Pagination states
  const limit = 20;
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadResults = async (query: string, currentOffset: number) => {
    if (isLoading || !query.trim()) return;
    setIsLoading(true);
    try {
      const newResults = await searchChatMessages(db, query, currentUserId, limit, currentOffset);
      if (newResults.length < limit) {
        setHasMore(false);
      }
      if (currentOffset === 0) {
        setResults(newResults as ChatSearchResult[]);
      } else {
        setResults((prev) => [...prev, ...(newResults as ChatSearchResult[])]);
      }
      setOffset(currentOffset + limit);
    } catch (error) {
      console.error('Search error', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset pagination and fetch fresh whenever search changes
    setResults([]);
    setOffset(0);
    setHasMore(true);
    if (debouncedSearch.trim()) {
      loadResults(debouncedSearch, 0);
    }
  }, [debouncedSearch, currentUserId]);

  const loadMore = () => {
    if (hasMore && !isLoading && debouncedSearch.trim()) {
      loadResults(debouncedSearch, offset);
    }
  };

  const renderItem = ({ item }: { item: ChatSearchResult }) => (
    <View className="bg-secondary/10 mb-2 rounded-md p-3">
      <Text className="text-foreground mb-1 font-semibold">{item.name}</Text>
      <Text className="text-foreground">
        <HighlightedText text={item.lastMessage || ''} highlight={debouncedSearch} />
      </Text>
      <Text className="text-foreground/50 mt-1 text-xs">
        {new Date(item.updatedAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <>
      <View style={{ paddingTop: safeAreaInsets.top }} className="bg-background flex-1 p-2">
        <SearchField className="mb-3" value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon>
              <Text className="text-base">🔍</Text>
            </SearchField.SearchIcon>
            <SearchField.Input className="pl-10" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <FlashList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: safeAreaInsets.bottom }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            debouncedSearch && !isLoading ? (
              <Text className="text-foreground/50 mt-4 text-center">No messages found.</Text>
            ) : null
          }
        />
      </View>
    </>
  );
}
