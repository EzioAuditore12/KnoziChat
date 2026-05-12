import React, { ComponentProps } from 'react';

import { cn } from '@gluestack-ui/utils';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { CloseCircleIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { ThrottledTouchable } from '@/components/throttled-touchable';
import type { User } from '@/features/common/schemas/user.schema';

interface SelectedUserCardProps extends ComponentProps<typeof Box> {
  user: User;
  onRemove: () => void;
}

export function SelectedUserCard({ className, user, onRemove, ...props }: SelectedUserCardProps) {
  return (
    <Box
      className={cn(
        'bg-background-50 border-outline-100 relative mr-3 flex-row items-center rounded-full border p-1 pr-3',
        className
      )}
      {...props}>
      <Avatar className="mr-2 h-10 w-10">
        <AvatarFallbackText>{user.firstName[0]}</AvatarFallbackText>
        <AvatarImage source={{ uri: user.avatar ?? undefined }} />
      </Avatar>
      <VStack className="mr-2 max-w-30 justify-center">
        <Text className="text-sm font-medium" numberOfLines={1}>
          {user.firstName}
        </Text>
        <Text className="text-typography-500 text-xs" numberOfLines={1}>
          {user.email}
        </Text>
      </VStack>
      <ThrottledTouchable onPress={onRemove} className="z-10 rounded-full">
        <Icon
          as={CloseCircleIcon}
          className="h-5 w-5 rounded-full bg-white text-red-500 dark:bg-transparent"
        />
      </ThrottledTouchable>
    </Box>
  );
}
