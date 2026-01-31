import { Database } from '@nozbe/watermelondb';
import { withDatabase, withObservables } from '@nozbe/watermelondb/react';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';

import { User } from '@/db/models/user.model';
import { cn } from '@/lib/utils';

import { USER_TABLE_NAME } from '@/db/schemas/user-table.schema';

interface UserInfoProps extends ViewProps {
  data: User;
}

export function UserInfo({ className, data, ...props }: UserInfoProps) {
  const { firstName, lastName, phoneNumber, avatar } = data;

  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      className={cn(
        'justify border-muted flex-row items-center gap-x-5 border-b-2 bg-yellow-50 p-2 px-4 dark:bg-gray-800',
        className
      )}
      style={{ paddingTop: safeAreaInsets.top }}
      {...props}>
      <Avatar alt={firstName} className="size-14">
        <AvatarImage source={{ uri: avatar ?? '' }} />
        <AvatarFallback>
          <Text>{firstName[0]}</Text>
        </AvatarFallback>
      </Avatar>

      <View className="flex-col">
        <View className="flex-row gap-x-2">
          <Text>{firstName}</Text>
          <Text>{lastName}</Text>
        </View>

        <Text>{phoneNumber}</Text>
      </View>
    </View>
  );
}

export const EnhancedUserInfo = withDatabase(
  withObservables(['id'], ({ database, id }: { database: Database; id: string }) => ({
    data: database.get<User>(USER_TABLE_NAME).findAndObserve(id),
  }))(UserInfo)
);
