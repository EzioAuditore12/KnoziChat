import { FlashList, type FlashListProps } from '@shopify/flash-list';
import type { Dispatch, SetStateAction } from 'react';

import type { User } from '@/features/common/schemas/user.schema';
import { UserCard } from '@/features/common/components/user-card';
import { View } from 'react-native';
import { Description } from 'heroui-native/description';

interface UserListProps extends Omit<
  FlashListProps<User>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> {
  data: User[];
  isFetchingNextPage?: boolean;
  selectedUserIds: Set<string>;
  setSelectedUserIds: Dispatch<SetStateAction<Set<string>>>;
}

export function UserList({
  className,
  isFetchingNextPage,
  data,
  selectedUserIds,
  setSelectedUserIds,
  ...props
}: UserListProps) {
  if (data.length <= 0)
    return (
      <View className="flex-1 items-center justify-center">
        <Description>No more to select</Description>
      </View>
    );

  // Handler for selecting/deselecting users
  const handleSelectUser = (id: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard data={item} className="mb-3" onPress={() => handleSelectUser(item.id)} />
        )}
        {...props}
      />
    </>
  );
}
