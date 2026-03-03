import { useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebounce } from 'use-debounce';
import { SearchField } from 'heroui-native/search-field';

import { UserList } from '@/features/common/components/user-list';

import { useGetUsers } from '@/features/common/hooks/queries/use-get-users';

import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

export default function SearchScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [searchValue] = useDebounce(search, 300);

  const { data, fetchNextPage, isFetchingNextPage, refetch } = useGetUsers({
    search: searchValue,
    limit: 10,
  });

  useRefreshOnFocus(refetch);

  const users = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <View
      style={{ paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }}
      className="flex-1 p-2">
      <SearchField className="mb-3" value={search} onChange={setSearch}>
        <SearchField.Group>
          <SearchField.SearchIcon>
            <Text className="text-base">🔍</Text>
          </SearchField.SearchIcon>
          <SearchField.Input className="pl-10" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      <UserList
        data={users}
        isFetchingNextPage={isFetchingNextPage}
        onEndReached={() => fetchNextPage()}
      />
    </View>
  );
}
