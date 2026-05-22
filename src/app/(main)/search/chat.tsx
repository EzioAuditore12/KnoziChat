import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { useChatSearch } from '@/features/chat/search/hooks/use-chat-search';
import { SearchBar } from '@/features/chat/search/components/search-bar';
import { SearchResultsList } from '@/features/chat/search/components/search-results-list';

export default function SearchThroughChatsScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { search, debouncedSearch, results, isLoading, handleSearchChange, loadMore } =
    useChatSearch();

  return (
    <View style={{ paddingTop: safeAreaInsets.top }} className="bg-background flex-1 p-2">
      <SearchBar value={search} onChangeText={handleSearchChange} />

      <SearchResultsList
        results={results}
        highlight={debouncedSearch}
        isLoading={isLoading}
        onEndReached={loadMore}
        bottomInset={safeAreaInsets.bottom}
      />
    </View>
  );
}
