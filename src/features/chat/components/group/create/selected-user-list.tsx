import type { ComponentProps, Dispatch, SetStateAction } from 'react';

import { cn } from '@gluestack-ui/utils';
import { FlashList } from '@shopify/flash-list';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

import type { User } from '@/features/common/schemas/user.schema';
import { SelectedUserCard } from './selected-user-card';

interface SelectedUserListProps extends ComponentProps<typeof Box> {
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
    return <Text className="text-red-500">No Users Selected, Please select at least 2</Text>;

  const handleRemove = (id: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <Box className={cn('gap-y-2', className)} {...props}>
      <Text>Selected Users</Text>

      <Box className="h-16 w-full">
        <FlashList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SelectedUserCard user={item} onRemove={() => handleRemove(item.id)} />
          )}
          horizontal
        />
      </Box>
    </Box>
  );
}
