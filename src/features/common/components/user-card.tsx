import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
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
        <CardContent className="relative w-full flex-row gap-x-2">
          <Avatar className="size-20" alt={firstName}>
            <AvatarImage src={avatar ?? ''} />
            <AvatarFallback>
              <Text>{firstName[0]}</Text>
            </AvatarFallback>
          </Avatar>

          <View>
            <Text variant={'h3'}>{firstName}</Text>
            <Text>{phoneNumber}</Text>
          </View>

          <Text className="absolute right-3" variant={'muted'}>
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        </CardContent>
      </Card>
    </ThrottledTouchable>
  );
}
