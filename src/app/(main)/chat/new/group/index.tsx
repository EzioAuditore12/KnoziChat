import { Stack } from 'expo-router';
import { useDebounce } from 'use-debounce';

import { Activity, useState } from 'react';

import { useGetUsers } from '@/features/common/hooks/queries/use-get-users';

import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

import { Box } from '@/components/ui/box';
import { SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

import { GroupCreationDialog } from '@/features/chat/group/components/create/dialog';
import { SelectedUserList } from '@/features/chat/group/components/create/selected-user-list';
import { UserList } from '@/features/chat/group/components/create/user-list';

import { useInitializeGroupChat } from '@/features/chat/group/hooks/mutation/use-initialize-group-chat';

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

  const knownUsers = new Map();
  if (data?.pages) {
    data.pages.flatMap((p) => p.data).forEach((u) => knownUsers.set(u.id, u));
  }

  const currentSearchUsers = (data?.pages.flatMap((page) => page.data) ?? []).filter(
    (u) => u.id !== operatingUser?.id
  );

  const selectedUsers = Array.from(selectedUserIds)
    .map((id) => knownUsers.get(id))
    .filter(Boolean);

  const unselectedUsers = currentSearchUsers.filter((u) => !selectedUserIds.has(u.id));

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
      <Box className="flex-1 gap-y-2 p-2">
        <Input className="mb-3">
          <InputSlot>
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField placeholder="Search..." value={search} onChangeText={setSearch} />
        </Input>

        <SelectedUserList data={selectedUsers} setSelectedUserIds={setSelectedUserIds} />

        <UserList
          data={unselectedUsers}
          isFetchingNextPage={isFetchingNextPage}
          onEndReached={() => fetchNextPage()}
          selectedUserIds={selectedUserIds}
          setSelectedUserIds={setSelectedUserIds}
        />
      </Box>
    </>
  );
}
