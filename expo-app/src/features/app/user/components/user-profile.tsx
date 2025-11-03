import type { ComponentProps } from 'react';
import { cn } from '@gluestack-ui/utils/nativewind-utils';

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';

import type { User } from '../schemas/user.schema';

interface UserProfileProps extends ComponentProps<typeof Box> {
  data: User;
}

export function UserProfile({ className, data, ...props }: UserProfileProps) {
  const {
    avatar,
    createdAt,
    email,
    firstName,
    middleName,
    lastName,
    phoneNumber,
    id,
  } = data;

  return (
    <Box
      key={id}
      className={cn(
        'p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center space-y-4',
        className,
      )}
      {...props}
    >
      <Avatar size="2xl">
        <AvatarImage src={avatar ?? ''} />
        <AvatarFallbackText>
          {firstName ? firstName[0] : '?'}
        </AvatarFallbackText>
      </Avatar>
      <Heading size="xl" className="text-center">
        {firstName} {middleName} {lastName}
      </Heading>
      <Text size="lg" className="text-center text-gray-700">
        {email}
      </Text>
      <Text size="lg" className="text-center text-gray-700">
        {phoneNumber}
      </Text>
      <Text size="sm" className="text-center text-gray-500 mt-2">
        Joined: {new Date(createdAt).toLocaleDateString()}
      </Text>
    </Box>
  );
}
