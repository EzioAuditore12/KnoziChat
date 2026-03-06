import { Description } from 'heroui-native/description';
import { View, type ViewProps } from 'react-native';
import { cn } from 'tailwind-variants';
import { FlashList } from '@shopify/flash-list';
import { CloseButton } from 'heroui-native/close-button';

import { UserCard } from '@/features/common/components/user-card';
import { User } from '@/features/common/schemas/user.schema';
import { Dispatch, SetStateAction } from 'react';

interface SelectedUserListProps extends ViewProps {
  data: User[];
  setSelectedUserIds: Dispatch<SetStateAction<Set<string>>>;
}

export function SelectedUserList({
  className,
  data,
  setSelectedUserIds,
  ...props
}: SelectedUserListProps) {
  if (data.length <= 0)
    return (
      <Description className="text-red-500">
        No Users Selected, Please select at least 2
      </Description>
    );

  const handleRemove = (id: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <View className={cn('gap-y-2', className)} {...props}>
      <Description>Selected Users</Description>

      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="relative mr-2 flex-row items-center">
            <UserCard data={item} />
            <CloseButton
              variant="danger"
              className="absolute top-0 right-0"
              onPress={() => handleRemove(item.id)}
            />
          </View>
        )}
        horizontal
      />
    </View>
  );
}
