import type { ComponentProps } from 'react';
import { cn } from '@gluestack-ui/utils/nativewind-utils';
import { Pressable, type PressableProps } from 'react-native';

import type { User } from '../schemas/user.schema';

import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

interface UserCardProps extends ComponentProps<typeof Card> {
  data?: User;
  onPress?: PressableProps['onPress'];
}

export function UserCard({
  className,
  data,
  onPress,
  ...props
}: UserCardProps) {
  if (!data) return null;
  const { id, firstName, avatar, phoneNumber, createdAt } = data;

  return (
    <Pressable onPress={onPress}>
      <Card
        key={id}
        className={cn('relative flex-row gap-x-2', className)}
        {...props}
      >
        <Avatar>
          <AvatarImage src={avatar ?? ''} />
          <AvatarFallbackText>{firstName[0]}</AvatarFallbackText>
        </Avatar>

        <VStack>
          <Heading>{firstName}</Heading>
          <Text>{phoneNumber}</Text>
        </VStack>

        <Text className="absolute right-2 top-1">{createdAt}</Text>
      </Card>
    </Pressable>
  );
}
