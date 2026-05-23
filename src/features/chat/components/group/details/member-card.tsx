import { cn } from '@gluestack-ui/utils';
import { Activity, type ComponentProps } from 'react';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';

interface GroupMemberCardProps extends ComponentProps<typeof Card> {
  className?: string;
  data: {
    id: string;
    name: string;
    isAdmin: boolean;
    avatar: string | null;
    isMe: boolean;
  };
  onPress?: ThrottledTouchableProps['onPress'];
}

export function GroupMemberCard({ className, data, onPress }: GroupMemberCardProps) {
  const { name, isAdmin, isMe, avatar } = data;

  return (
    <ThrottledTouchable onPress={isMe ? undefined : onPress}>
      <Card className={cn('flex-row items-center justify-between rounded-2xl p-3', className)}>
        <HStack className="items-center gap-x-3">
          <Avatar>
            <AvatarFallbackText>{name}</AvatarFallbackText>

            <AvatarImage source={{ uri: avatar ?? undefined }} alt={name} />
          </Avatar>

          <Box>
            <HStack className="items-center gap-x-2">
              <Text className="text-base font-semibold">{name}</Text>

              <Activity mode={isAdmin ? 'visible' : 'hidden'}>
                <Badge variant="outline" className="rounded-full">
                  <BadgeText>Admin</BadgeText>
                </Badge>
              </Activity>
            </HStack>

            <Text size="sm">{isMe ? 'You' : 'Member'}</Text>
          </Box>
        </HStack>
      </Card>
    </ThrottledTouchable>
  );
}
