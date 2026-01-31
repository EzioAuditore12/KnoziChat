import { withDatabase, withObservables } from '@nozbe/watermelondb/react';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils';

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
        <CardContent className="flex-row gap-x-2">
          <Avatar className="size-20" alt={firstName}>
            <AvatarImage source={{ uri: avatar ?? undefined }} />
            <AvatarFallback>
              <Text>{firstName[0]}</Text>
            </AvatarFallback>
          </Avatar>

          <View className="flex-col">
            <Text variant={'h3'}>{firstName}</Text>

            <Text>
              {firstName} {lastName}
            </Text>

            <Text>{phoneNumber}</Text>
          </View>
        </CardContent>
        <Text className="mr-2 ml-auto">
          {updatedAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
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
