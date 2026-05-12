import { cn } from '@gluestack-ui/utils';
import { format, isToday, isYesterday } from 'date-fns';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

import type { Conversation } from '@/features/home/types/conversation.type';

interface ConversationCardProps extends ComponentProps<typeof Card> {
  onPress: ThrottledTouchableProps['onPress'];
  data: Conversation;
}

function formatChatDate(timestamp: number) {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return format(date, 'p');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
    return format(date, 'EEEE');
  } else {
    return format(date, 'P');
  }
}

export function ConversationCard({ className, data, onPress, ...props }: ConversationCardProps) {
  const { name, updatedAt, lastMessage } = data;

  return (
    <ThrottledTouchable onPress={onPress}>
      <Card className={cn('rounded-3xl px-4 py-4', className)} {...props}>
        <Box className="flex-row items-center gap-3">
          <Avatar className="size-16 rounded-full">
            <AvatarImage source={{ uri: undefined }} />
            <AvatarFallbackText>{name ?? ''}</AvatarFallbackText>
          </Avatar>

          <View className="flex-1">
            <Box className="flex-row items-center justify-between">
              <Heading size="md" className="flex-1" numberOfLines={1}>
                {name}
              </Heading>

              <Text className="ml-3 text-xs">{formatChatDate(updatedAt)}</Text>
            </Box>

            <Text numberOfLines={1} className="mt-1 text-sm">
              {lastMessage}
            </Text>
          </View>
        </Box>
      </Card>
    </ThrottledTouchable>
  );
}
