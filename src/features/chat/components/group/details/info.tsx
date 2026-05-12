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
  isLoading: boolean;
}

export function GroupInfo({ className, data, isLoading, ...props }: GroupInfoProps) {
  if (isLoading) {
    return <Text>Data being loaded</Text>;
  }

  return (
    <Box
      key={data.id}
      className={cn(
        'justify border-background-tertiary flex-row items-center gap-x-3 border-b-2 p-2 px-4',
        className
      )}
      {...props}>
      <ThrottledTouchable className="bg-background rounded-full p-2" onPress={() => router.back()}>
        <Icon as={ArrowLeftIcon} size="md" />
      </ThrottledTouchable>

      <ThrottledTouchable
        onPress={() =>
          router.push({
            pathname: '/(main)/chat/group/details/[id]',
            params: { id: data.id },
          })
        }>
        <Avatar className="size-14">
          <AvatarImage
            source={
              data.avatar
                ? {
                    uri: data.avatar,
                  }
                : undefined
            }
          />

          <AvatarFallbackText>{data.name?.[0] ?? 'G'}</AvatarFallbackText>
        </Avatar>
      </ThrottledTouchable>

      <VStack className="flex-1">
        <Text numberOfLines={1} className="font-bold">
          {data.name}
        </Text>

        <Text size="sm" numberOfLines={1} className="text-zinc-500">
          {data.members}
        </Text>
      </VStack>
    </Box>
  );
}
