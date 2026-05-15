import { cn } from '@gluestack-ui/utils';
import { Activity, type ComponentProps } from 'react';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { ArrowLeftIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import type { User } from '@/db/tables/user.table';

interface ChatterInfoProps extends ComponentProps<typeof Box> {
  data: User;
  isLoading: boolean;
  isTyping: boolean;
  onBack?: () => void;
  onPress?: ThrottledTouchableProps['onPress'];
}

export function ChatterInfo({
  className,
  data,
  isLoading,
  isTyping,
  onPress,
  onBack,
  ...props
}: ChatterInfoProps) {
  if (isLoading) {
    return (
      <Box className="border-background-tertiary flex-row items-center gap-x-3 border-b px-4 py-3">
        <Box className="bg-background-tertiary size-10 animate-pulse rounded-full" />

        <Box className="bg-background-tertiary size-14 animate-pulse rounded-full" />

        <VStack className="flex-1 gap-y-2">
          <Box className="bg-background-tertiary h-4 w-36 animate-pulse rounded-md" />
          <Box className="bg-background-tertiary h-3 w-52 animate-pulse rounded-md" />
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      key={data.id}
      className={cn(
        'border-background-tertiary flex-row items-center gap-x-3 border-b px-4 py-3',
        className
      )}
      {...props}>
      <ThrottledTouchable
        className="bg-background-secondary active:bg-background-tertiary items-center justify-center rounded-full p-2.5"
        onPress={onBack}>
        <Icon as={ArrowLeftIcon} size="lg" />
      </ThrottledTouchable>

      <ThrottledTouchable onPress={onPress}>
        <Avatar className="border-background-tertiary size-14 border">
          <AvatarImage source={{ uri: data.avatar ?? undefined }} />

          <Activity mode={data.avatar ? 'hidden' : 'visible'}>
            <AvatarFallbackText className="font-semibold">{data.firstName?.[0]}</AvatarFallbackText>
          </Activity>
        </Avatar>
      </ThrottledTouchable>
      <VStack className="flex-1 justify-center">
        <HStack className="items-center gap-x-1">
          <Text numberOfLines={1} className="text-base font-semibold">
            {data.firstName} {data.lastName}
          </Text>
        </HStack>

        {isTyping ? (
          <Text numberOfLines={1} size="sm" className="anima mt-0.5 text-zinc-500 italic">
            {data.firstName} is typing...
          </Text>
        ) : (
          <Text numberOfLines={1} size="sm" className="mt-0.5 text-zinc-500">
            {data.email}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
