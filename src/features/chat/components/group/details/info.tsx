import { cn } from '@gluestack-ui/utils';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

import { ThrottledTouchable } from '@/components/throttled-touchable';
import { ArrowLeftIcon, Icon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';

interface GroupInfoProps extends ComponentProps<typeof Box> {
  data: {
    id: string;
    name: string;
    avatar: string | null;
    members: string;
  };
  isLoading?: boolean;
}

export function GroupInfo({ className, data, isLoading = false, ...props }: GroupInfoProps) {
  if (isLoading) {
    return (
      <Box className="border-background-tertiary flex-row items-center gap-x-3 border-b px-4 py-3">
        <Box className="bg-background-tertiary size-10 animate-pulse rounded-full" />
        <Box className="bg-background-tertiary size-14 animate-pulse rounded-full" />

        <VStack className="flex-1 gap-y-2">
          <Box className="bg-background-tertiary h-4 w-40 animate-pulse rounded-md" />
          <Box className="bg-background-tertiary h-3 w-24 animate-pulse rounded-md" />
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
        onPress={() => router.back()}>
        <Icon as={ArrowLeftIcon} size="md" />
      </ThrottledTouchable>

      <ThrottledTouchable
        onPress={() =>
          router.push({
            pathname: '/(main)/chat/group/details/[id]',
            params: { id: data.id },
          })
        }>
        <Avatar className="border-background-tertiary size-14 border">
          <AvatarImage
            source={
              data.avatar
                ? {
                    uri: data.avatar,
                  }
                : undefined
            }
          />

          <AvatarFallbackText className="font-semibold">{data.name?.[0] ?? 'G'}</AvatarFallbackText>
        </Avatar>
      </ThrottledTouchable>

      <VStack className="flex-1 justify-center">
        <Text numberOfLines={1} className="font-semibold">
          {data.name}
        </Text>

        <Text size="sm" numberOfLines={1} className="mt-0.5 leading-4">
          {data.members}
        </Text>
      </VStack>
    </Box>
  );
}
