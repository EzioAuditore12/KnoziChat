import { FlashList } from '@shopify/flash-list';
import type { ComponentProps } from 'react';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';

import { UserAvatar } from './avatar';

import type { User } from '@/db/tables/user.table';

type OnlineUser = User & {
  isOnline: boolean;
};

interface OnlineUsersListProps extends ComponentProps<typeof Box> {
  users: OnlineUser[];
}

export const OnlineUsersList = ({ className, users, ...props }: OnlineUsersListProps) => {
  if (!users || users.length === 0) return null;

  return (
    <Box className="border-outline-100 px-4 pt-4" {...props}>
      <Heading size="sm" className="mb-3">
        Active Contacts
      </Heading>

      <FlashList
        data={users}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <UserAvatar className="mr-4 items-center justify-center" data={item} />;
        }}
      />
    </Box>
  );
};
