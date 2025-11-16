import type { ComponentProps } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { cn } from '@gluestack-ui/utils/nativewind-utils';
import { withObservables } from '@nozbe/watermelondb/react';

import { Conversation } from '@/db/models/conversation.model';
import { User } from '@/db/models/user.model';

import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

interface ConversationCardProps extends ComponentProps<typeof Card> {
  onPress: PressableProps['onPress'];
  data: Conversation;
  user: User;
}

// Enhance the card to observe the user relation
const enhance = withObservables(
  ['data'],
  ({ data }: { data: Conversation }) => ({
    user: data.user.observe(),
  }),
);

function ConversationCardBase({
  className,
  data,
  user,
  onPress,
  ...props
}: ConversationCardProps) {
  const { contact, updatedAt } = data;

  console.log(user.lastName);

  return (
    <Pressable onPress={onPress}>
      <Card className={cn(className)} {...props}>
        <Box className="flex-row gap-x-2">
          <Avatar>
            <AvatarImage source={{ uri: user?.avatar ?? undefined }} />
            <AvatarFallbackText>
              {user?.firstName?.[0] ?? contact[0]}
            </AvatarFallbackText>
          </Avatar>
          <Box>
            <Heading>{contact}</Heading>

            <Text>
              {user.firstName} {user.lastName}
            </Text>

            <Text>{user.phoneNumer}</Text>
          </Box>
        </Box>
        <Text className="ml-auto">
          {updatedAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </Card>
    </Pressable>
  );
}

export const EnhancedConversationCard = enhance(ConversationCardBase);
