import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';
import { Card } from 'heroui-native/card';
import { cn } from 'tailwind-variants';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

import type { ConversationOneToOneJoinWithUser } from '@/db/tables/conversation-one-to-one.table';

interface ConversationCardProps extends ComponentProps<typeof Card> {
  onPress: ThrottledTouchableProps['onPress'];
  data: ConversationOneToOneJoinWithUser;
}

export function ConversationCard({ className, data, onPress, ...props }: ConversationCardProps) {
  const { user, conversation_one_to_one } = data;

  return (
    <ThrottledTouchable onPress={onPress}>
      <Card className={cn(className)} {...props}>
        <Card.Body className="flex-row gap-x-2">
          <Avatar className="size-20" alt={user?.firstName ?? ''}>
            <Avatar.Image source={{ uri: user?.avatar ?? undefined }} />
            <Avatar.Fallback>{user?.firstName[0]}</Avatar.Fallback>
          </Avatar>

          <View className="flex-col">
            <Description className="text-lg font-bold">{user?.firstName}</Description>

            <Description>
              {user?.firstName} {user?.lastName}
            </Description>

            <Description>{user?.phoneNumber}</Description>
          </View>
        </Card.Body>
        <Description className="mr-2 ml-auto">
          {new Date(conversation_one_to_one?.updatedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Description>
      </Card>
    </ThrottledTouchable>
  );
}
