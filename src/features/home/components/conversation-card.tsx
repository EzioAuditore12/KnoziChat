import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';
import { Card } from 'heroui-native/card';
import { cn } from 'tailwind-variants';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

import { Conversation } from '../../chat/types/conversation.type';

interface ConversationCardProps extends ComponentProps<typeof Card> {
  onPress: ThrottledTouchableProps['onPress'];
  data: Conversation;
}

export function ConversationCard({ className, data, onPress, ...props }: ConversationCardProps) {
  const { name, type, updatedAt } = data;

  return (
    <ThrottledTouchable onPress={onPress}>
      <Card className={cn(className)} {...props}>
        <Card.Body className="flex-row gap-x-2">
          <Avatar className="size-20" alt={name ?? ''}>
            <Avatar.Image source={{ uri: undefined }} />
            <Avatar.Fallback>{name[0]}</Avatar.Fallback>
          </Avatar>

          <View className="flex-col">
            <Description className="text-lg font-bold">{name}</Description>

            <Description>Type: {type}</Description>
          </View>
        </Card.Body>
        <Description className="mr-2 ml-auto">
          {new Date(updatedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Description>
      </Card>
    </ThrottledTouchable>
  );
}
