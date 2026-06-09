import { cn } from '@gluestack-ui/utils';
import { Activity, type ComponentProps } from 'react';

import { ThrottledTouchable, type ThrottledTouchableProps } from '@/components/throttled-touchable';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { ArrowLeftIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Skeleton } from '@/components/ui/skeleton';

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
    return <ChatterInfoLoading />;
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

export function ChatterInfoLoading() {
  return (
    <Box className="border-background-tertiary flex-row items-center gap-x-3 border-b px-4 py-3">
      <Skeleton className="size-10 rounded-full" />

      <Skeleton className="size-14 rounded-full" />

      <VStack className="flex-1 gap-y-2">
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-3 w-52 rounded-md" />
      </VStack>
    </Box>
  );
}
