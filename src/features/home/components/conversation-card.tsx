import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { Avatar } from 'heroui-native/avatar';
import { Description } from 'heroui-native/description';
import { Card } from 'heroui-native/card';
import { cn } from 'tailwind-variants';
import { isToday, isYesterday, format } from 'date-fns';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

import type { Conversation } from '../../chat/types/conversation.type';

interface ConversationCardProps extends ComponentProps<typeof Card> {
  onPress: ThrottledTouchableProps['onPress'];
  data: Conversation;
}

function formatChatDate(timestamp: number) {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return format(date, 'p'); // '10:30 AM'
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
    return format(date, 'EEEE'); // 'Monday'
  } else {
    return format(date, 'P'); // '10/24/2023'
  }
}

export function ConversationCard({ className, data, onPress, ...props }: ConversationCardProps) {
  const { name, updatedAt, lastMessage } = data;

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

            {/* FIX 2: Safely access array and object properties */}
            <Description className="mt-2" numberOfLines={1}>
              {lastMessage}
            </Description>
          </View>
        </Card.Body>
        <Description className="mr-2 ml-auto">{formatChatDate(updatedAt)}</Description>
      </Card>
    </ThrottledTouchable>
  );
}
