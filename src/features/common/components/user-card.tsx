import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { cn } from 'tailwind-variants';
import { Description } from 'heroui-native/description';
import { Card } from 'heroui-native/card';
import { Avatar } from 'heroui-native/avatar';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

import type { User } from '../schemas/user.schema';

interface UserCardProps extends ComponentProps<typeof Card> {
  data: User;
  onPress?: ThrottledTouchableProps['onPress'];
}

export function UserCard({ className, data, onPress, ...props }: UserCardProps) {
  const { firstName, avatar, phoneNumber, createdAt } = data;

  return (
    <ThrottledTouchable onPress={onPress}>
      <Card className={cn(className)} {...props}>
        <Card.Body className="relative w-full flex-row gap-x-2">
          <Avatar className="size-20" alt={firstName}>
            <Avatar.Image src={avatar ?? ''} />
            <Avatar.Fallback>{firstName[0]}</Avatar.Fallback>
          </Avatar>

          <View>
            <Description className="text-lg">{firstName}</Description>
            <Description>{phoneNumber}</Description>
          </View>

          <Description className="text-muted absolute right-3">
            {new Date(createdAt).toLocaleDateString()}
          </Description>
        </Card.Body>
      </Card>
    </ThrottledTouchable>
  );
}
