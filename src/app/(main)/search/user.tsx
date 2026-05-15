import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebounce } from 'use-debounce';

import { SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

import { UserList } from '@/features/common/components/user/list';

import { useGetUsers } from '@/features/common/hooks/queries/use-get-users';

import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

import { useAuthStore } from '@/store/auth';

export default function SearchScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { user: operatingUser } = useAuthStore((state) => state);

  const [search, setSearch] = useState('');
  const [searchValue] = useDebounce(search, 300);

  const { data, fetchNextPage, isFetchingNextPage, refetch, error } = useGetUsers({
    search: searchValue,
    limit: 10,
  });

  useRefreshOnFocus(refetch);

  const users = (data?.pages.flatMap((page) => page.data) ?? []).filter(
    (u) => u.id !== operatingUser?.id
  );

  console.log(users);

  if (error) alert(error);

  return (
    <View
      style={{ paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }}
      className="flex-1 p-2">
      <Input className="mb-3">
        <InputSlot>
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField placeholder="Search..." value={search} onChangeText={setSearch} />
      </Input>

      <UserList
        data={users}
        isFetchingNextPage={isFetchingNextPage}
        onEndReached={() => fetchNextPage()}
      />
    </View>
  );
}
