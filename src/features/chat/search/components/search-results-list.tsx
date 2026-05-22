import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

import { SearchResultCard } from './search-result-card';
import type { ChatSearchResult } from '../types';

interface SearchResultsListProps {
  results: ChatSearchResult[];
  highlight: string;
  isLoading: boolean;
  onEndReached: () => void;
  bottomInset: number;
}

export function SearchResultsList({
  results,
  highlight,
  isLoading,
  onEndReached,
  bottomInset,
}: SearchResultsListProps) {
  return (
    <FlashList
      data={results}
      renderItem={({ item }) => <SearchResultCard item={item} highlight={highlight} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: bottomInset }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        highlight && !isLoading ? (
          <View className="mt-4 items-center">
            <Text className="text-foreground/50">No messages found.</Text>
          </View>
        ) : null
      }
    />
  );
}
