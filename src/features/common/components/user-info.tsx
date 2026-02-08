import { Database } from '@nozbe/watermelondb';
import { withDatabase, withObservables } from '@nozbe/watermelondb/react';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'heroui-native/avatar';
import { cn } from 'tailwind-variants';

import { User } from '@/db/models/user.model';

import { USER_TABLE_NAME } from '@/db/schemas/user-table.schema';
import { Description } from 'heroui-native/description';
import { ThrottledTouchable } from '@/components/throttled-touchable';

interface UserInfoProps extends ViewProps {
  data: User;
}

export function UserInfo({ className, data, ...props }: UserInfoProps) {
  const { firstName, lastName, phoneNumber, avatar } = data;

  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      className={cn(
        'justify border-muted flex-row items-center gap-x-1 border-b-2 bg-yellow-50 p-2 px-4 dark:bg-gray-800',
        className
      )}
      style={{ paddingTop: safeAreaInsets.top }}
      {...props}>
      <ThrottledTouchable className="bg-muted rounded-full p-2" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} />
      </ThrottledTouchable>

      <Avatar alt={firstName} className="size-14">
        <Avatar.Image source={{ uri: avatar ?? '' }} />
        <Avatar.Fallback>{firstName[0]}</Avatar.Fallback>
      </Avatar>

      <View className="flex-col">
        <View className="flex-row gap-x-2">
          <Description>{firstName}</Description>
          <Description>{lastName}</Description>
        </View>

        <Description>{phoneNumber}</Description>
      </View>
    </View>
  );
}

export const EnhancedUserInfo = withDatabase(
  withObservables(['id'], ({ database, id }: { database: Database; id: string }) => ({
    data: database.get<User>(USER_TABLE_NAME).findAndObserve(id),
  }))(UserInfo)
);
