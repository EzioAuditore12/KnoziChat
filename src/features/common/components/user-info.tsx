import { Database } from '@nozbe/watermelondb';
import { withDatabase, withObservables } from '@nozbe/watermelondb/react';
import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Avatar } from 'heroui-native/avatar';
import { cn } from 'tailwind-variants';
import { Description } from 'heroui-native/description';

import { User } from '@/db/models/user.model';

import { USER_TABLE_NAME } from '@/db/schemas/user-table.schema';

import { ThrottledTouchable } from '@/components/throttled-touchable';
import { Ionicons } from '@/components/icon';

interface UserInfoProps extends ViewProps {
  data: User;
}

export function UserInfo({ className, data, ...props }: UserInfoProps) {
  const { firstName, lastName, phoneNumber, avatar } = data;

  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      className={cn(
        'justify border-background-tertiary flex-row items-center gap-x-1 border-b-2 p-2 px-4',
        className
      )}
      style={{ paddingTop: safeAreaInsets.top }}
      {...props}>
      <ThrottledTouchable className="bg-background rounded-full p-2" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22}/>
      </ThrottledTouchable>

      <Avatar alt={firstName} className="size-14">
        <Avatar.Image source={{ uri: avatar ?? '' }} />
        <Avatar.Fallback>{firstName[0]}</Avatar.Fallback>
      </Avatar>

      <View className="flex-col">
        <View className="flex-row gap-x-2">
          <Description className="font-bold">{firstName}</Description>
          <Description className="font-bold">{lastName}</Description>
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
