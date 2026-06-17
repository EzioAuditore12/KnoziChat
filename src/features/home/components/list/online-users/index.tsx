import { FlashList } from '@shopify/flash-list';
import type { ComponentProps } from 'react';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

import { UserAvatar } from './avatar';

import type { User } from '@/db/tables/user.table';

type OnlineUser = User & {
  isOnline: boolean;
};

interface OnlineUsersListProps extends ComponentProps<typeof Box> {
  users?: OnlineUser[];
  isLoading?: boolean;
}

export const OnlineUsersList = ({
  className,
  users,
  isLoading,
  ...props
}: OnlineUsersListProps) => {
  if (!isLoading && (!users || users.length === 0)) return null;

  return (
    <Box className="border-outline-100 px-4 pt-4" {...props}>
      <Heading size="sm" className="mb-3">
        Active Contacts
      </Heading>

      <Box className="min-h-[104px]">
        {isLoading ? (
          <OnlineUsersListLoading />
        ) : (
          <FlashList
            data={users}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <UserAvatar className="mr-4 items-center justify-center" data={item} />;
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const OnlineUsersListLoading = () => {
  return (
    <FlashList
      data={[1, 2, 3, 4, 5]}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={() => (
        <VStack className="mr-4 items-center justify-center">
          <Skeleton variant="circular" className="size-20" />
          <SkeletonText _lines={1} className="mt-2 h-3 w-16" />
        </VStack>
      )}
    />
  );
};
