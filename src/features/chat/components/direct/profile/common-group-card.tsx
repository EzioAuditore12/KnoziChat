import { cn } from '@gluestack-ui/utils';
import type { ComponentProps } from 'react';

import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { ThrottledTouchable, ThrottledTouchableProps } from '@/components/throttled-touchable';

interface CommonGroupCardProps extends ComponentProps<typeof VStack> {
  data: {
    id: string;
    name: string;
    avatar?: string | null;
  };

  onPress?: ThrottledTouchableProps['onPress'];
}

export function CommonGroupCard({ data, onPress, className, ...props }: CommonGroupCardProps) {
  return (
    <ThrottledTouchable
      onPress={onPress}
      className={cn(
        'flex-row items-center rounded-3xl border border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950',
        className
      )}
      {...props}>
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

        <AvatarFallbackText>{data.name[0]}</AvatarFallbackText>
      </Avatar>

      <VStack className="ml-4 flex-1">
        <Text size="lg" className="font-semibold">
          {data.name}
        </Text>

        <Text size="sm" className="mt-1 text-neutral-500 dark:text-neutral-400">
          Tap to view group
        </Text>
      </VStack>
    </ThrottledTouchable>
  );
}
