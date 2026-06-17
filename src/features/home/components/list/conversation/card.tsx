import { cn } from '@gluestack-ui/utils';
import { Activity, type ComponentProps } from 'react';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

import type { Conversation } from '@/features/home/types/conversation.type';
import { VStack } from '@/components/ui/vstack';

import { Badge, BadgeText } from '@/components/ui/badge';
import { formatChatDate } from '@/features/chat/utils/format-chat-date';

interface ConversationCardProps extends ComponentProps<typeof Card> {
  onPress: ThrottledTouchableProps['onPress'];
  data: Conversation;
}

export function ConversationCard({ className, data, onPress, ...props }: ConversationCardProps) {
  const { name, updatedAt, lastMessageAt, lastMessage, avatar, unreadCount } = data as any;

  return (
    <ThrottledTouchable onPress={onPress}>
      <Card className={cn('rounded-3xl px-4 py-4', className)} {...props}>
        <Box className="flex-row items-center gap-3">
          <Avatar className="size-16 rounded-full">
            <AvatarImage source={{ uri: avatar ?? undefined }} />
            <AvatarFallbackText>{name ?? ''}</AvatarFallbackText>
          </Avatar>

          <VStack className="flex-1">
            <Box className="flex-row items-center justify-between">
              <Heading size="md" className="flex-1" numberOfLines={1}>
                {name}
              </Heading>

              <Text className="ml-3 text-xs">{formatChatDate(lastMessageAt ?? updatedAt)}</Text>
            </Box>

            <Box className="mt-1 flex-row items-center justify-between">
              <Text numberOfLines={1} className="flex-1 text-sm">
                {lastMessage}
              </Text>

              <Activity mode={unreadCount > 0 ? 'visible' : 'hidden'}>
                <Badge className="ml-2 min-w-5 justify-center rounded-full border-0 bg-green-500 px-1.5 py-0.5">
                  <BadgeText className="text-xs font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </BadgeText>
                </Badge>
              </Activity>
            </Box>
          </VStack>
        </Box>
      </Card>
    </ThrottledTouchable>
  );
}
