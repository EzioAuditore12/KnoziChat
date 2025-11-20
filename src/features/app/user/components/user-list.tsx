import type { ComponentProps } from 'react';
import { router } from 'expo-router';
import { LegendList } from '@legendapp/list';

import { Spinner } from '@/components/ui/spinner';

import type { User } from '../schemas/user.schema';

import { UserCard } from './user-card';

export type UserListProps = Omit<
  ComponentProps<typeof LegendList<User>>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> & {
  users: User[];
  isFetchingNextPage?: boolean;
};

export function UserList({
  className,
  isFetchingNextPage,
  users,
  ...props
}: UserListProps) {
  return (
    <>
      <LegendList<User>
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            onPress={() =>
              router.push({
                pathname: '/(app)/[id]',
                params: { id: item.id },
              })
            }
            className="mb-3"
            data={item}
          />
        )}
        {...props}
      />
      {isFetchingNextPage && <Spinner />}
    </>
  );
}
