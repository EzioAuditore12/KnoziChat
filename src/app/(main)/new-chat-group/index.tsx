import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { useDebounce } from 'use-debounce';
import { SearchField } from 'heroui-native/search-field';
import { useState, Activity } from 'react';

import { useGetUsers } from '@/features/common/hooks/queries/use-get-users';

import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

import { UserList } from '@/features/chat/components/group/user-list';
import { SelectedUserList } from '@/features/chat/components/group/selected-users-list';
import { GroupCreationDialog } from '@/features/chat/components/group/creation-dialog';

import { useInitializeGroupChat } from '@/features/chat/hooks/mutations/use-initialize-group-chat';

import { useAuthStore } from '@/store/auth';

export default function NewGroupChatCreationScreen() {
  const [search, setSearch] = useState<string>('');
  const [searchValue] = useDebounce(search, 300);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user: operatingUser } = useAuthStore((state) => state);

  const { data, fetchNextPage, isFetchingNextPage, refetch } = useGetUsers({
    search: searchValue,
    limit: 10,
  });

  const { mutate, isPending } = useInitializeGroupChat();

  useRefreshOnFocus(refetch);

  const users = (data?.pages.flatMap((page) => page.data) ?? []).filter(
    (u) => u.id !== operatingUser?.id
  );
  const selectedUsers = users.filter((u) => selectedUserIds.has(u.id));
  const unselectedUsers = users.filter((u) => !selectedUserIds.has(u.id));

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Create a new Group',
          headerRight: () => (
            <Activity mode={selectedUserIds.size >= 2 ? 'visible' : 'hidden'}>
              <GroupCreationDialog
                handleFormSubmit={mutate}
                isFormSubmitting={isPending}
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                participants={Array.from(selectedUserIds)}
              />
            </Activity>
          ),
        }}
      />
      <View className="flex-1 gap-y-2 p-2">
        <SearchField className="mb-3" value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon>
              <Text className="text-base">🔍</Text>
            </SearchField.SearchIcon>
            <SearchField.Input className="pl-10" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <SelectedUserList data={selectedUsers} setSelectedUserIds={setSelectedUserIds} />

        <UserList
          data={unselectedUsers}
          isFetchingNextPage={isFetchingNextPage}
          onEndReached={() => fetchNextPage()}
          selectedUserIds={selectedUserIds}
          setSelectedUserIds={setSelectedUserIds}
        />
      </View>
    </>
  );
}
