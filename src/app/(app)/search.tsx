import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebounce } from 'use-debounce';

import { Box } from '@/components/ui/box';
import { SearchUserInput } from '@/features/app/user/components/search-user';
import { useGetUsers } from '@/features/app/user/hooks/use-get-users';
import { UserList } from '@/features/app/user/components/user-list';

export default function SearchScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const [firstNameSearch, setFirstNameSearch] = useState('');
  const [searchValue] = useDebounce(firstNameSearch, 300);

  const { data, fetchNextPage, isFetchingNextPage } = useGetUsers({
    firstName: searchValue,
    limit: 10,
  });

  const users = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Box style={{ marginTop: safeAreaInsets.top }} className="flex-1 p-2">
      <SearchUserInput
        className="mb-5"
        value={firstNameSearch}
        onChangeText={setFirstNameSearch}
      />

      <UserList
        users={users}
        isFetchingNextPage={isFetchingNextPage}
        onEndReached={() => fetchNextPage()}
      />
    </Box>
  );
}
