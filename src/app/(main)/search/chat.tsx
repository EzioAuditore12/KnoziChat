import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebounce } from 'use-debounce';

import { db } from '@/db';
import { searchChatMessages } from '@/db/extensions/fts-5';
import { useAuthStore } from '@/store/auth';

import { SearchIcon } from '@/components/ui/icon';

import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

import { Text } from '@/components/ui/text';

export type ChatSearchResult = {
  id: string;
  conversationId: string;
  name: string;
  updatedAt: number;
  type: 'direct' | 'group';
  userId: string | null;
  lastMessage: string | null;
};

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim() || !text) {
    return <Text>{text}</Text>;
  }

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

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);

  const [results, setResults] = useState<ChatSearchResult[]>([]);

  const limit = 20;

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const query = debouncedSearch.trim();

    if (!query) {
      setResults([]);
      setOffset(0);
      setHasMore(true);
      return;
    }

    let isMounted = true;

    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const newResults = await searchChatMessages(db, query, currentUserId, limit, 0);

        if (isMounted) {
          setResults(newResults as ChatSearchResult[]);
          setOffset(limit);
          setHasMore(newResults.length === limit);
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
        limit,
        offset
      );
      setResults((prev) => [...prev, ...(newResults as ChatSearchResult[])]);
      setOffset((prevOffset) => prevOffset + limit);
      setHasMore(newResults.length === limit);
    } catch (error) {
      console.error('Search error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: ChatSearchResult }) => (
    <View className="bg-secondary/10 mb-2 rounded-md p-3">
      <Text className="mb-1 font-semibold">
        <HighlightedText text={item.name || ''} highlight={debouncedSearch} />
      </Text>

      <Text>
        <HighlightedText text={item.lastMessage || ''} highlight={debouncedSearch} />
      </Text>

      <Text className="mt-1 text-xs">{new Date(item.updatedAt).toLocaleString()}</Text>
    </View>
  );

  console.log(results);

  return (
    <View style={{ paddingTop: safeAreaInsets.top }} className="bg-background flex-1 p-2">
      <Input className="mb-3">
        <InputSlot>
          <InputIcon as={SearchIcon} />
        </InputSlot>

        <InputField placeholder="Search..." value={search} onChangeText={setSearch} />
      </Input>

      <FlashList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: safeAreaInsets.bottom,
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          debouncedSearch && !isLoading ? (
            <Text className="text-foreground/50 mt-4 text-center">No messages found.</Text>
          ) : null
        }
      />
    </View>
  );
}
