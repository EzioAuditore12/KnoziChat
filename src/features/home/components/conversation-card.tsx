import { withDatabase, withObservables } from '@nozbe/watermelondb/react';
import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';
import { Card } from 'heroui-native/card';
import { cn } from 'tailwind-variants';

import { Conversation } from '@/db/models/conversation.model';
import { User } from '@/db/models/user.model';
import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

interface ConversationCardProps extends ComponentProps<typeof Card> {
  onPress: ThrottledTouchableProps['onPress'];
  data: Conversation;
  user: User;
}

export function ConversationCard({
  className,
  data,
  user,
  onPress,
  ...props
}: ConversationCardProps) {
  const { updatedAt } = data;

  const { firstName, lastName, phoneNumber, avatar } = user;

  return (
    <ThrottledTouchable onPress={onPress}>
      <Card className={cn(className)} {...props}>
        <Card.Body className="flex-row gap-x-2">
          <Avatar className="size-20" alt={firstName}>
            <Avatar.Image source={{ uri: avatar ?? undefined }} />
            <Avatar.Fallback>{firstName[0]}</Avatar.Fallback>
          </Avatar>

          <View className="flex-col">
            <Description className="text-lg font-bold">{firstName}</Description>

            <Description>
              {firstName} {lastName}
            </Description>

            <Description>{phoneNumber}</Description>
          </View>
        </Card.Body>
        <Description className="mr-2 ml-auto">
          {updatedAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Description>
      </Card>
    </ThrottledTouchable>
  );
}

export const EnhancedConversationCard = withDatabase(
  withObservables(['data'], ({ data }: { data: Conversation }) => ({
    data: data.observe(),
    user: data.user.observe(),
  }))(ConversationCard)
);
