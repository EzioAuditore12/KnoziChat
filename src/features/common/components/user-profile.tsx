import { View, type ViewProps } from 'react-native';
import { cn } from 'tailwind-variants';
import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';

import type { User } from '../schemas/user.schema';

interface UserProfileProps extends ViewProps {
  data?: User;
}

export function UserProfile({ className, data, ...props }: UserProfileProps) {
  if (!data) return null;

  const { avatar, createdAt, email, firstName, middleName, lastName, phoneNumber, id } = data;

  return (
    <View
      key={id}
      className={cn('flex flex-col items-center space-y-4 rounded-2xl p-6 shadow-lg', className)}
      {...props}>
      <Avatar className="size-48" alt={firstName}>
        <Avatar.Image src={avatar ?? ''} />
        <Avatar.Fallback>{firstName[0]}</Avatar.Fallback>
      </Avatar>
      <Description className="text-center text-lg">
        {firstName} {middleName} {lastName}
      </Description>
      <Description className="text-center text-lg">{email}</Description>
      <Description className="text-center text-lg">{phoneNumber}</Description>
      <Description className="mt-2 text-center text-sm">
        Joined: {new Date(createdAt).toLocaleDateString()}
      </Description>
    </View>
  );
}
