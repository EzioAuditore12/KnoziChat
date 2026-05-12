import { cn } from '@gluestack-ui/utils';
import type { ComponentProps } from 'react';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

import { VStack } from '@/components/ui/vstack';
import type { User } from '../../schemas/user.schema';

interface UserCardProps extends ComponentProps<typeof Card> {
  data: User;
  onPress?: ThrottledTouchableProps['onPress'];
}

export function UserCard({ className, data, onPress, ...props }: UserCardProps) {
  const { firstName, avatar, email } = data;

  return (
    <ThrottledTouchable onPress={onPress}>
      <Card className={cn('flex-row gap-x-2', className)} {...props}>
        <Avatar className="size-20">
          <AvatarImage source={{ uri: avatar ?? undefined }} />
          <AvatarFallbackText>{firstName[0]}</AvatarFallbackText>
        </Avatar>

        <VStack>
          <Text className="text-lg">{firstName}</Text>
          <Text>{email}</Text>
        </VStack>
      </Card>
    </ThrottledTouchable>
  );
}
